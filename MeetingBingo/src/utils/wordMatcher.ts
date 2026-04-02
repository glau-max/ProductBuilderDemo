function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
}

/**
 * Given a transcript string and a list of card words,
 * returns the subset of card words found in the transcript.
 */
export function findMatches(transcript: string, cardWords: string[]): string[] {
  const normalizedTranscript = normalize(transcript)
  return cardWords.filter((word) => {
    const normalizedWord = normalize(word)
    // Match whole-word or phrase within transcript
    const pattern = new RegExp(`(^|\\s)${normalizedWord.replace(/\s+/g, '\\s+')}(\\s|$)`)
    return pattern.test(normalizedTranscript)
  })
}
