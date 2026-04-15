import { useEffect, useRef, useState } from 'react'
import { Send, Globe, FileText, ArrowLeftRight, Star, MessageCircle } from 'lucide-react'
import MessageBubble from '@/components/MessageBubble'
import type { Message, Mode } from '@/types'

interface ChatAreaProps {
  messages: Message[]
  activeMode: Mode
  onSend: (content: string) => void
}

const MODE_META: Record<Mode, { label: string; icon: React.ReactNode; placeholder: string }> = {
  chat: {
    label: 'Chat',
    icon: <MessageCircle size={14} />,
    placeholder: 'Ask anything…',
  },
  url: {
    label: 'URL',
    icon: <Globe size={14} />,
    placeholder: 'Paste a URL to analyse…',
  },
  pdf: {
    label: 'PDF',
    icon: <FileText size={14} />,
    placeholder: 'Ask about your PDF…',
  },
  compare: {
    label: 'Compare',
    icon: <ArrowLeftRight size={14} />,
    placeholder: 'Enter two items to compare…',
  },
  reviews: {
    label: 'Reviews',
    icon: <Star size={14} />,
    placeholder: 'Paste a product URL or reviews…',
  },
}

export default function ChatArea({ messages, activeMode, onSend }: ChatAreaProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const meta = MODE_META[activeMode]

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [input])

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed) return
    onSend(trimmed)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col flex-1 h-screen min-w-0 bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 h-12 px-4 shrink-0 border-b border-border">
        <span className="text-muted-foreground">{meta.icon}</span>
        <span className="text-sm font-semibold text-foreground">{meta.label}</span>
        <span className="ml-auto text-xs text-muted-foreground">{messages.length} messages</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
              {meta.icon}
            </div>
            <div>
              <p className="font-medium text-foreground">{meta.label} mode</p>
              <p className="text-sm text-muted-foreground mt-0.5">{meta.placeholder}</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 py-3 border-t border-border bg-background">
        <div className="flex items-end gap-2 rounded-xl border border-input bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-ring transition-shadow">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={meta.placeholder}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none leading-relaxed max-h-40 py-0.5"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground/50 mt-1.5 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
