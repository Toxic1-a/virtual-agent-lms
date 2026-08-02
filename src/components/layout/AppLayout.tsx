import { motion } from 'framer-motion'
import { useAgentHost } from '../../context/AgentHostContext'
import { useUiMotion } from '../../motion/useUiMotion'
import { AgentController } from '../virtual-agent/AgentController'
import { PageTransition } from '../motion/PageTransition'
import { AmbientMotion } from './AmbientMotion'
import { Footer } from './Footer'
import { Header } from './Header'

/**
 * Persistent chrome: Header, Footer, AmbientMotion, and Agent (Rive) live here.
 * Only the Outlet (page body) goes through AnimatePresence — Rive never remounts on navigate.
 */
export function AppLayout() {
  const { config } = useAgentHost()
  const motionUi = useUiMotion()
  const { showAgent, wide, context, mood } = config

  return (
    <div className="relative flex min-h-screen flex-col">
      <AmbientMotion />
      <Header />
      <main className="relative z-10 flex-1">
        <div
          className={`mx-auto grid gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 ${
            wide || !showAgent
              ? 'max-w-6xl'
              : 'max-w-6xl lg:grid-cols-[minmax(0,1fr)_280px]'
          }`}
        >
          <div
            className={motionUi.animated ? 'page-alive' : undefined}
          >
            <PageTransition />
          </div>

          {/* Always mounted to keep Rive warm; visually hidden when showAgent is false */}
          <aside
            className={`order-first lg:order-none lg:sticky lg:top-24 lg:self-start ${
              showAgent ? '' : 'hidden'
            }`}
            aria-hidden={!showAgent}
          >
            {motionUi.animated ? (
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 0.6, 0, -0.6, 0],
                }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="agent-panel-live"
              >
                <AgentController context={context} mood={mood} />
              </motion.div>
            ) : (
              <AgentController context={context} mood={mood} />
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
