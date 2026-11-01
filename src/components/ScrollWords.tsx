import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'

/**
 * Scroll word reveal: each word brightens in turn as the paragraph scrolls
 * through the middle of the screen. Built from useScroll + useTransform.
 */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.5'],
  })
  const words = text.split(' ')

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {word}
        </Word>
      ))}
    </p>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <>
      <motion.span aria-hidden style={{ opacity }}>
        {children}
      </motion.span>{' '}
    </>
  )
}
