import { useEffect, useRef } from 'react'

type Props = {
  className?: string
  density?: number
  active?: boolean
}

/** Soft rose/cream petal drift — motion language borrowed from the birthday gift canvas. */
export function Petals({ className = '', density = 18, active = true }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let t = 0

    type P = { x: number; y: number; s: number; v: number; w: number; a: number; c: string }
    const petals: P[] = []
    const colors = ['#e86a8a', '#f6b9c9', '#f2dcc0', '#d9a85b']

    const resize = () => {
      const parent = canvas.parentElement
      w = parent?.clientWidth || window.innerWidth
      h = parent?.clientHeight || window.innerHeight
      canvas.width = w * devicePixelRatio
      canvas.height = h * devicePixelRatio
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    const spawn = () => {
      petals.push({
        x: Math.random() * w,
        y: -20,
        s: Math.random() * 9 + 5,
        v: Math.random() * 0.7 + 0.35,
        w: Math.random() * 2,
        a: Math.random() * 6,
        c: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    const heart = (x: number, y: number, s: number, rot: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.beginPath()
      const k = s / 16
      ctx.moveTo(0, 3 * k)
      ctx.bezierCurveTo(-9 * k, -6 * k, -14 * k, 6 * k, 0, 14 * k)
      ctx.bezierCurveTo(14 * k, 6 * k, 9 * k, -6 * k, 0, 3 * k)
      ctx.fill()
      ctx.restore()
    }

    for (let i = 0; i < Math.min(density, 10); i++) spawn()

    const draw = () => {
      t += 0.016
      ctx.clearRect(0, 0, w, h)
      if (Math.random() < 0.04 && petals.length < density) spawn()
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i]
        p.y += p.v
        p.x += Math.sin(t * 2 + p.w) * 0.65
        p.a += 0.02
        ctx.globalAlpha = 0.5
        ctx.fillStyle = p.c
        heart(p.x, p.y, p.s, Math.sin(p.a) * 0.55)
        if (p.y > h + 30) petals.splice(i, 1)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active, density])

  return (
    <canvas
      ref={ref}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    />
  )
}
