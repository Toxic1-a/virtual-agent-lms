import { useAgentMode } from '../hooks/useAgentMode'

const easeOut = [0.22, 1, 0.36, 1] as const
const springSoft = { type: 'spring', stiffness: 260, damping: 22 } as const

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
        initial: { opacity: 0, y: 28, filter: 'blur(4px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        transition: { duration: 0.55, ease: easeOut },
      }
    : {
        initial: false,
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        transition: { duration: 0 },
      }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = (index = 0): any =>
    on
      ? {
          initial: { opacity: 0, y: 28, scale: 0.94, rotate: index % 2 === 0 ? -1.2 : 1.2 },
          animate: { opacity: 1, y: 0, scale: 1, rotate: 0 },
          transition: {
            delay: 0.06 + index * 0.08,
            duration: 0.48,
            ease: easeOut,
          },
        }
      : {
          initial: false,
          animate: { opacity: 1, y: 0, scale: 1, rotate: 0 },
          transition: { duration: 0 },
        }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const float: any = on
    ? {
        animate: { y: [0, -8, 0], rotate: [0, 0.6, 0] },
        transition: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
      }
    : {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pulse: any = on
    ? {
        animate: { scale: [1, 1.03, 1] },
        transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
      }
    : {}

  return {
    mode,
    animated: on,
    page,
    item,
    float,
    pulse,
    hover: on
      ? { y: -8, scale: 1.025, rotate: -0.4, transition: springSoft }
      : undefined,
    tap: on ? { scale: 0.96, rotate: 0.4 } : undefined,
  }
}
