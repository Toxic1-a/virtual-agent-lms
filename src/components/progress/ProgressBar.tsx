interface ProgressBarProps {
  value: number
  label?: string
}

export function ProgressBar({ value, label = 'نسبة الإنجاز' }: ProgressBarProps) {
  const safe = Math.min(100, Math.max(0, value))

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-secondary-800">{label}</span>
        <span className="font-bold text-primary" aria-live="polite">
          {safe}%
        </span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-secondary-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safe}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  )
}
