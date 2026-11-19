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
import { PerrosService } from './perros.service';
import { CreatePerroDto } from './dto/create-perro.dto';
import { UpdatePerroDto } from './dto/update-perro.dto';
import { FilterPerroDto } from './dto/filter-perro.dto';

@Controller('perros')
export class PerrosController {
  constructor(private readonly perrosService: PerrosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPerroDto: CreatePerroDto) {
    return this.perrosService.create(createPerroDto);
  }

  @Get()
  findAll(@Query() filtros: FilterPerroDto) {
    return this.perrosService.findAll(filtros);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.perrosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePerroDto: UpdatePerroDto,
  ) {
    return this.perrosService.update(id, updatePerroDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.perrosService.remove(id);
  }
}