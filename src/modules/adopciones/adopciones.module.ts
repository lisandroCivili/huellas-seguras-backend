import { Module } from '@nestjs/common';
import { AdopcionesService } from './adopciones.service';
import { AdopcionesController } from './adopciones.controller';

@Module({
  controllers: [AdopcionesController],
  providers: [AdopcionesService],
})
export class AdopcionesModule {}
