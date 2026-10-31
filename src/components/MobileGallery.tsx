import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { photos } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'

const shots = photos.story

/** Compact thumbnail grid + swipeable full-screen viewer, meant for phones. */
export function MobileGallery() {
  const { lang } = useLanguage()
  const tamil = lang === 'ta'
  const [active, setActive] = useState<number | null>(null)

  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (dir: 1 | -1) =>
      setActive((i) => (i === null ? i : (i + dir + shots.length) % shots.length)),
    [],
  )

  // Lock page scroll + keyboard controls while the viewer is open.
  useEffect(() => {
    if (active === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [active, close, step])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) step(1)
    else if (info.offset.x > 60) step(-1)
  }

  const current = active === null ? null : shots[active]

  return (
    <>
      <div className="relative mx-auto grid max-w-md grid-cols-3 gap-1.5 px-3">
        {shots.map((shot, i) => {
          const caption = tamil ? shot.captionTa : shot.captionEn
          return (
            <motion.button
              key={shot.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={caption}
              className="relative aspect-square overflow-hidden rounded-sm bg-ocean/40 ring-1 ring-sand/20 active:scale-95"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
            >
              <img
                src={shot.thumb}
                alt={caption}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {current && active !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-black/95"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between px-4 pt-4 text-sm text-ivory/80">
              <span className="tracking-[0.2em] tabular-nums">
                {String(active + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl leading-none text-ivory"
              >
                ×
              </button>
            </div>

            <motion.div
              key={active}
              className="relative flex flex-1 items-center justify-center px-2"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={onDragEnd}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <img
                src={current.src}
                alt={tamil ? current.captionTa : current.captionEn}
                draggable={false}
                className="max-h-full max-w-full select-none object-contain"
              />
            </motion.div>

            <div className="px-6 pb-6 text-center text-ivory">
              <p className={tamil ? 'font-tamil text-base' : 'font-display text-2xl'}>
                {tamil ? current.captionTa : current.captionEn}
              </p>
              <div className="mt-4 flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none"
                >
                  ›
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
