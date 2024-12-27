import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import type { User, UserPreferences } from '../types/User'
import { v4 as uuid } from 'uuid'
import { ValidationError, AuthorizationError, NotFoundError, AppError } from '../utils/errors'

interface StoredUser extends User {
  password: string
}

interface ProfileUpdateData {
  name?: string
  preferences: UserPreferences
}

export class UserService {
  private static currentUser: User | null = null

  private static validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format')
    }
  }

  private static validatePassword(password: string) {
    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long')
    }
  }

  static async register(email: string, password: string): Promise<User> {
    try {
      this.validateEmail(email)
      this.validatePassword(password)

      const existingUser = await db.select().from(users).where(eq(users.email, email)).get()
      if (existingUser) {
        throw new ValidationError('Email already registered')
      }

      const newUser = await db.insert(users).values({
        id: uuid(),
        email,
        password, // TODO: Add password hashing in Phase 2B
        createdAt: new Date(),
        lastLogin: new Date(),
        status: 'pending',
        role: 'user',
        profileName: null,
        themePreference: 'light',
        emailNotifications: false
      }).returning().get()

      const { password: _, ...userWithoutPassword } = newUser
      return userWithoutPassword
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Registration error:', error)
      throw new AppError('Failed to register user', 'DB_ERROR', 500)
    }
  }

  static async login(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new ValidationError('Email and password are required')
    }

    try {
      const user = await db.login(email, password)
      return user
    } catch (error) {
      throw new AuthorizationError('Invalid credentials')
    }
  }

  static async updateProfile(userId: string, data: ProfileUpdateData): Promise<User> {
    try {
      if (!this.currentUser || this.currentUser.id !== userId) {
        throw new AuthorizationError('Not authorized to update this profile')
      }

      const updatedUser = await db.update(users)
        .set({
          profileName: data.name ?? null,
          themePreference: data.preferences.theme ?? 'light',
          emailNotifications: data.preferences.emailNotifications ?? false
        })
        .where(eq(users.id, userId))
        .returning()
        .get()

      if (!updatedUser) {
        throw new NotFoundError('User not found')
      }

      const { password: _, ...userWithoutPassword } = updatedUser
      this.currentUser = userWithoutPassword
      return userWithoutPassword
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Profile update error:', error)
      throw new AppError('Failed to update profile', 'DB_ERROR', 500)
    }
  }

  static async updateUserStatus(userId: string, status: User['status']): Promise<void> {
    try {
      if (!this.currentUser || this.currentUser.role !== 'admin') {
        throw new AuthorizationError('Only admins can update user status')
      }

      const result = await db.update(users)
        .set({ status })
        .where(eq(users.id, userId))
        .run()

      if (!result) {
        throw new NotFoundError('User not found')
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Status update error:', error)
      throw new AppError('Failed to update user status', 'DB_ERROR', 500)
    }
  }

  static async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    try {
      this.validatePassword(newPassword)

      if (!this.currentUser || (this.currentUser.id !== userId && this.currentUser.role !== 'admin')) {
        throw new AuthorizationError('Not authorized to reset this password')
      }

      const result = await db.update(users)
        .set({ password: newPassword }) // TODO: Add password hashing in Phase 2B
        .where(eq(users.id, userId))
        .run()

      if (!result) {
        throw new NotFoundError('User not found')
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Password reset error:', error)
      throw new AppError('Failed to reset password', 'DB_ERROR', 500)
    }
  }

  static logout(): void {
    this.currentUser = null
  }

  static getCurrentUser(): User | null {
    return this.currentUser
  }

  static async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users).all()
    return allUsers.map(({ password: _, ...user }) => user)
  }

  static async getPendingUsers(): Promise<User[]> {
    const pendingUsers = await db.select()
      .from(users)
      .where(eq(users.status, 'pending'))
      .all()
    return pendingUsers.map(({ password: _, ...user }) => user)
  }
} 