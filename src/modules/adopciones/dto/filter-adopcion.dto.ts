import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { EstadoAdopcion } from '../../../generated/prisma/enums';

export class FilterAdopcionDto {
  @IsOptional()
  @IsEnum(EstadoAdopcion)
  estado?: EstadoAdopcion;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  perro_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  adoptante_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  refugio_id?: number;
}