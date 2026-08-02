import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAgentCue } from '../../context/AgentCueContext'
import { useAgentMode } from '../../hooks/useAgentMode'

interface VisualFeedbackProps {
  status: 'idle' | 'correct' | 'incorrect'
  message?: string
}

export function VisualFeedback({ status, message }: VisualFeedbackProps) {
  const mode = useAgentMode()
  const { react } = useAgentCue()
  const lastStatus = useRef(status)

  useEffect(() => {
    if (mode !== 'animated') return
    if (status === lastStatus.current) return
    lastStatus.current = status
    if (status === 'correct') react('correct')
    if (status === 'incorrect') react('incorrect')
  }, [mode, react, status])

  if (status === 'idle') return null

  const isCorrect = status === 'correct'

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1, x: isCorrect ? 0 : [0, -6, 6, -4, 4, 0] }}
      className={`rounded-card px-4 py-3 text-sm font-semibold ${
        isCorrect
          ? 'visual-feedback-correct text-accent-700'
          : 'visual-feedback-incorrect text-red-700'
      }`}
    >
      <span className="me-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-base" aria-hidden>
        {isCorrect ? '✓' : '!'}
      </span>
      {message ?? (isCorrect ? 'إجابة صحيحة' : 'حاول مرة أخرى')}
    </motion.div>
  )
}
