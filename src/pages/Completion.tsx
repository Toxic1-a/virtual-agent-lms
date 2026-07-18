import { Link } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { Badges } from '../components/progress/Badges'
import { CompletionStats } from '../components/progress/CompletionStats'
import { ProgressBar } from '../components/progress/ProgressBar'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import { exportProgressCsv } from '../lib/exportProgressCsv'

const QUIZ_TITLES: Record<string, string> = {
  'module-1-pretest': 'الاختبار القبلي — الموديول الأول',
  'module-2-pretest': 'الاختبار القبلي — الموديول الثاني',
  'module-3-pretest': 'الاختبار القبلي — الموديول الثالث',
  'achievement-test': 'الاختبار التحصيلي',
}

export function Completion() {
  const { completionPercent, resetProgress, progress } = useProgress()
  const { play } = useSound()

  return (
    <PageShell agentContext="completion">
      <div className="space-y-8">
        <header>
          <h1 className="page-title">إتمام مسار التعلم</h1>
          <p className="mt-2 max-w-3xl muted">
            ملخص تقدمك في بيئة التعلم الإلكتروني. النسبة تشمل الدروس والاختبارات القبلية والاختبار
            التحصيلي.
          </p>
        </header>

        <div className="card p-5">
          <ProgressBar value={completionPercent} label="نسبة إكمال المسار" />
        </div>

        <CompletionStats />

        <section className="space-y-3">
          <h2 className="section-title">نتائج الاختبارات</h2>
          {progress.quizResults.length === 0 ? (
            <p className="muted">لا توجد نتائج اختبارات بعد.</p>
          ) : (
            <ul className="space-y-2">
              {progress.quizResults.map((result) => (
                <li
                  key={result.quizId}
                  className="card flex items-center justify-between gap-3 p-4 text-sm"
                >
                  <span className="font-semibold text-secondary-900">
                    {QUIZ_TITLES[result.quizId] ?? result.quizId}
                  </span>
                  <span className="shrink-0 font-bold text-primary">
                    {result.score}/{result.total} — {result.percentage}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="section-title">الشارات المكتسبة</h2>
          <Badges />
        </section>

        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard" className="btn-primary">
            العودة للوحة المقرر
          </Link>
          <Link to="/quizzes/achievement-test" className="btn-secondary">
            الاختبار التحصيلي
          </Link>
          <button
            type="button"
            className="btn-secondary"
            data-sound="off"
            onClick={() => {
              exportProgressCsv(progress, completionPercent)
              play('success')
            }}
          >
            تصدير النتائج (CSV)
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              if (window.confirm('هل تريد مسح كل التقدم المحلي؟')) resetProgress()
            }}
          >
            إعادة تعيين التقدم المحلي
          </button>
        </div>
      </div>
    </PageShell>
  )
}
