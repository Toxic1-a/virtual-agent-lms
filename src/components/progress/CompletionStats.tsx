import { useProgress } from '../../context/ProgressContext'

export function CompletionStats() {
  const { completionPercent, finishedLessonsCount, remainingLessonsCount, totalLessons } =
    useProgress()

  const stats = [
    { label: 'نسبة الإكمال', value: `${completionPercent}%` },
    { label: 'دروس مكتملة', value: String(finishedLessonsCount) },
    { label: 'دروس متبقية', value: String(remainingLessonsCount) },
    { label: 'إجمالي الدروس', value: String(totalLessons) },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-card border border-secondary-100 bg-white p-4 shadow-card">
          <p className="text-sm text-secondary-600">{stat.label}</p>
          <p className="mt-1 text-2xl font-bold text-secondary-900">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
