import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { EstadoReporte, TipoReporte } from '../../../generated/prisma/enums';

export class FilterReporteDto {
  @IsOptional()
  @IsEnum(TipoReporte)
  tipo?: TipoReporte;

  @IsOptional()
  @IsEnum(EstadoReporte)
  estado?: EstadoReporte;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  usuario_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  perro_id?: number;
}