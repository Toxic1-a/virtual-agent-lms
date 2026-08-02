import { useState } from 'react'
import type { DragDropItem, DragDropZone } from '../../types'
import { VisualFeedback } from './VisualFeedback'

interface DragDropProps {
  items: DragDropItem[]
  zones: DragDropZone[]
  onComplete: (score: number) => void
}

export function DragDrop({ items, zones, onComplete }: DragDropProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle')
  const [dragging, setDragging] = useState<string | null>(null)

  const unassigned = items.filter((item) => !assignments[item.id])

  const assign = (itemId: string, zoneId: string) => {
    setAssignments((prev) => ({ ...prev, [itemId]: zoneId }))
    setStatus('idle')
  }

  const handleCheck = () => {
    const correctCount = items.filter((item) => assignments[item.id] === item.zoneId).length
    const score = Math.round((correctCount / items.length) * 100)
    const allCorrect = correctCount === items.length
    setStatus(allCorrect ? 'correct' : 'incorrect')
    if (allCorrect) onComplete(score)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" aria-label="العناصر القابلة للسحب">
        {unassigned.map((item) => (
          <button
            key={item.id}
            type="button"
            draggable
            onDragStart={() => setDragging(item.id)}
            onDragEnd={() => setDragging(null)}
            className="rounded-xl border border-primary/20 bg-primary-50 px-3 py-2 text-sm font-semibold text-primary"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {zones.map((zone) => (
          <div
            key={zone.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragging) assign(dragging, zone.id)
            }}
            className="interactive-surface min-h-36 rounded-card border border-dashed border-secondary-100 bg-white p-3"
          >
            <p className="mb-2 text-sm font-bold text-secondary-900">{zone.label}</p>
            <div className="space-y-2">
              {items
                .filter((item) => assignments[item.id] === zone.id)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="w-full rounded-lg bg-secondary-50 px-2 py-2 text-start text-sm"
                    onClick={() =>
                      setAssignments((prev) => {
                        const next = { ...prev }
                        delete next[item.id]
                        return next
                      })
                    }
                  >
                    {item.label}
                  </button>
                ))}
            </div>
            <div className="mt-3">
              <label className="sr-only" htmlFor={`zone-select-${zone.id}`}>
                إضافة عنصر إلى {zone.label}
              </label>
              <select
                id={`zone-select-${zone.id}`}
                className="w-full rounded-lg border border-secondary-100 px-2 py-1 text-xs"
                value=""
                onChange={(e) => {
                  if (e.target.value) assign(e.target.value, zone.id)
                }}
              >
                <option value="">إضافة عنصر...</option>
                {unassigned.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="btn-primary" onClick={handleCheck}>
        تحقق من التصنيف
      </button>
      <VisualFeedback status={status} />
    </div>
  )
}
