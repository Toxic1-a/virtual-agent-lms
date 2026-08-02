import { useState } from 'react'
import type { McqOption } from '../../types'
import { VisualFeedback } from './VisualFeedback'

interface MCQProps {
  options: McqOption[]
  onComplete: (score: number) => void
}

export function MCQ({ options, onComplete }: MCQProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle')

  const handleSubmit = () => {
    const option = options.find((item) => item.id === selected)
    if (!option) return
    if (option.correct) {
      setStatus('correct')
      onComplete(100)
    } else {
      setStatus('incorrect')
    }
  }

  return (
    <div className="space-y-3">
      <fieldset className="space-y-2">
        <legend className="sr-only">اختر إجابة</legend>
        {options.map((option) => (
          <label
            key={option.id}
            className={`interactive-surface flex cursor-pointer items-start gap-3 rounded-card border p-4 transition ${
              selected === option.id
                ? 'border-primary bg-primary-50'
                : 'border-secondary-100 bg-white hover:border-primary/30'
            }`}
          >
            <input
              type="radio"
              name="mcq"
              value={option.id}
              checked={selected === option.id}
              onChange={() => {
                setSelected(option.id)
                setStatus('idle')
              }}
              className="mt-1"
            />
            <span>{option.text}</span>
          </label>
        ))}
      </fieldset>
      <button type="button" className="btn-primary" disabled={!selected} onClick={handleSubmit}>
        تأكيد الإجابة
      </button>
      <VisualFeedback status={status} />
    </div>
  )
}
