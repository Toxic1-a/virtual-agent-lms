import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageShell } from '../components/layout/PageShell'
import { useProgress } from '../context/ProgressContext'
import { useLessonsByModule, useModule } from '../hooks/useCourseData'
import { useUiMotion } from '../motion/useUiMotion'

export function ModulePage() {
  const { moduleId } = useParams()
  const module = useModule(moduleId)
  const lessons = useLessonsByModule(moduleId)
  const { isLessonComplete, getQuizResult } = useProgress()
  const motionUi = useUiMotion()

  if (!module) {
    return (
      <PageShell agentContext="module">
        <p>الوحدة غير موجودة.</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex">
          العودة للوحة المقرر
        </Link>
      </PageShell>
    )
  }

  const pretestDone = module.preQuizId ? Boolean(getQuizResult(module.preQuizId)) : false

  return (
    <PageShell agentContext={`module:${module.id}`}>
      <div className="space-y-6">
        <motion.header {...motionUi.item(0)} className="space-y-2">
          <p className="text-sm font-bold text-primary">الموديول {module.order}</p>
          <h1 className="page-title">{module.title}</h1>
          <p className="muted max-w-3xl">{module.description}</p>
          <p className="text-sm font-semibold text-secondary-700">
            الوقت التقديري: {module.estimatedTime}
          </p>
        </motion.header>

        {module.objectives?.length ? (
          <motion.section
            {...motionUi.item(1)}
            className="card space-y-3 p-5"
            aria-labelledby="module-objectives"
          >
            <h2 id="module-objectives" className="section-title">
              أهداف دراسة الموديول
            </h2>
            <p className="text-sm text-secondary-600">
              عزيزي الطالب/ عزيزتي الطالبة، بعد دراستك لهذا الموديول يجب أن تكون قادراً على أن:
            </p>
            <ul className="space-y-2">
              {module.objectives.map((objective, index) => (
                <motion.li
                  key={objective}
                  {...motionUi.item(index + 2)}
                  className="flex gap-2 text-sm leading-7 text-secondary-800"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{objective}</span>
                </motion.li>
              ))}
            </ul>
          </motion.section>
        ) : null}

        {module.preQuizId ? (
          <motion.section
            {...motionUi.item(2)}
            whileHover={motionUi.hover}
            className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="section-title">الاختبار القبلي</h2>
              <p className="mt-1 text-sm text-secondary-600">
                {pretestDone
                  ? 'تم أداء الاختبار القبلي. يمكنك مراجعته أو الانتقال للمحتوى.'
                  : 'ابدأ بالاختبار القبلي قبل دراسة محتوى الموديول.'}
              </p>
            </div>
            <Link to={`/quizzes/${module.preQuizId}`} className="btn-primary">
              {pretestDone ? 'مراجعة الاختبار القبلي' : 'بدء الاختبار القبلي'}
            </Link>
          </motion.section>
        ) : null}

        <section className="space-y-3" aria-labelledby="lessons-list-title">
          <h2 id="lessons-list-title" className="section-title">
            محتوى الموديول
          </h2>
          <ol className="space-y-3">
            {lessons.map((lesson, index) => {
              const done = isLessonComplete(lesson.id)
              return (
                <motion.li
                  key={lesson.id}
                  {...motionUi.item(index)}
                  whileHover={motionUi.hover}
                  className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-secondary-600">جزء {lesson.order}</p>
                    <h3 className="font-bold text-secondary-900">{lesson.title}</h3>
                    <p className="mt-1 text-sm text-secondary-600">
                      {done ? 'مكتمل' : 'لم يُكمل بعد'}
                    </p>
                  </div>
                  <Link to={`/lessons/${lesson.id}`} className="btn-primary">
                    {done ? 'مراجعة' : 'ابدأ'}
                  </Link>
                </motion.li>
              )
            })}
          </ol>
        </section>

        <Link to="/dashboard" className="btn-secondary inline-flex">
          العودة للوحة المقرر
        </Link>
      </div>
    </PageShell>
  )
}
