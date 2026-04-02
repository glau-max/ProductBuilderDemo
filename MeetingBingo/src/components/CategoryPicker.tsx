import { PACKS, type Pack } from '../data/packs'

type Props = {
  selectedId: string | null
  onSelect: (pack: Pack) => void
  onGenerate: () => void
}

export function CategoryPicker({ selectedId, onSelect, onGenerate }: Props) {
  return (
    <div className="flex flex-col items-center gap-8 py-10 px-4 pb-safe">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2">
          Meeting Bingo
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg">Pick a category to get started</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {PACKS.map((pack) => {
          const selected = pack.id === selectedId
          return (
            <button
              key={pack.id}
              onClick={() => onSelect(pack)}
              className={[
                'rounded-xl border p-5 text-left transition-all duration-200',
                'flex flex-col gap-3 cursor-pointer',
                selected
                  ? 'bg-violet-600/20 border-violet-500 ring-2 ring-violet-500'
                  : 'bg-zinc-800/60 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800',
              ].join(' ')}
            >
              <div className="font-bold text-white text-base">{pack.name}</div>
              <div className="text-zinc-400 text-xs">{pack.description}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {pack.words.slice(0, 5).map((word) => (
                  <span
                    key={word}
                    className="text-xs bg-zinc-700 text-zinc-300 rounded px-2 py-0.5"
                  >
                    {word}
                  </span>
                ))}
                <span className="text-xs text-zinc-500 px-1 py-0.5">
                  +{pack.words.length - 5} more
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={onGenerate}
        disabled={!selectedId}
        className={[
          'w-full max-w-xs px-8 py-4 rounded-xl font-bold text-base transition-all duration-200',
          'min-h-[52px]',
          selectedId
            ? 'bg-violet-600 hover:bg-violet-500 text-white cursor-pointer active:scale-95'
            : 'bg-zinc-700 text-zinc-500 cursor-not-allowed',
        ].join(' ')}
      >
        Generate Card →
      </button>
    </div>
  )
}
