import { motion, AnimatePresence } from 'framer-motion'
import { photos } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'
import { Petals } from './Petals'

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
              <motion.span
                className="absolute inset-0 rounded-full border border-rose/40"
                animate={{ scale: [1, 1.14, 1], opacity: [0.75, 0.15, 0.75] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.span
                className="absolute inset-3 rounded-full border border-gold-bright/35"
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              />
              {/* Wax seal — rose glow language from birthday gift */}
              <motion.span
                className="absolute inset-5 rounded-full wax-seal"
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
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
