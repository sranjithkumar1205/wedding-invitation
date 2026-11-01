import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useCallback, useRef, useState, type CSSProperties } from 'react'
import { photos } from '../content/i18n'
import { useLanguage } from '../hooks/useLanguage'
import { FullScreenViewer } from './MobileGallery'

const shots = photos.story
const N = shots.length
const TILT = -16
const MAX_TILT = 28
const AUTO_DEG_PER_S = 11

type Tile = { x: number; y: number; z: number; yaw: number; lat: number }

/** Spread every story photo evenly on the globe, with the first facing forward. */
function sphereTiles(count: number): Tile[] {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const raw = Array.from({ length: count }, (_, i) => {
    const y = 1 - (2 * i + 1) / count
    const radius = Math.sqrt(1 - y * y)
    const theta = golden * i
    return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius }
  })
  const origin = raw[0]
  const axisLen = Math.hypot(origin.y, origin.x)
  const angle = Math.acos(Math.min(1, Math.max(-1, origin.z)))
  const turned =
    axisLen < 1e-6
      ? raw
      : raw.map((point) => {
          const ax = origin.y / axisLen
          const ay = -origin.x / axisLen
          const dot = ax * point.x + ay * point.y
          const crossX = ay * point.z
          const crossY = -ax * point.z
          const crossZ = ax * point.y - ay * point.x
          const sine = Math.sin(angle)
          const cosine = Math.cos(angle)
          return {
            x: point.x * cosine + crossX * sine + ax * dot * (1 - cosine),
            y: point.y * cosine + crossY * sine + ay * dot * (1 - cosine),
            z: point.z * cosine + crossZ * sine,
          }
        })
  return turned.map((point) => ({
    x: point.x,
    y: point.y,
    z: point.z,
    yaw: Math.atan2(point.x, point.z),
    lat: Math.asin(Math.min(1, Math.max(-1, point.y))),
  }))
}

const tiles = sphereTiles(N)

/** Start with the stage portrait (photo 0) facing the viewer. */
const START_RY = (Math.atan2(-tiles[0].x, tiles[0].z) * 180) / Math.PI

/** Camera-facing depth after the sphere's CSS rotateX/rotateY. 1 = dead centre. */
function depthOf(t: Tile, ryDeg: number, rxDeg: number) {
  const b = (ryDeg * Math.PI) / 180
  const a = (rxDeg * Math.PI) / 180
  const z1 = -t.x * Math.sin(b) + t.z * Math.cos(b)
  return -t.y * Math.sin(a) + z1 * Math.cos(a)
}

