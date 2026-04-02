import type { BingoCard, BingoCell } from '../types'
import type { Pack } from '../data/packs'

const FREE_SPACE = 'FREE SPACE'
const GRID_SIZE = 5
const FREE_ROW = 2
const FREE_COL = 2

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function generateCard(pack: Pack): BingoCard {
  const totalCells = GRID_SIZE * GRID_SIZE // 25
  const wordsNeeded = totalCells - 1 // 24 (exclude FREE SPACE)

  if (pack.words.length < wordsNeeded) {
    throw new Error(
      `Pack "${pack.name}" needs at least ${wordsNeeded} words, has ${pack.words.length}`
    )
  }

  const shuffled = shuffle(pack.words).slice(0, wordsNeeded)

  const card: BingoCard = []
  let wordIndex = 0

  for (let row = 0; row < GRID_SIZE; row++) {
    const rowCells: BingoCell[] = []
    for (let col = 0; col < GRID_SIZE; col++) {
      if (row === FREE_ROW && col === FREE_COL) {
        rowCells.push({ word: FREE_SPACE, isFree: true, marked: true, source: null })
      } else {
        rowCells.push({ word: shuffled[wordIndex++], isFree: false, marked: false, source: null })
      }
    }
    card.push(rowCells)
  }

  return card
}
