import { useState, useEffect } from 'react'
import { UserService } from '../../services/userService'
import type { User } from '../../types/User'

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadUsers = async () => {
    try {
      console.log('Loading users...')
      const [allUsers, pending] = await Promise.all([
        UserService.getAllUsers(),
        UserService.getPendingUsers()
      ])
      console.log('Loaded users:', allUsers)
      console.log('Pending users:', pending)
      setUsers(allUsers)
      setPendingUsers(pending)
      setError('')
    } catch (err) {
      console.error('Failed to load users:', err)
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleStatusUpdate = async (userId: string, status: User['status']) => {
    try {
      await UserService.updateUserStatus(userId, status)
      setSuccess(`User status updated to ${status}`)
      await loadUsers() // Refresh the lists
    } catch (err) {
      console.error('Failed to update status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      await UserService.deleteUser(userId)
      setSuccess('User deleted successfully')
      await loadUsers() // Refresh the lists
    } catch (err) {
      console.error('Failed to delete user:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  const handlePasswordReset = async (userId: string) => {
    const newPassword = window.prompt('Enter new password for user:')
    if (!newPassword) return // User cancelled

    try {
      await UserService.resetUserPassword(userId, newPassword)
      setSuccess('Password updated successfully')
      setError('') // Clear any existing errors
    } catch (err) {
      console.error('Failed to reset password:', err)
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    }
  }

  if (isLoading) return (
    <div className="p-8 text-center">
      <div className="text-xl">Loading users...</div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={loadUsers}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Refresh Users
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Pending Approvals ({pendingUsers.length})
        </h2>
        {pendingUsers.length === 0 ? (
          <p className="text-gray-500">No pending approvals</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map(user => (
              <div key={user.id} className="p-4 bg-white rounded-lg shadow flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Registered: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleStatusUpdate(user.id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(user.id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          All Users ({users.length})
        </h2>
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="p-4 bg-white rounded-lg shadow flex items-center justify-between">
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Status: {user.status} | Role: {user.role}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handlePasswordReset(user.id)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="px-4 py-2 text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 