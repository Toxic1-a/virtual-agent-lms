import { lazy, Suspense, useCallback, useState } from 'react'
import { useAgentMode } from '../../hooks/useAgentMode'
import type { AgentMood } from './agentCharacters'
import { AgentSpeech } from './AgentSpeech'
import { StaticAgent } from './StaticAgent'

const AnimatedAgent = lazy(() =>
  import('./AnimatedAgent').then((module) => ({ default: module.AnimatedAgent })),
)

interface AgentControllerProps {
  context: string
  mood?: AgentMood
}

export function AgentController({ context, mood = 'idle' }: AgentControllerProps) {
  const mode = useAgentMode()
  const [speaking, setSpeaking] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleSpeakingChange = useCallback((value: boolean) => {
    setSpeaking(value)
  }, [])

  return (
    <section
      aria-label="الوكيل الافتراضي"
      className="card sticky top-20 space-y-2 overflow-visible p-3 sm:p-4 lg:top-24"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-secondary-900">الوكيل الافتراضي</h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[11px] font-semibold text-accent-700">
            {mode === 'animated' ? 'متحرك' : 'ثابت'}
          </span>
          <button
            type="button"
            className="rounded-lg border border-secondary-100 px-2 py-1 text-[11px] font-semibold text-secondary-700 lg:hidden"
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? 'إظهار' : 'تصغير'}
          </button>
        </div>
      </div>

      <div className={collapsed ? 'hidden lg:block' : 'block'}>
        <div className="relative isolate overflow-visible">
          <div className="relative z-20 mx-auto mb-2 w-full max-w-[220px] sm:mb-3 sm:max-w-[260px] lg:max-w-[280px]">
            <AgentSpeech context={context} onSpeakingChange={handleSpeakingChange} />
          </div>

          <div className="mx-auto max-w-[200px] sm:max-w-[240px] lg:max-w-none">
            {mode === 'animated' ? (
              <Suspense
                fallback={
                  <div className="flex h-40 items-center justify-center text-sm text-secondary-600 sm:h-56 lg:h-64">
                    جاري تحميل الوكيل...
                  </div>
                }
              >
                <AnimatedAgent speaking={speaking} mood={mood} />
              </Suspense>
            ) : (
              <StaticAgent compact />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
