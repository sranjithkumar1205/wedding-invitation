import { motion } from 'framer-motion'
import { useLanguage } from '../hooks/useLanguage'

type Props = {
  muted: boolean
  onToggleMusic: () => void
  visible: boolean
}

export function FloatingControls({ muted, onToggleMusic, visible }: Props) {
  const { t, toggle, lang } = useLanguage()

  if (!visible) return null

  return (
    <motion.div
      className="fixed bottom-5 right-4 z-50 flex flex-col gap-2 sm:bottom-8 sm:right-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <button
        type="button"
        onClick={toggle}
        data-lang-toggle
        className="min-h-10 min-w-[4.5rem] rounded-full border border-gold/40 bg-maroon-deep/90 px-4 py-2.5 text-xs font-medium tracking-wide text-ivory shadow-lg backdrop-blur-md transition hover:border-gold"
        aria-label={lang === 'en' ? 'Switch to Tamil' : 'Switch to English'}
      >
        {lang === 'en' ? 'தமிழ்' : 'EN'}
      </button>
      <button
        type="button"
        onClick={onToggleMusic}
        className="rounded-full border border-gold/40 bg-maroon-deep/90 px-4 py-2 text-xs font-medium tracking-wide text-ivory shadow-lg backdrop-blur-md transition hover:border-gold"
        aria-label={muted ? t.unmute : t.mute}
      >
        {muted ? '♪ ' + (lang === 'en' ? 'Music' : 'இசை') : '🔇 ' + t.mute}
      </button>
    </motion.div>
  )
}
