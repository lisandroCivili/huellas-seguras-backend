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
import { VeterinariasService } from './veterinarias.service';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';
import { FilterVeterinariaDto } from './dto/filter-veterinaria.dto';

@Controller('veterinarias')
export class VeterinariasController {
  constructor(private readonly veterinariasService: VeterinariasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVeterinariaDto: CreateVeterinariaDto) {
    return this.veterinariasService.create(createVeterinariaDto);
  }

  @Get()
  findAll(@Query() filtros: FilterVeterinariaDto) {
    return this.veterinariasService.findAll(filtros);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.veterinariasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVeterinariaDto: UpdateVeterinariaDto,
  ) {
    return this.veterinariasService.update(id, updateVeterinariaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.veterinariasService.remove(id);
  }
}
