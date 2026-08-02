import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUiMotion } from '../../motion/useUiMotion'

export function Footer() {
  const motionUi = useUiMotion()

  return (
    <footer className="relative z-10 mt-auto border-t border-secondary-100 bg-white">
      <motion.div
        className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-secondary-600 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        {...(motionUi.animated
          ? {
              initial: { opacity: 0, y: 12 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.45 },
            }
          : {})}
      >
        <p>بيئة تعلم إلكتروني لأغراض بحثية — المعلم الرقمي</p>
        <p>
          إعداد:{' '}
          <Link to="/authors" className="font-semibold text-primary hover:underline">
            د/ مارلين عصام شوقي و د/ هند عماد حمودة
          </Link>
        </p>
      </motion.div>
    </footer>
  )
}
