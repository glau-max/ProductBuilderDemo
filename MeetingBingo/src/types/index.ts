export type CellSource = 'speech' | 'manual' | null

export type BingoCell = {
  word: string
  isFree: boolean
  marked: boolean
  source: CellSource
}

export type BingoCard = BingoCell[][]

// [row, col] coordinates of a winning line
export type WinLine = [number, number][]

export type WinResult = {
  lines: WinLine[]
}
