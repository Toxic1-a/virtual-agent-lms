import { motion } from 'framer-motion'
import { useUiMotion } from '../../motion/useUiMotion'

/** Soft floating shapes — only visible in animated agent mode. */
export function AmbientMotion() {
  const { animated } = useUiMotion()
  if (!animated) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <motion.span
        className="absolute -right-16 top-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute -left-20 bottom-32 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, -35, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute left-1/3 top-1/2 h-40 w-40 rounded-full bg-primary-100/40 blur-2xl"
        animate={{ x: [0, 60, -20, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-full bg-primary/30"
          style={{
            right: `${12 + i * 14}%`,
            top: `${18 + (i % 3) * 22}%`,
          }}
          animate={{
            y: [0, -18 - i * 4, 0],
            opacity: [0.25, 0.7, 0.25],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 3.5 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.35,
          }}
        />
      ))}
    </div>
  )
}
