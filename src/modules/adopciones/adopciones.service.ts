import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdopcioneDto } from './dto/create-adopcione.dto';
import { UpdateAdopcioneDto } from './dto/update-adopcione.dto';
import { FilterAdopcionDto } from './dto/filter-adopcion.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { EstadoAdopcion, EstadoPerro } from '../../generated/prisma/enums';

@Injectable()
export class AdopcionesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdopcioneDto: CreateAdopcioneDto) {
    const { perro_id, adoptante_id, fecha_resolucion, ...resto } =
      createAdopcioneDto;

    // 1. Verificar que el perro exista y esté disponible
    const perro = await this.prisma.perro.findUnique({
      where: { id: perro_id },
    });

    if (!perro) {
      throw new NotFoundException(`No se encontró el perro con ID ${perro_id}`);
    }

    if (perro.estado_actual === EstadoPerro.adoptado) {
      throw new BadRequestException('Este perro ya fue adoptado');
    }

    // 2. Verificar que el adoptante exista y esté activo
    const adoptante = await this.prisma.user.findUnique({
      where: { id: adoptante_id },
    });

    if (!adoptante || !adoptante.activo) {
      throw new NotFoundException(
        `No se encontró un usuario activo con ID ${adoptante_id}`,
      );
    }

    // 3. Evitar solicitudes pendientes duplicadas del mismo usuario para el mismo perro
    const solicitudExistente = await this.prisma.adopcion.findFirst({
      where: {
        perro_id,
        adoptante_id,
        estado: EstadoAdopcion.pendiente,
      },
    });

    if (solicitudExistente) {
      throw new ConflictException(
        'El usuario ya tiene una solicitud pendiente para este perro',
      );
    }

    try {
      return await this.prisma.adopcion.create({
        data: {
          ...resto,
          perro_id,
          adoptante_id,
          ...(fecha_resolucion && {
            fecha_resolucion: new Date(fecha_resolucion),
          }),
        },
        include: {
          perro: true,
          adoptante: { omit: { password_hash: true } },
          refugio: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'El refugio indicado en refugio_id no existe',
        );
      }
      throw error;
    }
  }

  async findAll(filtros: FilterAdopcionDto) {
    const { estado, perro_id, adoptante_id, refugio_id } = filtros;

    return await this.prisma.adopcion.findMany({
      where: {
        ...(estado !== undefined && { estado }),
        ...(perro_id !== undefined && { perro_id }),
        ...(adoptante_id !== undefined && { adoptante_id }),
        ...(refugio_id !== undefined && { refugio_id }),
      },
      include: {
        perro: true,
        adoptante: { omit: { password_hash: true } },
        refugio: true,
      },
      orderBy: {
        fecha_solicitud: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const adopcion = await this.prisma.adopcion.findUnique({
      where: { id },
      include: {
        perro: true,
        adoptante: { omit: { password_hash: true } },
        refugio: true,
      },
    });

    if (!adopcion) {
      throw new NotFoundException(`No se encontró la adopción con ID ${id}`);
    }

    return adopcion;
  }

  async update(id: number, updateAdopcioneDto: UpdateAdopcioneDto) {
    const adopcionActual = await this.findOne(id);
    const { fecha_resolucion, ...datos } = updateAdopcioneDto;

    const fechaRes = fecha_resolucion
      ? new Date(fecha_resolucion)
      : datos.estado && datos.estado !== EstadoAdopcion.pendiente
        ? new Date()
        : undefined;

    // Si se aprueba la adopción, ejecutamos una transacción atómica
    if (
      datos.estado === EstadoAdopcion.aprobada &&
      adopcionActual.estado !== EstadoAdopcion.aprobada
    ) {
      if (adopcionActual.perro.estado_actual === EstadoPerro.adoptado) {
        throw new BadRequestException(
          'El perro ya figura como adoptado en otra solicitud',
        );
      }

      const [adopcionAprobada] = await this.prisma.$transaction([
        // 1. Aprobar esta solicitud
        this.prisma.adopcion.update({
          where: { id },
          data: {
            ...datos,
            fecha_resolucion: fechaRes ?? new Date(),
          },
          include: {
            perro: true,
            adoptante: { omit: { password_hash: true } },
            refugio: true,
          },
        }),
        // 2. Cambiar el estado del perro a adoptado y ocultarlo del listado público
        this.prisma.perro.update({
          where: { id: adopcionActual.perro_id },
          data: {
            estado_actual: EstadoPerro.adoptado,
            publicado: false,
          },
        }),
        // 3. Rechazar automáticamente otras solicitudes pendientes para este mismo perro
        this.prisma.adopcion.updateMany({
          where: {
            perro_id: adopcionActual.perro_id,
            id: { not: id },
            estado: EstadoAdopcion.pendiente,
          },
          data: {
            estado: EstadoAdopcion.rechazada,
            fecha_resolucion: new Date(),
            observaciones:
              'Solicitud rechazada automáticamente porque el perro fue adoptado',
          },
        }),
      ]);

      return adopcionAprobada;
    }

    // Actualización normal (ej. cambiar observaciones, rechazar o cancelar)
    try {
      return await this.prisma.adopcion.update({
        where: { id },
        data: {
          ...datos,
          ...(fechaRes && { fecha_resolucion: fechaRes }),
        },
        include: {
          perro: true,
          adoptante: { omit: { password_hash: true } },
          refugio: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'Alguno de los IDs relacionados (perro, adoptante o refugio) no existe',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.adopcion.delete({
      where: { id },
    });
  }
}