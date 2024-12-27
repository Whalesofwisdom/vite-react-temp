import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
  profileName: text('profile_name'),
  themePreference: text('theme_preference', { enum: ['light', 'dark'] }).default('light'),
  emailNotifications: integer('email_notifications', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  lastLogin: integer('last_login', { mode: 'timestamp' }).notNull()
})

export const entries = sqliteTable('entries', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  content: text('content').notNull(),
  type: text('type', { enum: ['journal', 'message', 'wishes'] }).notNull(),
  status: text('status', { enum: ['draft', 'private', 'scheduled'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  releaseType: text('release_type', { enum: ['date', 'death'] }),
  releaseDate: integer('release_date', { mode: 'timestamp' }),
  releaseContactEmail: text('release_contact_email')
}) 