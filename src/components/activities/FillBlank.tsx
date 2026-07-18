import { useState } from 'react'
import type { FillBlankItem } from '../../types'
import { VisualFeedback } from './VisualFeedback'

interface FillBlankProps {
  blanks: FillBlankItem[]
  onComplete: (score: number) => void
}

function normalize(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function FillBlank({ blanks, onComplete }: FillBlankProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle')

  const handleCheck = () => {
    let correctCount = 0
    blanks.forEach((blank) => {
      const value = normalize(answers[blank.id] ?? '')
      const accepted = [blank.answer, ...(blank.alternatives ?? [])].map(normalize)
      if (accepted.includes(value)) correctCount += 1
    })
    const score = Math.round((correctCount / blanks.length) * 100)
    const allCorrect = correctCount === blanks.length
    setStatus(allCorrect ? 'correct' : 'incorrect')
    if (allCorrect) onComplete(score)
  }

  return (
    <div className="space-y-4">
      {blanks.map((blank) => (
        <div key={blank.id} className="rounded-card border border-secondary-100 bg-white p-4">
          <p className="mb-3 leading-8 text-secondary-800">{blank.sentence}</p>
          <label className="block text-sm font-semibold text-secondary-700" htmlFor={`blank-${blank.id}`}>
            إجابتك
          </label>
          <input
            id={`blank-${blank.id}`}
            className="mt-1 w-full rounded-xl border border-secondary-100 px-3 py-2"
            value={answers[blank.id] ?? ''}
            onChange={(e) => {
              setAnswers((prev) => ({ ...prev, [blank.id]: e.target.value }))
              setStatus('idle')
            }}
          />
        </div>
      ))}
      <button type="button" className="btn-primary" onClick={handleCheck}>
        تحقق من الإجابات
      </button>
      <VisualFeedback status={status} />
    </div>
  )
}
