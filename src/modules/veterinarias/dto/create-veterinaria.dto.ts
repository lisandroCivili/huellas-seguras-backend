import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateVeterinariaDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  usuario_id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  horarios?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  matricula?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicios?: string[];

  @IsOptional()
  @IsBoolean()
  afiliado_confirmado?: boolean;
}
