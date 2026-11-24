import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCasoDto } from './create-caso.dto';

// El reporte de un caso no se puede cambiar una vez creado
export class UpdateCasoDto extends PartialType(
  OmitType(CreateCasoDto, ['reporte_id'] as const),
) {}
