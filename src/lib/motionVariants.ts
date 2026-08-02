import type { Variants } from 'framer-motion'

/** Parent variants: stagger children by 0.1s. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

/** Child variants: fade + slide up (opacity/transform only). */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

/** Instant variants when motion should be skipped (reduced / static). */
export const staggerContainerStatic: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0, duration: 0 } },
}

export const staggerItemStatic: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
}
