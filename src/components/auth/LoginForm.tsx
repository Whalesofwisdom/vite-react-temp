import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { UserService } from '../../services/userService'

interface LocationState {
  registrationSuccess?: boolean
  message?: string
}

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { registrationSuccess, message } = (location.state as LocationState) || {}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = await UserService.login(email, password)
      navigate(user.role === 'admin' ? '/admin' : '/home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {registrationSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          {message || 'Registration successful! Please wait for admin approval.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link 
          to="/reset-password"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  )
} 