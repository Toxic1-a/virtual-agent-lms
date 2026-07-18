import { useMemo, useState } from 'react'
import type { MatchingPair } from '../../types'
import { VisualFeedback } from './VisualFeedback'

interface MatchingProps {
  pairs: MatchingPair[]
  onComplete: (score: number) => void
}

export function Matching({ pairs, onComplete }: MatchingProps) {
  const rights = useMemo(
    () => [...pairs.map((p) => p.right)].sort(() => Math.random() - 0.5),
    [pairs],
  )
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle')

  const handleCheck = () => {
    const correctCount = pairs.filter((pair) => answers[pair.id] === pair.right).length
    const score = Math.round((correctCount / pairs.length) * 100)
    const allCorrect = correctCount === pairs.length
    setStatus(allCorrect ? 'correct' : 'incorrect')
    if (allCorrect) onComplete(score)
  }

  return (
    <div className="space-y-4">
      {pairs.map((pair) => (
        <div key={pair.id} className="grid gap-3 rounded-card border border-secondary-100 bg-white p-4 sm:grid-cols-2">
          <p className="font-semibold text-secondary-900">{pair.left}</p>
          <label className="sr-only" htmlFor={`match-${pair.id}`}>
            مطابقة لـ {pair.left}
          </label>
          <select
            id={`match-${pair.id}`}
            className="rounded-xl border border-secondary-100 bg-surface px-3 py-2 text-sm"
            value={answers[pair.id] ?? ''}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [pair.id]: e.target.value }))}
          >
            <option value="">اختر التعريف</option>
            {rights.map((right) => (
              <option key={right} value={right}>
                {right}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button type="button" className="btn-primary" onClick={handleCheck}>
        تحقق من المطابقة
      </button>
      <VisualFeedback status={status} />
    </div>
  )
}
