import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { users } from './schema'
import { v4 as uuid } from 'uuid'
import * as schema from './schema'

async function main() {
  // Create a new database connection for seeding
  const sqlite = new Database('./sqlite.db')
  const db = drizzle(sqlite, { schema })

  try {
    // Create default admin
    await db.insert(users).values({
      id: uuid(),
      email: 'admin@admin.com',
      password: 'admin', // TODO: Hash passwords in production
      role: 'admin',
      status: 'approved',
      createdAt: new Date(),
      lastLogin: new Date(),
      profileName: 'Admin',
      themePreference: 'light',
      emailNotifications: false
    })

    // Create default test user
    await db.insert(users).values({
      id: uuid(),
      email: 'test@test.com',
      password: 'test123', // TODO: Hash passwords in production
      role: 'user',
      status: 'approved',
      createdAt: new Date(),
      lastLogin: new Date(),
      profileName: 'Test User',
      themePreference: 'light',
      emailNotifications: false
    })

    console.log('✅ Database seeded with default users')
  } catch (error) {
    console.error('Failed to seed database:', error)
    process.exit(1)
  }
  process.exit(0)
}

main() 