-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('macho', 'hembra');

-- CreateEnum
CREATE TYPE "EstadoPerro" AS ENUM ('perdido', 'encontrado', 'en_refugio', 'en_tratamiento', 'adoptado');

-- CreateEnum
CREATE TYPE "TipoReporte" AS ENUM ('perdido', 'encontrado', 'maltrato');

-- CreateEnum
CREATE TYPE "EstadoReporte" AS ENUM ('pendiente', 'en_revision', 'verificado', 'descartado', 'cerrado');

-- CreateEnum
CREATE TYPE "PrioridadCaso" AS ENUM ('baja', 'media', 'alta', 'urgente');

-- CreateEnum
CREATE TYPE "EstadoCaso" AS ENUM ('abierto', 'en_proceso', 'resuelto', 'cerrado');

-- CreateEnum
CREATE TYPE "EstadoAdopcion" AS ENUM ('pendiente', 'aprobada', 'rechazada', 'cancelada');

-- CreateEnum
CREATE TYPE "EstadoTratamiento" AS ENUM ('en_curso', 'finalizado', 'suspendido');

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refugio" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "nombre" VARCHAR(150) NOT NULL,
    "direccion" VARCHAR(200),
    "telefono" VARCHAR(30),
    "capacidad_maxima" INTEGER,
    "descripcion" TEXT,
    "horarios" VARCHAR(200),
    "servicios" TEXT[],
    "afiliado_confirmado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Refugio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veterinaria" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "nombre" VARCHAR(150) NOT NULL,
    "direccion" VARCHAR(200),
    "telefono" VARCHAR(30),
    "matricula" VARCHAR(50),
    "horarios" VARCHAR(200),
    "servicios" TEXT[],
    "afiliado_confirmado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Veterinaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perro" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100),
    "raza" VARCHAR(100),
    "edad_aproximada" INTEGER,
    "sexo" "Sexo",
    "estado_actual" "EstadoPerro" NOT NULL DEFAULT 'perdido',
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "refugio_actual_id" INTEGER,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Perro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerroFoto" (
    "id" SERIAL NOT NULL,
    "perro_id" INTEGER NOT NULL,
    "url" VARCHAR(300) NOT NULL,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerroFoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoReporte" NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "perro_id" INTEGER,
    "titulo" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "direccion" VARCHAR(200),
    "estado" "EstadoReporte" NOT NULL DEFAULT 'pendiente',
    "fecha_reporte" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revisado_por" INTEGER,
    "fecha_revision" TIMESTAMP(3),
    "motivo_descarte" TEXT,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReporteFoto" (
    "id" SERIAL NOT NULL,
    "reporte_id" INTEGER NOT NULL,
    "url" VARCHAR(300) NOT NULL,
    "fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReporteFoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "reporte_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caso" (
    "id" SERIAL NOT NULL,
    "reporte_id" INTEGER NOT NULL,
    "asignado_a" INTEGER,
    "prioridad" "PrioridadCaso" NOT NULL DEFAULT 'media',
    "estado" "EstadoCaso" NOT NULL DEFAULT 'abierto',
    "fecha_apertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" TIMESTAMP(3),
    "resolucion" TEXT,

    CONSTRAINT "Caso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CasoSeguimiento" (
    "id" SERIAL NOT NULL,
    "caso_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "estado_anterior" "EstadoCaso",
    "estado_nuevo" "EstadoCaso",
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CasoSeguimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adopcion" (
    "id" SERIAL NOT NULL,
    "perro_id" INTEGER NOT NULL,
    "adoptante_id" INTEGER NOT NULL,
    "refugio_id" INTEGER NOT NULL,
    "estado" "EstadoAdopcion" NOT NULL DEFAULT 'pendiente',
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_resolucion" TIMESTAMP(3),
    "observaciones" TEXT,

    CONSTRAINT "Adopcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TratamientoMedico" (
    "id" SERIAL NOT NULL,
    "perro_id" INTEGER NOT NULL,
    "veterinaria_id" INTEGER NOT NULL,
    "diagnostico" TEXT,
    "tratamiento" TEXT,
    "estado" "EstadoTratamiento" NOT NULL DEFAULT 'en_curso',
    "fecha_inicio" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" DATE,

    CONSTRAINT "TratamientoMedico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Refugio_usuario_id_key" ON "Refugio"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Veterinaria_usuario_id_key" ON "Veterinaria"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Caso_reporte_id_key" ON "Caso"("reporte_id");

-- CreateIndex
CREATE INDEX "Adopcion_perro_id_adoptante_id_idx" ON "Adopcion"("perro_id", "adoptante_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refugio" ADD CONSTRAINT "Refugio_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veterinaria" ADD CONSTRAINT "Veterinaria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perro" ADD CONSTRAINT "Perro_refugio_actual_id_fkey" FOREIGN KEY ("refugio_actual_id") REFERENCES "Refugio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerroFoto" ADD CONSTRAINT "PerroFoto_perro_id_fkey" FOREIGN KEY ("perro_id") REFERENCES "Perro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_revisado_por_fkey" FOREIGN KEY ("revisado_por") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_perro_id_fkey" FOREIGN KEY ("perro_id") REFERENCES "Perro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReporteFoto" ADD CONSTRAINT "ReporteFoto_reporte_id_fkey" FOREIGN KEY ("reporte_id") REFERENCES "Reporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_reporte_id_fkey" FOREIGN KEY ("reporte_id") REFERENCES "Reporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_reporte_id_fkey" FOREIGN KEY ("reporte_id") REFERENCES "Reporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_asignado_a_fkey" FOREIGN KEY ("asignado_a") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CasoSeguimiento" ADD CONSTRAINT "CasoSeguimiento_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "Caso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CasoSeguimiento" ADD CONSTRAINT "CasoSeguimiento_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adopcion" ADD CONSTRAINT "Adopcion_perro_id_fkey" FOREIGN KEY ("perro_id") REFERENCES "Perro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adopcion" ADD CONSTRAINT "Adopcion_adoptante_id_fkey" FOREIGN KEY ("adoptante_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adopcion" ADD CONSTRAINT "Adopcion_refugio_id_fkey" FOREIGN KEY ("refugio_id") REFERENCES "Refugio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TratamientoMedico" ADD CONSTRAINT "TratamientoMedico_perro_id_fkey" FOREIGN KEY ("perro_id") REFERENCES "Perro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TratamientoMedico" ADD CONSTRAINT "TratamientoMedico_veterinaria_id_fkey" FOREIGN KEY ("veterinaria_id") REFERENCES "Veterinaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
