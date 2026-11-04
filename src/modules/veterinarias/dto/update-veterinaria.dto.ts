import { PartialType } from '@nestjs/mapped-types';
import { CreateVeterinariaDto } from './create-veterinaria.dto';

export class UpdateVeterinariaDto extends PartialType(CreateVeterinariaDto) {}
