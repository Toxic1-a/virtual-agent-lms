import { useBadges } from '../../hooks/useCourseData'
import { useProgress } from '../../context/ProgressContext'

const iconMap: Record<string, string> = {
  book: 'ب',
  star: '★',
  eye: 'ع',
  award: 'ت',
  flag: '✓',
}

export function Badges() {
  const badges = useBadges()
  const { hasBadge } = useProgress()

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {badges.map((badge) => {
        const earned = hasBadge(badge.id)
        return (
          <div
            key={badge.id}
            className={`interactive-surface rounded-card border p-4 shadow-card transition ${
              earned
                ? 'border-accent/40 bg-accent-50'
                : 'border-secondary-100 bg-white opacity-70'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${
                  earned ? 'bg-accent text-white' : 'bg-secondary-100 text-secondary-600'
                }`}
                aria-hidden
              >
                {iconMap[badge.icon] ?? '•'}
              </span>
              <div>
                <p className="font-bold text-secondary-900">{badge.title}</p>
                <p className="mt-1 text-sm text-secondary-600">{badge.description}</p>
                <p className="mt-2 text-xs font-semibold text-secondary-700">
                  {earned ? 'مكتسبة' : 'غير مكتسبة بعد'}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
