import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePerroDto } from './dto/create-perro.dto';
import { UpdatePerroDto } from './dto/update-perro.dto';
import { FilterPerroDto } from './dto/filter-perro.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class PerrosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPerroDto: CreatePerroDto) {
    try {
      return await this.prisma.perro.create({
        data: createPerroDto,
        include: {
          refugio: true,
          fotos: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'El refugio indicado en refugio_actual_id no existe',
        );
      }
      throw error;
    }
  }

  async findAll(filtros: FilterPerroDto) {
    const { estado_actual, refugio_actual_id, publicado } = filtros;

    return await this.prisma.perro.findMany({
      where: {
        ...(estado_actual !== undefined && { estado_actual }),
        ...(refugio_actual_id !== undefined && { refugio_actual_id }),
        ...(publicado !== undefined && { publicado }),
      },
      include: {
        refugio: true,
        fotos: true,
      },
      orderBy: {
        fecha_registro: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const perro = await this.prisma.perro.findUnique({
      where: { id },
      include: {
        refugio: true,
        fotos: true,
        tratamientos: true,
      },
    });

    if (!perro) {
      throw new NotFoundException(`No se encontró el perro con ID ${id}`);
    }

    return perro;
  }

  async update(id: number, updatePerroDto: UpdatePerroDto) {
    await this.findOne(id);

    try {
      return await this.prisma.perro.update({
        where: { id },
        data: updatePerroDto,
        include: {
          refugio: true,
          fotos: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'El refugio indicado en refugio_actual_id no existe',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.perro.delete({
      where: { id },
    });
  }
}