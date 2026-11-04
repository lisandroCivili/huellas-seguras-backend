import { Module } from '@nestjs/common';
import { VeterinariasService } from './veterinarias.service';
import { VeterinariasController } from './veterinarias.controller';

@Module({
  controllers: [VeterinariasController],
  providers: [VeterinariasService],
})
export class VeterinariasModule {}
