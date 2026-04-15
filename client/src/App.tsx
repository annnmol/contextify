import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatArea from '@/components/ChatArea'
import type { Chat, Message, Mode } from '@/types'

const INITIAL_CHATS: Chat[] = [
  { id: '1', title: 'How does React work?', updatedAt: new Date() },
  { id: '2', title: 'Analyse this URL for me', updatedAt: new Date() },
  { id: '3', title: 'Compare GPT-4 vs Claude', updatedAt: new Date() },
  { id: '4', title: 'Summarise this PDF', updatedAt: new Date() },
]

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'system',
    content: 'Hi! I\'m Contextify. How can I help you today? Try switching modes in the sidebar.',
    timestamp: new Date(Date.now() - 60_000 * 5),
  },
  {
    id: '2',
    role: 'user',
    content: 'Can you summarise this article for me?',
    timestamp: new Date(Date.now() - 60_000 * 4),
  },
  {
    id: '3',
    role: 'system',
    content:
      'Sure! Paste the article text or drop in a URL and I\'ll give you a clear, concise summary with the key points highlighted.',
    timestamp: new Date(Date.now() - 60_000 * 3),
  },
  {
    id: '4',
    role: 'user',
    content: 'Great, here it is: https://example.com/article',
    timestamp: new Date(Date.now() - 60_000 * 2),
  },
  {
    id: '5',
    role: 'system',
    content:
      'Got it! Here\'s a summary:\n\n• The article covers the fundamentals of machine learning and its applications.\n• Key takeaway: neural networks have dramatically improved image recognition accuracy.\n• The author recommends starting with supervised learning before exploring unsupervised methods.',
    timestamp: new Date(Date.now() - 60_000),
  },
]

let nextId = 100

export default function App() {
  const [activeMode, setActiveMode] = useState<Mode>('chat')
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS)
  const [activeChatId, setActiveChatId] = useState<string | null>('1')
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)

  function handleSend(content: string) {
    const userMsg: Message = {
      id: String(nextId++),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    const systemMsg: Message = {
      id: String(nextId++),
      role: 'system',
      content: `You said: "${content}"\n\nThis is a demo response. Connect your backend to get real answers!`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg, systemMsg])
  }

  function handleNewChat() {
    const id = String(nextId++)
    const newChat: Chat = {
      id,
      title: 'New conversation',
      updatedAt: new Date(),
    }
    setChats((prev) => [newChat, ...prev])
    setActiveChatId(id)
    setMessages([])
  }

  function handleChatSelect(id: string) {
    setActiveChatId(id)
    // In a real app you'd load messages for this chat
    setMessages(id === '1' ? INITIAL_MESSAGES : [])
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activeMode={activeMode}
        onModeChange={setActiveMode}
        chats={chats}
        activeChatId={activeChatId}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
      />
      <ChatArea messages={messages} activeMode={activeMode} onSend={handleSend} />
    </div>
  )
}
