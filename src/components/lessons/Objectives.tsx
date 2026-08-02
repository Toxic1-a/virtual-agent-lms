import { motion } from 'framer-motion'
import { useUiMotion } from '../../motion/useUiMotion'

interface ObjectivesProps {
  items: string[]
}

export function Objectives({ items }: ObjectivesProps) {
  const motionUi = useUiMotion()

  return (
    <section className="card p-5" aria-labelledby="objectives-title">
      <h2 id="objectives-title" className="section-title mb-3">
        أهداف التعلم
      </h2>
      <motion.ul
        className="space-y-2"
        variants={motionUi.staggerContainer}
        {...motionUi.staggerProps}
      >
        {items.map((item) => (
          <motion.li
            key={item}
            variants={motionUi.staggerItem}
            className="flex gap-2 text-secondary-800"
          >
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
            <span>{item}</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
