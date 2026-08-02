import { motion } from 'framer-motion'
import { MotionPressable } from '../motion/MotionPressable'
import { useProgress } from '../../context/ProgressContext'
import { useUiMotion } from '../../motion/useUiMotion'

export function CompletionStats() {
  const { completionPercent, finishedLessonsCount, remainingLessonsCount, totalLessons } =
    useProgress()
  const motionUi = useUiMotion()

  const stats = [
    { label: 'نسبة الإكمال', value: `${completionPercent}%` },
    { label: 'دروس مكتملة', value: String(finishedLessonsCount) },
    { label: 'دروس متبقية', value: String(remainingLessonsCount) },
    { label: 'إجمالي الدروس', value: String(totalLessons) },
  ]

  return (
    <motion.div
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      variants={motionUi.staggerContainer}
      {...motionUi.staggerProps}
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={motionUi.staggerItem}>
          <MotionPressable className="card interactive-surface border border-secondary-100 p-4">
            <p className="text-sm text-secondary-600">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-secondary-900">{stat.value}</p>
          </MotionPressable>
        </motion.div>
      ))}
    </motion.div>
  )
}
