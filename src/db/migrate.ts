import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'
import { Logger } from '../utils/logger'
import * as schema from './schema'
import fs from 'fs'

async function main() {
  // Delete existing database if it exists
  try {
    if (fs.existsSync('./sqlite.db')) {
      fs.unlinkSync('./sqlite.db')
      Logger.info('Removed existing database')
    }
  } catch (error) {
    Logger.error('Failed to remove existing database', error as Error)
  }

  // Create a new database connection for migrations
  const sqlite = new Database('./sqlite.db')
  const db = drizzle(sqlite, { schema })

  // This will automatically run needed migrations on the database
  Logger.info('Starting database migrations...')
  try {
    await migrate(db, { migrationsFolder: './drizzle' })
    Logger.info('Migrations completed successfully')
  } catch (error) {
    Logger.error('Migration failed', error as Error)
    process.exit(1)
  }
  process.exit(0)
}

main() 