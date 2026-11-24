import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCasoDto } from './dto/create-caso.dto';
import { UpdateCasoDto } from './dto/update-caso.dto';
import { FilterCasoDto } from './dto/filter-caso.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { EstadoCaso } from '../../generated/prisma/enums';

const INCLUIR_RELACIONES = {
  reporte: true,
  asignado: { omit: { password_hash: true } },
} satisfies Prisma.CasoInclude;

@Injectable()
export class CasosService {
  constructor(private readonly prisma: PrismaService) {}

  // Verifica que la persona a la que se asigna el caso exista y esté activa
  private async validarAsignado(asignado_a: number) {
    const usuario = await this.prisma.user.findUnique({
      where: { id: asignado_a },
    });

    if (!usuario || !usuario.activo) {
      throw new NotFoundException(
        `No se encontró un usuario activo con ID ${asignado_a}`,
      );
    }
  }

  async create(createCasoDto: CreateCasoDto) {
    const { reporte_id, asignado_a, estado, fecha_cierre, ...resto } =
      createCasoDto;

    // 1. El reporte debe existir
    const reporte = await this.prisma.reporte.findUnique({
      where: { id: reporte_id },
    });

    if (!reporte) {
      throw new NotFoundException(
        `No se encontró el reporte con ID ${reporte_id}`,
      );
    }

    // 2. Un reporte solo puede tener un caso
    const casoExistente = await this.prisma.caso.findUnique({
      where: { reporte_id },
    });

    if (casoExistente) {
      throw new ConflictException(
        `El reporte con ID ${reporte_id} ya tiene un caso asociado`,
      );
    }

    // 3. Si viene asignado, validar al responsable
    if (asignado_a !== undefined) {
      await this.validarAsignado(asignado_a);
    }

    // Si nace ya resuelto/cerrado y no mandan fecha, la completamos hoy
    const nacioCerrado =
      estado === EstadoCaso.resuelto || estado === EstadoCaso.cerrado;
    const fechaCierre = fecha_cierre
      ? new Date(fecha_cierre)
      : nacioCerrado
        ? new Date()
        : undefined;

    try {
      return await this.prisma.caso.create({
        data: {
          ...resto,
          reporte_id,
          ...(estado !== undefined && { estado }),
          ...(asignado_a !== undefined && { asignado_a }),
          ...(fechaCierre && { fecha_cierre: fechaCierre }),
        },
        include: INCLUIR_RELACIONES,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `El reporte con ID ${reporte_id} ya tiene un caso asociado`,
          );
        }
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'Alguno de los IDs relacionados (reporte_id o asignado_a) no existe',
          );
        }
      }
      throw error;
    }
  }

  async findAll(filtros: FilterCasoDto) {
    const { estado, prioridad, asignado_a, reporte_id } = filtros;

    return await this.prisma.caso.findMany({
      where: {
        ...(estado !== undefined && { estado }),
        ...(prioridad !== undefined && { prioridad }),
        ...(asignado_a !== undefined && { asignado_a }),
        ...(reporte_id !== undefined && { reporte_id }),
      },
      include: INCLUIR_RELACIONES,
      orderBy: {
        fecha_apertura: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const caso = await this.prisma.caso.findUnique({
      where: { id },
      include: {
        ...INCLUIR_RELACIONES,
        seguimientos: {
          include: { usuario: { omit: { password_hash: true } } },
          orderBy: { fecha: 'asc' },
        },
      },
    });

    if (!caso) {
      throw new NotFoundException(`No se encontró el caso con ID ${id}`);
    }

    return caso;
  }

  async update(id: number, updateCasoDto: UpdateCasoDto) {
    await this.findOne(id);
    const { asignado_a, estado, fecha_cierre, ...datos } = updateCasoDto;

    if (asignado_a !== undefined) {
      await this.validarAsignado(asignado_a);
    }

    // Manejo de fecha_cierre según el estado:
    // - fecha explícita => se usa
    // - pasa a resuelto/cerrado => hoy
    // - se reabre (abierto/en_proceso) => se limpia
    let fechaCierre: Date | null | undefined;
    if (fecha_cierre) {
      fechaCierre = new Date(fecha_cierre);
    } else if (
      estado === EstadoCaso.resuelto ||
      estado === EstadoCaso.cerrado
    ) {
      fechaCierre = new Date();
    } else if (
      estado === EstadoCaso.abierto ||
      estado === EstadoCaso.en_proceso
    ) {
      fechaCierre = null;
    }

    try {
      return await this.prisma.caso.update({
        where: { id },
        data: {
          ...datos,
          ...(estado !== undefined && { estado }),
          ...(asignado_a !== undefined && { asignado_a }),
          ...(fechaCierre !== undefined && { fecha_cierre: fechaCierre }),
        },
        include: INCLUIR_RELACIONES,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'El usuario indicado en asignado_a no existe',
        );
      }
      throw error;
    }
  }

  // Ojo: por el schema, borrar un caso elimina en cascada sus seguimientos
  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.caso.delete({
      where: { id },
    });
  }
}
