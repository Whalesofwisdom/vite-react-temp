import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-red-500">
      <h1 className="text-4xl font-bold mb-6">Digital Legacy Platform</h1>
      <p className="text-xl mb-8 text-gray-600">
        A secure platform for storing your thoughts, memories, and messages for the future.
      </p>
      
      <div className="space-x-4">
        <Link 
          to="/register"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Get Started
        </Link>
        <Link 
          to="/login"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
} 