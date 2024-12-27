import { describe, it, expect, beforeEach } from 'vitest'
import { UserService } from '../../services/userService'
import { setupTestDatabase } from '../setup'
import { ValidationError, AuthorizationError } from '../../utils/errors'
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'

describe('UserService', () => {
  beforeEach(async () => {
    await setupTestDatabase()
    // Create and login as admin first
    const admin = await UserService.register('admin@example.com', 'adminpass')
    await db.update(users)
      .set({ role: 'admin', status: 'approved' })
      .where(eq(users.id, admin.id))
      .run()
    await UserService.login('admin@example.com', 'adminpass')
  })

  describe('registration', () => {
    it('should register a new user', async () => {
      const user = await UserService.register('test@example.com', 'password123')
      expect(user.email).toBe('test@example.com')
      expect(user.status).toBe('pending')
      expect(user.role).toBe('user')
    })

    it('should not allow duplicate emails', async () => {
      await UserService.register('test@example.com', 'password123')
      await expect(
        UserService.register('test@example.com', 'password456')
      ).rejects.toThrow(ValidationError)
    })

    it('should validate email format', async () => {
      await expect(
        UserService.register('invalid-email', 'password123')
      ).rejects.toThrow(ValidationError)
    })

    it('should validate password length', async () => {
      await expect(
        UserService.register('test@example.com', '123')
      ).rejects.toThrow(ValidationError)
    })
  })

  describe('login', () => {
    beforeEach(async () => {
      await UserService.register('test@example.com', 'password123')
    })

    it('should not allow login for pending users', async () => {
      await expect(
        UserService.login('test@example.com', 'password123')
      ).rejects.toThrow(AuthorizationError)
    })

    it('should not allow login with incorrect password', async () => {
      await expect(
        UserService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow(AuthorizationError)
    })

    it('should allow login for approved users', async () => {
      const user = await UserService.register('approved@example.com', 'password123')
      await UserService.updateUserStatus(user.id, 'approved')
      
      const loggedInUser = await UserService.login('approved@example.com', 'password123')
      expect(loggedInUser.email).toBe('approved@example.com')
      expect(loggedInUser.status).toBe('approved')
    })
  })

  describe('profile management', () => {
    let userId: string

    beforeEach(async () => {
      const user = await UserService.register('test@example.com', 'password123')
      userId = user.id
      await UserService.updateUserStatus(userId, 'approved')
      await UserService.login('test@example.com', 'password123')
    })

    it('should update user profile', async () => {
      const updatedUser = await UserService.updateProfile(userId, {
        name: 'Test User',
        preferences: {
          theme: 'dark',
          emailNotifications: true
        }
      })

      expect(updatedUser.profileName).toBe('Test User')
      expect(updatedUser.themePreference).toBe('dark')
      expect(updatedUser.emailNotifications).toBe(true)
    })

    it('should not allow profile updates for other users', async () => {
      const otherUser = await UserService.register('other@example.com', 'password123')
      
      await expect(
        UserService.updateProfile(otherUser.id, {
          name: 'Hacker',
          preferences: {}
        })
      ).rejects.toThrow(AuthorizationError)
    })
  })
}) 