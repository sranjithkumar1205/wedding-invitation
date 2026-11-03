import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { venue } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'
import { addWeddingToCalendar, whatsappShareUrl } from '../lib/calendar'

export function Venue() {
  const { t, lang } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const shareText =
    lang === 'ta'
      ? `ரஞ்சித் குமார் & சந்திரிகா தேவி திருமண அழைப்பு · 15 நவம்பர் 2026 · ${venue.name}, சென்னை. ${venue.mapsLink}`
      : `You're invited — Ranjith Kumar weds Chandrika Devi · 15 Nov 2026 · ${venue.name}, Chennai. ${venue.mapsLink}`

  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory-warm py-20 sm:py-28">
      <motion.div
        className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-rose/10 blur-3xl"
        animate={{ x: [0, 24, 0], y: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -right-16 bottom-8 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
        animate={{ x: [0, -18, 0], y: [0, -14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <motion.p
            className={`mb-3 text-maroon-soft ${lang === 'ta' ? 'font-tamil text-sm' : 'font-serif italic text-base'}`}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            {t.venueSub}
          </motion.p>
          <motion.h2
            className={`text-maroon ${lang === 'ta' ? 'font-tamil text-3xl font-semibold' : 'font-display text-5xl sm:text-6xl'}`}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.05 }}
          >
            {t.venueTitle}
          </motion.h2>
          <motion.div
            className="ornament-line mt-5"
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={inView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span className="motif-dot" />
          </motion.div>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <motion.div
            className="relative flex flex-col justify-center border border-gold/25 bg-gradient-to-br from-ivory via-ivory-warm to-[#f6e6cf] px-7 py-9 sm:px-9 sm:py-11"
            initial={{ opacity: 0, x: -36, rotate: -0.6 }}
            animate={inView ? { opacity: 1, x: 0, rotate: 0 } : {}}
            transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.12 }}
          >
            <motion.span
              className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gold via-rose to-maroon"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.35 }}
              style={{ originY: 0 }}
            />

            <motion.p
              className={`text-[0.65rem] tracking-[0.28em] text-gold-deep ${lang === 'ta' ? 'font-tamil tracking-wide normal-case text-xs' : 'uppercase'}`}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.25 }}
            >
              {t.chennaiLabel}
            </motion.p>

            <motion.h3
              className={`mt-3 leading-tight text-maroon ${
                lang === 'ta' ? 'font-tamil text-2xl font-semibold sm:text-3xl' : 'font-serif text-3xl sm:text-4xl'
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.55 }}
            >
              {venue.name}
            </motion.h3>

            <motion.p
              className={`mt-5 max-w-md leading-relaxed text-ink/70 ${
                lang === 'ta' ? 'font-tamil text-sm sm:text-base' : 'font-serif text-lg'
              }`}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.55 }}
            >
              {venue.address}
            </motion.p>

            <motion.div
              className="mt-7 grid gap-y-5"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              {venue.contacts.map((group) => (
                <div key={group.role}>
                  <p
                    className={`mb-2 text-gold-deep ${
                      lang === 'ta'
                        ? 'font-tamil text-sm'
                        : 'text-[0.68rem] tracking-[0.18em] uppercase'
                    }`}
                  >
                    {t.contactRoles[group.role]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        aria-label={`${t.callUs} ${t.contactRoles[group.role]} ${phone}`}
                        className="border border-maroon/20 bg-ivory/80 px-3 py-1.5 text-sm text-maroon shadow-sm transition hover:border-maroon hover:bg-maroon hover:text-ivory"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.58 }}
            >
              <motion.a
                href={venue.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="bg-maroon px-5 py-3 text-sm tracking-wide text-ivory shadow-[0_10px_30px_rgba(90,21,48,0.25)] transition hover:bg-maroon-deep"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {t.getDirections}
              </motion.a>
              <motion.button
                type="button"
                onClick={() => addWeddingToCalendar(lang)}
                className="border border-gold-deep/40 bg-transparent px-5 py-3 text-sm text-maroon transition hover:border-gold-deep hover:bg-gold/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t.saveCalendar}
              </motion.button>
              <motion.a
                href={whatsappShareUrl(shareText)}
                target="_blank"
                rel="noreferrer"
                className="border border-ocean/30 px-5 py-3 text-sm text-ocean transition hover:bg-ocean hover:text-ivory"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t.shareWhatsApp}
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            className="map-frame group relative min-h-[340px] overflow-hidden border border-gold/30 bg-plum/5 shadow-[0_24px_70px_rgba(23,15,31,0.14)] lg:min-h-[440px]"
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 85, damping: 16, delay: 0.22 }}
          >
            <motion.div
              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-plum/25 via-transparent to-transparent"
              animate={{ opacity: [0.55, 0.35, 0.55] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-4"
              initial={{ opacity: 0, y: -8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55 }}
            >
              <span className="border border-gold/35 bg-plum/75 px-4 py-1.5 text-[0.65rem] tracking-[0.22em] text-gold-bright uppercase backdrop-blur-md">
                {venue.name}
              </span>
            </motion.div>
            <iframe
              title="Praneetha Palace map"
              src={venue.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="transition duration-700 group-hover:scale-[1.02]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
