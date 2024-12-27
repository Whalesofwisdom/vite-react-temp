import { Link } from 'react-router-dom'
import { UserService } from '../../services/userService'

export function HomePage() {
  const user = UserService.getCurrentUser()

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link 
          to="/new-entry"
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Create New Entry</h2>
          <p className="text-gray-600">Write a new journal entry, message, or wish.</p>
        </Link>

        {/* Add more cards for other features as they're implemented */}
      </div>
    </div>
  )
} 