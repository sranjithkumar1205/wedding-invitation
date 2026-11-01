import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion'
import { useRef } from 'react'
import { photos } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'
import { MobileGallery } from './MobileGallery'
import { PolaroidStack } from './PolaroidStack'
import { SphereGallery } from './SphereGallery'

const galleryStyle = new URLSearchParams(window.location.search).get('gallery')

export function PhotoStory() {
  const { t, lang } = useLanguage()
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section className="ocean-wash relative overflow-hidden py-14 text-ivory sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 0%, rgba(232,213,183,0.25), transparent 45%)',
        }}
      />

      <div ref={headerRef} className="relative mx-auto mb-8 max-w-4xl sm:mb-12 px-6 text-center">
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

      {/* Phones: compact animated gallery (no long scroll) */}
      <div className="sm:hidden">
        {/* Default is the 3D photo globe. Compare with ?gallery=polaroid or ?gallery=coverflow */}
        {galleryStyle === 'coverflow' ? (
          <MobileGallery />
        ) : galleryStyle === 'polaroid' ? (
          <PolaroidStack />
        ) : (
          <SphereGallery />
        )}
      </div>

      {/* Tablet / desktop: scroll-driven curtain reveal */}
      <div className="relative mx-auto hidden max-w-6xl space-y-28 px-6 sm:block">
        {photos.story.map((shot, i) => (
          <RevealShot
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

/**
 * Scroll Image Reveal: the photo opens like a curtain from the centre as it scrolls
 * into view (clip-path), while the image drifts inside the frame (parallax) and the
 * caption rises in once the frame is mostly open.
 */
function RevealShot({
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

  // Curtain: 50% clipped from each side -> fully open by ~40% of the pass.
  const inset = useTransform(scrollYProgress, [0.02, 0.4], [50, 0])
  const clipPath = useMotionTemplate`inset(0% ${inset}% 0% ${inset}%)`
  // Parallax + a gentle zoom-out as the curtain opens.
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const scale = useTransform(scrollYProgress, [0.02, 0.4], [1.25, 1])
  // Caption appears after the curtain is open, and softly leaves at the end.
  const captionOpacity = useTransform(scrollYProgress, [0.3, 0.45, 0.85, 1], [0, 1, 1, 0.3])
  const captionY = useTransform(scrollYProgress, [0.3, 0.45], [18, 0])
  const fromLeft = index % 2 === 0

  return (
    <figure
      ref={ref}
      className={`relative ${fromLeft ? 'md:ml-0 md:mr-[12%]' : 'md:ml-[12%] md:mr-0'}`}
    >
      <motion.div
        className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[21/9]"
        style={{ clipPath }}
      >
        <motion.img
          src={src}
          alt={caption}
          className="absolute inset-0 h-[128%] w-full object-cover"
          style={{ y, scale, top: '-14%' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean/80 via-transparent to-ocean/20" />
      </motion.div>
      <motion.figcaption
        className={`absolute bottom-0 ${fromLeft ? 'left-0' : 'right-0'} max-w-md p-5 sm:p-8 ${
          tamil ? 'font-tamil text-base' : 'font-display text-2xl sm:text-3xl'
        }`}
        style={{ opacity: captionOpacity, y: captionY }}
      >
        <span className="mb-2 block text-[0.65rem] tracking-[0.28em] text-sand/80 uppercase">
          {String(index + 1).padStart(2, '0')}
        </span>
        {caption}
      </motion.figcaption>
    </figure>
  )
}
