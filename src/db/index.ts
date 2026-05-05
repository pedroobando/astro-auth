import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Fallback: import.meta.env para Astro/Vite, process.env para scripts CLI (Bun/Node)
const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof process !== 'undefined' && process.env
      ? process.env
      : {};

export const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL!,
    authToken: env.TURSO_AUTH_TOKEN!,
  },
  schema,
});

export type Db = typeof db;

// Re-exportar todo el schema para facilitar los imports
export * from './schema';
