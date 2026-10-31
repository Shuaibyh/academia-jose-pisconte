# Academia Jose Pisconte

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-f59e0b)
![Java](https://img.shields.io/badge/Java-21-007396)
![React](https://img.shields.io/badge/React-18-61DAFB)

> **Estado: En desarrollo (Work in Progress).** Esta es una demostracion tecnica en evolucion. No esta lista para produccion ni se presenta como un sistema oficial de una institucion educativa.

Aplicacion web para explorar la gestion de una academia: estudiantes, cursos, matriculas, aula virtual, tareas, comunicados y asistencia. El repositorio conserva el estado actual para continuar su mejora funcional y visual de forma trazable.

## Tecnologias

- Frontend: React 18, Vite 8, JavaScript, CSS, Lucide React y ESLint.
- Backend: Java 21, Spring Boot 3.3, Spring Web, Spring Data JPA y Bean Validation.
- Datos: PostgreSQL 16 y migraciones Flyway.
- Entorno local: Maven, npm y Docker Compose.

## Arquitectura

```text
frontend/              SPA React y cliente HTTP
backend/               API REST Spring Boot
  src/main/java/       dominio, repositorios, servicios y controladores
  src/main/resources/  configuracion y migraciones Flyway
docker-compose.yml     PostgreSQL para desarrollo local
```

El frontend consume la API en `http://localhost:8081/api` por defecto. El backend persiste en PostgreSQL y sirve archivos cargados desde una carpeta local configurable.

## Funcionalidades implementadas

- Inicio de sesion demo con roles de estudiante y administracion/docencia.
- Consulta y registro de estudiantes, cursos y matriculas; edicion de estudiantes.
- Dashboard con metricas academicas basicas.
- Comunicados y anuncios con creacion, edicion y eliminacion.
- Aula virtual con materiales, lecciones, actividades y entregas de archivos.
- Sesiones y registros de asistencia.
- Progreso, notas y asistencia por estudiante.
- Carga de archivos y foto de perfil en almacenamiento local.

Estas funciones se verificaron por inspeccion del codigo y sus rutas. No implican calidad de produccion ni cobertura completa de casos limite.

## Limitaciones conocidas

- La autenticacion es demostrativa: compara contrasenas en texto plano y no usa sesiones ni tokens.
- Los endpoints no aplican autorizacion robusta del lado del servidor.
- No hay pruebas automatizadas en el estado actual.
- Los archivos se almacenan en disco local y no existe politica de antivirus o retencion.
- La interfaz requiere una auditoria completa de UI/UX, responsive y accesibilidad.
- Las migraciones incluyen datos sinteticos para demostracion; no deben sustituirse por datos reales.

Consulta [ROADMAP.md](ROADMAP.md) para el plan de trabajo.

## Ejecucion local

### Requisitos

- Java 21
- Maven 3.9 o superior
- Node.js 20 o superior y npm
- Docker con Compose

### 1. Variables de entorno

Define como minimo las contrasenas de las cuentas demo antes de iniciar el backend:

```powershell
$env:APP_DEMO_ADMIN_PASSWORD='una-contrasena-local'
$env:APP_DEMO_STUDENT_PASSWORD='otra-contrasena-local'
```

No uses credenciales reales. `.env.example` documenta las variables disponibles; los archivos `.env` estan excluidos de Git.

| Variable | Proposito | Valor local por defecto |
| --- | --- | --- |
| `APP_DEMO_ADMIN_PASSWORD` | Clave inicial del administrador demo | Obligatoria |
| `APP_DEMO_STUDENT_PASSWORD` | Clave inicial del estudiante demo | Obligatoria |
| `DB_URL` | URL JDBC de PostgreSQL | `jdbc:postgresql://localhost:5433/academia_demo` |
| `DB_USERNAME` | Usuario de PostgreSQL | `academia` |
| `DB_PASSWORD` | Clave de PostgreSQL | Obligatoria |
| `APP_CORS_ALLOWED_ORIGINS` | Origen permitido para el frontend | `http://localhost:5173` |
| `APP_UPLOADS_PATH` | Carpeta de archivos cargados | `uploads` |
| `SERVER_PORT` | Puerto HTTP | `8081` |

El frontend acepta `VITE_API_URL`; su valor predeterminado es `http://localhost:8081/api`.

### 2. Base de datos

```bash
docker compose up -d db
```

El Compose incluido levanta PostgreSQL en el puerto local `5433`. Define `DB_PASSWORD` antes de ejecutarlo; sus valores son solo para desarrollo local.

### 3. Backend

```bash
cd backend
mvn spring-boot:run
```

Comprobacion: `http://localhost:8081/api/health`.

### 4. Frontend

```bash
cd frontend
npm ci
npm run dev
```

Interfaz: `http://localhost:5173`.

## Docker

Docker Compose configura unicamente PostgreSQL; no empaqueta todavia el frontend ni el backend. Valida la configuracion con `docker compose config`.

## Capturas

No se publican capturas en esta version porque la interfaz puede mostrar nombres, documentos, telefonos y otros datos academicos. Se agregaran capturas con datos sinteticos despues de preparar un entorno seguro de demostracion.

## Pruebas y calidad

- Frontend: scripts disponibles `npm run lint` y `npm run build`.
- Backend: `mvn test` y `mvn package` (actualmente sin clases de prueba propias).
- Integracion: pendiente una suite automatizada con PostgreSQL aislado.

## Uso responsable

No cargues informacion real de estudiantes, docentes o apoderados en una instalacion publica. Antes de un despliegue se deben implementar autenticacion segura, autorizacion por rol, cifrado de contrasenas, proteccion de archivos, registros de auditoria y politicas de privacidad.
