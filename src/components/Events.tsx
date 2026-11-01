import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { events } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'

const accents = [
  'from-maroon/90 to-maroon-deep',
  'from-ocean to-[#0f3340]',
  'from-gold-deep to-maroon',
] as const

const cardPhotos = [
  'photos/web/04-hands-closeup.jpg',
  'photos/web/05-wave-splash.jpg',
  'photos/web/couple-stage.jpg',
]

export function Events({ onEnter }: { onEnter?: () => void }) {
  const { t, lang } = useLanguage()
  const ref = useRef<HTMLElement | null>(null)
  const [sectionNode, setSectionNode] = useState<HTMLElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const setSection = useCallback((node: HTMLElement | null) => {
    ref.current = node
    setSectionNode(node)
  }, [])

  useEffect(() => {
    const section = sectionNode
    if (!section || !onEnter) return

    let cancelled = false
    let played = false

    const imagesReady = Promise.all(
      cardPhotos.map(
        (path) =>
          new Promise<void>((resolve) => {
            const img = new Image()
            const finish = () => resolve()
            img.onload = finish
            img.onerror = finish
            img.src = `${import.meta.env.BASE_URL}${path}`
            if (img.complete) finish()
          }),
      ),
    )

    const pageIsShowing = () => {
      const rect = section.getBoundingClientRect()
      const viewport = window.innerHeight
      if (viewport <= 0) return false
      const visible = Math.min(rect.bottom, viewport) - Math.max(rect.top, 0)
      const wholeSectionOnScreen = rect.top >= -8 && rect.bottom <= viewport + 8
      return wholeSectionOnScreen || visible >= viewport * 0.9
    }

    const tryPlay = () => {
      if (cancelled || played || !pageIsShowing()) return
      played = true
      void imagesReady.then(() => {
        if (cancelled) return
        if (!pageIsShowing()) {
          played = false
          return
        }
        onEnter()
      })
    }

    const observer = new IntersectionObserver(tryPlay, {
      threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
    })
    observer.observe(section)
    window.addEventListener('scroll', tryPlay, { passive: true })
    window.addEventListener('resize', tryPlay)
    tryPlay()

    return () => {
      cancelled = true
      observer.disconnect()
      window.removeEventListener('scroll', tryPlay)
      window.removeEventListener('resize', tryPlay)
    }
  }, [onEnter, sectionNode])

  const copy = {
    pandakkal: { title: t.pandakkal, desc: t.pandakkalDesc, date: t.onDate.pandakkal, time: t.time.pandakkal },
    reception: { title: t.reception, desc: t.receptionDesc, date: t.onDate.reception, time: t.time.reception },
    wedding: { title: t.wedding, desc: t.weddingDesc, date: t.onDate.wedding, time: t.time.wedding },
  } as const

  return (
    <section ref={setSection} className="relative bg-ivory-warm py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <motion.h2
            className={`text-maroon ${lang === 'ta' ? 'font-tamil text-3xl font-semibold' : 'font-display text-5xl'}`}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            {t.eventsTitle}
          </motion.h2>
          <p className={`mt-3 text-ink/60 ${lang === 'ta' ? 'font-tamil text-sm' : 'font-serif italic'}`}>
            {t.eventsSub}
          </p>
          <div className="ornament-line mt-5">
            <span className="motif-dot" />
          </div>
        </div>

        <EventCoverflow inView={inView} lang={lang} copy={copy} note={t.programmeNote} />
      </div>
    </section>
  )
}

type EventCopy = { title: string; desc: string; date: string; time: string }

const TURN = 55
const SPREAD = 0.3
const DEPTH = 0.5
const CENTER = 0.8
const CARD_H = 380

/** Flat card in front, neighbours turned 55° and set back — the coverflow arrangement. */
function coverPose(delta: number, width: number) {
  const abs = Math.abs(delta)
  const sign = delta < 0 ? -1 : 1
  const along = abs <= 1 ? abs * CENTER * width : CENTER * width + (abs - 1) * SPREAD * width
  const face = Math.min(abs, 1)
  return {
    x: sign * along * (abs === 0 ? 0 : 1),
    z: -face * DEPTH * width,
    rotateY: (delta < 0 ? face : -face) * TURN,
    zIndex: Math.round(100 - abs * 10),
  }
}

