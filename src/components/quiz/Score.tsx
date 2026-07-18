interface ScoreProps {
  score: number
  total: number
  percentage: number
  passingScore: number
}

export function Score({ score, total, percentage, passingScore }: ScoreProps) {
  const passed = percentage >= passingScore

  return (
    <div
      className={`rounded-card border p-5 ${
        passed ? 'border-accent/40 bg-accent-50' : 'border-red-200 bg-red-50'
      }`}
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-semibold text-secondary-700">نتيجتك</p>
      <p className="mt-1 text-3xl font-bold text-secondary-900">
        {score} / {total}
      </p>
      <p className="mt-2 text-lg font-bold text-secondary-900">{percentage}%</p>
      <p className="mt-2 text-sm font-semibold">
        {passed ? 'لقد اجتزت الاختبار بنجاح' : `درجة النجاح المطلوبة: ${passingScore}%`}
      </p>
    </div>
  )
}
