# Meeting Bingo — Implementation Plan

**Version**: 1.0
**Date**: March 26, 2026
**Linear Project**: [Meeting Bingo](https://linear.app/glau/project/meeting-bingo-11dd399a8d25)
**Stack**: React 18 + TypeScript + Vite + Tailwind CSS
**Target Build Time**: 90-minute MVP

---

## Overview

Meeting Bingo is a browser-based bingo game that uses the Web Speech API to auto-detect buzzwords during meetings. Players generate a 5×5 card from a category pack, then squares fill automatically as keywords are spoken.

---

## Milestones

### Milestone 1 — Project Setup

| Issue | Title | Priority |
|-------|-------|----------|
| [GLA-5](https://linear.app/glau/issue/GLA-5) | Project setup: Vite + React + TypeScript + Tailwind | 🟠 High |

**Deliverables:**
- Vite project scaffolded with React 18 + TypeScript template
- Tailwind CSS configured
- ESLint configured
- Folder structure in place:
  ```
  src/
    components/   # UI components
    hooks/        # Custom React hooks
    data/         # Buzzword packs and constants
    utils/        # Pure logic functions (card gen, bingo detection)
    types/        # Shared TypeScript types
  ```

---

### Milestone 2 — Core Data & Logic

| Issue | Title | Priority |
|-------|-------|----------|
| [GLA-6](https://linear.app/glau/issue/GLA-6) | Define buzzword category packs (3 packs) | 🟠 High |
| [GLA-7](https://linear.app/glau/issue/GLA-7) | Implement bingo card generation (5×5 grid) | 🟠 High |
| [GLA-8](https://linear.app/glau/issue/GLA-8) | Implement BINGO detection logic | 🟠 High |

**Deliverables:**
- `src/data/packs.ts` — 3 packs × 30+ words each:
  - **Corporate Speak** — synergy, bandwidth, leverage, pivot, circle back…
  - **Tech Jargon** — blockchain, scalable, microservices, ML, cloud-native…
  - **Startup** — disrupt, unicorn, growth hack, runway, product-market fit…
- `src/utils/cardGenerator.ts` — `generateCard(pack): BingoCard`
  - 5×5 grid, center always FREE SPACE, no duplicates, random each time
- `src/utils/bingoDetector.ts` — `detectBingo(marks): WinResult | null`
  - Checks 5 rows + 5 columns + 2 diagonals = 12 winning patterns
  - Returns winning line coordinates for highlight animation
  - Unit tested for all 12 patterns

**Key types:**
```ts
type BingoCell = { word: string; isFree: boolean; marked: boolean; source: 'speech' | 'manual' | null }
type BingoCard = BingoCell[][]
type WinResult = { lines: [number, number][][] }
```

---

### Milestone 3 — UI Components

| Issue | Title | Priority |
|-------|-------|----------|
| [GLA-9](https://linear.app/glau/issue/GLA-9) | Build BingoCard component | 🟠 High |
| [GLA-10](https://linear.app/glau/issue/GLA-10) | Build CategoryPicker component | 🟡 Medium |
| [GLA-11](https://linear.app/glau/issue/GLA-11) | Build game header and controls UI | 🟡 Medium |
| [GLA-12](https://linear.app/glau/issue/GLA-12) | Win celebration animation | 🟡 Medium |

**Deliverables:**

- **`<BingoCard>`** — 5×5 grid
  - Cell states: default / marked-speech / marked-manual / winning
  - FREE SPACE center (pre-marked)
  - Click/tap to manually mark any cell
  - Winning line cells highlighted distinctly

- **`<CategoryPicker>`** — pre-game screen
  - 3 category cards with name + sample words
  - Selected state
  - "Generate Card" CTA

- **`<GameHeader>`** — top bar
  - App title
  - Category badge
  - Listening status indicator: `idle` | `listening` | `error`
  - New Card + Reset buttons

- **Win overlay** — triggered on BINGO detection
  - `canvas-confetti` animation
  - BINGO! modal with winning line highlighted
  - Detection summary (speech vs manual)
  - Share Result + New Game actions

---

### Milestone 4 — Speech Recognition

| Issue | Title | Priority |
|-------|-------|----------|
| [GLA-13](https://linear.app/glau/issue/GLA-13) | Implement Web Speech API transcription service | 🔴 Urgent |
| [GLA-14](https://linear.app/glau/issue/GLA-14) | Auto-fill cells on buzzword detection | 🔴 Urgent |
| [GLA-15](https://linear.app/glau/issue/GLA-15) | Microphone permission handling and browser support | 🟠 High |

**Deliverables:**

- **`useSpeechRecognition` hook**
  - Wraps `window.SpeechRecognition` / `window.webkitSpeechRecognition`
  - Continuous mode, interim + final results
  - Exposes: `transcript`, `status`, `start()`, `stop()`
  - Auto-restarts on recoverable errors
  - Error states: `not-supported` | `permission-denied` | `network-error`

- **Word matching service**
  - Normalize transcript (lowercase, strip punctuation)
  - Case-insensitive match against card words
  - Mark matched cells with `source: 'speech'`
  - Visual pulse animation on newly detected cells
  - Transcript feed below card showing recent detections

- **Browser/permission guard**
  - Detect API availability (Chrome/Edge supported; Firefox/Safari show warning)
  - Unsupported browser → banner + manual-only mode
  - Permission denied → instructions + manual-only fallback
  - Permission pending → prompt UI before starting

> **Note**: Web Speech API requires HTTPS in production (Vercel handles this automatically).

---

### Milestone 5 — Persistence & Sharing

| Issue | Title | Priority |
|-------|-------|----------|
| [GLA-16](https://linear.app/glau/issue/GLA-16) | Game state persistence with localStorage | 🟡 Medium |
| [GLA-17](https://linear.app/glau/issue/GLA-17) | Shareable win result card | 🔵 Low |

**Deliverables:**

- **localStorage persistence**
  - Saves: selected category, card layout, marked cells, detection sources
  - Auto-saves on every state change
  - Restores on page load
  - Clears on "New Game"
  - Versioned schema (`v1`) for future migrations

- **Share functionality**
  - Emoji grid text summary (copy/paste friendly)
  - Web Share API (`navigator.share`) on mobile
  - Clipboard copy fallback on desktop
  - Share message: category + winning pattern + detected words

---

### Milestone 6 — Polish

| Issue | Title | Priority |
|-------|-------|----------|
| [GLA-18](https://linear.app/glau/issue/GLA-18) | Mobile responsive layout | 🟡 Medium |
| [GLA-19](https://linear.app/glau/issue/GLA-19) | Light/dark theme support | 🔵 Low |
| [GLA-20](https://linear.app/glau/issue/GLA-20) | Deploy to Vercel | 🟠 High |

**Deliverables:**

- **Mobile responsive**
  - Grid scales to fill viewport width on 375px+
  - Touch targets ≥ 44×44px
  - Readable font sizes at small viewports
  - No horizontal scroll in portrait or landscape

- **Light/dark theme**
  - Defaults to `prefers-color-scheme`
  - Manual toggle in header
  - Persisted in localStorage
  - Tailwind `dark:` variants throughout

- **Vercel deployment**
  - GitHub repo connected to Vercel
  - Build command: `vite build`
  - HTTPS enforced (required for Web Speech API)
  - Production URL smoke-tested

---

## Build Order (90-minute MVP)

For the workshop sprint, prioritize in this order:

```
1. Project setup (GLA-5)           ~10 min
2. Buzzword packs (GLA-6)          ~5 min
3. Card generation (GLA-7)         ~10 min
4. BINGO detection (GLA-8)         ~10 min
5. BingoCard UI (GLA-9)            ~15 min
6. Speech recognition (GLA-13)     ~15 min
7. Auto-fill on detection (GLA-14) ~10 min
8. Game header + controls (GLA-11) ~10 min
9. Win animation (GLA-12)          ~5 min
                                   -------
                                   ~90 min
```

Defer to after workshop: CategoryPicker, mic error handling, localStorage, sharing, mobile polish, dark mode.

---

## Dependencies

```
vite
react + react-dom
typescript
tailwindcss
canvas-confetti          # Win animation
```

No backend. No auth. No API keys. Total cost: **$0/month**.
