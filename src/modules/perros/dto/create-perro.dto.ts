import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { EstadoPerro, Sexo } from '../../../generated/prisma/enums';

export class CreatePerroDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  raza?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  edad_aproximada?: number;

  @IsOptional()
  @IsEnum(Sexo)
  sexo?: Sexo;

  @IsOptional()
  @IsEnum(EstadoPerro)
  estado_actual?: EstadoPerro;

  @IsOptional()
  @IsBoolean()
  publicado?: boolean;

  @IsOptional()
  @IsInt()
  @IsPositive()
  refugio_actual_id?: number;
}
