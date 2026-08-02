import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useUiMotion } from '../../motion/useUiMotion'

/** Animates route content only (opacity + x). Agent chrome stays outside. */
export function PageTransition() {
  const location = useLocation()
  const reduced = useReducedMotion()
  const { animated } = useUiMotion()
  const on = animated && !reduced

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={on ? { opacity: 0, x: 20 } : false}
        animate={{ opacity: 1, x: 0 }}
        exit={on ? { opacity: 0, x: -16 } : undefined}
        transition={{ duration: on ? 0.3 : 0, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}
