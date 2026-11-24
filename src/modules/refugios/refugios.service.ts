import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRefugioDto } from './dto/create-refugio.dto';
import { UpdateRefugioDto } from './dto/update-refugio.dto';
import { FilterRefugioDto } from './dto/filter-refugio.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class RefugiosService {
  constructor(private readonly prisma: PrismaService) {}

  // Verifica que el usuario responsable del refugio exista y esté activo
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

  async create(createRefugioDto: CreateRefugioDto) {
    if (createRefugioDto.usuario_id !== undefined) {
      await this.validarUsuario(createRefugioDto.usuario_id);
    }

    try {
      return await this.prisma.refugio.create({
        data: createRefugioDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Este usuario ya tiene un refugio asociado',
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
  }

  async findAll(filtros: FilterRefugioDto) {
    const { afiliado_confirmado } = filtros;

    return await this.prisma.refugio.findMany({
      where: {
        ...(afiliado_confirmado !== undefined && { afiliado_confirmado }),
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const refugio = await this.prisma.refugio.findUnique({
      where: { id },
    });

    if (!refugio) {
      throw new NotFoundException(`No se encontró el refugio con ID ${id}`);
    }

    return refugio;
  }

  async update(id: number, updateRefugioDto: UpdateRefugioDto) {
    await this.findOne(id);

    if (updateRefugioDto.usuario_id !== undefined) {
      await this.validarUsuario(updateRefugioDto.usuario_id);
    }

    try {
      return await this.prisma.refugio.update({
        where: { id },
        data: updateRefugioDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Este usuario ya tiene un refugio asociado',
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
  }

  async remove(id: number) {
    await this.findOne(id);

    // No dejamos borrar un refugio que todavía tiene perros o adopciones
    const [perros, adopciones] = await Promise.all([
      this.prisma.perro.count({ where: { refugio_actual_id: id } }),
      this.prisma.adopcion.count({ where: { refugio_id: id } }),
    ]);

    if (perros > 0 || adopciones > 0) {
      throw new ConflictException(
        'No se puede eliminar el refugio porque tiene perros o adopciones asociadas',
      );
    }

    try {
      return await this.prisma.refugio.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'No se puede eliminar el refugio porque tiene registros asociados',
        );
      }
      throw error;
    }
  }
}
