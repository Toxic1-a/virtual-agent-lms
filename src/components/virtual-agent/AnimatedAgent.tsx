import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiveAgent } from './RiveAgent'
import { ANIMATED_AGENT_CHARACTER, type AgentMood } from './agentCharacters'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useLiteMotion } from '../../hooks/useLiteMotion'
import { moodLabelAr } from '../../lib/agentReactions'

interface AnimatedAgentProps {
  speaking?: boolean
  mood?: AgentMood
  thinking?: boolean
}

export function AnimatedAgent({
  speaking = false,
  mood = 'idle',
  thinking = false,
}: AnimatedAgentProps) {
  const [pointerEngaged, setPointerEngaged] = useState(false)
  const reduced = useReducedMotion()
  const lite = useLiteMotion()
  const celebrating = mood === 'celebrating' || mood === 'happy' || mood === 'greeting'
  const calmShell = reduced || lite

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className={`agent-avatar-shell relative w-full cursor-pointer overflow-hidden rounded-card border border-secondary-100 bg-gradient-to-b from-primary-50 to-white p-2 shadow-card transition-shadow hover:shadow-lg ${
          speaking ? 'agent-talking-glow' : ''
        } ${celebrating && !calmShell ? 'agent-celebrate-glow' : ''}`}
        onPointerEnter={() => setPointerEngaged(true)}
        onPointerLeave={() => setPointerEngaged(false)}
        onFocus={() => setPointerEngaged(true)}
        onBlur={() => setPointerEngaged(false)}
        tabIndex={0}
        aria-label="وكيل افتراضي متحرك وتفاعلي"
        initial={calmShell ? false : { opacity: 0, scale: 0.92, y: 12 }}
        animate={
          calmShell
            ? { opacity: 1, scale: 1, y: 0 }
            : {
                opacity: 1,
                scale: speaking ? [1, 1.02, 1] : celebrating ? [1, 1.035, 1] : 1,
                y: speaking || calmShell ? 0 : [0, -4, 0],
              }
        }
        transition={
          calmShell
            ? { duration: 0 }
            : speaking
              ? { scale: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 0 } }
              : {
                  opacity: { duration: 0.45 },
                  scale: celebrating
                    ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.45 },
                  y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
                }
        }
      >
        <RiveAgent
          character={ANIMATED_AGENT_CHARACTER}
          speaking={speaking}
          mood={mood}
          pointerEngaged={pointerEngaged}
        />

        <AnimatePresence>
          {thinking && !speaking ? (
            <motion.div
              key="thinking"
              role="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-primary-100 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-secondary-700 shadow-md"
            >
              <span className="agent-think-dot" />
              <span className="agent-think-dot" style={{ animationDelay: '0.15s' }} />
              <span className="agent-think-dot" style={{ animationDelay: '0.3s' }} />
              <span className="ms-1">يفكر…</span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <p className="text-xs font-semibold text-secondary-600">
        الوكيل الافتراضي (متحرك) · {moodLabelAr(mood)}
      </p>
    </div>
  )
}
