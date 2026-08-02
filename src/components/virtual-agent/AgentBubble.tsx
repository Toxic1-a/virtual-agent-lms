import { AnimatePresence, motion } from 'framer-motion'
import { useAgentMode } from '../../hooks/useAgentMode'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface AgentBubbleProps {
  message: string
  muted?: boolean
  thinking?: boolean
}

export function AgentBubble({ message, muted = false, thinking = false }: AgentBubbleProps) {
  const mode = useAgentMode()
  const reduced = useReducedMotion()
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
        key={muted ? `muted-${message}` : message}
        role="status"
        aria-live="polite"
        initial={reduced ? false : { opacity: 0, scale: 0.86, y: -12, rotate: -2 }}
        animate={
          reduced
            ? { opacity: muted ? 0.72 : 1, scale: 1, y: 0, rotate: 0 }
            : {
                opacity: muted ? 0.72 : 1,
                scale: 1,
                y: muted ? 0 : [0, -4, 0],
                rotate: 0,
              }
        }
        exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -8 }}
        transition={
          reduced
            ? { duration: 0.15 }
            : {
                opacity: { duration: 0.28 },
                scale: { duration: 0.32 },
                rotate: { duration: 0.32 },
                y: muted
                  ? { duration: 0.2 }
                  : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
              }
        }
        className={`relative rounded-2xl border px-4 py-3 text-center text-[13px] font-semibold leading-6 shadow-lg backdrop-blur-sm ${
          muted
            ? 'border-secondary-100 bg-secondary-50/95 text-secondary-600'
            : 'border-primary-100 bg-white/95 text-secondary-800'
        }`}
        style={{ transformOrigin: 'center bottom' }}
      >
        <span
          className={`absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r bg-inherit ${
            muted ? 'border-secondary-100' : 'border-primary-100'
          }`}
          aria-hidden
        />
        {thinking ? (
          <span className="relative z-10 flex items-center justify-center gap-1">
            <span className="agent-think-dot" />
            <span className="agent-think-dot" style={{ animationDelay: '0.15s' }} />
            <span className="agent-think-dot" style={{ animationDelay: '0.3s' }} />
          </span>
        ) : (
          <span className="relative z-10">
            {muted ? <span className="me-1 text-[11px] font-bold text-secondary-500">(صامت)</span> : null}
            {message}
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
