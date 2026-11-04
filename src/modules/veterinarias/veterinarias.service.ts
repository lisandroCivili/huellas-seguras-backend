import { Injectable } from '@nestjs/common';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';

@Injectable()
export class VeterinariasService {
  create(createVeterinariaDto: CreateVeterinariaDto) {
    return 'This action adds a new veterinaria';
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
