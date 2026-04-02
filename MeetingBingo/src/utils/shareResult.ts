import type { BingoCard } from '../types'
import type { Pack } from '../data/packs'

const MARKED = '🟪'
const FREE   = '⭐'
const EMPTY  = '⬜'

export function buildShareText(pack: Pack, card: BingoCard): string {
  const grid = card
    .map((row) =>
      row.map((cell) => (cell.isFree ? FREE : cell.marked ? MARKED : EMPTY)).join('')
    )
    .join('\n')

  const speechCount = card.flat().filter((c) => c.source === 'speech').length
  const detectedWords = card
    .flat()
    .filter((c) => c.source === 'speech')
    .map((c) => c.word)
    .join(', ')

  const lines = [
    `🎉 BINGO! — ${pack.name}`,
    '',
    grid,
    '',
    speechCount > 0
      ? `🎙 Auto-detected: ${detectedWords}`
      : '✋ All cells marked manually',
    '',
    'Play at meetingbingo.vercel.app',
  ]

  return lines.join('\n')
}

export async function shareResult(pack: Pack, card: BingoCard): Promise<'shared' | 'copied' | 'error'> {
  const text = buildShareText(pack, card)

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: 'Meeting Bingo 🎉', text })
      return 'shared'
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'error'
  }
}
