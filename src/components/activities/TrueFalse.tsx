import { useState } from 'react'
import { VisualFeedback } from './VisualFeedback'

interface TrueFalseProps {
  statement: string
  correct: boolean
  onComplete: (score: number) => void
}

export function TrueFalse({ statement, correct, onComplete }: TrueFalseProps) {
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle')

  const answer = (value: boolean) => {
    if (value === correct) {
      setStatus('correct')
      onComplete(100)
    } else {
      setStatus('incorrect')
    }
  }

  return (
    <div className="space-y-4">
      <p className="interactive-surface rounded-card border border-secondary-100 bg-white p-5 text-lg font-semibold leading-8 text-secondary-900">
        {statement}
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={() => answer(true)}>
          صحيحة
        </button>
        <button type="button" className="btn-secondary" onClick={() => answer(false)}>
          خاطئة
        </button>
      </div>
      <VisualFeedback status={status} />
    </div>
  )
}
