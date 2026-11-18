import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { EstadoReporte, TipoReporte } from '../../../generated/prisma/enums';

export class CreateReporteDto {
  @IsEnum(TipoReporte)
  tipo: TipoReporte;

  @IsInt()
  @IsPositive()
  usuario_id: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  perro_id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @IsOptional()
  @IsEnum(EstadoReporte)
  estado?: EstadoReporte;

  @IsOptional()
  @IsInt()
  @IsPositive()
  revisado_por?: number;

  @IsOptional()
  @IsDateString()
  fecha_revision?: string;

  @IsOptional()
  @IsString()
  motivo_descarte?: string;
}
