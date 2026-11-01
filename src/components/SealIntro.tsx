import { motion, AnimatePresence } from 'framer-motion'
import type { CSSProperties } from 'react'
import { photos } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'
import { Petals } from './Petals'

const heartRing: CSSProperties = {
  WebkitMask: `url("data:image/svg+xml,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 180' preserveAspectRatio='none'><path d='M100 162C100 162 26 112 26 68C26 38 50 22 74 40C88 52 100 70 100 70C100 70 112 52 126 40C150 22 174 38 174 68C174 112 100 162 100 162Z' fill='none' stroke='white' stroke-width='1.4'/></svg>",
  )}") center / 100% 100% no-repeat`,
  mask: `url("data:image/svg+xml,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 180' preserveAspectRatio='none'><path d='M100 162C100 162 26 112 26 68C26 38 50 22 74 40C88 52 100 70 100 70C100 70 112 52 126 40C150 22 174 38 174 68C174 112 100 162 100 162Z' fill='none' stroke='white' stroke-width='1.4'/></svg>",
  )}") center / 100% 100% no-repeat`,
}

type Props = {
  open: boolean
  onOpen: () => void
}

export function SealIntro({ open, onOpen }: Props) {
  const { t, lang } = useLanguage()

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2, delay: 0.45 } }}
        >
          <div className="absolute inset-0">
            <img
              src={photos.seal}
              alt=""
              className="h-full w-full object-cover object-[center_22%] scale-110"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#2c1634cc,#170f1ff2)]" />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 38%, rgba(232,106,138,0.28), transparent 52%)',
              }}
            />
          </div>

          <Petals density={22} active={!open} className="z-[1]" />

          {/* Card-unfold flaps */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-1/2 origin-left border-r border-gold/15"
            style={{
              transformStyle: 'preserve-3d',
              background: 'linear-gradient(90deg, #170f1f, #5a1530ee)',
            }}
            exit={{
              rotateY: -98,
              opacity: 0.25,
              transition: { duration: 1.25, ease: [0.65, 0, 0.35, 1] },
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-1/2 origin-right border-l border-gold/15"
            style={{
              transformStyle: 'preserve-3d',
              background: 'linear-gradient(270deg, #170f1f, #5a1530ee)',
            }}
            exit={{
              rotateY: 98,
              opacity: 0.25,
              transition: { duration: 1.25, ease: [0.65, 0, 0.35, 1] },
            }}
          />

          <div className="relative z-10 flex flex-col items-center px-6 text-center text-ivory">
            <motion.p
              className={`mb-5 max-w-sm text-gold-bright/95 ${lang === 'ta' ? 'font-tamil text-sm leading-relaxed' : 'font-serif text-base italic leading-relaxed sm:text-lg'}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t.openLine}
            </motion.p>

            <motion.button
              type="button"
              onClick={onOpen}
              className="group relative mb-8 flex h-36 w-36 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-rose"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.35 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              aria-label={t.openSeal}
            >
              <svg className="absolute h-0 w-0" aria-hidden>
                <clipPath id="seal-heart" clipPathUnits="objectBoundingBox">
                  <path d="M0.5 0.9C0.5 0.9 0.13 0.622 0.13 0.378C0.13 0.211 0.25 0.122 0.37 0.222C0.44 0.289 0.5 0.389 0.5 0.389C0.5 0.389 0.56 0.289 0.63 0.222C0.75 0.122 0.87 0.211 0.87 0.378C0.87 0.622 0.5 0.9 0.5 0.9Z" />
                </clipPath>
              </svg>
              <motion.span
                className="absolute inset-0 bg-rose/40"
                style={heartRing}
                animate={{ scale: [1, 1.14, 1], opacity: [0.75, 0.15, 0.75] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="absolute inset-3 bg-gold-bright/35" style={heartRing} />
              {/* Wax seal — rose glow language from birthday gift */}
              <motion.span
                className="absolute inset-5"
                style={{ filter: 'drop-shadow(0 0 60px color-mix(in srgb, var(--color-rose) 45%, transparent))' }}
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="absolute -inset-1.5 bg-[#6a0f2a]" style={{ clipPath: 'url(#seal-heart)' }} />
                <span className="absolute inset-0 wax-seal" style={{ clipPath: 'url(#seal-heart)', boxShadow: 'none' }} />
              </motion.span>
              <span className="relative z-10 font-serif text-3xl italic text-[#f8d6dd] drop-shadow-sm">
                R · C
              </span>
            </motion.button>

            <motion.h1
              className="font-serif text-4xl italic text-ivory sm:text-5xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="font-display text-5xl sm:text-6xl">Ranjith</span>
              <span className="mx-3 inline-block font-serif text-2xl italic text-gold">&</span>
              <span className="font-display text-5xl sm:text-6xl">Chandrika</span>
            </motion.h1>

            <motion.p
              className={`mt-4 max-w-xs text-sm text-ivory/70 ${lang === 'ta' ? 'font-tamil' : 'font-serif italic'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {t.tapToOpen}
            </motion.p>

            <motion.button
              type="button"
              onClick={onOpen}
              className="mt-8 border border-gold/45 px-8 py-3 text-xs tracking-[0.28em] uppercase text-gold-bright transition hover:bg-gold/15"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
            >
              {t.openSeal}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
