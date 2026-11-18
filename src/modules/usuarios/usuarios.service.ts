import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

  

const ROL_POR_DEFECTO=2;

@Injectable()

export class UsuariosService {

  constructor(private readonly prisma:PrismaService){}


  async create(createUsuarioDto: CreateUsuarioDto) {
    const {password,...datos}=createUsuarioDto;
    try {
      return this.prisma.user.create({
        data:{...datos,
          password_hash: await bcrypt.hash(password,10),
          rol_id:ROL_POR_DEFECTO
        }
      })
      
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
        throw new ConflictException('Ya existe un usuario con este email')
      }      
      throw error;
    }
    }

  async findAll() {
   return  this.prisma.user.findMany({omit:{password_hash:true}})
   
  }

  async findOne(id: number) {
   const usuario= this.prisma.user.findUnique({
    where:{id},
    omit:{password_hash:true}})
    return usuario
   
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);
    const {password,...datos}=updateUsuarioDto;
    return this.prisma.user.update({
      where:{id},
      data:password ? {...datos,password_hash:await bcrypt.hash(password,10)}:
      datos,
      omit:{password_hash:true}
    })

  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.user.delete({
      where:{id}
    })

  }
}
