import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { FilterReporteDto } from './dto/filter-reporte.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { EstadoReporte } from '../../generated/prisma/enums';

@Injectable()
export class ReportesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReporteDto: CreateReporteDto) {
    const { usuario_id, perro_id, revisado_por, fecha_revision, ...resto } =
      createReporteDto;

    // 1. Verificar que el autor exista y esté activo
    const autor = await this.prisma.user.findUnique({
      where: { id: usuario_id },
    });

    if (!autor || !autor.activo) {
      throw new NotFoundException(
        `No se encontró un usuario activo con ID ${usuario_id}`,
      );
    }

    // 2. Si viene asociado a un perro, verificar que exista
    if (perro_id !== undefined) {
      const perro = await this.prisma.perro.findUnique({
        where: { id: perro_id },
      });
      if (!perro) {
        throw new NotFoundException(
          `No se encontró el perro con ID ${perro_id}`,
        );
      }
    }

    try {
      return await this.prisma.reporte.create({
        data: {
          ...resto,
          usuario_id,
          ...(perro_id !== undefined && { perro_id }),
          ...(revisado_por !== undefined && { revisado_por }),
          ...(fecha_revision && {
            fecha_revision: new Date(fecha_revision),
          }),
        },
        include: {
          usuario: { omit: { password_hash: true } },
          revisor: { omit: { password_hash: true } },
          perro: true,
          fotos: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'Alguno de los IDs relacionados (usuario_id, perro_id o revisado_por) no existe',
        );
      }
      throw error;
    }
  }

  async findAll(filtros: FilterReporteDto) {
    const { tipo, estado, usuario_id, perro_id } = filtros;

    return await this.prisma.reporte.findMany({
      where: {
        ...(tipo !== undefined && { tipo }),
        ...(estado !== undefined && { estado }),
        ...(usuario_id !== undefined && { usuario_id }),
        ...(perro_id !== undefined && { perro_id }),
      },
      include: {
        usuario: { omit: { password_hash: true } },
        revisor: { omit: { password_hash: true } },
        perro: true,
        fotos: true,
        caso: true,
      },
      orderBy: {
        fecha_reporte: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const reporte = await this.prisma.reporte.findUnique({
      where: { id },
      include: {
        usuario: { omit: { password_hash: true } },
        revisor: { omit: { password_hash: true } },
        perro: true,
        fotos: true,
        comentarios: {
          include: {
            usuario: { omit: { password_hash: true } },
          },
        },
        caso: true,
      },
    });

    if (!reporte) {
      throw new NotFoundException(`No se encontró el reporte con ID ${id}`);
    }

    return reporte;
  }

  async update(id: number, updateReporteDto: UpdateReporteDto) {
    await this.findOne(id);
    const { fecha_revision, ...datos } = updateReporteDto;

    // Si asignan un revisor o cambian el estado de revisión sin mandar fecha, la completamos hoy
    const fechaRev = fecha_revision
      ? new Date(fecha_revision)
      : datos.revisado_por !== undefined ||
          (datos.estado && datos.estado !== EstadoReporte.pendiente)
        ? new Date()
        : undefined;

    try {
      return await this.prisma.reporte.update({
        where: { id },
        data: {
          ...datos,
          ...(fechaRev && { fecha_revision: fechaRev }),
        },
        include: {
          usuario: { omit: { password_hash: true } },
          revisor: { omit: { password_hash: true } },
          perro: true,
          fotos: true,
          caso: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'Alguno de los IDs relacionados (usuario_id, perro_id o revisado_por) no existe',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.reporte.delete({
      where: { id },
    });
  }
}