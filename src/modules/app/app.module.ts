import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthModule } from '../auth/auth.module';
import { RefugiosModule } from '../refugios/refugios.module';
import { PerrosModule } from '../perros/perros.module';
import { VeterinariasModule } from '../veterinarias/veterinarias.module';
import { ReportesModule } from '../reportes/reportes.module';
import { CasosModule } from '../casos/casos.module';
import { AdopcionesModule } from '../adopciones/adopciones.module';

@Module({
  imports: [UsuariosModule, AuthModule, RefugiosModule, PerrosModule, VeterinariasModule, ReportesModule, CasosModule, AdopcionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
