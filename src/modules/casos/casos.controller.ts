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
import { CasosService } from './casos.service';
import { CreateCasoDto } from './dto/create-caso.dto';
import { UpdateCasoDto } from './dto/update-caso.dto';
import { FilterCasoDto } from './dto/filter-caso.dto';

@Controller('casos')
export class CasosController {
  constructor(private readonly casosService: CasosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCasoDto: CreateCasoDto) {
    return this.casosService.create(createCasoDto);
  }

  @Get()
  findAll(@Query() filtros: FilterCasoDto) {
    return this.casosService.findAll(filtros);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.casosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCasoDto: UpdateCasoDto,
  ) {
    return this.casosService.update(id, updateCasoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.casosService.remove(id);
  }
}
