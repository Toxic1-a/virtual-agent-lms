import { Link, useParams } from 'react-router-dom'
import { Objectives } from '../components/lessons/Objectives'
import { LessonContent } from '../components/lessons/LessonContent'
import { Summary } from '../components/lessons/Summary'
import { PageShell } from '../components/layout/PageShell'
import { useProgress } from '../context/ProgressContext'
import { useLesson, useModule, useNextPath } from '../hooks/useCourseData'

export function LessonPage() {
  const { lessonId } = useParams()
  const lesson = useLesson(lessonId)
  const module = useModule(lesson?.moduleId)
  const nextPath = useNextPath(lesson)
  const { markLessonComplete, isLessonComplete } = useProgress()

  if (!lesson) {
    return (
      <PageShell agentContext="lesson">
        <p>الدرس غير موجود.</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex">
          العودة للوحة المقرر
        </Link>
      </PageShell>
    )
  }

  const complete = isLessonComplete(lesson.id)
  const fallbackNext = `/modules/${lesson.moduleId}`

  return (
    <PageShell agentContext={`lesson:${lesson.id}`}>
      <div className="space-y-6">
        <header>
          <p className="text-sm font-bold text-primary">
            {module ? `الموديول ${module.order}` : 'محتوى'}
          </p>
          <h1 className="page-title">{lesson.title}</h1>
        </header>

        {lesson.objectives?.length ? <Objectives items={lesson.objectives} /> : null}

        <LessonContent lesson={lesson} />
        {lesson.summary ? <Summary text={lesson.summary} /> : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-accent"
            onClick={() => markLessonComplete(lesson.id)}
          >
            {complete ? 'تم تعليم المحتوى كمكتمل' : 'تعليم المحتوى كمكتمل'}
          </button>
          <Link
            to={lesson.nextLessonId ? nextPath : fallbackNext}
            className="btn-primary"
            onClick={() => markLessonComplete(lesson.id)}
          >
            {lesson.nextLessonId ? 'التالي' : 'العودة للموديول'}
          </Link>
          <Link to={`/modules/${lesson.moduleId}`} className="btn-secondary">
            العودة للموديول
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
