import { writeFileSync } from 'node:fs';

const url = process.env.SUPABASE_URL;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!url || !publishableKey) {
  throw new Error('Configure SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY en el entorno de despliegue.');
}
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) throw new Error('SUPABASE_URL no es válida.');
if (/^sb_secret_/.test(publishableKey)) throw new Error('Use la clave publicable, no una clave secreta.');
const config = JSON.stringify({ url, publishableKey }).replace(/</g, '\\u003c');
writeFileSync('web/config.js', `window.E360_CONFIG = ${config};\n`);
