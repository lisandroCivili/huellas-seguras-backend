import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AdopcionesService } from './adopciones.service';
import { CreateAdopcioneDto } from './dto/create-adopcione.dto';
import { UpdateAdopcioneDto } from './dto/update-adopcione.dto';
import { FilterAdopcionDto } from './dto/filter-adopcion.dto';

@Controller('adopciones')
export class AdopcionesController {
  constructor(private readonly adopcionesService: AdopcionesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAdopcioneDto: CreateAdopcioneDto) {
    return this.adopcionesService.create(createAdopcioneDto);
  }

  @Get()
  findAll(@Query() filtros: FilterAdopcionDto) {
    return this.adopcionesService.findAll(filtros);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adopcionesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdopcioneDto: UpdateAdopcioneDto,
  ) {
    return this.adopcionesService.update(id, updateAdopcioneDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adopcionesService.remove(id);
  }
}