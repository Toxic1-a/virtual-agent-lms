import { useAgentMode } from '../../hooks/useAgentMode'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * Unmistakable proof that animated mode is active.
 * Always renders when mode === 'animated' (not gated by reduced-motion).
 */
export function AnimatedModeBanner() {
  const mode = useAgentMode()
  const reduced = useReducedMotion()

  if (mode !== 'animated') return null

  return (
    <div
      className="animated-mode-banner"
      role="status"
      aria-live="polite"
      data-testid="animated-mode-banner"
    >
      <strong>وضع متحرك نشط</strong>
      <span aria-hidden="true"> — </span>
      <span>مرّر على الكروت لتشوف الرفع والتوهج</span>
      {reduced ? (
        <span className="animated-mode-banner__warn">
          {' '}
          | تحذير: إعداد النظام «تقليل الحركة» مفعّل — عطّله من إعدادات ويندوز عشان تشوف كل الحركات
        </span>
      ) : null}
    </div>
  )
}
