import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from '../src/db/schema'

// Create SQLite database connection
const sqlite = new Database('sqlite.db')
export const db = drizzle(sqlite, { schema }) 