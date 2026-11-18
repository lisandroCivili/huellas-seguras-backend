import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { EstadoCaso, PrioridadCaso } from '../../../generated/prisma/enums';

export class CreateCasoDto {
  @IsInt()
  @IsPositive()
  reporte_id: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  asignado_a?: number;

  @IsOptional()
  @IsEnum(PrioridadCaso)
  prioridad?: PrioridadCaso;

  @IsOptional()
  @IsEnum(EstadoCaso)
  estado?: EstadoCaso;

  @IsOptional()
  @IsDateString()
  fecha_cierre?: string;

  @IsOptional()
  @IsString()
  resolucion?: string;
}
