import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-semibold shrink-0 mr-2 mt-0.5">
          AI
        </div>
      )}
      <div className={`max-w-[72%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted text-foreground rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>
        <span className="text-[11px] text-muted-foreground px-1">{time}</span>
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-semibold shrink-0 ml-2 mt-0.5">
          U
        </div>
      )}
    </div>
  )
}
