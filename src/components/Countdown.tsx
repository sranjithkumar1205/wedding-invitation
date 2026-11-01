import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { muhurthamISO } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now())
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)
  return { days, hours, minutes, seconds, done: diff <= 0 }
}

export function Countdown() {
  const { t, lang } = useLanguage()
  const target = useMemo(() => new Date(muhurthamISO).getTime(), [])
  const [parts, setParts] = useState(() => getRemaining(target))
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  useEffect(() => {
    const id = window.setInterval(() => setParts(getRemaining(target)), 1000)
    return () => window.clearInterval(id)
  }, [target])

  const cells = [
    { label: t.days, value: parts.days },
    { label: t.hours, value: parts.hours },
    { label: t.minutes, value: parts.minutes },
    { label: t.seconds, value: parts.seconds },
  ]

  return (
    <section ref={ref} className="ceremony-bg relative overflow-hidden py-20 text-ivory sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 20%, #c4a35a 0, transparent 28%), radial-gradient(circle at 90% 80%, #c4a35a 0, transparent 25%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.p
          className={`mb-3 text-gold-bright ${lang === 'ta' ? 'font-tamil text-base' : 'font-display text-3xl'}`}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.countdownTitle}
        </motion.p>
        <div className="ornament-line mb-10">
          <span className="motif-dot" />
        </div>

        {parts.done ? (
          <p className={`text-2xl text-gold-bright ${lang === 'ta' ? 'font-tamil' : 'font-display'}`}>
            {t.celebrating}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {cells.map((cell, i) => (
              <motion.div
                key={cell.label}
                className="relative overflow-hidden rounded-sm border border-gold/25 bg-maroon-deep/40 px-3 py-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.18 + 0.12 * i, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Rolling digits: the old number slides up and out, the new one rolls in */}
                <span className="relative block h-[1.25em] overflow-hidden font-serif text-4xl leading-[1.25] font-semibold tabular-nums text-gold-bright sm:text-5xl">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={cell.value}
                      className="block"
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {String(cell.value).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span
                  className={`mt-2 block text-[0.65rem] tracking-[0.22em] text-ivory/65 ${lang === 'ta' ? 'font-tamil tracking-wide normal-case text-xs' : 'uppercase'}`}
                >
                  {cell.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
