# Roadmap de Academia Jose Pisconte

Este plan refleja el estado verificado del codigo al preparar su publicacion como proyecto en desarrollo. Una casilla marcada indica que existe una implementacion inicial, no que este lista para produccion.

## Implementado en la demo

- [x] Estructura separada de frontend React y API Spring Boot.
- [x] Persistencia PostgreSQL con migraciones Flyway.
- [x] Gestion basica de estudiantes, cursos y matriculas.
- [x] Comunicados, aula virtual, actividades, entregas y asistencia.
- [x] Carga local de archivos y foto de perfil.
- [x] Variables de entorno para no versionar contrasenas demo.
- [x] Exclusiones para dependencias, builds, cargas, logs y artefactos locales.

## Prioridad 0 Seguridad y privacidad

- [ ] Sustituir contrasenas en texto plano por hashes con Spring Security.
- [ ] Implementar autenticacion con sesiones seguras o tokens y cierre de sesion real.
- [ ] Aplicar autorizacion por rol en cada endpoint y evitar confiar en el rol enviado por el cliente.
- [ ] Validar tipo, tamano y contenido de archivos; definir retencion y almacenamiento privado.
- [ ] Incorporar gestion segura de secretos y perfiles separados por entorno.
- [ ] Auditar datos semilla, logs y respuestas para impedir exposicion de datos personales.

## Prioridad 1 Estabilidad e integracion

- [ ] Agregar pruebas unitarias de servicios y validaciones.
- [ ] Agregar pruebas de integracion del backend con PostgreSQL aislado.
- [ ] Agregar pruebas de componentes y flujos criticos del frontend.
- [ ] Manejar estados de carga, errores y reintentos de forma consistente.
- [ ] Documentar el contrato de la API con OpenAPI.
- [ ] Verificar de extremo a extremo login, matriculas, entregas y asistencia.

## Prioridad 2 UI UX y accesibilidad

- [ ] Realizar una auditoria visual antes del rediseno.
- [ ] Simplificar navegacion, jerarquia y terminologia por rol.
- [ ] Disenar una experiencia responsive para movil, tablet y escritorio.
- [ ] Revisar contraste, foco visible, etiquetas, teclado y lectores de pantalla.
- [ ] Mejorar tablas y formularios para conjuntos de datos extensos.
- [ ] Preparar capturas publicas usando solo datos sinteticos.

## Prioridad 3 Modulos academicos

- [ ] Completar reglas de edicion y eliminacion de cursos, matriculas y sesiones.
- [ ] Mejorar calificacion y retroalimentacion de entregas.
- [ ] Definir estados, cierres y correcciones de asistencia.
- [ ] Agregar filtros, paginacion y busqueda del lado del servidor.
- [ ] Validar fechas, puntajes, duplicados y transiciones de estado.
- [ ] Exportar reportes anonimizados con permisos adecuados.

## Prioridad 4 Rendimiento y despliegue

- [ ] Medir rendimiento del frontend y optimizar recursos e imagenes.
- [ ] Incorporar observabilidad, logs estructurados y comprobaciones de salud.
- [ ] Crear imagenes reproducibles para frontend y backend.
- [ ] Configurar CI para lint, build y pruebas en cada cambio.
- [ ] Preparar copias de seguridad y migraciones con estrategia de recuperacion.
- [ ] Hacer una revision de seguridad y privacidad antes de cualquier despliegue publico.

## Criterio para una primera version publica

La aplicacion podra considerarse candidata a una primera version desplegable cuando la autenticacion y autorizacion sean seguras, los datos de prueba esten aislados, los flujos criticos tengan pruebas automatizadas, la interfaz cumpla requisitos basicos de responsive y accesibilidad, y exista una operacion documentada de despliegue, monitoreo y recuperacion.