/** Phone gallery: a spinning 3D photo globe. Drag to spin, tap a photo for full screen. */
export function SphereGallery() {
  const { lang } = useLanguage()
  const tamil = lang === 'ta'
  const reduceMotion = useReducedMotion()

  const ry = useMotionValue(START_RY)
  const rx = useMotionValue(TILT)
  const sphereTransform = useMotionTemplate`rotateX(${rx}deg) rotateY(${ry}deg)`

  const [front, setFront] = useState(0)
  const [viewer, setViewer] = useState<number | null>(null)

  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { margin: '-60px' })
  const dragging = useRef(false)
  const dragged = useRef(false)
  const velY = useRef(0)
  const velX = useRef(0)
  const frontRef = useRef(0)

  useAnimationFrame((_, delta) => {
    const dt = Math.min(delta, 50) / 1000
    if (inView && viewer === null && !dragging.current) {
      const auto = reduceMotion ? 0 : AUTO_DEG_PER_S
      ry.set(ry.get() + (velY.current + auto) * dt)
      const nextX = rx.get() + velX.current * dt
      rx.set(Math.max(TILT - MAX_TILT, Math.min(TILT + MAX_TILT, nextX)))
      velY.current *= Math.exp(-dt * 2.4)
      velX.current *= Math.exp(-dt * 3.2)
    }
    const y = ry.get()
    const x = rx.get()
    let best = 0
    let bestZ = -Infinity
    for (let i = 0; i < N; i++) {
      const z = depthOf(tiles[i], y, x)
      if (z > bestZ) {
        bestZ = z
        best = i
      }
    }
    if (best !== frontRef.current) {
      frontRef.current = best
      setFront(best)
    }
  })

  const shot = shots[front]
  const caption = tamil ? shot.captionTa : shot.captionEn
  const open = useCallback((i: number) => {
    if (dragged.current) return
    setViewer(i)
  }, [])

  return (
    <div className="relative overflow-hidden">
      <motion.div
        ref={stageRef}
        className="relative mx-auto w-full max-w-md cursor-grab overflow-hidden select-none active:cursor-grabbing"
        style={
          {
            height: 'min(108vw, 440px)',
            perspective: 1100,
            touchAction: 'none',
            '--r': 'min(39vw, 158px)',
          } as CSSProperties
        }
        initial={{ opacity: 0, scale: 0.72, rotateX: 18 }}
        animate={inView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        onPanStart={() => {
          dragging.current = true
          dragged.current = false
          velY.current = 0
          velX.current = 0
        }}
        onPan={(_, info) => {
          if (Math.abs(info.offset.x) + Math.abs(info.offset.y) > 8) dragged.current = true
          ry.set(ry.get() + info.delta.x * 0.52)
          const nextX = rx.get() - info.delta.y * 0.28
          rx.set(Math.max(TILT - MAX_TILT, Math.min(TILT + MAX_TILT, nextX)))
        }}
        onPanEnd={(_, info) => {
          dragging.current = false
          velY.current = Math.max(-480, Math.min(480, info.velocity.x * 0.48))
          velX.current = Math.max(-240, Math.min(240, -info.velocity.y * 0.22))
        }}
      >
        {/* atmosphere */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 46%, rgba(232,213,183,0.32), rgba(26,74,92,0.0) 58%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-[12%] rounded-full opacity-40"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, transparent 52%, rgba(0,0,0,0.35) 100%)',
          }}
        />

        <motion.div
          className="absolute inset-0"
          style={{ transform: sphereTransform, transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {/* equator + two meridians, spinning with the globe */}
          <span
            className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border border-sand/25"
            style={{
              width: 'calc(var(--r) * 2)',
              height: 'calc(var(--r) * 2)',
              margin: 'calc(var(--r) * -1)',
              transform: 'rotateX(90deg)',
              boxShadow: '0 0 24px rgba(232,213,183,0.18)',
            }}
          />
          <span
            className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border border-sand/10"
            style={{
              width: 'calc(var(--r) * 2)',
              height: 'calc(var(--r) * 2)',
              margin: 'calc(var(--r) * -1)',
              transform: 'rotateY(90deg)',
            }}
          />
          <span
            className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border border-gold/20"
            style={{
              width: 'calc(var(--r) * 2)',
              height: 'calc(var(--r) * 2)',
              margin: 'calc(var(--r) * -1)',
            }}
          />

          {tiles.map((tile, i) => (
            <SphereTile
              key={shots[i].src}
              tile={tile}
              src={shots[i].thumb}
              label={tamil ? shots[i].captionTa : shots[i].captionEn}
              ry={ry}
              rx={rx}
              isFront={i === front}
              onOpen={() => open(i)}
            />
          ))}
        </motion.div>
      </motion.div>

      <div className="mx-auto -mt-1 flex max-w-md flex-col items-center px-6 text-center">
        <span className="mb-2 text-[0.65rem] tracking-[0.28em] text-sand/70 tabular-nums">
          {String(front + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
        </span>
        <div className="flex h-14 items-start justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={front}
              className={`text-ivory ${tamil ? 'font-tamil text-base' : 'font-display text-2xl'}`}
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
              transition={{ duration: 0.3 }}
            >
              {caption}
            </motion.p>
          </AnimatePresence>
        </div>
        <p className="text-[0.65rem] tracking-[0.28em] text-sand/70 uppercase">
          {tamil ? 'சுழற்றுங்கள் · தொட்டுப் பாருங்கள்' : 'Drag to spin · tap a photo'}
        </p>
      </div>

      <FullScreenViewer
        index={viewer}
        tamil={tamil}
        onChange={setViewer}
        onClose={() => setViewer(null)}
      />
    </div>
  )
}

function SphereTile({
  tile,
  src,
  label,
  ry,
  rx,
  isFront,
  onOpen,
}: {
  tile: Tile
  src: string
  label: string
  ry: MotionValue<number>
  rx: MotionValue<number>
  isFront: boolean
  onOpen: () => void
}) {
  const depth = useTransform([ry, rx], ([y, x]) => depthOf(tile, y as number, x as number))
  const opacity = useTransform(depth, [-0.55, 0.05, 1], [0.28, 0.82, 1])
  const filter = useTransform(
    depth,
    [-0.5, 0.15, 1],
    ['blur(3.5px) brightness(0.5)', 'blur(0.8px) brightness(0.82)', 'blur(0px) brightness(1.06)'],
  )
  const zIndex = useTransform(depth, (d) => Math.round(d * 120))
  const pointerEvents = useTransform(depth, (d) => (d > 0.05 ? 'auto' : 'none'))

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label}
      className="absolute inset-0 m-auto p-0 outline-none"
      style={{
        width: 'calc(var(--r) * 0.78)',
        height: 'calc(var(--r) * 1.0)',
        transform: `rotateY(${tile.yaw}rad) rotateX(${-tile.lat}rad) translateZ(var(--r))`,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {/* Inner layer carries opacity/blur so Motion cannot overwrite the 3D placement transform. */}
      <motion.span
        className="block h-full w-full overflow-hidden rounded-[6px] bg-ocean/70 p-[3px]"
        style={{
          opacity,
          filter,
          zIndex,
          pointerEvents,
          boxShadow: isFront
            ? '0 0 0 1.5px rgba(232,213,183,0.95), 0 14px 32px -8px rgba(0,0,0,0.7)'
            : '0 0 0 1px rgba(232,213,183,0.3), 0 8px 18px -8px rgba(0,0,0,0.55)',
        }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          decoding="async"
          className="pointer-events-none h-full w-full rounded-[4px] object-cover"
        />
      </motion.span>
    </button>
  )
}
