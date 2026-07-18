import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ActivityRenderer } from '../components/activities/ActivityRenderer'
import { PageShell } from '../components/layout/PageShell'
import { useProgress } from '../context/ProgressContext'
import { useActivity } from '../hooks/useCourseData'

export function ActivityPage() {
  const { activityId } = useParams()
  const activity = useActivity(activityId)
  const { markActivityComplete, isActivityComplete } = useProgress()
  const [doneScore, setDoneScore] = useState<number | null>(null)

  if (!activity) {
    return (
      <PageShell agentContext="activity">
        <p>النشاط غير موجود.</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex">
          العودة للوحة المقرر
        </Link>
      </PageShell>
    )
  }

  const nextPath = activity.nextQuizId
    ? `/quizzes/${activity.nextQuizId}`
    : activity.nextLessonId
      ? `/lessons/${activity.nextLessonId}`
      : activity.nextActivityId
        ? `/activities/${activity.nextActivityId}`
        : `/modules/${activity.moduleId}`

  const handleComplete = (score: number) => {
    markActivityComplete(activity.id, score)
    setDoneScore(score)
  }

  return (
    <PageShell agentContext="activity">
      <div className="space-y-5">
        <header>
          <p className="text-sm font-bold text-accent">نشاط تفاعلي</p>
          <h1 className="page-title">{activity.title}</h1>
          <p className="mt-2 muted">{activity.instructions}</p>
        </header>

        <ActivityRenderer activity={activity} onComplete={handleComplete} />

        {(doneScore !== null || isActivityComplete(activity.id)) && (
          <div className="rounded-card border border-accent/30 bg-accent-50 p-4" role="status">
            <p className="font-semibold text-accent-700">
              أحسنت! تم إكمال النشاط
              {doneScore !== null ? ` بدرجة ${doneScore}%` : ''}.
            </p>
            <Link to={nextPath} className="btn-primary mt-3 inline-flex">
              متابعة
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  )
}
