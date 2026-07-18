import { CompletionStats } from '../progress/CompletionStats'
import { ProgressBar } from '../progress/ProgressBar'
import { useProgress } from '../../context/ProgressContext'

export function CourseStats() {
  const { completionPercent } = useProgress()

  return (
    <section className="space-y-4" aria-labelledby="course-stats-title">
      <h2 id="course-stats-title" className="section-title">
        تقدمك في المقرر
      </h2>
      <div className="card p-5">
        <ProgressBar value={completionPercent} />
      </div>
      <CompletionStats />
    </section>
  )
}
