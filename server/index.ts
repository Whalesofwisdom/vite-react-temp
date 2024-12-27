import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './db'
import { users } from '../src/db/schema'
import { eq } from 'drizzle-orm'
import { v4 as uuid } from 'uuid'

const app = express()
const router = express.Router()
app.use(cors())
app.use(express.json())

// Get all users
const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const allUsers = await db.select().from(users).all()
    const usersWithoutPasswords = allUsers.map(({ password: _, ...user }) => user)
    res.json(usersWithoutPasswords)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database error' })
  }
}

// Get pending users
const getPendingUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pendingUsers = await db.select()
      .from(users)
      .where(eq(users.status, 'pending'))
      .all()
    const usersWithoutPasswords = pendingUsers.map(({ password: _, ...user }) => user)
    res.json(usersWithoutPasswords)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database error' })
  }
}

// Register new user
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email)).get()
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' })
      return
    }

    const newUser = await db.insert(users).values({
      id: uuid(),
      email,
      password, // TODO: Add password hashing
      createdAt: new Date(),
      lastLogin: new Date(),
      status: 'pending',
      role: 'user',
      profileName: null,
      themePreference: 'light',
      emailNotifications: false
    }).returning().get()

    const { password: _, ...userWithoutPassword } = newUser
    res.status(201).json(userWithoutPassword)
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Login
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    const user = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .get()

    if (!user || user.password !== password) { // TODO: Use proper password hashing
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    if (user.status !== 'approved') {
      res.status(401).json({ error: 'Account not approved' })
      return
    }

    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id))
      .run()

    const { password: _, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update user status
const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const { status } = req.body

    const result = await db.update(users)
      .set({ status })
      .where(eq(users.id, userId))
      .run()

    if (!result) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ message: 'Status updated successfully' })
  } catch (error) {
    console.error('Status update error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update user profile
const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const { name, preferences } = req.body

    const updatedUser = await db.update(users)
      .set({
        profileName: name ?? null,
        themePreference: preferences.theme ?? 'light',
        emailNotifications: preferences.emailNotifications ?? false
      })
      .where(eq(users.id, userId))
      .returning()
      .get()

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const { password: _, ...userWithoutPassword } = updatedUser
    res.json(userWithoutPassword)
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Reset user password
const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const { password } = req.body

    const result = await db.update(users)
      .set({ password }) // TODO: Add password hashing
      .where(eq(users.id, userId))
      .run()

    if (!result) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Password reset error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Register routes
router.get('/users', getAllUsers)
router.get('/users/pending', getPendingUsers)
router.post('/register', register)
router.post('/login', login)
router.put('/users/:userId/status', updateUserStatus)
router.put('/users/:userId/profile', updateUserProfile)
router.put('/users/:userId/password', resetUserPassword)

// Mount the router with the /api prefix
app.use('/api', router)

app.listen(3000, () => {
  console.log('Server running on port 3000')
}) 