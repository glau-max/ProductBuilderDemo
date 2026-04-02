import type { BingoCard as BingoCardType, WinResult } from '../types'
import { isWinningCell } from '../utils/bingoDetector'

type Props = {
  card: BingoCardType
  winResult: WinResult | null
  onCellClick: (row: number, col: number) => void
  recentlyDetected: string[]
}

export function BingoCard({ card, winResult, onCellClick, recentlyDetected }: Props) {
  return (
    <div className="w-full max-w-lg mx-auto px-1 sm:px-2">
      {/* Column headers */}
      <div className="grid grid-cols-5 mb-1">
        {['B', 'I', 'N', 'G', 'O'].map((letter) => (
          <div
            key={letter}
            className="flex items-center justify-center text-xl font-black text-violet-400 h-10"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-0.5 sm:gap-1">
        {card.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const winning = winResult ? isWinningCell(rowIdx, colIdx, winResult) : false
            const justDetected = recentlyDetected.includes(cell.word.toLowerCase())

            return (
              <button
                key={`${rowIdx}-${colIdx}`}
                onClick={() => !cell.isFree && onCellClick(rowIdx, colIdx)}
                disabled={cell.isFree}
                className={[
                  'aspect-square flex items-center justify-center rounded-lg text-center',
                  'text-xs sm:text-sm font-medium leading-tight p-1 transition-all duration-200',
                  'border select-none cursor-pointer',
                  cell.isFree
                    ? 'bg-violet-600 border-violet-500 text-white cursor-default font-bold text-base'
                    : winning
                      ? 'bg-yellow-400 border-yellow-300 text-zinc-900 font-bold scale-105 shadow-lg shadow-yellow-400/30'
                      : cell.marked && cell.source === 'speech'
                        ? 'bg-violet-500 border-violet-400 text-white'
                        : cell.marked && cell.source === 'manual'
                          ? 'bg-zinc-600 border-zinc-500 text-white'
                          : justDetected
                            ? 'bg-violet-900/60 border-violet-500 text-violet-200 animate-pulse'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:border-zinc-600 active:scale-95',
                ].join(' ')}
              >
                <span className="line-clamp-3">{cell.word}</span>
              </button>
            )
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 justify-center text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-violet-500 inline-block" /> Speech
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-zinc-600 inline-block" /> Manual
        </span>
        {winResult && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-yellow-400 inline-block" /> Bingo!
          </span>
        )}
      </div>
    </div>
  )
}
