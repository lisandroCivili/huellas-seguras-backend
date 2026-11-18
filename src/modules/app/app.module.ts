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
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true,}),  UsuariosModule, AuthModule, RefugiosModule, PerrosModule, VeterinariasModule, ReportesModule, CasosModule, AdopcionesModule,PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
