# Entrenamiento 360

Primera iteración de una aplicación web para campañas y call center. La versión actual usa una interfaz web estática y Supabase (PostgreSQL y Auth), con configuración para desplegar en Vercel. La carpeta `web` es el frontend; `supabase/schema.sql` crea la base y los procedimientos. Los archivos `.gs` de la raíz pertenecen al prototipo anterior y no forman parte de esta versión.

## Configuración de prueba

1. Cree un proyecto nuevo en Supabase. En el editor SQL ejecute completo `supabase/schema.sql`. Es una instalación inicial para una base nueva; no está diseñada para repetirse sobre una base existente.
2. En Authentication cree los usuarios autorizados. Desactive el registro público si no lo necesita. Obtenga el UUID de cada usuario en Authentication e inserte su perfil desde el editor SQL: `insert into public.perfiles (id, rol) values ('UUID-DEL-USUARIO', 'admin');`. Los roles disponibles son `admin`, `analista` y `call`. Admin y analista gestionan campañas; call solo ve campañas asignadas. Para asignar una campaña a call: `insert into public.asignaciones_call (usuario, id_campana) values ('UUID-DEL-USUARIO', 'CAMP-000001');`.
3. Importe los datos existentes mediante CSV a Supabase. `droguerias` combina el código, dirección y contacto de `Aso_Drog_Activo` con municipio, departamento, latitud y longitud de `E360_Droguerias`; `planes` recibe CODIGO, MODULO, NIVEL y ESTADO GENERAL de `Plan_de_Trabajo`. Exporte y cruce los datos por código antes de importar; conserve códigos como texto, incluidos ceros iniciales. Importe primero `droguerias`, después `planes`, y agregue registros a `profesionales`. No se geocodifica de nuevo. La carga y sincronización automática desde Sheets no están implementadas.
4. Revise `parametros` en el editor de tablas. Los montos y las tipificaciones provienen del demo y son provisionales. Ajuste los estados de plan abierto, el bloqueo por deuda y los montos antes de operar; la cobertura usa 80 % por defecto. El tiempo en minutos es la estimación del demo, no una ruta real.
5. Para desarrollo local copie `web/config.example.js` como `web/config.js` y escriba la URL y la clave **publicable** de Supabase. Para Vercel configure las variables `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`; el proceso de construcción genera `web/config.js`. Estos valores son visibles en el navegador. Nunca use una clave secreta o `service_role` ni la contraseña de base de datos. Configure las URLs permitidas en Supabase Auth para el dominio de la aplicación.
6. Para publicar en Vercel, suba el proyecto a un repositorio e impórtelo. `vercel.json` construye y publica la carpeta `web`. Vercel Hobby está limitado a uso personal no comercial; revise el plan necesario para su operación. Puede alojar estos mismos archivos estáticos en otro proveedor compatible.

### Alternativa: Cloudflare Pages

Conecte el repositorio privado a Cloudflare Pages, seleccione `main`, configure como comando de compilación `node scripts/build.mjs` y como directorio de salida `web`. En las variables de entorno del proyecto indique `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` con los datos públicos de Supabase. Cada cambio publicado en GitHub puede generar un nuevo despliegue. Crear el sitio y otorgar acceso al repositorio requiere una cuenta y sus permisos en Cloudflare. Configure Supabase y cree una cuenta individual para cada usuario antes de utilizarlo.

Abrir `web/index.html` haciendo doble clic permite ver la pantalla, pero no inicia el servicio ni crea usuarios. La cuenta de GitHub no es la cuenta de la aplicación. Si falta configuración, la pantalla explica que el administrador debe conectar Supabase y crear los usuarios.

## Alcance y limitaciones

- La segmentación admite distancia y códigos manuales, pegados y primeras N aptas. Al guardar, la base se recalcula en el servidor; campaña, base y agenda se guardan en una transacción de PostgreSQL.
- La asistencia única por código, tema y nivel alimenta la cobertura calculada en consulta; los cobros se crean de forma explícita después del evento y son únicos por código, concepto y campaña. Para proceso incompleto se busca un plan del mismo tema y nivel con estado `Cerrado`; confirme esa regla antes de generar cobros reales.
- La seguridad se basa en Auth, perfiles, asignaciones de call center y procedimientos con autorización. Las tablas tienen RLS habilitado y no se conceden permisos de acceso directo a usuarios de la aplicación. Los permisos administrativos de Supabase deben reservarse a personas autorizadas.
- Edición o eliminación solo antes de iniciar gestión. Las correcciones de asistencia y anulación de cobros requieren una siguiente iteración. Dashboard completo, planificación regional, insights, edición de catálogo y metas, drag & drop y sincronización automática también están pendientes.
- Es una base de implementación, no una instalación ya desplegada: antes de producción pruebe en un proyecto Supabase de prueba con datos representativos, verifique permisos por rol, revise el tratamiento de datos personales y establezca respaldos. La capa gratuita de Supabase no incluye respaldos automáticos y puede pausar proyectos inactivos.
