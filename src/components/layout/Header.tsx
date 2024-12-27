import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserService } from '../../services/userService'

export function Header() {
  const user = UserService.getCurrentUser()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    UserService.logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/home" className="text-xl font-bold text-gray-900">
            Digital Legacy
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <span>{user.email}</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {isMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50"
                onBlur={() => setIsMenuOpen(false)}
              >
                <Link
                  to="/home"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/new-entry"
                  className="block px-4 py-2 text-blue-600 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create New Entry
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleLogout()
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 