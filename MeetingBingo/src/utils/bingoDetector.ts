import type { BingoCard, WinLine, WinResult } from '../types'

const SIZE = 5

function buildWinPatterns(): WinLine[] {
  const patterns: WinLine[] = []

  // 5 rows
  for (let r = 0; r < SIZE; r++) {
    patterns.push(Array.from({ length: SIZE }, (_, c) => [r, c] as [number, number]))
  }

  // 5 columns
  for (let c = 0; c < SIZE; c++) {
    patterns.push(Array.from({ length: SIZE }, (_, r) => [r, c] as [number, number]))
  }

  // top-left → bottom-right diagonal
  patterns.push(Array.from({ length: SIZE }, (_, i) => [i, i] as [number, number]))

  // top-right → bottom-left diagonal
  patterns.push(Array.from({ length: SIZE }, (_, i) => [i, SIZE - 1 - i] as [number, number]))

  return patterns
}

const WIN_PATTERNS = buildWinPatterns() // 12 patterns total

export function detectBingo(card: BingoCard): WinResult | null {
  const winningLines: WinLine[] = []

  for (const pattern of WIN_PATTERNS) {
    const isWin = pattern.every(([r, c]) => card[r][c].marked)
    if (isWin) {
      winningLines.push(pattern)
    }
  }

  return winningLines.length > 0 ? { lines: winningLines } : null
}

export function isWinningCell(row: number, col: number, result: WinResult): boolean {
  return result.lines.some((line) => line.some(([r, c]) => r === row && c === col))
}
