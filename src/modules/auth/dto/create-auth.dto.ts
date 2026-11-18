import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  password: string;
}
