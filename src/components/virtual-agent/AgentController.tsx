import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { useAgentMode } from '../../hooks/useAgentMode'
import { useAgentCue } from '../../context/AgentCueContext'
import { useAnimatedAgentLifecycle } from '../../hooks/useAnimatedAgentLifecycle'
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

function resolveMood(
  pageMood: AgentMood,
  cueMood: AgentMood | null,
  flashMood: AgentMood | null,
  speaking: boolean,
): AgentMood {
  if (flashMood) return flashMood
  if (cueMood) return cueMood
  if (speaking && pageMood === 'idle') return 'talk'
  return pageMood
}

export function AgentController({ context, mood = 'idle' }: AgentControllerProps) {
  const mode = useAgentMode()
  const {
    cueMood,
    flashMoodActive,
    speechMuted,
    setSpeechMuted,
    replayLastCue,
    lastMessage,
  } = useAgentCue()
  const [speaking, setSpeaking] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useAnimatedAgentLifecycle(context)

  const handleSpeakingChange = useCallback((value: boolean) => {
    setSpeaking(value)
  }, [])

  const effectiveMood = useMemo(
    () => resolveMood(mood, cueMood, flashMoodActive, speaking && !speechMuted),
    [mood, cueMood, flashMoodActive, speaking, speechMuted],
  )

  const thinking = mode === 'animated' && (effectiveMood === 'think' || effectiveMood === 'explaining')

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

      {mode === 'animated' ? (
        <div
          data-agent-controls
          className="flex flex-wrap items-center gap-1.5"
        >
          <button
            type="button"
            className="rounded-lg border border-secondary-100 bg-white px-2 py-1 text-[11px] font-semibold text-secondary-700 hover:border-primary/30 hover:text-primary"
            aria-pressed={speechMuted}
            onClick={() => setSpeechMuted(!speechMuted)}
          >
            {speechMuted ? 'إلغاء الصمت' : 'كتم الحديث'}
          </button>
          <button
            type="button"
            className="rounded-lg border border-secondary-100 bg-white px-2 py-1 text-[11px] font-semibold text-secondary-700 hover:border-primary/30 hover:text-primary disabled:opacity-40"
            disabled={!lastMessage}
            onClick={() => replayLastCue()}
          >
            إعادة التلميح
          </button>
        </div>
      ) : null}

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
                <AnimatedAgent
                  speaking={speaking && !speechMuted}
                  mood={effectiveMood}
                  thinking={thinking && !speaking}
                />
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
