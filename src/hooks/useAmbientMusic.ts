import { useCallback, useEffect, useRef, useState } from 'react'

const TRACK = `${import.meta.env.BASE_URL}${encodeURI(
  'Cinematic Trendy Wedding Invitation Video Premium Save the date Dude wedding.mp3.mpeg',
)}`

/**
 * Wedding track. Playback starts on the seal tap (a user gesture) and the mute control pauses it.
 */
export function useAmbientMusic() {
  const [muted, setMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current
    const audio = new Audio(TRACK)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.9
    audioRef.current = audio
    return audio
  }, [])

  const unmute = useCallback(async () => {
    const audio = ensureAudio()
    setMuted(false)
    try {
      await audio.play()
    } catch {
      setMuted(true)
    }
  }, [ensureAudio])

  const mute = useCallback(() => {
    audioRef.current?.pause()
    setMuted(true)
  }, [])

  const toggle = useCallback(async () => {
    if (muted) await unmute()
    else mute()
  }, [mute, muted, unmute])

  useEffect(() => {
    return () => {
      const audio = audioRef.current
      if (!audio) return
      audio.pause()
      audio.src = ''
    }
  }, [])

  return { muted, ready: true, toggle, unmute, mute }
}
