import { useState, useCallback } from 'react'
import type { Entry } from '../types/Entry'
import { UserService } from '../services/userService'
import { AppError } from '../utils/errors'

interface EntryEditorProps {
  initialEntry?: Partial<Entry>
  onSave: (entry: Partial<Entry>) => Promise<void>
}

export function EntryEditor({ initialEntry, onSave }: EntryEditorProps) {
  const [content, setContent] = useState(initialEntry?.content ?? '')
  const [status] = useState<Entry['status']>(initialEntry?.status ?? 'draft')
  const [releaseType, setReleaseType] = useState<Entry['releaseType']>(initialEntry?.releaseType)
  const [releaseDate, setReleaseDate] = useState<string>('')
  const [releaseContactEmail, setReleaseContactEmail] = useState(initialEntry?.releaseContactEmail ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const user = UserService.getCurrentUser()

  const handleSave = useCallback(async (asDraft: boolean) => {
    if (!user) return

    setIsSaving(true)
    setError('')

    try {
      await onSave({
        content,
        status: asDraft ? 'draft' : 'private',
        type: initialEntry?.type ?? 'journal',
        userId: user.id,
        releaseType,
        releaseDate: releaseDate ? new Date(releaseDate) : undefined,
        releaseContactEmail: releaseContactEmail || undefined,
        updatedAt: new Date()
      })
    } catch (err) {
      if (err instanceof AppError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
        console.error(err)
      }
    } finally {
      setIsSaving(false)
    }
  }, [content, initialEntry?.type, onSave, user, releaseType, releaseDate, releaseContactEmail])

  return (
    <div className="max-w-2xl mx-auto p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <textarea
        className="w-full h-64 p-4 mb-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
        disabled={isSaving}
      />
      
      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          onClick={() => handleSave(true)}
          disabled={isSaving || !content.trim()}
        >
          Save as Draft
        </button>
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={() => handleSave(false)}
          disabled={isSaving || !content.trim()}
        >
          Save Private Entry
        </button>
      </div>

      {status === 'draft' && (
        <p className="mt-2 text-sm text-gray-500">
          This entry is saved as a draft and is only visible to you.
        </p>
      )}
    </div>
  )
} 