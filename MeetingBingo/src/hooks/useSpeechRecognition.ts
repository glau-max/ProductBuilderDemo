import { useCallback, useEffect, useRef, useState } from 'react'

export type SpeechStatus = 'idle' | 'listening' | 'error' | 'unsupported'

export type SpeechError =
  | 'not-supported'
  | 'permission-denied'
  | 'network-error'
  | 'unknown'

type UseSpeechRecognitionResult = {
  status: SpeechStatus
  transcript: string
  error: SpeechError | null
  start: () => void
  stop: () => void
}

function getSpeechRecognitionClass(): typeof SpeechRecognition | null {
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

export function useSpeechRecognition(
  onTranscript: (text: string) => void
): UseSpeechRecognitionResult {
  const [status, setStatus] = useState<SpeechStatus>(() =>
    getSpeechRecognitionClass() ? 'idle' : 'unsupported'
  )
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<SpeechError | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const stoppedManuallyRef = useRef(false)
  const onTranscriptRef = useRef(onTranscript)
  useEffect(() => { onTranscriptRef.current = onTranscript }, [onTranscript])

  const stop = useCallback(() => {
    stoppedManuallyRef.current = true
    recognitionRef.current?.stop()
    setStatus('idle')
  }, [])

  const start = useCallback(() => {
    const SR = getSpeechRecognitionClass()
    if (!SR) {
      setStatus('unsupported')
      setError('not-supported')
      return
    }

    // Tear down any existing instance
    recognitionRef.current?.stop()

    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition
    stoppedManuallyRef.current = false

    recognition.onstart = () => {
      setStatus('listening')
      setError(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        }
      }
      if (finalText) {
        setTranscript(finalText)
        onTranscriptRef.current(finalText)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('permission-denied')
        setStatus('error')
      } else if (event.error === 'network') {
        setError('network-error')
        setStatus('error')
      } else if (event.error === 'no-speech') {
        // Non-fatal — recognition will continue
      } else {
        setError('unknown')
        setStatus('error')
      }
    }

    recognition.onend = () => {
      // Auto-restart unless manually stopped or errored
      if (!stoppedManuallyRef.current && status !== 'error') {
        try {
          recognition.start()
        } catch {
          setStatus('idle')
        }
      } else {
        setStatus('idle')
      }
    }

    recognition.start()
  }, [status])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stoppedManuallyRef.current = true
      recognitionRef.current?.stop()
    }
  }, [])

  return { status, transcript, error, start, stop }
}
