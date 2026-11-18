import { Injectable } from '@nestjs/common';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VeterinariasService {
  constructor( private readonly prisma:PrismaService){}
  create(createVeterinariaDto: CreateVeterinariaDto) {
    const {...data}=createVeterinariaDto
    try {
      return
      
    } catch (error) {
      
    }
  }

  findAll() {
    return `This action returns all veterinarias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} veterinaria`;
  }

  update(id: number, updateVeterinariaDto: UpdateVeterinariaDto) {
    return `This action updates a #${id} veterinaria`;
  }

  remove(id: number) {
    return `This action removes a #${id} veterinaria`;
  }
}