function EventCoverflow({
  inView,
  lang,
  copy,
  note,
}: {
  inView: boolean
  lang: string
  copy: Record<(typeof events)[number]['id'], EventCopy>
  note: string
}) {
  const reduce = useReducedMotion()
  const focus = useMotionValue(1)
  const coast = useRef<ReturnType<typeof animate> | null>(null)
  const pointer = useRef<{ id: number; lastX: number; originX: number; originY: number; horizontal: boolean | null } | null>(null)
  const dragged = useRef(false)
  const [width, setWidth] = useState(260)

  useEffect(() => {
    const measure = () => setWidth(Math.round(Math.min(280, Math.max(220, window.innerWidth * 0.62))))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(events.length - 1, index))
    coast.current?.stop()
    coast.current = animate(focus, next, { type: 'spring', stiffness: 260, damping: 30 })
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    coast.current?.stop()
    dragged.current = false
    pointer.current = {
      id: event.pointerId,
      lastX: event.clientX,
      originX: event.clientX,
      originY: event.clientY,
      horizontal: null,
    }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = pointer.current
    if (!drag || drag.id !== event.pointerId) return
    const dx = event.clientX - drag.originX
    const dy = event.clientY - drag.originY
    if (drag.horizontal === null) {
      if (Math.hypot(dx, dy) < 8) return
      drag.horizontal = Math.abs(dx) > Math.abs(dy)
      if (!drag.horizontal) {
        pointer.current = null
        return
      }
      dragged.current = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    const delta = event.clientX - drag.lastX
    drag.lastX = event.clientX
    const step = CENTER * width
    const next = Math.max(0, Math.min(events.length - 1, focus.get() - delta / step))
    focus.set(next)
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = pointer.current
    pointer.current = null
    if (!drag || drag.id !== event.pointerId || !drag.horizontal) return
    goTo(Math.round(focus.get()))
  }

  if (reduce) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        {events.map((ev, i) => (
          <article key={ev.id} className="relative min-h-[280px] overflow-hidden text-ivory">
            <EventFace index={i} lang={lang} note={note} {...copy[ev.id]} />
          </article>
        ))}
      </div>
    )
  }

  return (
    <div
      className="relative cursor-grab select-none active:cursor-grabbing"
      style={{ height: CARD_H + 36, perspective: 1200, touchAction: 'pan-y' }}
      role="group"
      aria-label="Celebrations"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          goTo(Math.round(focus.get()) + 1)
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          goTo(Math.round(focus.get()) - 1)
        }
      }}
    >
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {events.map((ev, i) => (
          <CoverCard
            key={ev.id}
            index={i}
            focus={focus}
            width={width}
            inView={inView}
            onSelect={() => {
              if (dragged.current) return
              goTo(i)
            }}
          >
            <EventFace index={i} lang={lang} note={note} {...copy[ev.id]} />
          </CoverCard>
        ))}
      </div>
    </div>
  )
}

function CoverCard({
  index,
  focus,
  width,
  inView,
  onSelect,
  children,
}: {
  index: number
  focus: MotionValue<number>
  width: number
  inView: boolean
  onSelect: () => void
  children: ReactNode
}) {
  const pose = useTransform(focus, (value) => coverPose(index - value, width))
  const x = useTransform(pose, (p) => p.x)
  const z = useTransform(pose, (p) => p.z)
  const rotateY = useTransform(pose, (p) => p.rotateY)
  const zIndex = useTransform(pose, (p) => p.zIndex)
  const transform = useMotionTemplate`translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`

  return (
    <motion.article
      className="absolute top-1/2 left-1/2 overflow-hidden text-ivory shadow-[0_18px_40px_rgba(23,15,31,0.22)]"
      style={{
        width,
        height: CARD_H,
        marginLeft: -width / 2,
        marginTop: -CARD_H / 2,
        transform,
        zIndex,
      }}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay: 0.08 * index, duration: 0.55 }}
      onClick={onSelect}
    >
      {children}
    </motion.article>
  )
}

function EventFace({
  index,
  lang,
  title,
  desc,
  date,
  time,
  note,
}: EventCopy & { index: number; lang: string; note: string }) {
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${accents[index]}`} />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}${cardPhotos[index]})`,
          backgroundSize: 'cover',
          backgroundPosition: index === 2 ? 'center 20%' : 'center',
          mixBlendMode: 'overlay',
        }}
      />
      <div className="relative flex h-full flex-col justify-end p-7">
        <p className="mb-2 text-[0.65rem] tracking-[0.28em] text-gold-bright/90 uppercase">
          {String(index + 1).padStart(2, '0')}
        </p>
        <h3 className={`leading-tight ${lang === 'ta' ? 'font-tamil text-xl font-semibold' : 'font-display text-3xl'}`}>
          {title}
        </h3>
        <p className={`mt-2 text-sm text-ivory/75 ${lang === 'ta' ? 'font-tamil' : 'font-serif italic'}`}>{desc}</p>
        <div className="mt-6 space-y-1 border-t border-ivory/20 pt-4">
          <p className={`text-sm font-medium text-gold-bright ${lang === 'ta' ? 'font-tamil' : ''}`}>{date}</p>
          <p className={`text-sm text-ivory/85 ${lang === 'ta' ? 'font-tamil' : 'font-serif'}`}>{time}</p>
          {index === 2 && <p className={`pt-1 text-[0.7rem] text-ivory/50 ${lang === 'ta' ? 'font-tamil' : ''}`}>{note}</p>}
        </div>
      </div>
    </>
  )
}
