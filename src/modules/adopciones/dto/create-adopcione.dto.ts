import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { EstadoAdopcion } from '../../../generated/prisma/enums';

export class CreateAdopcioneDto {
  @IsInt()
  @IsPositive()
  perro_id: number;

  @IsInt()
  @IsPositive()
  adoptante_id: number;

  @IsInt()
  @IsPositive()
  refugio_id: number;

  @IsOptional()
  @IsEnum(EstadoAdopcion)
  estado?: EstadoAdopcion;

  @IsOptional()
  @IsDateString()
  fecha_resolucion?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
