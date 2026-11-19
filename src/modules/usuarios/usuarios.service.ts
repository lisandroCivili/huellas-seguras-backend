import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

const ROL_POR_DEFECTO = 1; 

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { password, ...datos } = createUsuarioDto;
    try {
      return await this.prisma.user.create({
        data: {
          ...datos,
          password_hash: await bcrypt.hash(password, 10),
          rol_id: ROL_POR_DEFECTO,
        },
        omit: { password_hash: true },
        include: { rol: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Ya existe un usuario con este email');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'El rol por defecto no existe en la base de datos',
          );
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.user.findMany({
      where: { activo: true },
      omit: { password_hash: true },
      include: { rol: true },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.user.findUnique({
      where: { id },
      omit: { password_hash: true },
      include: { rol: true },
    });

    if (!usuario) {
      throw new NotFoundException(`No se encontró el usuario con ID ${id}`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);
    const { password, ...datos } = updateUsuarioDto;

    try {
      return await this.prisma.user.update({
        where: { id },
        data: password
          ? { ...datos, password_hash: await bcrypt.hash(password, 10) }
          : datos,
        omit: { password_hash: true },
        include: { rol: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe un usuario con este email');
      }
      throw error;
    }
  }

  async asignarRol(id: number, rolId: number) {
    await this.findOne(id);

    try {
      return await this.prisma.user.update({
        where: { id },
        data: { rol_id: rolId },
        omit: { password_hash: true },
        include: { rol: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(`El rol con ID ${rolId} no existe`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.user.update({
      where: { id },
      data: { activo: false },
      omit: { password_hash: true },
    });
  }
}