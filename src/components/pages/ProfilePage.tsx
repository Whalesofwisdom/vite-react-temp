import { useState } from 'react'
import { UserService } from '../../services/userService'
import type { UserPreferences } from '../../types/User'

export function ProfilePage() {
  const user = UserService.getCurrentUser()
  const [name, setName] = useState(user?.profile.name ?? '')
  const [preferences, setPreferences] = useState<UserPreferences>(
    user?.profile.preferences ?? {}
  )
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await UserService.updateProfile({
        name,
        preferences
      })
      setSuccess('Profile updated successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await UserService.resetPassword(user!.email, currentPassword, newPassword)
      setSuccess('Password updated successfully')
      // Clear password fields
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Account Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Account Details</h2>
          <div className="text-gray-600">
            <p>Email: {user.email}</p>
            <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
            <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Profile Settings Section */}
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={preferences.theme ?? 'light'}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  theme: e.target.value as 'light' | 'dark'
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={preferences.emailNotifications ?? false}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  emailNotifications: e.target.checked
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Enable email notifications
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Password Change Section */}
        <form onSubmit={handlePasswordSubmit} className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Updating Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 