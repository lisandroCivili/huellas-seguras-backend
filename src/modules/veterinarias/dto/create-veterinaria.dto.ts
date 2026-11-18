import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateVeterinariaDto {
@IsBoolean() @IsOptional() afiliado_confirmado?:boolean

@IsString() @IsOptional() direccion?:string

@IsString() @IsOptional() horarios?:string

@IsString() @IsOptional() matricula?:string

@IsString() @IsOptional() nombre?:string

@IsOptional() @IsArray() @IsString({each:true}) servicios?:string

@IsString() @IsOptional() telefono?:string
}
