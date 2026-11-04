import { Injectable } from '@nestjs/common';
import { CreateAdopcioneDto } from './dto/create-adopcione.dto';
import { UpdateAdopcioneDto } from './dto/update-adopcione.dto';

@Injectable()
export class AdopcionesService {
  create(createAdopcioneDto: CreateAdopcioneDto) {
    return 'This action adds a new adopcione';
  }

  findAll() {
    return `This action returns all adopciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adopcione`;
  }

  update(id: number, updateAdopcioneDto: UpdateAdopcioneDto) {
    return `This action updates a #${id} adopcione`;
  }

  remove(id: number) {
    return `This action removes a #${id} adopcione`;
  }
}
