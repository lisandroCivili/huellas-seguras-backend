import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsString()
  @MinLength(2)
  apellido: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  @MaxLength(72)
  password: string;

  @IsPhoneNumber('AR')
  telefono: string;
}