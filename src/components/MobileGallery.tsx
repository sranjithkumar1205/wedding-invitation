import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { photos } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'

const shots = photos.story
const N = shots.length
const AUTOPLAY_MS = 3200
const SWIPE_PX = 50

/** Shortest circular distance from the active index (negative = left of centre). */
function offsetOf(i: number, active: number) {
  let d = (i - active + N) % N
  if (d > N / 2) d -= N
  return d
}

/** Phone gallery: auto-playing 3D coverflow. Tap the centre photo for full screen. */
export function MobileGallery() {
  const { lang } = useLanguage()
  const tamil = lang === 'ta'
  const reduceMotion = useReducedMotion()

  const [index, setIndex] = useState(0)
  const [viewer, setViewer] = useState<number | null>(null)
  const [resumeAt, setResumeAt] = useState(0)

  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { margin: '-80px' })

  const go = useCallback((dir: 1 | -1, manual = true) => {
    setIndex((i) => (i + dir + N) % N)
    if (manual) setResumeAt(Date.now() + 7000)
  }, [])

  const jumpTo = useCallback((i: number) => {
    setIndex(i)
    setResumeAt(Date.now() + 7000)
  }, [])

  // Auto-advance while visible, not in the full-screen viewer, and not just touched.
  useEffect(() => {
    if (!inView || viewer !== null || reduceMotion) return
    const id = window.setInterval(() => {
      if (Date.now() >= resumeAt) go(1, false)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [inView, viewer, reduceMotion, resumeAt, go])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.15
    if (swipe < -SWIPE_PX) go(1)
    else if (swipe > SWIPE_PX) go(-1)
  }

  const current = shots[index]
  const caption = tamil ? current.captionTa : current.captionEn

  return (
    <div className="relative">
      {/* Stage */}
      <div
        ref={stageRef}
        className="relative mx-auto h-[min(92vw,380px)] w-full max-w-md select-none overflow-hidden"
        style={{ perspective: 900 }}
      >
        {/* soft spotlight behind centre card */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 60% at 50% 50%, rgba(232,213,183,0.22), transparent 70%)',
          }}
        />

        <motion.div
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          dragSnapToOrigin
          onDragEnd={onDragEnd}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {shots.map((shot, i) => {
            const off = offsetOf(i, index)
            const abs = Math.abs(off)
            if (abs > 2) return null
            const isCenter = off === 0
            const label = tamil ? shot.captionTa : shot.captionEn

            return (
              <motion.button
                key={shot.src}
                type="button"
                aria-label={isCenter ? `${label} — open full screen` : label}
                onTap={() => (isCenter ? setViewer(i) : jumpTo(i))}
                className="absolute inset-0 m-auto overflow-hidden rounded-md bg-ocean/60 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.65)] ring-1 ring-sand/30"
                style={{
                  width: 'min(60vw, 230px)',
                  height: 'min(75vw, 288px)',
                  zIndex: 10 - abs,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.6,
                  x: `${off * 62}%`,
                  rotateY: off * -42,
                }}
                animate={{
                  opacity: isCenter ? 1 : abs === 1 ? 0.8 : 0.4,
                  scale: 1 - abs * 0.16,
                  x: `${off * 62}%`,
                  rotateY: off * -42,
                  filter: isCenter ? 'brightness(1)' : `brightness(${1 - abs * 0.22})`,
                }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 170, damping: 22, mass: 0.9 }
                }
              >
                <img
                  src={shot.card}
                  alt={label}
                  draggable={false}
                  decoding="async"
                  className="pointer-events-none h-full w-full object-cover"
                />
                {isCenter && (
                  <span className="pointer-events-none absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-xs text-ivory backdrop-blur-sm">
                    ⤢
                  </span>
                )}
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      {/* Caption */}
      <div className="mx-auto mt-5 flex h-16 max-w-md items-start justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            className={`text-ivory ${tamil ? 'font-tamil text-base' : 'font-display text-2xl'}`}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.28 }}
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Controls: prev · progress dots · next */}
      <div className="mx-auto flex max-w-md items-center justify-center gap-4 px-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-ivory active:scale-90"
        >
          ‹
        </button>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Photos">
          {shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1}`}
              onClick={() => jumpTo(i)}
              className="flex h-6 items-center"
            >
              <motion.span
                className="block h-1.5 rounded-full bg-sand"
                animate={{
                  width: i === index ? 20 : 6,
                  opacity: i === index ? 1 : 0.35,
                }}
                transition={{ duration: 0.25 }}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-ivory active:scale-90"
        >
          ›
        </button>
      </div>

      <FullScreenViewer
        index={viewer}
        tamil={tamil}
        onChange={(i) => {
          setViewer(i)
          setIndex(i)
        }}
        onClose={() => {
          setViewer(null)
          setResumeAt(Date.now() + 4000)
        }}
      />
    </div>
  )
}

export function FullScreenViewer({
  index,
  tamil,
  onChange,
  onClose,
}: {
  index: number | null
  tamil: boolean
  onChange: (i: number) => void
  onClose: () => void
}) {
  const step = useCallback(
    (dir: 1 | -1) => {
      if (index !== null) onChange((index + dir + N) % N)
    },
    [index, onChange],
  )

  // Lock page scroll + keyboard controls while open.
  useEffect(() => {
    if (index === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [index, onClose, step])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) step(1)
    else if (info.offset.x > 60) step(-1)
  }

  const shot = index === null ? null : shots[index]

  return createPortal(
    <AnimatePresence>
      {shot && index !== null && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="flex items-center justify-between pt-4 pr-20 pl-4 text-sm text-ivory/80">
            <span className="tracking-[0.2em] tabular-nums">
              {String(index + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="fixed z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] ring-2 ring-white/80"
              style={{
                top: 'max(0.75rem, env(safe-area-inset-top))',
                right: 'max(0.75rem, env(safe-area-inset-right))',
                touchAction: 'manipulation',
              }}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <motion.div
            key={index}
            className="relative flex min-h-0 flex-1 items-center justify-center px-2"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <img
              src={shot.src}
              alt={tamil ? shot.captionTa : shot.captionEn}
              draggable={false}
              className="max-h-full max-w-full select-none object-contain"
            />
          </motion.div>

          <div
            className="px-6 pt-4 text-center text-ivory"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            <p className={tamil ? 'font-tamil text-base' : 'font-display text-2xl'}>
              {tamil ? shot.captionTa : shot.captionEn}
            </p>
            <div className="mt-4 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none"
              >
                ›
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
