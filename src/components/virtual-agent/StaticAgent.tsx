import { useEffect } from 'react'
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { STATIC_AGENT_CHARACTER } from './agentCharacters'

/**
 * Static agent: same face character, completely frozen (no tracking, no motion).
 */
export function StaticAgent({ compact = false }: { compact?: boolean }) {
  const { rive, RiveComponent } = useRive({
    src: STATIC_AGENT_CHARACTER.src,
    artboard: STATIC_AGENT_CHARACTER.artboard,
    stateMachines: STATIC_AGENT_CHARACTER.stateMachine,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  })

  useEffect(() => {
    if (!rive) return

    rive.resizeDrawingSurfaceToCanvas()

    const freeze = () => {
      try {
        const smName = STATIC_AGENT_CHARACTER.stateMachine
        const inputs = smName ? rive.stateMachineInputs(smName) : undefined
        if (inputs) {
          for (const input of inputs) {
            const name = input.name
            if (name === 'Parent-isTracking' || name === 'isOnGlasses' || name === 'isOnBlush') {
              try {
                ;(input as { value?: boolean }).value = false
              } catch {
                /* ignore */
              }
            }
          }
        }

        const machines = [...(rive.stateMachineNames ?? [])]
        const animations = [...(rive.animationNames ?? [])]
        const sm = smName && machines.includes(smName) ? smName : machines[0]

        if (sm) rive.pause(sm)
        for (const anim of animations) {
          try {
            rive.pause(anim)
          } catch {
            /* ignore */
          }
        }
        try {
          rive.pause()
        } catch {
          /* ignore */
        }
      } catch {
        try {
          rive.pause()
        } catch {
          /* ignore */
        }
      }
      rive.resizeDrawingSurfaceToCanvas()
    }

    const timers = [
      window.setTimeout(freeze, 0),
      window.setTimeout(freeze, 50),
      window.setTimeout(freeze, 150),
      window.setTimeout(freeze, 400),
    ]
    const raf = window.requestAnimationFrame(freeze)

    return () => {
      window.cancelAnimationFrame(raf)
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [rive])

  const height = compact ? 200 : 288

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full overflow-hidden rounded-card border border-secondary-100 bg-gradient-to-b from-primary-50 to-white p-1.5 shadow-card sm:p-2">
        <div
          className={`mx-auto w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#DCEBFF] to-[#F7FBFF] ${
            compact ? 'h-48 max-w-[220px] sm:h-56 sm:max-w-[260px]' : 'h-72 max-w-[300px]'
          }`}
        >
          <RiveComponent
            className="pointer-events-none h-full w-full"
            style={{ width: '100%', height }}
            aria-label="الوكيل الافتراضي — عرض ثابت بدون حركة"
          />
        </div>
      </div>
      <p className="mt-1 text-[11px] font-semibold text-secondary-600 sm:mt-2 sm:text-xs">
        الوكيل الافتراضي (ثابت)
      </p>
    </div>
  )
}
