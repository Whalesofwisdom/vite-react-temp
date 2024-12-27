import { db } from '../db'
import { users, entries } from '../db/schema'

export async function clearDatabase() {
  await db.delete(entries).run()
  await db.delete(users).run()
}

export async function setupTestDatabase() {
  await clearDatabase()
} 