import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const rawUrl = process.env.DATABASE_URL ?? process.env.TURSO_DATABASE_URL ?? './wanderings.db';
const authToken = process.env.DATABASE_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN;
// @libsql/client needs the file: prefix for local paths
const url = rawUrl.startsWith('.') || rawUrl.startsWith('/') ? `file:${rawUrl}` : rawUrl;

const client = createClient({ url, authToken });

export const db = drizzle(client, { schema });
