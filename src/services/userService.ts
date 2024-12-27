import { db } from '../db'
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

      const user = await db.query('register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      return user
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Registration error:', error)
      throw new AppError('Failed to register user', 'API_ERROR', 500)
    }
  }

  static async login(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new ValidationError('Email and password are required')
    }

    try {
      const user = await db.login(email, password)
      this.currentUser = user
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

      const user = await db.query(`users/${userId}/profile`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      this.currentUser = user
      return user
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Profile update error:', error)
      throw new AppError('Failed to update profile', 'API_ERROR', 500)
    }
  }

  static async updateUserStatus(userId: string, status: User['status']): Promise<void> {
    try {
      if (!this.currentUser || this.currentUser.role !== 'admin') {
        throw new AuthorizationError('Only admins can update user status')
      }

      await db.query(`users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Status update error:', error)
      throw new AppError('Failed to update user status', 'API_ERROR', 500)
    }
  }

  static async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    try {
      this.validatePassword(newPassword)

      if (!this.currentUser || (this.currentUser.id !== userId && this.currentUser.role !== 'admin')) {
        throw new AuthorizationError('Not authorized to reset this password')
      }

      await db.query(`users/${userId}/password`, {
        method: 'PUT',
        body: JSON.stringify({ password: newPassword })
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Password reset error:', error)
      throw new AppError('Failed to reset password', 'API_ERROR', 500)
    }
  }

  static logout(): void {
    this.currentUser = null
  }

  static getCurrentUser(): User | null {
    return this.currentUser
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const users = await db.query('users')
      return users
    } catch (error) {
      console.error('Failed to get users:', error)
      throw new AppError('Failed to get users', 'API_ERROR', 500)
    }
  }

  static async getPendingUsers(): Promise<User[]> {
    try {
      const users = await db.query('users/pending')
      return users
    } catch (error) {
      console.error('Failed to get pending users:', error)
      throw new AppError('Failed to get pending users', 'API_ERROR', 500)
    }
  }
} 