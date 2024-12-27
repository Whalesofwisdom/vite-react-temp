export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  status: 'pending' | 'approved' | 'rejected'
  profileName: string | null
  themePreference: 'light' | 'dark' | null
  emailNotifications: boolean | null
  createdAt: Date
  lastLogin: Date
}

export interface UserPreferences {
  theme?: 'light' | 'dark'
  emailNotifications?: boolean
} 