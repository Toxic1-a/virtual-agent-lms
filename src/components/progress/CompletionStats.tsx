import { motion } from 'framer-motion'
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
        <motion.div
          key={stat.label}
          variants={motionUi.staggerItem}
          whileHover={motionUi.hover}
          whileTap={motionUi.tap}
          className="interactive-surface rounded-card border border-secondary-100 bg-white p-4 shadow-card"
        >
          <p className="text-sm text-secondary-600">{stat.label}</p>
          <p className="mt-1 text-2xl font-bold text-secondary-900">{stat.value}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
