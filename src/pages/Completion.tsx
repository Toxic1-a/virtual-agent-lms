import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageShell } from '../components/layout/PageShell'
import { Badges } from '../components/progress/Badges'
import { CompletionStats } from '../components/progress/CompletionStats'
import { ProgressBar } from '../components/progress/ProgressBar'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import { exportProgressCsv } from '../lib/exportProgressCsv'
import { useUiMotion } from '../motion/useUiMotion'

const QUIZ_TITLES: Record<string, string> = {
  'module-1-pretest': 'الاختبار القبلي — الموديول الأول',
  'module-2-pretest': 'الاختبار القبلي — الموديول الثاني',
  'module-3-pretest': 'الاختبار القبلي — الموديول الثالث',
  'achievement-test': 'الاختبار التحصيلي',
}

export function Completion() {
  const { completionPercent, resetProgress, progress } = useProgress()
  const { play } = useSound()
  const motionUi = useUiMotion()

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
            <motion.ul
              className="space-y-2"
              variants={motionUi.staggerContainer}
              {...motionUi.staggerProps}
            >
              {progress.quizResults.map((result) => (
                <motion.li
                  key={result.quizId}
                  variants={motionUi.staggerItem}
                  whileHover={motionUi.hover}
                  whileTap={motionUi.tap}
                  className="card flex items-center justify-between gap-3 p-4 text-sm"
                >
                  <span className="font-semibold text-secondary-900">
                    {QUIZ_TITLES[result.quizId] ?? result.quizId}
                  </span>
                  <span className="shrink-0 font-bold text-primary">
                    {result.score}/{result.total} — {result.percentage}%
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="section-title">الشارات المكتسبة</h2>
          <Badges />
        </section>

        <div className="flex flex-wrap gap-3">
          <motion.div whileHover={motionUi.hover} whileTap={motionUi.tap}>
            <Link to="/dashboard" className="btn-primary">
              العودة للوحة المقرر
            </Link>
          </motion.div>
          <motion.div whileHover={motionUi.hover} whileTap={motionUi.tap}>
            <Link to="/quizzes/achievement-test" className="btn-secondary">
              الاختبار التحصيلي
            </Link>
          </motion.div>
          <motion.button
            type="button"
            className="btn-secondary"
            data-sound="off"
            whileHover={motionUi.hover}
            whileTap={motionUi.tap}
            onClick={() => {
              exportProgressCsv(progress, completionPercent)
              play('success')
            }}
          >
            تصدير النتائج (CSV)
          </motion.button>
          <motion.button
            type="button"
            className="btn-secondary"
            whileHover={motionUi.hover}
            whileTap={motionUi.tap}
            onClick={() => {
              if (window.confirm('هل تريد مسح كل التقدم المحلي؟')) resetProgress()
            }}
          >
            إعادة تعيين التقدم المحلي
          </motion.button>
        </div>
      </div>
    </PageShell>
  )
}
