-- DropForeignKey
ALTER TABLE "Adopcion" DROP CONSTRAINT "Adopcion_adoptante_id_fkey";

-- DropForeignKey
ALTER TABLE "Adopcion" DROP CONSTRAINT "Adopcion_perro_id_fkey";

-- DropForeignKey
ALTER TABLE "Adopcion" DROP CONSTRAINT "Adopcion_refugio_id_fkey";

-- DropForeignKey
ALTER TABLE "Caso" DROP CONSTRAINT "Caso_reporte_id_fkey";

-- DropForeignKey
ALTER TABLE "CasoSeguimiento" DROP CONSTRAINT "CasoSeguimiento_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Comentario" DROP CONSTRAINT "Comentario_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Reporte" DROP CONSTRAINT "Reporte_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "TratamientoMedico" DROP CONSTRAINT "TratamientoMedico_perro_id_fkey";

-- DropForeignKey
ALTER TABLE "TratamientoMedico" DROP CONSTRAINT "TratamientoMedico_veterinaria_id_fkey";

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_reporte_id_fkey" FOREIGN KEY ("reporte_id") REFERENCES "Reporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CasoSeguimiento" ADD CONSTRAINT "CasoSeguimiento_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adopcion" ADD CONSTRAINT "Adopcion_perro_id_fkey" FOREIGN KEY ("perro_id") REFERENCES "Perro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adopcion" ADD CONSTRAINT "Adopcion_adoptante_id_fkey" FOREIGN KEY ("adoptante_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adopcion" ADD CONSTRAINT "Adopcion_refugio_id_fkey" FOREIGN KEY ("refugio_id") REFERENCES "Refugio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TratamientoMedico" ADD CONSTRAINT "TratamientoMedico_perro_id_fkey" FOREIGN KEY ("perro_id") REFERENCES "Perro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TratamientoMedico" ADD CONSTRAINT "TratamientoMedico_veterinaria_id_fkey" FOREIGN KEY ("veterinaria_id") REFERENCES "Veterinaria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
