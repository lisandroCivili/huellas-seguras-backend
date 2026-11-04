import { PartialType } from '@nestjs/mapped-types';
import { CreateAdopcioneDto } from './create-adopcione.dto';

export class UpdateAdopcioneDto extends PartialType(CreateAdopcioneDto) {}
