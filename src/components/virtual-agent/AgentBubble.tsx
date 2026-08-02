import { AnimatePresence, motion } from 'framer-motion'
import { useAgentMode } from '../../hooks/useAgentMode'

interface AgentBubbleProps {
  message: string
}

export function AgentBubble({ message }: AgentBubbleProps) {
  const mode = useAgentMode()
  const animated = mode === 'animated'

  if (!animated) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="relative rounded-2xl border border-primary-100 bg-white/95 px-4 py-3 text-center text-[13px] font-semibold leading-6 text-secondary-800 shadow-lg backdrop-blur-sm"
      >
        <span
          className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-primary-100 bg-white"
          aria-hidden
        />
        <span className="relative z-10">{message}</span>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, scale: 0.86, y: -12, rotate: -2 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -4, 0],
          rotate: 0,
        }}
        exit={{ opacity: 0, scale: 0.94, y: -8 }}
        transition={{
          opacity: { duration: 0.28 },
          scale: { duration: 0.32 },
          rotate: { duration: 0.32 },
          y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative rounded-2xl border border-primary-100 bg-white/95 px-4 py-3 text-center text-[13px] font-semibold leading-6 text-secondary-800 shadow-lg backdrop-blur-sm"
        style={{ transformOrigin: 'center bottom' }}
      >
        <span
          className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-primary-100 bg-white"
          aria-hidden
        />
        <span className="relative z-10">{message}</span>
      </motion.div>
    </AnimatePresence>
  )
}
