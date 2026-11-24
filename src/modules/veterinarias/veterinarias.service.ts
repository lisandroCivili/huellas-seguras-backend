import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';
import { FilterVeterinariaDto } from './dto/filter-veterinaria.dto';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VeterinariasService {
  constructor(private readonly prisma: PrismaService) {}

  // Verifica que el usuario responsable de la veterinaria exista y esté activo
  private async validarUsuario(usuario_id: number) {
    const usuario = await this.prisma.user.findUnique({
      where: { id: usuario_id },
    });

    if (!usuario || !usuario.activo) {
      throw new NotFoundException(
        `No se encontró un usuario activo con ID ${usuario_id}`,
      );
    }
  }

  private manejarErrorPrisma(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Este usuario ya tiene una veterinaria asociada',
        );
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'El usuario indicado en usuario_id no existe',
        );
      }
    }
    throw error;
  }

  async create(createVeterinariaDto: CreateVeterinariaDto) {
    if (createVeterinariaDto.usuario_id !== undefined) {
      await this.validarUsuario(createVeterinariaDto.usuario_id);
    }

    try {
      return await this.prisma.veterinaria.create({
        data: createVeterinariaDto,
      });
    } catch (error) {
      this.manejarErrorPrisma(error);
    }
  }

  async findAll(filtros: FilterVeterinariaDto) {
    const { afiliado_confirmado } = filtros;

    return await this.prisma.veterinaria.findMany({
      where: {
        ...(afiliado_confirmado !== undefined && { afiliado_confirmado }),
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const veterinaria = await this.prisma.veterinaria.findUnique({
      where: { id },
    });

    if (!veterinaria) {
      throw new NotFoundException(
        `No se encontró la veterinaria con ID ${id}`,
      );
    }

    return veterinaria;
  }

  async update(id: number, updateVeterinariaDto: UpdateVeterinariaDto) {
    await this.findOne(id);

    if (updateVeterinariaDto.usuario_id !== undefined) {
      await this.validarUsuario(updateVeterinariaDto.usuario_id);
    }

    try {
      return await this.prisma.veterinaria.update({
        where: { id },
        data: updateVeterinariaDto,
      });
    } catch (error) {
      this.manejarErrorPrisma(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    // En el schema los tratamientos se borran en cascada con la veterinaria,
    // así que bloqueamos el borrado para no perder el historial médico
    const tratamientos = await this.prisma.tratamientoMedico.count({
      where: { veterinaria_id: id },
    });

    if (tratamientos > 0) {
      throw new ConflictException(
        'No se puede eliminar la veterinaria porque tiene tratamientos asociados',
      );
    }

    return await this.prisma.veterinaria.delete({
      where: { id },
    });
  }
}
