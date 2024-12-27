export interface Entry {
  id: string
  content: string
  type: 'journal' | 'message' | 'wishes'
  status: 'draft' | 'private' | 'scheduled'
  userId: string
  createdAt: Date
  updatedAt: Date
  releaseType?: 'date' | 'death'
  releaseDate?: Date
  releaseContactEmail?: string
} 