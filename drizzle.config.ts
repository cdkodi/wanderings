import type { Config } from 'drizzle-kit';

const rawUrl = process.env.DATABASE_URL ?? process.env.TURSO_DATABASE_URL ?? './wanderings.db';
const authToken = process.env.DATABASE_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN;
const isTurso = rawUrl.startsWith('libsql://');
const url = rawUrl.startsWith('.') || rawUrl.startsWith('/') ? `file:${rawUrl}` : rawUrl;

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: isTurso ? 'turso' : 'sqlite',
  dbCredentials: {
    url,
    ...(isTurso && { authToken }),
  },
} as Config;
