import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAgentCue } from '../context/AgentCueContext'
import { useAgentMode } from '../hooks/useAgentMode'
import { useReducedMotion } from '../hooks/useReducedMotion'

const IDLE_MS = 24000
const BUTTON_COOLDOWN_MS = 1800
const NAV_COOLDOWN_MS = 3500

/**
 * Animated-mode only: greeting on route change, button micro-reactions, idle cues.
 * Static mode is a no-op so the frozen agent stays frozen.
 */
export function useAnimatedAgentLifecycle(context: string) {
  const mode = useAgentMode()
  const reduced = useReducedMotion()
  const location = useLocation()
  const { react, flashMood, bumpInteraction, interactionEpoch } = useAgentCue()

  const greetedRef = useRef(false)
  const lastNavAt = useRef(0)
  const lastButtonAt = useRef(0)
  const prevContext = useRef(context)
  const prevPath = useRef(location.pathname)

  // First mount greeting
  useEffect(() => {
    if (mode !== 'animated' || reduced) return
    if (greetedRef.current) return
    greetedRef.current = true
    const t = window.setTimeout(() => react('greeting'), 450)
    return () => window.clearTimeout(t)
  }, [mode, reduced, react])

  // Navigation / context change
  useEffect(() => {
    if (mode !== 'animated' || reduced) return

    const pathChanged = prevPath.current !== location.pathname
    const contextChanged = prevContext.current !== context
    prevPath.current = location.pathname
    prevContext.current = context

    if (!pathChanged && !contextChanged) return
    if (!greetedRef.current) return

    const now = Date.now()
    if (now - lastNavAt.current < NAV_COOLDOWN_MS) {
      bumpInteraction()
      return
    }
    lastNavAt.current = now
    bumpInteraction()

    if (context === 'quiz' || context.startsWith('quiz')) {
      react('quiz-start')
    } else if (context === 'completion') {
      react('celebrating')
    } else {
      react('navigate')
    }
  }, [bumpInteraction, context, location.pathname, mode, react, reduced])

  // Global button / interactive micro-reaction
  useEffect(() => {
    if (mode !== 'animated' || reduced) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest(
        'button, a.btn, a.btn-primary, a.btn-secondary, a.btn-accent, [role="button"], label.interactive-surface, .interactive-surface',
      )
      if (!interactive) return

      const now = Date.now()
      if (now - lastButtonAt.current < BUTTON_COOLDOWN_MS) {
        bumpInteraction()
        return
      }
      lastButtonAt.current = now
      bumpInteraction()
      flashMood('happy', 650)
    }

    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [bumpInteraction, flashMood, mode, reduced])

  // Idle timeout alternate cue
  useEffect(() => {
    if (mode !== 'animated' || reduced) return

    const timer = window.setTimeout(() => {
      react('idle')
    }, IDLE_MS)

    return () => window.clearTimeout(timer)
  }, [interactionEpoch, mode, react, reduced])
}
