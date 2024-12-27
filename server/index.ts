import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './db'
import { users } from '../src/db/schema'
import { eq } from 'drizzle-orm'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/users', async (_req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users).all()
    res.json(allUsers)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .get()

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (user.password !== password) { // TODO: Use proper password hashing
      return res.status(401).json({ error: 'Invalid credentials' })
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
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
}) 