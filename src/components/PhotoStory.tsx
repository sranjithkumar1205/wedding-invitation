import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion'
import { useRef } from 'react'
import { photos } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'

export function PhotoStory() {
  const { t, lang } = useLanguage()
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section className="ocean-wash relative overflow-hidden py-20 text-ivory sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 0%, rgba(232,213,183,0.25), transparent 45%)',
        }}
      />

      <div ref={headerRef} className="relative mx-auto mb-12 max-w-4xl px-6 text-center">
        <motion.h2
          className={`${lang === 'ta' ? 'font-tamil text-3xl font-semibold' : 'font-display text-5xl'}`}
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
        >
          {t.ourStory}
        </motion.h2>
        <p className={`mt-3 text-ivory/70 ${lang === 'ta' ? 'font-tamil text-sm' : 'font-serif italic'}`}>
          {t.ourStorySub}
        </p>
        <div className="ornament-line mt-5">
          <span className="motif-dot" />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl space-y-16 px-4 sm:space-y-28 sm:px-6">
        {photos.story.map((shot, i) => (
          <ParallaxShot
            key={shot.src}
            src={shot.src}
            caption={lang === 'ta' ? shot.captionTa : shot.captionEn}
            index={i}
            tamil={lang === 'ta'}
          />
        ))}
      </div>
    </section>
  )
}

function ParallaxShot({
  src,
  caption,
  index,
  tamil,
}: {
  src: string
  caption: string
  index: number
  tamil: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.35, 1, 1, 0.45])
  const fromLeft = index % 2 === 0

  return (
    <motion.figure
      ref={ref}
      className={`relative overflow-hidden ${
        fromLeft ? 'md:ml-0 md:mr-[12%]' : 'md:ml-[12%] md:mr-0'
      }`}
      style={{ opacity }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[21/9]">
        <motion.img
          src={src}
          alt={caption}
          className="absolute inset-0 h-[128%] w-full object-cover"
          style={{ y, top: '-14%' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean/80 via-transparent to-ocean/20" />
      </div>
      <figcaption
        className={`absolute bottom-0 ${fromLeft ? 'left-0' : 'right-0'} max-w-md p-5 sm:p-8 ${
          tamil ? 'font-tamil text-base' : 'font-display text-2xl sm:text-3xl'
        }`}
      >
        <span className="mb-2 block text-[0.65rem] tracking-[0.28em] text-sand/80 uppercase">
          {String(index + 1).padStart(2, '0')}
        </span>
        {caption}
      </figcaption>
    </motion.figure>
  )
}
