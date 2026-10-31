# Academia José Pisconte — Plataforma de Gestión Académica y Aprendizaje Inteligente

[![Estado](https://img.shields.io/badge/estado-en%20desarrollo-f59e0b)](ROADMAP.md)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-007396?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)

> **Estado: En desarrollo (Work in Progress).** El repositorio contiene un prototipo funcional en evolución. No está listo para producción ni se presenta como el sistema oficial de una institución educativa.

Academia José Pisconte es un proyecto Full Stack orientado a construir un ecosistema educativo digital que integre gestión académica, aula virtual, seguimiento del aprendizaje y, en etapas futuras, herramientas de inteligencia artificial.

La plataforma busca reunir en un mismo entorno las actividades de estudiantes, docentes y administradores: acceso a recursos educativos, gestión de cursos y matrículas, entrega de tareas, asistencia, calificaciones y seguimiento del progreso académico.

Una línea central de desarrollo es la evaluación asistida por **inteligencia artificial multimodal**. La visión contempla analizar tareas enviadas como fotografías o documentos, identificar posibles errores y generar retroalimentación educativa personalizada bajo la supervisión del docente. Esta capacidad todavía no está implementada.

## Alcance actual

### Funcionalidades implementadas

El código actual incluye implementaciones iniciales de:

- Inicio de sesión demostrativo con roles de estudiante y administración/docencia.
- Consulta y registro de estudiantes, cursos y matrículas, incluida la edición de estudiantes.
- Panel académico con métricas básicas.
- Comunicados y anuncios con creación, edición y eliminación.
- Aula virtual con materiales, lecciones, actividades y entregas de archivos.
- Sesiones y registros de asistencia.
- Consulta de progreso, calificaciones y asistencia por estudiante.
- Carga local de archivos y fotografía de perfil.

Estas capacidades se verificaron en el código y sus rutas. Son implementaciones de prototipo y todavía requieren mejoras de seguridad, pruebas, integración y experiencia de usuario.

### Funcionalidades planificadas

Las siguientes capacidades forman parte de la visión de desarrollo y **no se presentan como implementadas**:

- Biblioteca de clases grabadas y reproducción de video por curso.
- Organización ampliada de contenidos por módulos, unidades y lecciones.
- Evaluaciones y actividades interactivas.
- Entrega y revisión de ejercicios mediante fotografías y documentos.
- Evaluación asistida por inteligencia artificial multimodal.
- Interpretación de imágenes de ejercicios y documentos académicos.
- Retroalimentación explicativa y recomendaciones personalizadas.
- Tutor académico virtual con acompañamiento adaptado al estudiante.
- Analítica avanzada del rendimiento y detección de necesidades de refuerzo.
- Herramientas ampliadas para planificación, revisión y seguimiento docente.
- Experiencia responsive con una interfaz moderna y accesible.

## Objetivo a largo plazo

Construir una plataforma educativa integral, escalable y orientada al aprendizaje personalizado que combine herramientas tradicionales de gestión académica con inteligencia artificial, preservando la supervisión docente, la privacidad y la seguridad de los estudiantes.

## Tecnologías actuales

| Capa | Tecnologías verificadas |
| --- | --- |
| Frontend | React 18, Vite 8, JavaScript, CSS, Lucide React y ESLint |
| Backend | Java 21, Spring Boot 3.3, Spring Web, Spring Data JPA y Bean Validation |
| Datos | PostgreSQL 16 y migraciones Flyway |
| Desarrollo | Maven, npm y Docker Compose |

## Arquitectura

La aplicación mantiene una separación entre la interfaz web, la API REST y la persistencia:

```text
┌──────────────────────────────┐
│ Frontend React y Vite        │
│ Interfaz y cliente HTTP      │
└──────────────┬───────────────┘
               │ REST / JSON
┌──────────────▼───────────────┐
│ Backend Spring Boot          │
│ Controladores y servicios    │
└──────────────┬───────────────┘
               │ JPA / Flyway
┌──────────────▼───────────────┐
│ PostgreSQL                   │
│ Datos académicos de la demo  │
└──────────────────────────────┘

Archivos cargados -> almacenamiento local configurable
IA multimodal      -> integración futura, no implementada
```

Estructura principal del repositorio:

```text
frontend/              SPA React y cliente HTTP
backend/               API REST Spring Boot
  src/main/java/       dominio, repositorios, servicios y controladores
  src/main/resources/  configuración y migraciones Flyway
docker-compose.yml     PostgreSQL para desarrollo local
```

El frontend consume la API en `http://localhost:8081/api` por defecto. El backend persiste en PostgreSQL y sirve los archivos cargados desde una carpeta local configurable.

## Roadmap visual

| Fase | Enfoque | Estado |
| --- | --- | --- |
| 1 | Base Full Stack, gestión académica y aula virtual inicial | En desarrollo |
| 2 | Seguridad, autorización por rol, pruebas e integración estable | Pendiente |
| 3 | Rediseño UI/UX, navegación, responsive y accesibilidad | Pendiente |
| 4 | Clases grabadas, módulos, lecciones y actividades ampliadas | Planificado |
| 5 | Evaluación multimodal, retroalimentación y tutor académico con IA | Visión futura |
| 6 | Analítica, rendimiento y preparación para despliegue | Visión futura |

El desglose técnico y los criterios de avance están en [ROADMAP.md](ROADMAP.md).

## Limitaciones conocidas

- La autenticación es demostrativa: compara contraseñas en texto plano y no usa sesiones ni tokens.
- Los endpoints no aplican autorización robusta del lado del servidor.
- No hay pruebas automatizadas propias en el estado actual.
- Los archivos se almacenan en disco local y no existe una política de antivirus o retención.
- La interfaz requiere una auditoría completa de UI/UX, responsive y accesibilidad.
- Las migraciones incluyen datos sintéticos para demostración; no deben sustituirse por datos reales.
- La inteligencia artificial multimodal y las nuevas capacidades de video siguen pendientes.

## Ejecución local

### Requisitos

- Java 21
- Maven 3.9 o superior
- Node.js 20 o superior y npm
- Docker con Compose

### 1. Variables de entorno

Define como mínimo las contraseñas de las cuentas demo y de PostgreSQL antes de iniciar los servicios:

```powershell
$env:APP_DEMO_ADMIN_PASSWORD='una-contrasena-local'
$env:APP_DEMO_STUDENT_PASSWORD='otra-contrasena-local'
$env:DB_PASSWORD='una-contrasena-local-para-postgresql'
```

No uses credenciales reales. `.env.example` documenta las variables disponibles; los archivos `.env` están excluidos de Git.

| Variable | Propósito | Valor local predeterminado |
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

Docker Compose levanta PostgreSQL en el puerto local `5433`. Define `DB_PASSWORD` antes de ejecutarlo. Esta configuración está destinada exclusivamente al desarrollo local.

### 3. Backend

```bash
cd backend
mvn spring-boot:run
```

Comprobación del servicio: `http://localhost:8081/api/health`.

### 4. Frontend

```bash
cd frontend
npm ci
npm run dev
```

Interfaz local: `http://localhost:5173`.

## Docker

Docker Compose configura únicamente PostgreSQL; todavía no empaqueta el frontend ni el backend. La configuración puede validarse con:

```bash
docker compose config
```

## Pruebas y calidad

- Frontend: `npm run lint` y `npm run build`.
- Backend: `mvn test` y `mvn package`; actualmente no existen clases de prueba propias.
- Integración: está pendiente una suite automatizada con PostgreSQL aislado.
- Documentación: README y roadmap distinguen el alcance actual de la visión futura.

## Seguridad y privacidad

No cargues información real de estudiantes, docentes o apoderados en una instalación pública. Antes de cualquier despliegue deben implementarse:

- Autenticación segura y almacenamiento de contraseñas mediante hashes.
- Autorización por rol aplicada en el servidor.
- Protección, validación y políticas de retención para archivos.
- Gestión segura de secretos por entorno.
- Registros de auditoría y políticas de privacidad.
- Revisión humana y salvaguardas para cualquier evaluación asistida por IA.

## Capturas

No se publican capturas en esta versión porque la interfaz puede mostrar nombres, documentos, teléfonos u otros datos académicos. Se incorporarán capturas con datos sintéticos cuando exista un entorno seguro de demostración.

## Estado del proyecto

Este repositorio documenta el avance técnico de una plataforma en construcción. Las contribuciones futuras deben conservar una separación clara entre funcionalidades verificadas, trabajo en curso y visión planificada.
