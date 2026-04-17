import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

export const trips = sqliteTable('trips', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  country: text('country').notNull(),
  region: text('region').notNull(),
  year: integer('year').notNull(),
  month: text('month').notNull(),
  duration: text('duration').notNull(),
  travelWith: text('travel_with').notNull(),
  story: text('story'),
  tips: text('tips'),
  emoji: text('emoji'),
  coverImageUrl: text('cover_image_url'),
  published: integer('published', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const stays = sqliteTable('stays', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tripId: integer('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  location: text('location'),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const activities = sqliteTable('activities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tripId: integer('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const photos = sqliteTable('photos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tripId: integer('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  cloudinaryId: text('cloudinary_id'),
  url: text('url'),
  caption: text('caption'),
  takenAt: text('taken_at'),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const tripsRelations = relations(trips, ({ many }) => ({
  stays: many(stays),
  activities: many(activities),
  photos: many(photos),
}));

export const staysRelations = relations(stays, ({ one }) => ({
  trip: one(trips, { fields: [stays.tripId], references: [trips.id] }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  trip: one(trips, { fields: [activities.tripId], references: [trips.id] }),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  trip: one(trips, { fields: [photos.tripId], references: [trips.id] }),
}));

export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
export type Stay = typeof stays.$inferSelect;
export type NewStay = typeof stays.$inferInsert;
export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;
export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
