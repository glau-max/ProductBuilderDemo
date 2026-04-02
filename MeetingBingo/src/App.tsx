import { useState, useCallback, useRef } from 'react'
import { CategoryPicker } from './components/CategoryPicker'
import { BingoCard } from './components/BingoCard'
import { GameHeader } from './components/GameHeader'
import { WinOverlay } from './components/WinOverlay'
import { TranscriptFeed, type TranscriptEntry } from './components/TranscriptFeed'
import { generateCard } from './utils/cardGenerator'
import { detectBingo } from './utils/bingoDetector'
import { findMatches } from './utils/wordMatcher'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useAutoSave, loadGame, clearGame } from './hooks/useGamePersistence'
import { useTheme } from './hooks/useTheme'
import { PACK_MAP, type Pack } from './data/packs'
import type { BingoCard as BingoCardType } from './types'

type Screen = 'picker' | 'game'

function getInitialState(): { screen: Screen; pack: Pack | null; card: BingoCardType | null } {
  const saved = loadGame()
  if (saved && PACK_MAP[saved.packId]) {
    return { screen: 'game', pack: PACK_MAP[saved.packId], card: saved.card }
  }
  return { screen: 'picker', pack: null, card: null }
}

export default function App() {
  const initial = getInitialState()
  const [screen, setScreen] = useState<Screen>(initial.screen)
  const [selectedPack, setSelectedPack] = useState<Pack | null>(initial.pack)
  const [card, setCard] = useState<BingoCardType | null>(initial.card)
  const [showWin, setShowWin] = useState(false)
  const [recentlyDetected, setRecentlyDetected] = useState<string[]>([])
  const [transcriptEntries, setTranscriptEntries] = useState<TranscriptEntry[]>([])
  const recentlyDetectedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useAutoSave(selectedPack, card)
  const { theme, toggle: toggleTheme } = useTheme()

  const handleTranscript = useCallback((text: string) => {
    setCard((prev) => {
      if (!prev) return prev

      const cardWords = prev.flat()
        .filter((c) => !c.isFree && !c.marked)
        .map((c) => c.word)

      const matches = findMatches(text, cardWords)

      // Add to transcript feed
      setTranscriptEntries((entries) => [
        ...entries.slice(-49), // keep last 50
        { text, matchedWord: matches[0] ?? null, timestamp: Date.now() },
      ])

      if (matches.length === 0) return prev

      // Flash recently detected
      const matchesLower = matches.map((m) => m.toLowerCase())
      setRecentlyDetected(matchesLower)
      if (recentlyDetectedTimerRef.current) clearTimeout(recentlyDetectedTimerRef.current)
      recentlyDetectedTimerRef.current = setTimeout(() => setRecentlyDetected([]), 1500)

      // Mark matched cells
      const next = prev.map((row) =>
        row.map((cell) => {
          if (cell.marked || cell.isFree) return cell
          if (matches.some((m) => m.toLowerCase() === cell.word.toLowerCase())) {
            return { ...cell, marked: true, source: 'speech' as const }
          }
          return cell
        })
      )

      const win = detectBingo(next)
      if (win) setTimeout(() => setShowWin(true), 300)
      return next
    })
  }, [])

  const { status: speechStatus, error: speechError, start, stop } = useSpeechRecognition(handleTranscript)

  const handleToggleListening = useCallback(() => {
    if (speechStatus === 'listening') {
      stop()
    } else {
      start()
    }
  }, [speechStatus, start, stop])

  const handleGenerate = useCallback(() => {
    if (!selectedPack) return
    setCard(generateCard(selectedPack))
    setShowWin(false)
    setTranscriptEntries([])
    setRecentlyDetected([])
    stop()
    setScreen('game')
  }, [selectedPack, stop])

  const handleCellClick = useCallback((row: number, col: number) => {
    setCard((prev) => {
      if (!prev) return prev
      const next = prev.map((r, ri) =>
        r.map((cell, ci) => {
          if (ri !== row || ci !== col) return cell
          return { ...cell, marked: !cell.marked, source: cell.marked ? null : 'manual' as const }
        })
      )
      const win = detectBingo(next)
      if (win) setTimeout(() => setShowWin(true), 300)
      return next
    })
  }, [])

  const handleReset = useCallback(() => {
    setCard((prev) =>
      prev
        ? prev.map((row) =>
            row.map((cell) => (cell.isFree ? cell : { ...cell, marked: false, source: null }))
          )
        : prev
    )
    setShowWin(false)
    setTranscriptEntries([])
  }, [])

  const handleNewCard = useCallback(() => {
    stop()
    clearGame()
    setScreen('picker')
    setCard(null)
    setShowWin(false)
    setTranscriptEntries([])
    setRecentlyDetected([])
  }, [stop])

  const winResult = card ? detectBingo(card) : null

  if (screen === 'picker') {
    return (
      <div className="min-h-screen bg-zinc-950 dark:bg-zinc-950 relative">
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 text-lg min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-all"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <CategoryPicker
          selectedId={selectedPack?.id ?? null}
          onSelect={setSelectedPack}
          onGenerate={handleGenerate}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {selectedPack && card && (
        <>
          <GameHeader
            pack={selectedPack}
            listeningStatus={speechStatus}
            theme={theme}
            onNewCard={handleNewCard}
            onReset={handleReset}
            onToggleListening={handleToggleListening}
            onToggleTheme={toggleTheme}
          />

          {/* Permission / browser error banners */}
          {speechError === 'not-supported' && (
            <div className="bg-yellow-900/40 border-b border-yellow-700/50 text-yellow-300 text-xs px-4 py-2 text-center">
              Web Speech API is not supported in this browser. Use Chrome or Edge for auto-detection, or tap cells manually.
            </div>
          )}
          {speechError === 'permission-denied' && (
            <div className="bg-red-900/40 border-b border-red-700/50 text-red-300 text-xs px-4 py-2 text-center">
              Microphone access was denied. Enable mic permissions in your browser settings, or tap cells manually.
            </div>
          )}
          {speechError === 'network-error' && (
            <div className="bg-red-900/40 border-b border-red-700/50 text-red-300 text-xs px-4 py-2 text-center">
              Speech recognition network error. Check your connection or tap cells manually.
            </div>
          )}

          <main className="flex-1 flex flex-col items-center justify-center py-6 px-2 gap-6">
            <BingoCard
              card={card}
              winResult={winResult}
              onCellClick={handleCellClick}
              recentlyDetected={recentlyDetected}
            />

            {/* Transcript feed */}
            <div className="w-full max-w-lg px-4">
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2 font-medium">
                Transcript
              </p>
              <TranscriptFeed entries={transcriptEntries} />
            </div>
          </main>

          {showWin && (
            <WinOverlay
              card={card}
              pack={selectedPack}
              onNewGame={handleNewCard}
              onDismiss={() => setShowWin(false)}
            />
          )}
        </>
      )}
    </div>
  )
}
