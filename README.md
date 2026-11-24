# 🐾 Huellas Seguras — Backend

API REST para **Huellas Seguras**, una plataforma que conecta a personas, refugios y veterinarias para gestionar **perros perdidos, encontrados y en situación de maltrato**, su seguimiento por casos, tratamientos médicos y adopciones.

Proyecto académico de Programación IV, desarrollado con **NestJS**, **Prisma** y **PostgreSQL**.

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Modelo de datos](#modelo-de-datos)
- [Endpoints](#endpoints)
- [Autenticación](#autenticación)
- [Datos de prueba (seed)](#datos-de-prueba-seed)
- [Colección de Postman](#colección-de-postman)
- [Tests](#tests)

## Tecnologías

| Área | Herramienta |
| --- | --- |
| Framework | [NestJS 12](https://nestjs.com/) |
| Lenguaje | TypeScript |
| Base de datos | PostgreSQL |
| ORM | [Prisma 7](https://www.prisma.io/) con `@prisma/adapter-pg` |
| Autenticación | JWT (`@nestjs/jwt`) + `bcrypt` para el hash de contraseñas |
| Validación | `class-validator` + `class-transformer` |
| Tests | Jest + Supertest |
| Lint / formato | oxlint + Prettier |

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión LTS reciente)
- [PostgreSQL](https://www.postgresql.org/) en ejecución y una base de datos vacía creada
- npm

## Instalación y puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo .env en la raíz (ver sección "Variables de entorno")

# 3. Aplicar las migraciones a la base de datos
npx prisma migrate deploy

# 4. Generar el cliente de Prisma (se genera en src/generated/prisma)
npx prisma generate

# 5. (Opcional) Cargar datos de prueba
npx prisma db seed

# 6. Levantar el servidor en modo desarrollo
npm run start:dev
```

La API queda disponible en `http://localhost:3000` (o el puerto definido en `PORT`).

> Durante el desarrollo, para crear nuevas migraciones a partir de cambios en `prisma/schema.prisma` usá `npx prisma migrate dev`.

## Variables de entorno

Creá un archivo `.env` en la raíz del proyecto:

```env
# Cadena de conexión a PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/huellas_seguras"

# Puerto del servidor (opcional, por defecto 3000)
PORT=3000

# Secreto para firmar los JWT (obligatorio: la app no arranca sin él)
JWT_SECRET="un-secreto-largo-y-aleatorio"
```

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run start` | Inicia la app |
| `npm run start:dev` | Inicia en modo watch (desarrollo) |
| `npm run start:debug` | Inicia en modo debug con watch |
| `npm run build` | Compila a `dist/` |
| `npm run start:prod` | Ejecuta la versión compilada (`node dist/main`) |
| `npm run lint` | Linter (oxlint con chequeo de tipos) |
| `npm run format` | Formatea el código con Prettier |
| `npm run test` | Tests unitarios |
| `npm run test:watch` | Tests unitarios en modo watch |
| `npm run test:cov` | Tests con reporte de cobertura |
| `npm run test:e2e` | Tests end-to-end |

## Estructura del proyecto

```
.
├── prisma/
│   ├── schema.prisma        # Modelos y enums de la base de datos
│   ├── migrations/          # Historial de migraciones
│   └── seed.ts              # Datos de prueba
├── postman/                 # Colección de Postman con los endpoints
├── src/
│   ├── main.ts              # Punto de entrada (ValidationPipe global)
│   ├── generated/prisma/    # Cliente de Prisma generado
│   └── modules/
│       ├── app/             # Módulo raíz
│       ├── prisma/          # PrismaService (conexión a la BD)
│       ├── auth/            # Registro, login y guard JWT
│       ├── usuarios/        # Gestión de usuarios y roles
│       ├── perros/          # Perros
│       ├── reportes/        # Reportes de perdidos / encontrados / maltrato
│       ├── casos/           # Casos de seguimiento de los reportes
│       ├── refugios/        # Refugios
│       ├── veterinarias/    # Veterinarias
│       └── adopciones/      # Solicitudes de adopción
└── test/                    # Tests e2e
```

Cada módulo sigue la misma organización: `controller`, `service`, `module`, carpeta `dto/` (creación, actualización y filtros) y `entities/`.

La app aplica un `ValidationPipe` global con `whitelist`, `forbidNonWhitelisted` y `transform`: se rechazan los campos no declarados en los DTOs y los parámetros se convierten automáticamente a su tipo.

## Modelo de datos

Entidades principales (definidas en [prisma/schema.prisma](prisma/schema.prisma)):

- **Rol / User**: usuarios del sistema con un rol asociado.
- **Refugio / Veterinaria**: pueden estar vinculados a un usuario (1 a 1) y tienen un flag `afiliado_confirmado`.
- **Perro / PerroFoto**: perros con su estado actual y fotos.
- **Reporte / ReporteFoto / Comentario**: reportes de perros perdidos, encontrados o maltrato, con fotos y comentarios.
- **Caso / CasoSeguimiento**: cada reporte puede derivar en un caso asignado a un usuario, con historial de seguimiento.
- **Adopcion**: solicitud de un usuario para adoptar un perro de un refugio.
- **TratamientoMedico**: tratamiento de un perro en una veterinaria.

Enums relevantes:

| Enum | Valores |
| --- | --- |
| `EstadoPerro` | `perdido`, `encontrado`, `en_refugio`, `en_tratamiento`, `adoptado` |
| `TipoReporte` | `perdido`, `encontrado`, `maltrato` |
| `EstadoReporte` | `pendiente`, `en_revision`, `verificado`, `descartado`, `cerrado` |
| `PrioridadCaso` | `baja`, `media`, `alta`, `urgente` |
| `EstadoCaso` | `abierto`, `en_proceso`, `resuelto`, `cerrado` |
| `EstadoAdopcion` | `pendiente`, `aprobada`, `rechazada`, `cancelada` |
| `EstadoTratamiento` | `en_curso`, `finalizado`, `suspendido` |

## Endpoints

Todos los recursos exponen un CRUD con la misma forma. Los listados (`GET /recurso`) aceptan filtros por query string definidos en los `filter-*.dto.ts` de cada módulo (por ejemplo, `GET /casos?estado=abierto&prioridad=alta`).

| Recurso | Base | Operaciones |
| --- | --- | --- |
| Auth | `/auth` | `POST /register`, `POST /login`, `GET /me` 🔒 |
| Usuarios | `/usuarios` | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `PATCH /:id/rol`, `DELETE /:id` |
| Perros | `/perros` | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| Reportes | `/reportes` | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| Casos | `/casos` | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| Refugios | `/refugios` | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| Veterinarias | `/veterinarias` | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| Adopciones | `/adopciones` | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |

🔒 = requiere token JWT.

> **Nota:** por ahora el guard JWT solo protege `GET /auth/me`. La protección del resto de los endpoints y el control de acceso por rol quedan pendientes.

## Autenticación

1. Registrarse con `POST /auth/register` (los usuarios nuevos reciben el rol `usuario` por defecto).
2. Iniciar sesión con `POST /auth/login`; la respuesta incluye un token JWT con vigencia de **1 día**.
3. Enviar el token en las rutas protegidas:

```
Authorization: Bearer <token>
```

Roles disponibles: `usuario`, `refugio`, `veterinaria` y `admin`. El rol se puede cambiar con `PATCH /usuarios/:id/rol`.

## Datos de prueba (seed)

El seed es **idempotente** (se puede ejecutar varias veces sin duplicar datos) y crea roles, usuarios, un refugio, una veterinaria, perros, un reporte, un caso y una solicitud de adopción.

```bash
npx prisma db seed
```

Usuarios de prueba (contraseña de todos: `Password123!`):

| Email | Rol |
| --- | --- |
| `admin@huellas.test` | admin |
| `juan.perez@huellas.test` | usuario |
| `refugio@huellas.test` | refugio |
| `vet@huellas.test` | veterinaria |

> ⚠️ Solo para desarrollo. No ejecutar el seed en producción.

## Colección de Postman

En [postman/huellas-seguras.postman_collection.json](postman/huellas-seguras.postman_collection.json) hay una colección lista para importar en Postman con los endpoints de la API.

## Tests

```bash
# unitarios
npm run test

# end-to-end
npm run test:e2e

# cobertura
npm run test:cov
```
