import { db } from '../db'
import { entries } from '../db/schema'
import { eq, and } from 'drizzle-orm'
import type { Entry } from '../types/Entry'
import { v4 as uuid } from 'uuid'
import { ValidationError, NotFoundError, AuthorizationError, AppError } from '../utils/errors'

export class EntryService {
  private static validateEntry(entry: Partial<Entry>) {
    if (entry.content && entry.content.length > 10000) {
      throw new ValidationError('Content cannot exceed 10000 characters')
    }

    if (entry.releaseType === 'date' && !entry.releaseDate) {
      throw new ValidationError('Release date is required when release type is "date"')
    }

    if (entry.releaseType && !['date', 'death'].includes(entry.releaseType)) {
      throw new ValidationError('Invalid release type')
    }

    if (entry.type && !['journal', 'message', 'wishes'].includes(entry.type)) {
      throw new ValidationError('Invalid entry type')
    }

    if (entry.status && !['draft', 'private', 'scheduled'].includes(entry.status)) {
      throw new ValidationError('Invalid status')
    }
  }

  static async saveEntry(entry: Partial<Entry>): Promise<Entry> {
    if (!entry.userId) {
      throw new AuthorizationError('User ID is required')
    }

    this.validateEntry(entry)
    const now = new Date()

    try {
      if (!entry.id) {
        // Create new entry
        const newEntry = await db.insert(entries).values({
          id: uuid(),
          content: entry.content ?? '',
          type: entry.type ?? 'journal',
          status: entry.status ?? 'draft',
          userId: entry.userId,
          createdAt: now,
          updatedAt: now,
          releaseType: entry.releaseType || null,
          releaseDate: entry.releaseDate || null,
          releaseContactEmail: entry.releaseContactEmail || null
        }).returning().get()

        return {
          ...newEntry,
          releaseType: newEntry.releaseType || undefined,
          releaseDate: newEntry.releaseDate || undefined,
          releaseContactEmail: newEntry.releaseContactEmail || undefined
        }
      } else {
        // Verify entry exists and belongs to user
        const existing = await this.getEntryById(entry.id, entry.userId)
        if (!existing) {
          throw new NotFoundError('Entry not found')
        }

        const updatedEntry = await db.update(entries)
          .set({
            content: entry.content,
            type: entry.type,
            status: entry.status,
            updatedAt: now,
            releaseType: entry.releaseType || null,
            releaseDate: entry.releaseDate || null,
            releaseContactEmail: entry.releaseContactEmail || null
          })
          .where(eq(entries.id, entry.id))
          .returning()
          .get()

        return {
          ...updatedEntry,
          releaseType: updatedEntry.releaseType || undefined,
          releaseDate: updatedEntry.releaseDate || undefined,
          releaseContactEmail: updatedEntry.releaseContactEmail || undefined
        }
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Database error:', error)
      throw new AppError('Failed to save entry', 'DB_ERROR', 500)
    }
  }

  static async getEntries(userId: string): Promise<Entry[]> {
    const dbEntries = await db.select()
      .from(entries)
      .where(eq(entries.userId, userId))
      .all()

    // Convert nulls to undefined for the interface
    return dbEntries.map(entry => ({
      ...entry,
      releaseType: entry.releaseType || undefined,
      releaseDate: entry.releaseDate || undefined,
      releaseContactEmail: entry.releaseContactEmail || undefined
    }))
  }

  static async getEntryById(id: string, userId: string): Promise<Entry | undefined> {
    const entry = await db.select()
      .from(entries)
      .where(and(
        eq(entries.id, id),
        eq(entries.userId, userId)
      ))
      .get()

    if (!entry) return undefined

    // Convert nulls to undefined for the interface
    return {
      ...entry,
      releaseType: entry.releaseType || undefined,
      releaseDate: entry.releaseDate || undefined,
      releaseContactEmail: entry.releaseContactEmail || undefined
    }
  }

  static async deleteEntry(id: string, userId: string): Promise<void> {
    await db.delete(entries)
      .where(and(
        eq(entries.id, id),
        eq(entries.userId, userId)
      ))
      .run()
  }

  static async getDraftEntries(userId: string): Promise<Entry[]> {
    const dbEntries = await db.select()
      .from(entries)
      .where(and(
        eq(entries.userId, userId),
        eq(entries.status, 'draft')
      ))
      .all()

    // Convert nulls to undefined for the interface
    return dbEntries.map(entry => ({
      ...entry,
      releaseType: entry.releaseType || undefined,
      releaseDate: entry.releaseDate || undefined,
      releaseContactEmail: entry.releaseContactEmail || undefined
    }))
  }

  static async getScheduledEntries(userId: string): Promise<Entry[]> {
    const dbEntries = await db.select()
      .from(entries)
      .where(and(
        eq(entries.userId, userId),
        eq(entries.status, 'scheduled')
      ))
      .all()

    // Convert nulls to undefined for the interface
    return dbEntries.map(entry => ({
      ...entry,
      releaseType: entry.releaseType || undefined,
      releaseDate: entry.releaseDate || undefined,
      releaseContactEmail: entry.releaseContactEmail || undefined
    }))
  }
} 