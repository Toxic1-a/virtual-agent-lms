import { useAgentMode } from '../hooks/useAgentMode'

const easeOut = [0.22, 1, 0.36, 1] as const

/** Shared UI motion: rich when animated mode, frozen when static. */
export function useUiMotion() {
  const mode = useAgentMode()
  const animated = mode === 'animated'
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const on = animated && !reduce

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page: any = on
    ? {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: easeOut },
      }
    : {
        initial: false,
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = (index = 0): any =>
    on
      ? {
          initial: { opacity: 0, y: 20, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { delay: 0.05 + index * 0.07, duration: 0.4, ease: easeOut },
        }
      : {
          initial: false,
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0 },
        }

  return {
    mode,
    animated: on,
    page,
    item,
    hover: on ? { y: -4, scale: 1.01 } : undefined,
    tap: on ? { scale: 0.98 } : undefined,
  }
}
