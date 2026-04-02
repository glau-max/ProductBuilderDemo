import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import type { BingoCard } from '../types'
import type { Pack } from '../data/packs'
import { shareResult } from '../utils/shareResult'

type Props = {
  card: BingoCard
  pack: Pack
  onNewGame: () => void
  onDismiss: () => void
}

function countDetected(card: BingoCard) {
  let speech = 0
  let manual = 0
  card.flat().forEach((cell) => {
    if (cell.source === 'speech') speech++
    else if (cell.source === 'manual') manual++
  })
  return { speech, manual }
}

export function WinOverlay({ card, pack, onNewGame, onDismiss }: Props) {
  const [shareLabel, setShareLabel] = useState('Share Result')

  useEffect(() => {
    const end = Date.now() + 2500
    const colors = ['#7c3aed', '#a78bfa', '#fbbf24', '#f9fafb']

    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const { speech, manual } = countDetected(card)

  const handleShare = async () => {
    const result = await shareResult(pack, card)
    if (result === 'copied') {
      setShareLabel('Copied!')
      setTimeout(() => setShareLabel('Share Result'), 2000)
    } else if (result === 'shared') {
      setShareLabel('Shared!')
      setTimeout(() => setShareLabel('Share Result'), 2000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-7xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-yellow-400 mb-2">
          BINGO!
        </div>
        <p className="text-zinc-400 mb-6">You called it!</p>

        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-violet-400">{speech}</div>
            <div className="text-xs text-zinc-500 mt-1">Speech detected</div>
          </div>
          <div className="w-px bg-zinc-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-300">{manual}</div>
            <div className="text-xs text-zinc-500 mt-1">Manually marked</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleShare}
            className="w-full py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-all text-sm"
          >
            {shareLabel}
          </button>
          <div className="flex gap-2">
            <button
              onClick={onDismiss}
              className="flex-1 py-2.5 rounded-xl border border-zinc-600 text-zinc-300 hover:bg-zinc-800 transition-all text-sm"
            >
              Keep playing
            </button>
            <button
              onClick={onNewGame}
              className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all text-sm"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
