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
import { RefugiosService } from './refugios.service';
import { CreateRefugioDto } from './dto/create-refugio.dto';
import { UpdateRefugioDto } from './dto/update-refugio.dto';
import { FilterRefugioDto } from './dto/filter-refugio.dto';

@Controller('refugios')
export class RefugiosController {
  constructor(private readonly refugiosService: RefugiosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRefugioDto: CreateRefugioDto) {
    return this.refugiosService.create(createRefugioDto);
  }

  @Get()
  findAll(@Query() filtros: FilterRefugioDto) {
    return this.refugiosService.findAll(filtros);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.refugiosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRefugioDto: UpdateRefugioDto,
  ) {
    return this.refugiosService.update(id, updateRefugioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.refugiosService.remove(id);
  }
}
