import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { photos } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'
import { FullScreenViewer } from './MobileGallery'

const shots = photos.story
const N = shots.length
const VISIBLE = 4 // cards you can see in the pile
const AUTOPLAY_MS = 3600
const FLICK_MS = 0.32

/** Fixed, slightly different tilt for every print so the pile looks hand-placed. */
const baseTilt = (i: number) => ((i * 37) % 13) - 6 // -6..6 degrees

/** Phone gallery: a pile of polaroids. Flick or tap the top one to send it to the back. */
export function PolaroidStack() {
  const { lang } = useLanguage()
  const tamil = lang === 'ta'
  const reduceMotion = useReducedMotion()

  const [top, setTop] = useState(0)
  const [exitDir, setExitDir] = useState<1 | -1 | 0>(0) // direction the top card is flying out
  const [viewer, setViewer] = useState<number | null>(null)
  const [resumeAt, setResumeAt] = useState(0)

  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { margin: '-80px' })

  const flick = useCallback(
    (dir: 1 | -1, manual = true) => {
      if (exitDir !== 0) return
      setExitDir(dir)
      if (manual) setResumeAt(Date.now() + 7000)
    },
    [exitDir],
  )

  const onExited = useCallback(() => {
    setTop((t) => (t + 1) % N)
    setExitDir(0)
  }, [])

  // Auto-flick while visible, not in the full-screen viewer, and not just touched.
  useEffect(() => {
    if (!inView || viewer !== null || reduceMotion) return
    const id = window.setInterval(() => {
      if (Date.now() >= resumeAt) flick(1, false)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [inView, viewer, reduceMotion, resumeAt, flick])

  const current = shots[top]
  const caption = tamil ? current.captionTa : current.captionEn

  return (
    <div className="relative">
      <div
        ref={stageRef}
        className="relative mx-auto h-[min(112vw,430px)] w-full max-w-md select-none overflow-hidden"
      >
        {shots.map((shot, i) => {
          const depth = (i - top + N) % N
          return (
            <PolaroidCard
              key={shot.src}
              src={shot.card}
              caption={tamil ? shot.captionTa : shot.captionEn}
              tamil={tamil}
              tilt={baseTilt(i)}
              depth={depth}
              exiting={depth === 0 ? exitDir : 0}
              reduceMotion={!!reduceMotion}
              onFlick={flick}
              onExited={onExited}
              onOpen={() => setViewer(i)}
            />
          )
        })}
      </div>

      {/* Caption mirrors the top print for screen readers + a clear counter */}
      <div className="mx-auto mt-3 flex max-w-md items-center justify-center gap-4 px-4">
        <span className="sr-only" aria-live="polite">
          {caption}
        </span>
        <div className="flex items-center gap-1.5" aria-hidden>
          {shots.map((shot, i) => (
            <motion.span
              key={shot.src}
              className="block h-1.5 rounded-full bg-sand"
              animate={{ width: i === top ? 20 : 6, opacity: i === top ? 1 : 0.35 }}
              transition={{ duration: 0.25 }}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-center text-[0.65rem] tracking-[0.28em] text-sand/70 uppercase">
        {tamil ? 'தொட்டு அல்லது ஸ்வைப் செய்யுங்கள்' : 'Tap or swipe the photo'}
      </p>

      <FullScreenViewer
        index={viewer}
        tamil={tamil}
        onChange={(i) => {
          setViewer(i)
          setTop(i)
        }}
        onClose={() => {
          setViewer(null)
          setResumeAt(Date.now() + 4000)
        }}
      />
    </div>
  )
}

function PolaroidCard({
  src,
  caption,
  tamil,
  tilt,
  depth,
  exiting,
  reduceMotion,
  onFlick,
  onExited,
  onOpen,
}: {
  src: string
  caption: string
  tamil: boolean
  tilt: number
  depth: number
  exiting: 1 | -1 | 0
  reduceMotion: boolean
  onFlick: (dir: 1 | -1) => void
  onExited: () => void
  onOpen: () => void
}) {
  const isTop = depth === 0
  const shown = depth < VISIBLE
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  // Card tips as you drag it, like a real print being pulled off the pile.
  const dragTilt = useTransform(x, [-220, 0, 220], [-16, 0, 16])

  // Once a card has flown off and joins the back of the pile, slide it back under the stack.
  useEffect(() => {
    if (isTop) return
    const spring = { type: 'spring', stiffness: 140, damping: 20 } as const
    const a = animate(x, 0, spring)
    const b = animate(y, 0, spring)
    return () => {
      a.stop()
      b.stop()
    }
  }, [isTop, x, y])

  // Fly out when told to (tap, button, autoplay or swipe release).
  useEffect(() => {
    if (!exiting) return
    if (reduceMotion) {
      onExited()
      return
    }
    const a = animate(x, exiting * 420, { duration: FLICK_MS, ease: 'easeIn' })
    const b = animate(y, 40, { duration: FLICK_MS, ease: 'easeIn' })
    void a.then(onExited)
    return () => {
      a.stop()
      b.stop()
    }
    // onExited is stable; x/y are stable motion values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const power = Math.abs(info.offset.x) + Math.abs(info.velocity.x) * 0.18
    if (power > 110) onFlick(info.offset.x >= 0 ? 1 : -1)
  }

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 m-auto"
      style={{
        width: 'min(68vw, 262px)',
        height: 'min(86vw, 330px)',
        zIndex: 20 - depth,
      }}
      initial={false}
      animate={{
        scale: 1 - Math.min(depth, VISIBLE) * 0.035,
        // Cards behind fan out a little to either side so the pile reads as a pile.
        x: isTop ? 0 : (tilt >= 0 ? 1 : -1) * Math.min(depth, VISIBLE) * 7,
        y: Math.min(depth, VISIBLE) * 9,
        rotate: isTop ? tilt * 0.4 : tilt + (tilt >= 0 ? 3 : -3),
        opacity: shown ? 1 : 0,
      }}
      transition={
        reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 20 }
      }
    >
      <motion.div
          className={`relative h-full w-full rounded-[3px] bg-[#fbf6ec] p-[9px] pb-0 shadow-[0_16px_34px_-10px_rgba(0,0,0,0.7)] ${
            isTop ? 'pointer-events-auto cursor-grab touch-none active:cursor-grabbing' : ''
          }`}
          style={{ x, y, rotate: dragTilt }}
          drag={isTop && !exiting}
          dragSnapToOrigin
          dragElastic={0.9}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          onTap={() => isTop && !exiting && onFlick(1)}
          whileTap={isTop ? { scale: 0.985 } : undefined}
        >
          <div className="relative h-[calc(100%-62px)] w-full overflow-hidden bg-ocean/50">
            <img
              src={src}
              alt={caption}
              draggable={false}
              loading="lazy"
              decoding="async"
              className="pointer-events-none h-full w-full object-cover"
            />
            {/* soft vignette + paper sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/15" />
            {isTop && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  onOpen()
                }}
                aria-label="Open full screen"
                className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-sm text-ivory backdrop-blur-sm"
              >
                ⤢
              </button>
            )}
          </div>
          <p
            className={`flex h-[62px] items-center justify-center px-2 text-center leading-tight text-ink/85 ${
              tamil ? 'font-tamil text-[0.8rem]' : 'font-display text-[1.45rem]'
            }`}
          >
            {caption}
          </p>
      </motion.div>
    </motion.div>
  )
}
