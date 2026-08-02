import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CourseStats } from '../components/dashboard/CourseStats'
import { ModuleCard } from '../components/dashboard/ModuleCard'
import { PageShell } from '../components/layout/PageShell'
import { Badges } from '../components/progress/Badges'
import { useProgress } from '../context/ProgressContext'
import { useCourse, useModules, useQuiz } from '../hooks/useCourseData'
import { useUiMotion } from '../motion/useUiMotion'

export function Dashboard() {
  const course = useCourse()
  const modules = useModules()
  const achievementTest = useQuiz('achievement-test')
  const { getQuizResult } = useProgress()
  const achievementResult = getQuizResult('achievement-test')
  const motionUi = useUiMotion()

  return (
    <PageShell agentContext="dashboard">
      <div className="space-y-8">
        <motion.header {...motionUi.item(0)}>
          <h1 className="page-title">{course.title}</h1>
          <p className="mt-2 max-w-3xl muted">{course.introduction}</p>
        </motion.header>

        <motion.div {...motionUi.item(1)}>
          <CourseStats />
        </motion.div>

        {achievementTest ? (
          <section aria-labelledby="achievement-title" className="space-y-4">
            <motion.h2 {...motionUi.item(2)} id="achievement-title" className="section-title">
              الاختبار التحصيلي
            </motion.h2>
            <motion.div
              {...motionUi.item(3)}
              whileHover={motionUi.hover}
              whileTap={motionUi.tap}
              className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-2">
                <p className="text-lg font-bold text-secondary-900">{achievementTest.title}</p>
                <p className="muted text-sm">
                  {achievementTest.questions.length} مفردة — اختيار من متعدد وصواب وخطأ. درجة النجاح{' '}
                  {achievementTest.passingScore}%.
                </p>
                {achievementResult ? (
                  <p className="text-sm font-semibold text-accent">
                    نتيجتك السابقة: {achievementResult.score}/{achievementResult.total} (
                    {achievementResult.percentage}%)
                  </p>
                ) : null}
              </div>
              <motion.div whileHover={motionUi.hover} whileTap={motionUi.tap}>
                <Link to="/quizzes/achievement-test" className="btn-primary shrink-0 text-center">
                  {achievementResult ? 'مراجعة الاختبار' : 'بدء الاختبار التحصيلي'}
                </Link>
              </motion.div>
            </motion.div>
          </section>
        ) : null}

        <section aria-labelledby="modules-title" className="space-y-4">
          <h2 id="modules-title" className="section-title">
            الوحدات التعليمية
          </h2>
          <motion.div
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            variants={motionUi.staggerContainer}
            {...motionUi.staggerProps}
          >
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </motion.div>
        </section>

        <section aria-labelledby="badges-title" className="space-y-4">
          <h2 id="badges-title" className="section-title">
            الشارات
          </h2>
          <Badges />
        </section>
      </div>
    </PageShell>
  )
}
