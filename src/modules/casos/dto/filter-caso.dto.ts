import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { EstadoCaso, PrioridadCaso } from '../../../generated/prisma/enums';

export class FilterCasoDto {
  @IsOptional()
  @IsEnum(EstadoCaso)
  estado?: EstadoCaso;

  @IsOptional()
  @IsEnum(PrioridadCaso)
  prioridad?: PrioridadCaso;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  asignado_a?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  reporte_id?: number;
}
