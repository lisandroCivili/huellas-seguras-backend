import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { EstadoPerro } from '../../../generated/prisma/enums';

export class FilterPerroDto {
  @IsOptional()
  @IsEnum(EstadoPerro)
  estado_actual?: EstadoPerro;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  refugio_actual_id?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  publicado?: boolean;
}