import { AppError } from '../utils/errors'

const API_URL = 'http://localhost:3000/api'

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

export const db = {
  async query(endpoint: string, options: RequestOptions = {}) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new AppError(error.error || 'API request failed', 'API_ERROR', response.status)
      }

      return response.json()
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError('API request failed', 'API_ERROR', 500)
    }
  },

  async login(email: string, password: string) {
    return this.query('login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }
} 