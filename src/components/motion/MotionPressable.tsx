import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { HTMLMotionProps } from 'framer-motion'
import { useUiMotion } from '../../motion/useUiMotion'

type MotionPressableProps = HTMLMotionProps<'div'> & {
  children: ReactNode
}

/**
 * Clickable surface: whileHover scale 1.03, whileTap 0.97 (~0.15s).
 * Frozen in static mode / prefers-reduced-motion (via useUiMotion).
 */
export function MotionPressable({ children, className, ...rest }: MotionPressableProps) {
  const motionUi = useUiMotion()

  return (
    <motion.div
      className={className}
      whileHover={motionUi.hover}
      whileTap={motionUi.tap}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
