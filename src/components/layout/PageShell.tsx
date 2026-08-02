import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { AgentMood } from '../virtual-agent/agentCharacters'
import { useUiMotion } from '../../motion/useUiMotion'
import { AgentController } from '../virtual-agent/AgentController'
import { AmbientMotion } from './AmbientMotion'
import { Footer } from './Footer'
import { Header } from './Header'

interface PageShellProps {
  children: ReactNode
  agentContext: string
  showAgent?: boolean
  wide?: boolean
  agentMood?: AgentMood
}

export function PageShell({
  children,
  agentContext,
  showAgent = true,
  wide = false,
  agentMood = 'idle',
}: PageShellProps) {
  const motionUi = useUiMotion()

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
          <motion.div key={motionUi.mode} {...motionUi.page}>
            {children}
          </motion.div>
          {showAgent ? (
            <aside className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start">
              {motionUi.animated ? (
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 0.8, 0, -0.8, 0],
                  }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="agent-panel-live"
                >
                  <AgentController context={agentContext} mood={agentMood} />
                </motion.div>
              ) : (
                <AgentController context={agentContext} mood={agentMood} />
              )}
            </aside>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  )
}
