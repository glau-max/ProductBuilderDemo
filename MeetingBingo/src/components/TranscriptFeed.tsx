type Entry = { text: string; matchedWord: string | null; timestamp: number }

type Props = {
  entries: Entry[]
}

export type TranscriptEntry = Entry

export function TranscriptFeed({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <p className="text-xs text-zinc-600 text-center py-2">
        Detected words will appear here…
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-1 max-h-28 overflow-y-auto">
      {[...entries].reverse().map((entry) => (
        <div key={entry.timestamp} className="flex items-center gap-2 text-xs">
          {entry.matchedWord ? (
            <>
              <span className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
              <span className="text-violet-300 font-medium">{entry.matchedWord}</span>
              <span className="text-zinc-600 truncate">{entry.text}</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-zinc-700 flex-shrink-0" />
              <span className="text-zinc-500 truncate">{entry.text}</span>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
