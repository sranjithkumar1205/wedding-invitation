import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { photos } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'

export function Hero() {
  const { t, lang } = useLanguage()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.25])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden text-ivory"
    >
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img
          src={photos.hero}
          alt="Ranjith and Chandrika on their wedding stage"
          className="h-full w-full object-cover object-[center_18%]"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-plum via-wine/55 to-plum/30" />
      <div
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c4a35a\' fill-opacity=\'0.18\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-16 pt-32 text-center sm:pb-20"
        style={{ opacity }}
      >
        <motion.p
          className={`mb-5 max-w-md text-gold-bright/90 ${lang === 'ta' ? 'font-tamil text-sm leading-relaxed' : 'font-serif text-base italic leading-relaxed sm:text-lg'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
        >
          {t.openLine}
        </motion.p>

        <motion.p
          className={`mb-3 text-sm text-ivory/75 ${lang === 'ta' ? 'font-tamil' : 'font-serif italic tracking-wide'}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.8 }}
        >
          {t.weddingOf}
        </motion.p>

        <motion.h1
          className="w-full max-w-4xl px-2"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
        >
          <span
            className={`block text-balance leading-[1.05] text-ivory drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] ${
              lang === 'ta'
                ? 'font-tamil text-[clamp(2rem,8vw,3.75rem)] font-semibold'
                : 'font-display text-[clamp(3.25rem,12vw,6.5rem)]'
            }`}
          >
            {lang === 'ta' ? 'ரஞ்சித்' : 'Ranjith'}
          </span>
          <span className="my-2 block font-serif text-xl italic text-gold sm:my-3 sm:text-3xl">
            {t.weds}
          </span>
          <span
            className={`block text-balance leading-[1.05] text-ivory drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] ${
              lang === 'ta'
                ? 'font-tamil text-[clamp(2rem,8vw,3.75rem)] font-semibold'
                : 'font-display text-[clamp(3.25rem,12vw,6.5rem)]'
            }`}
          >
            {lang === 'ta' ? 'சந்திரிகா' : 'Chandrika'}
          </span>
          <span
            className={`mt-4 block text-sm text-ivory/65 sm:text-base ${
              lang === 'ta' ? 'font-tamil' : 'font-serif italic'
            }`}
          >
            {t.groomName} · {t.brideName}
          </span>
        </motion.h1>

        <motion.div
          className="ornament-line mt-8 text-gold"
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.65 }}
        >
          <span className="motif-dot" />
        </motion.div>

        <motion.p
          className={`mt-6 max-w-md text-sm leading-relaxed text-ivory/80 sm:text-base ${lang === 'ta' ? 'font-tamil' : 'font-serif italic'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {t.onDate.wedding} · {t.time.wedding}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-2 text-ivory/55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <span className={`text-[0.65rem] tracking-[0.3em] uppercase ${lang === 'ta' ? 'font-tamil tracking-wider normal-case text-xs' : ''}`}>
            {t.scrollInvite}
          </span>
          <motion.span
            className="block h-8 w-px bg-gradient-to-b from-gold to-transparent"
            animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
