import { useEffect, useRef } from 'react'
import type { BingoCard } from '../types'
import type { Pack } from '../data/packs'

const STORAGE_KEY = 'meeting-bingo-v1'

type PersistedState = {
  packId: string
  card: BingoCard
}

export function saveGame(pack: Pack, card: BingoCard): void {
  try {
    const state: PersistedState = { packId: pack.id, card }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage quota exceeded or unavailable — fail silently
  }
}

export function loadGame(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch {
    return null
  }
}

export function clearGame(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Auto-saves whenever pack or card changes.
 * Uses a ref to skip the initial render.
 */
export function useAutoSave(pack: Pack | null, card: BingoCard | null): void {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (pack && card) {
      saveGame(pack, card)
    }
  }, [pack, card])
}
