import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.ts';

const port = Number(process.env.PORT) || 3001;
const production = process.env.NODE_ENV === 'production';
const webDir = fileURLToPath(new URL('../../clients-analytics-web/dist', import.meta.url));

if (production && !existsSync(webDir)) {
  throw new Error(`Built web app not found at ${webDir}: run \`npm run build:web\` first.`);
}

createApp({ debugKnobs: !production, webDir: production ? webDir : undefined }).listen(port, () => {
  console.log(`${production ? 'App' : 'API'} listening on http://localhost:${port}`);
});
