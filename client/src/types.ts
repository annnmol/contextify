export type Mode = 'chat' | 'url' | 'pdf' | 'compare' | 'reviews'

export interface Message {
  id: string
  role: 'user' | 'system'
  content: string
  timestamp: Date
}

export interface Chat {
  id: string
  title: string
  updatedAt: Date
}
