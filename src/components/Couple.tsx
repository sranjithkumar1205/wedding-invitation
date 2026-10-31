import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { photos } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'

export function Couple() {
  const { t, lang } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="kolam-bg relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
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
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.9 }}
          >
            “{t.quote}”
          </motion.p>
        </blockquote>

        <div className="grid items-stretch gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          <Person
            inView={inView}
            delay={0.1}
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.35 }}
          >
            <span className="font-display text-4xl text-gold-deep">{t.weds}</span>
            <span className="mt-3 h-24 w-px bg-gradient-to-b from-gold to-transparent" />
          </motion.div>

          <div className="flex justify-center md:hidden">
            <span className="font-display text-3xl text-gold-deep">{t.weds}</span>
          </div>

          <Person
            inView={inView}
            delay={0.25}
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
      </div>
    </section>
  )
}

function Person({
  inView,
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
  inView: boolean
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
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7 }}
    >
      <div className="relative mb-6 aspect-[3/4] w-full max-w-[280px] overflow-hidden">
        <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
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
