import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { photos } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'
import { ScrollWords } from './ScrollWords'

type Phase = 'heart' | 'blast' | 'reveal'

const SHARDS = 56
const SHARD_COLORS = ['#f8d0dc', '#e86a8a', '#c93a5e', '#ecd3b0', '#f6e6cf', '#a67c35']

export function Couple() {
  const { t, lang } = useLanguage()
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.82 })
  const [phase, setPhase] = useState<Phase>('heart')
  const paused = Boolean(inView && !reduceMotion && phase !== 'reveal')

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setPhase('reveal')
      return
    }
    const toBlast = window.setTimeout(() => setPhase('blast'), 1400)
    const toReveal = window.setTimeout(() => setPhase('reveal'), 3200)
    return () => {
      window.clearTimeout(toBlast)
      window.clearTimeout(toReveal)
    }
  }, [inView, reduceMotion])

  useEffect(() => {
    if (!paused) return
    const section = ref.current
    if (!section) return

    const root = document.documentElement
    const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY)
    // Smooth scrolling would restart at the first page when the hold ends.
    const place = (y: number) => {
      const behavior = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      window.scrollTo(0, y)
      root.style.scrollBehavior = behavior
    }
    place(top)

    const previous = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
    }
    document.body.style.position = 'fixed'
    document.body.style.top = `-${top}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'

    const stopWheel = (event: WheelEvent) => event.preventDefault()
    const stopTouch = (event: TouchEvent) => {
      if (event.cancelable) event.preventDefault()
    }
    const stopKeys = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
        event.preventDefault()
      }
    }

    window.addEventListener('wheel', stopWheel, { passive: false })
    window.addEventListener('touchmove', stopTouch, { passive: false })
    window.addEventListener('keydown', stopKeys)

    return () => {
      root.style.scrollBehavior = 'auto'
      document.body.style.position = previous.position
      document.body.style.top = previous.top
      document.body.style.left = previous.left
      document.body.style.right = previous.right
      document.body.style.width = previous.width
      window.scrollTo(0, top)
      root.style.scrollBehavior = ''
      window.removeEventListener('wheel', stopWheel)
      window.removeEventListener('touchmove', stopTouch)
      window.removeEventListener('keydown', stopKeys)
    }
  }, [paused])

  const showStage = phase !== 'reveal'
  const showSection = phase === 'reveal'

  return (
    <section ref={ref} className="kolam-bg relative overflow-hidden">
      {showSection && (
        <motion.div
          className="mx-auto max-w-6xl px-6 py-20 sm:py-28"
          initial={{
            clipPath: 'circle(0% at 50% 32%)',
            filter: 'blur(18px)',
            scale: 0.78,
            opacity: 0.35,
          }}
          animate={{
            clipPath: 'circle(160% at 50% 32%)',
            filter: 'blur(0px)',
            scale: 1,
            opacity: 1,
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 24, scale: 0.86 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.45, duration: 1.15 }}
          >
            <p className={`text-maroon-soft ${lang === 'ta' ? 'font-tamil text-lg' : 'font-display text-3xl'}`}>
              {t.coupleSection}
            </p>
            <div className="ornament-line mt-4">
              <span className="motif-dot" />
            </div>
          </motion.div>

          <blockquote
            className={`mx-auto mb-16 max-w-2xl text-center text-lg leading-relaxed text-maroon sm:text-xl ${
              lang === 'ta' ? 'font-tamil' : 'font-serif italic'
            }`}
          >
            <ScrollWords text={`“${t.quote}”`} />
          </blockquote>

          <div className="grid items-stretch gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-6">
            <Person
              delay={0.7}
              image={photos.coupleGroom}
              imageAlt="Ranjith"
              title={t.groomTitle}
              name={t.groomName}
              degree={t.groomDegree}
              role={t.groomRole}
              parents={t.groomParents}
              lang={lang}
              align="right"
            />

            <motion.div
              className="hidden flex-col items-center justify-center md:flex"
              initial={{ opacity: 0, scale: 0.2, rotate: -18 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.05, type: 'spring', stiffness: 140, damping: 18 }}
            >
              <span className="font-display text-4xl text-gold-deep">{t.weds}</span>
              <span className="mt-3 h-24 w-px bg-gradient-to-b from-gold to-transparent" />
            </motion.div>

            <motion.div
              className="flex justify-center md:hidden"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.95, type: 'spring', stiffness: 140, damping: 18 }}
            >
              <span className="font-display text-3xl text-gold-deep">{t.weds}</span>
            </motion.div>

            <Person
              delay={0.95}
              image={photos.coupleBride}
              imageAlt="Chandrika"
              title={t.brideTitle}
              name={t.brideName}
              degree={t.brideDegree}
              role={t.brideRole}
              parents={t.brideParents}
              lang={lang}
              align="left"
            />
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showStage && (
          <motion.div
            key="stage"
            className={
              showSection
                ? 'pointer-events-none absolute inset-0 z-20'
                : 'relative flex min-h-[100svh] items-center justify-center px-6'
            }
            exit={{ opacity: 0, transition: { duration: 0.7 } }}
          >
            <HeartIntro phase={phase} weds={t.weds} tamil={lang === 'ta'} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function HeartIntro({
  phase,
  weds,
  tamil,
}: {
  phase: Phase
  weds: string
  tamil: boolean
}) {
  const shards = useMemo(
    () =>
      Array.from({ length: SHARDS }, (_, i) => {
        const angle = (i / SHARDS) * Math.PI * 2 + (i % 5) * 0.15
        const reach = 90 + (i % 9) * 28
        return {
          id: i,
          x: Math.cos(angle) * reach,
          y: Math.sin(angle) * reach * 0.82,
          size: 12 + (i % 6) * 4,
          color: SHARD_COLORS[i % SHARD_COLORS.length],
          rot: (i % 2 === 0 ? -1 : 1) * (80 + (i % 7) * 28),
          delay: (i % 8) * 0.012,
        }
      }),
    [],
  )

  return (
    <div className="relative flex h-full min-h-[100svh] w-full items-center justify-center overflow-hidden">
      <AnimatePresence>
        {phase === 'heart' && (
          <motion.div
            key="heart"
            className="absolute flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [1, 1.06, 0.98, 1.08, 1], opacity: 1 }}
            exit={{
              scale: [1, 1.28, 0.15],
              opacity: [1, 1, 0],
              transition: { duration: 0.34, times: [0, 0.35, 1], ease: 'easeIn' },
            }}
            transition={{
              scale: { duration: 1.15, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.3 },
            }}
          >
            <HeartGlyph />
            <span
              className={`absolute text-[#fff6ea] ${
                tamil ? 'mb-6 max-w-[9rem] text-center font-tamil text-lg font-semibold' : 'mb-7 font-display text-5xl sm:text-6xl'
              }`}
            >
              {weds}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'blast' && (
        <>
          <motion.span
            className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,244,232,0.95) 0%, rgba(232,106,138,0.55) 34%, transparent 70%)',
            }}
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 7, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 0.8, 0.3, 1] }}
          />
          <motion.span
            className="pointer-events-none absolute top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rose-soft"
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          />
          {shards.map((shard) => (
            <motion.span
              key={shard.id}
              className="absolute top-1/2 left-1/2 leading-none"
              style={{
                color: shard.color,
                fontSize: shard.size,
                marginLeft: -shard.size / 2,
                marginTop: -shard.size / 2,
              }}
              initial={{ x: 0, y: 0, scale: 0.35, opacity: 1, rotate: 0 }}
              animate={{
                x: shard.x,
                y: shard.y,
                scale: [0.5, 1.15, 0.55],
                opacity: [1, 1, 0],
                rotate: shard.rot,
              }}
              transition={{ duration: 1.35, delay: shard.delay, ease: [0.16, 0.7, 0.3, 1] }}
            >
              ♥
            </motion.span>
          ))}
        </>
      )}
    </div>
  )
}

function HeartGlyph() {
  return (
    <svg viewBox="0 0 200 180" className="h-full w-full drop-shadow-md" aria-hidden>
      <defs>
        <linearGradient id="heart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8d0dc" />
          <stop offset="48%" stopColor="#c93a5e" />
          <stop offset="100%" stopColor="#7a2440" />
        </linearGradient>
      </defs>
      <path
        d="M100 162C100 162 26 112 26 68 26 38 50 22 74 40 88 52 100 70 100 70 100 70 112 52 126 40 150 22 174 38 174 68 174 112 100 162 100 162Z"
        fill="url(#heart-fill)"
      />
    </svg>
  )
}

function Person({
  delay,
  image,
  imageAlt,
  title,
  name,
  degree,
  role,
  parents,
  lang,
  align,
}: {
  delay: number
  image: string
  imageAlt: string
  title: string
  name: string
  degree: string
  role: string
  parents: string
  lang: 'en' | 'ta'
  align: 'left' | 'right'
}) {
  return (
    <motion.article
      className={`flex flex-col ${align === 'right' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} items-center text-center`}
      initial={{ opacity: 0, y: 50, scale: 0.72, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay, duration: 1.35, type: 'spring', stiffness: 80, damping: 18 }}
    >
      <div className="relative mb-6 aspect-[3/4] w-full max-w-[280px] overflow-hidden">
        <motion.img
          src={image}
          alt={imageAlt}
          className="h-full w-full object-cover"
          initial={{ scale: 1.2, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.12, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-gold/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-maroon-deep/50 to-transparent" />
      </div>
      <p className={`text-xs tracking-[0.2em] text-maroon-soft ${lang === 'ta' ? 'font-tamil tracking-normal' : 'uppercase'}`}>
        {title}
      </p>
      <h3
        className={`mt-1 text-maroon ${
          lang === 'ta' ? 'font-tamil text-2xl font-semibold' : 'font-display text-4xl sm:text-5xl'
        }`}
      >
        {name}
      </h3>
      <p className="mt-1 font-serif text-sm text-gold-deep">{degree}</p>
      <p className={`mt-3 max-w-xs text-sm text-ink/70 ${lang === 'ta' ? 'font-tamil' : ''}`}>{role}</p>
      <p className={`mt-2 max-w-xs text-sm text-ink/55 ${lang === 'ta' ? 'font-tamil' : 'font-serif italic'}`}>
        {parents}
      </p>
    </motion.article>
  )
}
