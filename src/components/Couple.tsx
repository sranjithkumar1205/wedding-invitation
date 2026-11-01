import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { photos } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'
import { ScrollWords } from './ScrollWords'

type Phase = 'rc' | 'weds' | 'blast' | 'assemble' | 'reveal'

const CONFETTI = 340
const COLORS = [
  '#d9a85b',
  '#ecd3b0',
  '#e86a8a',
  '#c93a5e',
  '#f8d6dd',
  '#5a1530',
  '#a67c35',
  '#f2dcc0',
  '#8a3a4e',
  '#f6e6cf',
]

export function Couple() {
  const { t, lang } = useLanguage()
  const reduceMotion = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [phase, setPhase] = useState<Phase>('rc')

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setPhase('reveal')
      return
    }
    const toWeds = window.setTimeout(() => setPhase('weds'), 1400)
    const toBlast = window.setTimeout(() => setPhase('blast'), 3000)
    const toAssemble = window.setTimeout(() => setPhase('assemble'), 3800)
    const toReveal = window.setTimeout(() => setPhase('reveal'), 8200)
    return () => {
      window.clearTimeout(toWeds)
      window.clearTimeout(toBlast)
      window.clearTimeout(toAssemble)
      window.clearTimeout(toReveal)
    }
  }, [inView, reduceMotion])

  const showStage = phase !== 'reveal'
  const showSection = phase === 'assemble' || phase === 'reveal'

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
          transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
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
                : 'relative flex min-h-[78svh] items-center justify-center px-6'
            }
            exit={{ opacity: 0, transition: { duration: 0.7 } }}
          >
            <IntroBall phase={phase} weds={t.weds} tamil={lang === 'ta'} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function IntroBall({
  phase,
  weds,
  tamil,
}: {
  phase: Phase
  weds: string
  tamil: boolean
}) {
  const pieces = useMemo(
    () =>
      Array.from({ length: CONFETTI }, (_, i) => {
        const angle = (i / CONFETTI) * Math.PI * 2 + ((i * 17) % 11) * 0.11
        const burst = 80 + (i % 17) * 34 + (i % 5) * 26
        const shape = i % 5 === 0 ? 'circle' : i % 5 === 1 ? 'strip' : i % 5 === 2 ? 'diamond' : 'rect'
        return {
          id: i,
          burstX: Math.cos(angle) * burst,
          burstY: Math.sin(angle) * burst * 0.82,
          landX: Math.cos(angle) * (40 + (i % 8) * 16) + ((i * 9) % 70) - 35,
          landY: 160 + (i % 13) * 28 + (i % 5) * 14,
          w: shape === 'strip' ? 4 + (i % 3) : 6 + (i % 7),
          h: shape === 'strip' ? 12 + (i % 8) : shape === 'circle' ? 6 + (i % 5) : 7 + (i % 6),
          color: COLORS[i % COLORS.length],
          rot: (i * 47) % 360,
          spin: 180 + (i % 8) * 90,
          delay: (i % 14) * 0.008,
          shape,
        }
      }),
    [],
  )

  const blasting = phase === 'blast' || phase === 'assemble'
  const bouncing = phase === 'rc' || phase === 'weds'
  const label = phase === 'rc' ? 'R · C' : weds

  return (
    <div className="relative flex h-full min-h-[78svh] w-full items-center justify-center overflow-hidden">
      {blasting && (
        <>
          <motion.span
            className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,236,210,0.95) 0%, rgba(232,106,138,0.45) 28%, transparent 70%)',
            }}
            initial={{ scale: 0.2, opacity: 0.95 }}
            animate={{ scale: 7.5, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 0.8, 0.3, 1] }}
          />
          <motion.span
            className="pointer-events-none absolute top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold-bright"
            initial={{ scale: 0.15, opacity: 0.9 }}
            animate={{ scale: 9, opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.12, 0.8, 0.28, 1] }}
          />
          <motion.span
            className="pointer-events-none absolute top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-soft"
            initial={{ scale: 0.2, opacity: 0.7 }}
            animate={{ scale: 6.2, opacity: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: 'easeOut' }}
          />
        </>
      )}

      <AnimatePresence>
        {bouncing && (
          <motion.div
            key="ball"
            className="relative flex h-40 w-40 items-center justify-center sm:h-44 sm:w-44"
            initial={{ scale: 0.4, opacity: 0, y: 40 }}
            animate={
              phase === 'rc'
                ? { scale: 1, opacity: 1, y: [0, -16, 0], scaleX: [1, 0.97, 1.03, 1], scaleY: [1, 1.05, 0.97, 1] }
                : {
                    scale: 1,
                    opacity: 1,
                    y: [0, -28, 0, -44, 0, -18, 0],
                    scaleX: [1, 0.92, 1.08, 0.88, 1.12, 0.96, 1],
                    scaleY: [1, 1.1, 0.9, 1.14, 0.86, 1.06, 1],
                  }
            }
            exit={{
              scale: [1, 1.35, 0],
              scaleX: [1, 1.45, 0.2],
              scaleY: [1, 0.55, 0.2],
              opacity: [1, 1, 0],
              transition: { duration: 0.28, times: [0, 0.35, 1], ease: 'easeIn' },
            }}
            transition={
              phase === 'rc'
                ? { y: { duration: 1.05, repeat: Infinity, ease: 'easeInOut' }, scaleX: { duration: 1.05, repeat: Infinity }, scaleY: { duration: 1.05, repeat: Infinity }, scale: { type: 'spring', stiffness: 180, damping: 12 }, opacity: { duration: 0.3 } }
                : { duration: 1.25, repeat: Infinity, ease: [0.36, 0.07, 0.19, 0.97] }
            }
          >
            <span className="absolute inset-0 rounded-full border border-rose/40" />
            <motion.span
              className="absolute inset-2 rounded-full border border-gold-bright/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
            <span className="absolute inset-4 rounded-full wax-seal" />
            <motion.span
              className="pointer-events-none absolute inset-6 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(232,106,138,0.35), transparent 70%)',
              }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.15, 0.55] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            />

            <AnimatePresence mode="wait">
              <motion.span
                key={label}
                className={`relative z-10 text-[#f8d6dd] drop-shadow-sm ${
                  tamil && phase !== 'rc'
                    ? 'font-tamil px-3 text-center text-lg font-semibold'
                    : 'font-serif italic ' +
                      (phase === 'rc' ? 'text-3xl sm:text-4xl' : 'font-display text-4xl not-italic sm:text-5xl')
                }`}
                initial={{ opacity: 0, scale: 0.7, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.15, filter: 'blur(6px)' }}
                transition={{ duration: 0.4 }}
              >
                {label}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {blasting &&
        pieces.map((p) => (
          <motion.span
            key={p.id}
            className="absolute top-1/2 left-1/2"
            style={{
              width: p.w,
              height: p.h,
              marginLeft: -p.w / 2,
              marginTop: -p.h / 2,
              background: p.color,
              borderRadius:
                p.shape === 'circle' ? 999 : p.shape === 'diamond' ? 2 : p.shape === 'strip' ? 1 : 2,
              transform: p.shape === 'diamond' ? 'rotate(45deg)' : undefined,
              boxShadow: '0 0 0 0.5px rgba(255,255,255,0.15)',
            }}
            initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
            animate={{
              x: [0, p.burstX, p.landX],
              y: [0, p.burstY, p.landY],
              scale: [0.4, 1.15, 0.35],
              opacity: [1, 1, 0],
              rotate: [0, p.rot, p.rot + p.spin],
            }}
            transition={{
              duration: 3.2,
              delay: p.delay,
              times: [0, 0.26, 1],
              ease: [0.16, 0.75, 0.25, 1],
            }}
          />
        ))}
    </div>
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
