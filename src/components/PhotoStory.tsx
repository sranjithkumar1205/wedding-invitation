import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
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
          className={`mx-auto max-w-full text-balance ${lang === 'ta' ? 'font-tamil text-3xl font-semibold' : 'font-display text-[clamp(2.4rem,11vw,3rem)] leading-none'}`}
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

      {/* Same spinning globe on phones and desktop. Compare with ?gallery=polaroid or ?gallery=coverflow */}
      <div>
        {galleryStyle === 'coverflow' ? (
          <MobileGallery />
        ) : galleryStyle === 'polaroid' ? (
          <PolaroidStack />
        ) : (
          <SphereGallery />
        )}
      </div>
    </section>
  )
}
