import { useState } from 'react'
import type { SortingItem } from '../../types'
import { VisualFeedback } from './VisualFeedback'

interface SortingProps {
  items: SortingItem[]
  onComplete: (score: number) => void
}

export function Sorting({ items, onComplete }: SortingProps) {
  const [order, setOrder] = useState(() =>
    [...items].sort(() => Math.random() - 0.5).map((item) => item.id),
  )
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle')

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= order.length) return
    setOrder((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setStatus('idle')
  }

  const handleCheck = () => {
    const correctOrder = [...items]
      .sort((a, b) => a.correctOrder - b.correctOrder)
      .map((item) => item.id)
    const allCorrect = order.every((id, index) => id === correctOrder[index])
    setStatus(allCorrect ? 'correct' : 'incorrect')
    if (allCorrect) onComplete(100)
  }

  return (
    <div className="space-y-3">
      <ol className="space-y-2">
        {order.map((id, index) => {
          const item = items.find((entry) => entry.id === id)!
          return (
            <li
              key={id}
              className="interactive-surface flex items-center justify-between gap-3 rounded-card border border-secondary-100 bg-white p-3"
            >
              <span className="font-semibold text-secondary-900">
                {index + 1}. {item.text}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-secondary px-3 py-2 text-sm"
                  onClick={() => move(index, -1)}
                  aria-label={`تحريك للأعلى: ${item.text}`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="btn-secondary px-3 py-2 text-sm"
                  onClick={() => move(index, 1)}
                  aria-label={`تحريك للأسفل: ${item.text}`}
                >
                  ↓
                </button>
              </div>
            </li>
          )
        })}
      </ol>
      <button type="button" className="btn-primary" onClick={handleCheck}>
        تحقق من الترتيب
      </button>
      <VisualFeedback status={status} />
    </div>
  )
}
