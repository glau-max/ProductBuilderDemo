import type { Pack } from '../data/packs'
import type { Theme } from '../hooks/useTheme'

type ListeningStatus = 'idle' | 'listening' | 'error' | 'unsupported'

type Props = {
  pack: Pack
  listeningStatus: ListeningStatus
  theme: Theme
  onNewCard: () => void
  onReset: () => void
  onToggleListening: () => void
  onToggleTheme: () => void
}

const STATUS_CONFIG: Record<ListeningStatus, { label: string; dot: string; text: string }> = {
  idle: { label: 'Start listening', dot: 'bg-zinc-500', text: 'text-zinc-400' },
  listening: { label: 'Listening…', dot: 'bg-green-400 animate-pulse', text: 'text-green-400' },
  error: { label: 'Mic error', dot: 'bg-red-400', text: 'text-red-400' },
  unsupported: { label: 'Manual only', dot: 'bg-yellow-500', text: 'text-yellow-400' },
}

export function GameHeader({ pack, listeningStatus, theme, onNewCard, onReset, onToggleListening, onToggleTheme }: Props) {
  const status = STATUS_CONFIG[listeningStatus]
  const canToggle = listeningStatus !== 'unsupported'

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950 min-h-[56px]">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-black text-white tracking-tight">Meeting Bingo</h1>
        <span className="hidden sm:inline-block text-xs bg-violet-600/20 border border-violet-500/40 text-violet-300 rounded-full px-2.5 py-0.5">
          {pack.name}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Listening toggle */}
        <button
          onClick={canToggle ? onToggleListening : undefined}
          disabled={!canToggle}
          className={[
            'flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 border transition-all',
            canToggle
              ? 'cursor-pointer hover:bg-zinc-800 border-zinc-700'
              : 'cursor-default border-zinc-800',
            status.text,
          ].join(' ')}
          title={canToggle ? 'Toggle microphone' : 'Web Speech API not supported in this browser'}
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${status.dot}`} />
          <span className="hidden sm:inline">{status.label}</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg px-3 py-2.5 min-h-[44px] transition-all"
          title="Clear marks, keep same card"
        >
          Reset
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="text-lg min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-all"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* New Card */}
        <button
          onClick={onNewCard}
          className="text-xs text-white bg-violet-600 hover:bg-violet-500 rounded-lg px-3 py-2.5 min-h-[44px] font-semibold transition-all"
        >
          New Card
        </button>
      </div>
    </header>
  )
}
