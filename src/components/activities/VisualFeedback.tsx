import { motion } from 'framer-motion'

interface VisualFeedbackProps {
  status: 'idle' | 'correct' | 'incorrect'
  message?: string
}

export function VisualFeedback({ status, message }: VisualFeedbackProps) {
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
