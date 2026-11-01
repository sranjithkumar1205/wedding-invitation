import { useCallback, useEffect, useRef, useState } from 'react'

const file = (name: string) => `${import.meta.env.BASE_URL}${encodeURI(name)}`

const MAIN = file('Cinematic Trendy Wedding Invitation Video Premium Save the date Dude wedding.mp3.mpeg')
const INVITE = file('online wedding invitation.mp3.mpeg')

/**
 * The seal starts the main song. Once Celebrations fills the screen, the invitation
 * track plays once, then the main song continues. Mute pauses whichever track is current.
 */
export function useAmbientMusic() {
  const [muted, setMuted] = useState(true)
  const mutedRef = useRef(true)
  const trackRef = useRef<'main' | 'invite'>('main')
  const mainTimeRef = useRef(0)
  const inviteStartedRef = useRef(false)
  const suppressEndedRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current
    const audio = new Audio(MAIN)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.9
    audio.addEventListener('ended', () => {
      if (suppressEndedRef.current || trackRef.current !== 'invite') return
      trackRef.current = 'main'
      const resumeAt = mainTimeRef.current
      audio.loop = true
      audio.src = MAIN
      audio.addEventListener(
        'loadedmetadata',
        () => {
          const max = Number.isFinite(audio.duration) ? Math.max(0, audio.duration - 0.25) : resumeAt
          audio.currentTime = Math.min(resumeAt, max)
          if (!mutedRef.current && document.visibilityState === 'visible') void audio.play()
        },
        { once: true },
      )
    })
    audioRef.current = audio
    return audio
  }, [])

  const unmute = useCallback(async () => {
    const audio = ensureAudio()
    mutedRef.current = false
    setMuted(false)
    try {
      await audio.play()
    } catch {
      mutedRef.current = true
      setMuted(true)
    }
  }, [ensureAudio])

  const mute = useCallback(() => {
    mutedRef.current = true
    setMuted(true)
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(async () => {
    if (mutedRef.current) await unmute()
    else mute()
  }, [mute, unmute])

  const playInvitation = useCallback(async () => {
    if (inviteStartedRef.current) return
    inviteStartedRef.current = true
    const audio = ensureAudio()
    if (trackRef.current === 'main') mainTimeRef.current = audio.currentTime || 0
    trackRef.current = 'invite'
    suppressEndedRef.current = true
    audio.pause()
    audio.loop = false
    audio.src = INVITE
    audio.addEventListener(
      'playing',
      () => {
        suppressEndedRef.current = false
      },
      { once: true },
    )
    try {
      audio.currentTime = 0
    } catch {
      /* metadata not ready yet; play() starts at the beginning */
    }
    if (mutedRef.current) {
      suppressEndedRef.current = false
      return
    }
    try {
      await audio.play()
    } catch {
      suppressEndedRef.current = false
      mutedRef.current = true
      setMuted(true)
    }
  }, [ensureAudio])

  useEffect(() => {
    const preload = new Audio(INVITE)
    preload.preload = 'auto'
    preload.load()

    const pauseForBackground = () => {
      audioRef.current?.pause()
    }
    const resumeIfAudible = () => {
      if (document.visibilityState === 'hidden') return
      const audio = audioRef.current
      if (!audio || mutedRef.current) return
      void audio.play()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') pauseForBackground()
      else resumeIfAudible()
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', pauseForBackground)
    window.addEventListener('pageshow', resumeIfAudible)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', pauseForBackground)
      window.removeEventListener('pageshow', resumeIfAudible)
      preload.src = ''
      const audio = audioRef.current
      if (!audio) return
      audio.pause()
      audio.src = ''
    }
  }, [])

  return { muted, ready: true, toggle, unmute, mute, playInvitation }
}
