import { motion } from 'framer-motion'
import { useUiMotion } from '../../motion/useUiMotion'

const PARTICLES = Array.from({ length: 18 }, (_, i) => i)

/** Bold floating orbs + particles — animated mode only. */
export function AmbientMotion() {
  const { animated } = useUiMotion()
  if (!animated) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <motion.span
        className="absolute -right-10 top-10 h-80 w-80 rounded-full bg-primary/30 blur-3xl"
        animate={{ x: [0, -70, 20, 0], y: [0, 50, -20, 0], scale: [1, 1.35, 0.95, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute -left-14 bottom-16 h-96 w-96 rounded-full bg-accent/28 blur-3xl"
        animate={{ x: [0, 80, -30, 0], y: [0, -55, 25, 0], scale: [1, 1.4, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute left-1/4 top-1/3 h-56 w-56 rounded-full bg-sky-300/35 blur-2xl"
        animate={{ x: [0, 90, -40, 0], y: [0, -60, 30, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-teal-300/30 blur-2xl"
        animate={{ x: [0, -50, 40, 0], y: [0, 40, -30, 0], rotate: [0, 20, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      {PARTICLES.map((i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full ${
            i % 3 === 0 ? 'h-3 w-3 bg-primary/55' : i % 3 === 1 ? 'h-2.5 w-2.5 bg-accent/60' : 'h-2 w-2 bg-sky-400/50'
          }`}
          style={{
            right: `${4 + (i * 5.2) % 90}%`,
            top: `${8 + (i * 7.3) % 82}%`,
          }}
          animate={{
            y: [0, -36 - (i % 5) * 8, 0],
            x: [0, (i % 2 === 0 ? 18 : -18), 0],
            opacity: [0.2, 0.95, 0.2],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 2.2 + (i % 4) * 0.35,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
        />
      ))}
    </div>
  )
}
