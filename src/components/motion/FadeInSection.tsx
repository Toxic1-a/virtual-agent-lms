import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useUiMotion } from '../../motion/useUiMotion'

interface FadeInSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

/** Fades and slides content up when it enters the viewport. Skips when reduced-motion or static mode. */
export function FadeInSection({ children, delay = 0, className }: FadeInSectionProps) {
  const reduced = useReducedMotion()
  const { animated } = useUiMotion()

  if (reduced || !animated) {
    return className ? <div className={className}>{children}</div> : <>{children}</>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
