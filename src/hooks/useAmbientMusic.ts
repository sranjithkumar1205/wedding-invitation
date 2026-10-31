import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Soft procedural ambient pad (Web Audio) — no external audio file / royalty concerns.
 * Mute UI always works; sound starts only after a user gesture (open seal / unmute).
 */
export function useAmbientMusic() {
  const [muted, setMuted] = useState(true)
  const [ready, setReady] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<{
    master: GainNode
    oscs: OscillatorNode[]
    gains: GainNode[]
  } | null>(null)

  const ensureGraph = useCallback(async () => {
    if (nodesRef.current && ctxRef.current) {
      if (ctxRef.current.state === 'suspended') await ctxRef.current.resume()
      return
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    const ctx = new AudioCtx()
    ctxRef.current = ctx

    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    const freqs = [110, 164.81, 220, 329.63]
    const oscs: OscillatorNode[] = []
    const gains: GainNode[] = []

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = i % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.value = freq

      const g = ctx.createGain()
      g.gain.value = 0.04 - i * 0.006

      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 0.05 + i * 0.02
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.012
      lfo.connect(lfoGain)
      lfoGain.connect(g.gain)
      lfo.start()

      osc.connect(g)
      g.connect(master)
      osc.start()
      oscs.push(osc)
      gains.push(g)
    })

    nodesRef.current = { master, oscs, gains }
    setReady(true)
  }, [])

  const fadeTo = useCallback((target: number, seconds = 1.2) => {
    const ctx = ctxRef.current
    const master = nodesRef.current?.master
    if (!ctx || !master) return
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(target, now + seconds)
  }, [])

  const unmute = useCallback(async () => {
    await ensureGraph()
    fadeTo(0.22)
    setMuted(false)
  }, [ensureGraph, fadeTo])

  const mute = useCallback(() => {
    fadeTo(0, 0.6)
    setMuted(true)
  }, [fadeTo])

  const toggle = useCallback(async () => {
    if (muted) await unmute()
    else mute()
  }, [mute, muted, unmute])

  useEffect(() => {
    return () => {
      nodesRef.current?.oscs.forEach((o) => {
        try {
          o.stop()
        } catch {
          /* already stopped */
        }
      })
      void ctxRef.current?.close()
    }
  }, [])

  return { muted, ready, toggle, unmute, mute }
}
