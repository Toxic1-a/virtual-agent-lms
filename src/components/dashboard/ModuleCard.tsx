import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Module } from '../../types'
import { useAgentCue } from '../../context/AgentCueContext'
import { useProgress } from '../../context/ProgressContext'
import { useAgentScript, useLessonsByModule } from '../../hooks/useCourseData'
import { useUiMotion } from '../../motion/useUiMotion'

interface ModuleCardProps {
  module: Module
  index: number
}

export function ModuleCard({ module, index }: ModuleCardProps) {
  const lessons = useLessonsByModule(module.id)
  const { isLessonComplete, isModuleComplete } = useProgress()
  const { showCue, clearCue } = useAgentCue()
  const hoverScript = useAgentScript(`hover:${module.id}`)
  const motionUi = useUiMotion()
  const done = lessons.filter((lesson) => isLessonComplete(lesson.id)).length
  const complete = isModuleComplete(module.id)
  const percent = lessons.length ? Math.round((done / lessons.length) * 100) : 0

  const hoverMessage =
    hoverScript?.messages[0] ?? `هذه ${module.title}. ${module.description}`

  return (
    <motion.article
      {...motionUi.item(index)}
      whileHover={motionUi.hover}
      whileTap={motionUi.tap}
      className="card flex h-full flex-col p-5"
      onMouseEnter={() => showCue(hoverMessage)}
      onMouseLeave={() => clearCue()}
      onFocusCapture={() => showCue(hoverMessage)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          clearCue()
        }
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary">
          الوحدة {module.order}
        </span>
        <span className="text-xs font-semibold text-secondary-600">{module.estimatedTime}</span>
      </div>
      <h3 className="text-lg font-bold text-secondary-900">{module.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-7 text-secondary-600">{module.description}</p>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs font-semibold text-secondary-700">
          <span>التقدم</span>
          <span>
            {done}/{lessons.length} دروس — {percent}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-secondary-100">
          <div
            className="progress-bar-fill h-full rounded-full bg-accent"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <Link
        to={`/modules/${module.id}`}
        className="btn-primary mt-5 w-full"
        aria-label={`بدء الوحدة: ${module.title}`}
      >
        {complete ? 'مراجعة الوحدة' : done > 0 ? 'متابعة' : 'ابدأ'}
      </Link>
    </motion.article>
  )
}
