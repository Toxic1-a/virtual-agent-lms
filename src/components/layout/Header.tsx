import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAgentModeControls } from '../../hooks/useAgentMode'
import { useProgress } from '../../context/ProgressContext'
import { useSound } from '../../context/SoundContext'
import { assetUrl } from '../../lib/assetUrl'
import { useUiMotion } from '../../motion/useUiMotion'

const links = [
  { to: '/', label: 'الرئيسية', end: true },
  { to: '/dashboard', label: 'الوحدات' },
  { to: '/quizzes/achievement-test', label: 'الاختبار التحصيلي' },
  { to: '/authors', label: 'من نحن' },
  { to: '/completion', label: 'الإنجاز' },
]

export function Header() {
  const { mode, setMode } = useAgentModeControls()
  const { completionPercent } = useProgress()
  const { enabled: soundEnabled, setEnabled: setSoundEnabled } = useSound()
  const [open, setOpen] = useState(false)
  const motionUi = useUiMotion()

  return (
    <header className="sticky top-0 z-40 border-b border-secondary-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <motion.img
            src={assetUrl('/images/logo-agent.svg')}
            alt=""
            width={40}
            height={40}
            className="logo-mark h-10 w-10 rounded-xl shadow-sm"
            {...(motionUi.animated
              ? {
                  whileHover: { scale: 1.12, rotate: -8 },
                  whileTap: { scale: 0.92 },
                }
              : {})}
          />
          <span>
            <span className="block text-sm font-bold text-secondary-900 sm:text-base">
              الوكيل الافتراضي
            </span>
          </span>
        </Link>

        <nav aria-label="القائمة الرئيسية" className="hidden items-center gap-1 md:flex">
          {links.map((link, index) => (
            <motion.div
              key={link.to}
              {...(motionUi.animated
                ? {
                    initial: { opacity: 0, y: -8 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.05 * index, duration: 0.35 },
                  }
                : {})}
            >
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `nav-link-live rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-primary-50 text-primary'
                      : 'text-secondary-700 hover:bg-secondary-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary-100 bg-white text-secondary-600 transition hover:border-primary-100 hover:bg-primary-50 hover:text-primary"
            aria-label={soundEnabled ? 'إيقاف أصوات التفاعل' : 'تشغيل أصوات التفاعل'}
            title={soundEnabled ? 'إيقاف أصوات التفاعل' : 'تشغيل أصوات التفاعل'}
            aria-pressed={soundEnabled}
            data-sound="off"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5 6.5 8.5H3v7h3.5L11 19V5Z" />
                <path d="M15 9a4 4 0 0 1 0 6" />
                <path d="M17.8 6.5a8 8 0 0 1 0 11" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5 6.5 8.5H3v7h3.5L11 19V5Z" />
                <path d="m16 10 5 5M21 10l-5 5" />
              </svg>
            )}
          </button>
          <motion.div
            className={`mode-chip-live inline-flex items-center rounded-full border border-secondary-100 bg-secondary-50 p-1 ${
              mode === 'animated' ? 'ring-2 ring-accent/30' : ''
            }`}
            role="group"
            aria-label="تبديل نسخة الوكيل الافتراضي"
            {...(motionUi.animated ? motionUi.pulse : {})}
          >
            <button
              type="button"
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition sm:text-sm ${
                mode === 'static'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-secondary-700 hover:bg-white'
              }`}
              aria-pressed={mode === 'static'}
              onClick={() => setMode('static')}
            >
              أ ثابت
            </button>
            <button
              type="button"
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition sm:text-sm ${
                mode === 'animated'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-secondary-700 hover:bg-white'
              }`}
              aria-pressed={mode === 'animated'}
              onClick={() => setMode('animated')}
            >
              ب متحرك
            </button>
          </motion.div>
          <motion.span
            className="hidden font-semibold text-primary sm:inline"
            aria-live="polite"
            {...(motionUi.animated
              ? {
                  animate: { scale: [1, 1.06, 1] },
                  transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                }
              : {})}
          >
            الإنجاز {completionPercent}%
          </motion.span>
          <button
            type="button"
            className="btn-secondary px-3 py-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            القائمة
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="القائمة للجوال"
          className="border-t border-secondary-100 bg-white px-4 py-3 md:hidden"
        >
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-semibold ${
                      isActive ? 'bg-primary-50 text-primary' : 'text-secondary-700'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
