import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { events } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'

const accents = [
  'from-maroon/90 to-maroon-deep',
  'from-ocean to-[#0f3340]',
  'from-gold-deep to-maroon',
] as const

export function Events() {
  const { t, lang } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const copy = {
    pandakkal: { title: t.pandakkal, desc: t.pandakkalDesc, date: t.onDate.pandakkal, time: t.time.pandakkal },
    reception: { title: t.reception, desc: t.receptionDesc, date: t.onDate.reception, time: t.time.reception },
    wedding: { title: t.wedding, desc: t.weddingDesc, date: t.onDate.wedding, time: t.time.wedding },
  } as const

  return (
    <section ref={ref} className="relative bg-ivory-warm py-20 sm:py-28">
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

        <div className="grid gap-6 lg:grid-cols-3">
          {events.map((ev, i) => {
            const c = copy[ev.id]
            return (
              <motion.article
                key={ev.id}
                className="group relative overflow-hidden text-ivory"
                initial={{ opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.12 * i, duration: 0.65 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${accents[i]}`} />
                <div
                  className="absolute inset-0 opacity-30 transition duration-700 group-hover:opacity-45"
                  style={{
                    backgroundImage:
                      i === 1
                        ? `url(${import.meta.env.BASE_URL}photos/web/05-wave-splash.jpg)`
                        : i === 2
                          ? `url(${import.meta.env.BASE_URL}photos/web/couple-stage.jpg)`
                          : `url(${import.meta.env.BASE_URL}photos/web/04-hands-closeup.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: i === 2 ? 'center 20%' : 'center',
                    mixBlendMode: 'overlay',
                  }}
                />
                <div className="relative flex min-h-[280px] flex-col justify-end p-7">
                  <p className="mb-2 text-[0.65rem] tracking-[0.28em] text-gold-bright/90 uppercase">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3
                    className={`leading-tight ${
                      lang === 'ta' ? 'font-tamil text-xl font-semibold' : 'font-display text-3xl'
                    }`}
                  >
                    {c.title}
                  </h3>
                  <p className={`mt-2 text-sm text-ivory/75 ${lang === 'ta' ? 'font-tamil' : 'font-serif italic'}`}>
                    {c.desc}
                  </p>
                  <div className="mt-6 space-y-1 border-t border-ivory/20 pt-4">
                    <p className={`text-sm font-medium text-gold-bright ${lang === 'ta' ? 'font-tamil' : ''}`}>
                      {c.date}
                    </p>
                    <p className={`text-sm text-ivory/85 ${lang === 'ta' ? 'font-tamil' : 'font-serif'}`}>
                      {c.time}
                    </p>
                    {ev.id === 'wedding' && (
                      <p className={`pt-1 text-[0.7rem] text-ivory/50 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                        {t.programmeNote}
                      </p>
                    )}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
