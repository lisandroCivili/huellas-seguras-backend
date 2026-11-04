import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdopcionesService } from './adopciones.service';
import { CreateAdopcioneDto } from './dto/create-adopcione.dto';
import { UpdateAdopcioneDto } from './dto/update-adopcione.dto';

@Controller('adopciones')
export class AdopcionesController {
  constructor(private readonly adopcionesService: AdopcionesService) {}

  @Post()
  create(@Body() createAdopcioneDto: CreateAdopcioneDto) {
    return this.adopcionesService.create(createAdopcioneDto);
  }

  @Get()
  findAll() {
    return this.adopcionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adopcionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdopcioneDto: UpdateAdopcioneDto) {
    return this.adopcionesService.update(+id, updateAdopcioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adopcionesService.remove(+id);
  }
}
