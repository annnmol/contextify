import { useState } from 'react'
import {
  PanelLeft,
  Plus,
  MessageCircle,
  Globe,
  FileText,
  ArrowLeftRight,
  Star,
  MessageSquare,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Mode, Chat } from '@/types'

interface SidebarProps {
  activeMode: Mode
  onModeChange: (mode: Mode) => void
  chats: Chat[]
  activeChatId: string | null
  onChatSelect: (id: string) => void
  onNewChat: () => void
}

const MODES: { id: Mode; label: string; icon: React.ReactNode }[] = [
  { id: 'chat', label: 'Chat', icon: <MessageCircle size={16} /> },
  { id: 'url', label: 'URL', icon: <Globe size={16} /> },
  { id: 'pdf', label: 'PDF', icon: <FileText size={16} /> },
  { id: 'compare', label: 'Compare', icon: <ArrowLeftRight size={16} /> },
  { id: 'reviews', label: 'Reviews', icon: <Star size={16} /> },
]

export default function Sidebar({
  activeMode,
  onModeChange,
  chats,
  activeChatId,
  onChatSelect,
  onNewChat,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-sidebar border-r border-sidebar-border shrink-0 transition-all duration-200 ease-in-out overflow-hidden',
        collapsed ? 'w-14' : 'w-64',
      )}
    >
      {/* Top bar */}
      <div className="flex items-center h-12 px-3 shrink-0 border-b border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelLeft size={18} />
        </button>
        {!collapsed && (
          <span className="ml-2 font-semibold text-sidebar-foreground text-sm tracking-tight truncate">
            Contextify
          </span>
        )}
      </div>

      {/* New Chat button */}
      <div className="px-2 py-2 shrink-0">
        <button
          onClick={onNewChat}
          className={cn(
            'flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
            collapsed ? 'justify-center' : '',
          )}
          title="New chat"
        >
          <Plus size={16} className="shrink-0" />
          {!collapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Scrollable middle section */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2">
        {/* Modes */}
        <div className="mb-1">
          {!collapsed && (
            <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              Mode
            </p>
          )}
          {collapsed && <div className="h-2" />}
          <nav className="space-y-0.5">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                title={mode.label}
                className={cn(
                  'flex items-center gap-2.5 w-full rounded-md px-2 py-1.5 text-sm transition-colors',
                  collapsed ? 'justify-center' : '',
                  activeMode === mode.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <span className="shrink-0">{mode.icon}</span>
                {!collapsed && <span>{mode.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* History */}
        {!collapsed && (
          <div className="mt-4">
            <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              Recent
            </p>
            <nav className="space-y-0.5">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={cn(
                    'flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm transition-colors group',
                    activeChatId === chat.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}
                >
                  <MessageSquare size={14} className="shrink-0 opacity-60" />
                  <span className="truncate flex-1 text-left">{chat.title}</span>
                  <ChevronRight
                    size={12}
                    className="shrink-0 opacity-0 group-hover:opacity-40 transition-opacity"
                  />
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Collapsed history icons */}
        {collapsed && chats.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {chats.slice(0, 6).map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                title={chat.title}
                className={cn(
                  'flex items-center justify-center w-full rounded-md p-1.5 transition-colors',
                  activeChatId === chat.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <MessageSquare size={14} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Account — pinned to bottom */}
      <div className="shrink-0 border-t border-sidebar-border p-2">
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-md px-2 py-2 hover:bg-sidebar-accent cursor-pointer transition-colors',
            collapsed ? 'justify-center' : '',
          )}
        >
          <div className="w-7 h-7 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-sidebar-foreground truncate leading-tight">
                Anmol Tanwar
              </p>
              <p className="text-[11px] text-sidebar-foreground/50 truncate leading-tight">
                socialyt664@gmail.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
