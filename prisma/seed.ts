import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

// Seed de desarrollo. Es idempotente: se puede correr varias veces sin duplicar datos.
// Todos los usuarios de prueba usan la contraseña PASSWORD_DEV.
const PASSWORD_DEV = 'Password123!';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // --- Roles --------------------------------------------------------------
  // El id 1 es el ROL_POR_DEFECTO que UsuariosService asigna a los usuarios nuevos
  const roles = [
    { id: 1, nombre: 'usuario' },
    { id: 2, nombre: 'refugio' },
    { id: 3, nombre: 'veterinaria' },
    { id: 4, nombre: 'admin' },
  ];
  for (const rol of roles) {
    await prisma.rol.upsert({
      where: { nombre: rol.nombre },
      update: {},
      create: rol,
    });
  }
  // Como insertamos ids a mano, hay que reubicar la secuencia para que los próximos
  // roles creados con autoincrement no choquen
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Rol"', 'id'), (SELECT MAX(id) FROM "Rol"))`;

  // --- Usuarios -----------------------------------------------------------
  const password_hash = await bcrypt.hash(PASSWORD_DEV, 10);
  const crearUsuario = (
    email: string,
    nombre: string,
    apellido: string,
    telefono: string,
    rol_id: number,
  ) =>
    prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, nombre, apellido, telefono, rol_id, password_hash },
    });

  const admin = await crearUsuario(
    'admin@huellas.test',
    'Admin',
    'Huellas',
    '+5491100000001',
    4,
  );
  const adoptante = await crearUsuario(
    'juan.perez@huellas.test',
    'Juan',
    'Pérez',
    '+5491122334455',
    1,
  );
  const usuarioRefugio = await crearUsuario(
    'refugio@huellas.test',
    'Laura',
    'Refugio',
    '+5491100000002',
    2,
  );
  const usuarioVet = await crearUsuario(
    'vet@huellas.test',
    'Carlos',
    'Veterinario',
    '+5491100000003',
    3,
  );

  // --- Refugio y veterinaria (usuario_id es unique, sirve para el upsert) --
  const refugio = await prisma.refugio.upsert({
    where: { usuario_id: usuarioRefugio.id },
    update: {},
    create: {
      usuario_id: usuarioRefugio.id,
      nombre: 'Refugio Patitas',
      direccion: 'Av. Siempre Viva 742',
      telefono: '+5491122334455',
      capacidad_maxima: 50,
      descripcion: 'Refugio de perros rescatados',
      horarios: 'Lun a Vie 9 a 18',
      servicios: ['alojamiento', 'adopciones'],
      afiliado_confirmado: true,
    },
  });

  await prisma.veterinaria.upsert({
    where: { usuario_id: usuarioVet.id },
    update: {},
    create: {
      usuario_id: usuarioVet.id,
      nombre: 'Veterinaria San Roque',
      direccion: 'Calle Falsa 123',
      telefono: '+5491122334455',
      horarios: 'Lun a Sáb 8 a 20',
      matricula: 'MP-12345',
      servicios: ['consultas', 'vacunación', 'cirugía'],
      afiliado_confirmado: true,
    },
  });

  // --- Perros -------------------------------------------------------------
  // Perro no tiene campo unique, así que buscamos por nombre antes de crear
  const perroPorNombre = async (
    nombre: string,
    data: Parameters<typeof prisma.perro.create>[0]['data'],
  ) =>
    (await prisma.perro.findFirst({ where: { nombre } })) ??
    (await prisma.perro.create({ data }));

  const firulais = await perroPorNombre('Firulais', {
    nombre: 'Firulais',
    raza: 'Mestizo',
    edad_aproximada: 3,
    sexo: 'macho',
    estado_actual: 'en_refugio',
    publicado: true,
    refugio_actual_id: refugio.id,
  });
  await perroPorNombre('Luna', {
    nombre: 'Luna',
    raza: 'Labrador',
    edad_aproximada: 2,
    sexo: 'hembra',
    estado_actual: 'perdido',
    publicado: true,
  });

  // --- Reporte, caso y adopción ------------------------------------------
  const tituloReporte = 'Perro perdido en el centro';
  const reporte =
    (await prisma.reporte.findFirst({ where: { titulo: tituloReporte } })) ??
    (await prisma.reporte.create({
      data: {
        tipo: 'perdido',
        usuario_id: adoptante.id,
        perro_id: firulais.id,
        titulo: tituloReporte,
        descripcion: 'Visto por última vez cerca de la plaza',
        direccion: 'Plaza Principal',
        estado: 'pendiente',
      },
    }));

  // reporte_id es unique en Caso
  await prisma.caso.upsert({
    where: { reporte_id: reporte.id },
    update: {},
    create: {
      reporte_id: reporte.id,
      asignado_a: admin.id,
      prioridad: 'media',
      estado: 'abierto',
    },
  });

  const adopcionExistente = await prisma.adopcion.findFirst({
    where: { perro_id: firulais.id, adoptante_id: adoptante.id },
  });
  if (!adopcionExistente) {
    await prisma.adopcion.create({
      data: {
        perro_id: firulais.id,
        adoptante_id: adoptante.id,
        refugio_id: refugio.id,
        estado: 'pendiente',
        observaciones: 'Familia con patio amplio',
      },
    });
  }

  console.log('Seed OK. Usuarios de prueba (contraseña: %s):', PASSWORD_DEV);
  console.log(' - admin@huellas.test (admin)');
  console.log(' - juan.perez@huellas.test (usuario)');
  console.log(' - refugio@huellas.test (refugio)');
  console.log(' - vet@huellas.test (veterinaria)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
