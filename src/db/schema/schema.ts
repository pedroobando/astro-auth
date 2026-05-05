import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { randomUUID } from 'crypto';

// === Tablas del proyecto ===

export const posts = sqliteTable('posts', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: text('id').notNull(),
  name: text('name').notNull(),
  context: text('context').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
