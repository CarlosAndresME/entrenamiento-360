# Entrenamiento 360

Aplicación web para planificar campañas de formación, organizar la gestión de contactos y medir la cobertura de droguerías por ciudad y módulo. El proyecto se encuentra en construcción y busca centralizar una operación que combina agenda de profesionales, call center y seguimiento posterior a cada evento.

## El problema

Una campaña no siempre parte de un radio geográfico: también puede comenzar con una lista de códigos previamente acordada. Además, ofrecer un módulo en una ciudad no significa haber cubierto toda su base. Entrenamiento 360 aborda ambos casos: filtra la elegibilidad de cada droguería y mide la cobertura por ciudad, tema y nivel.

## Funcionalidades de la primera iteración

- Creación, consulta, edición y eliminación de campañas antes de iniciar su gestión.
- Segmentación por distancia al evento o por códigos seleccionados, pegados o elegidos por municipio; vista previa de candidatos y exclusiones.
- Exclusión de droguerías con planes abiertos y, según configuración, deudas pendientes.
- Registro de una actividad en la agenda del profesional al crear la campaña.
- Gestión de contactos y asistencia por campaña, con acceso limitado a las campañas asignadas a cada agente de call center.
- Registro único de asistencia por droguería, tema y nivel; consulta de cobertura regional; evaluación posterior de cobros por inasistencia o proceso incompleto.

El cálculo en minutos es una estimación basada en distancia, no una ruta real. Las reglas de montos y tipificaciones son configurables y deben validarse antes de su uso operativo.

## Arquitectura

La interfaz está construida con HTML, CSS y JavaScript. Supabase proporciona autenticación y PostgreSQL; las operaciones críticas se realizan mediante funciones de base de datos que validan permisos y ejecutan los cambios en una transacción. Las tablas tienen Row Level Security habilitado y la aplicación no recibe acceso directo a ellas.

```text
Navegador ── HTTPS ──> Sitio estático
    │
    └── Supabase Auth + funciones autorizadas ──> PostgreSQL
```

El proyecto está preparado para publicar la interfaz en Cloudflare Pages o Vercel. El repositorio contiene el código y la estructura de datos, sin credenciales ni bases de contactos.

| Ruta | Contenido |
| --- | --- |
| `web/` | Interfaz, conexión con Supabase y ejemplo de configuración pública |
| `supabase/schema.sql` | Modelo de datos, reglas de acceso y funciones |
| `scripts/build.mjs` | Generación de configuración para el despliegue |

## Estado del proyecto

Esta es una primera iteración y todavía no hay un despliegue público operativo. Quedan pendientes las pruebas integrales sobre una instancia de Supabase, la carga de datos reales, el dashboard completo, la edición de catálogo y metas, la planificación regional y la agenda con arrastrar y soltar. También están pendientes los flujos de corrección de asistencia y anulación de cobros.

## Ejecutar en un entorno de prueba

1. Cree un proyecto de prueba en Supabase y ejecute `supabase/schema.sql` en el editor SQL. El script está pensado para una base nueva y no es una migración repetible.
2. Cree los usuarios en Supabase Auth y agregue sus perfiles a `public.perfiles`. Los roles disponibles son `admin`, `analista` y `call`. Las asignaciones de campañas para call center se registran en `public.asignaciones_call`. Desactive el registro público si no se necesita.
3. Cargue profesionales y datos de prueba en `profesionales`, `droguerias` y `planes`. Las coordenadas existentes se importan con las droguerías; el proyecto no incluye un geocodificador. No suba bases reales ni exportaciones al repositorio.
4. Copie `web/config.example.js` a `web/config.js` y complete la URL del proyecto y su clave publicable. Sirva la carpeta `web` con un servidor local. Las cuentas de la aplicación se crean en Supabase y no son las credenciales de GitHub.

Para Cloudflare Pages, conecte el repositorio, seleccione `main`, use `node scripts/build.mjs` como comando de compilación y `web` como directorio de salida. Configure `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` en el entorno de despliegue. También es posible utilizar la configuración incluida para Vercel; compruebe las condiciones del plan aplicable al uso del proyecto.

## Seguridad y datos

`web/config.js`, variables de entorno, exportaciones y respaldos locales están excluidos mediante `.gitignore`. La URL y la clave publicable se distribuyen al navegador; nunca deben sustituirse por claves secretas, `service_role` o contraseñas. El archivo `.gitignore` no elimina información que ya se haya incorporado al historial.

Antes de utilizar datos reales se necesitan pruebas de autorización por rol y concurrencia, validación de las reglas de negocio, tratamiento adecuado de datos personales y una estrategia de respaldo. El esquema y la aplicación todavía deben validarse de extremo a extremo en un entorno de prueba.
