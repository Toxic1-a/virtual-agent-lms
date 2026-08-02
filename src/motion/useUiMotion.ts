import { useAgentMode } from '../hooks/useAgentMode'

const easeOut = [0.16, 1, 0.3, 1] as const
const springSoft = { type: 'spring', stiffness: 340, damping: 16 } as const

/** Shared UI motion: dramatic when animated mode, frozen when static. */
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
        initial: { opacity: 0, y: 56, scale: 0.94, filter: 'blur(10px)' },
        animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
        transition: { duration: 0.7, ease: easeOut },
      }
    : {
        initial: false,
        animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
        transition: { duration: 0 },
      }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = (index = 0): any =>
    on
      ? {
          initial: {
            opacity: 0,
            y: 44,
            scale: 0.86,
            rotate: index % 2 === 0 ? -3 : 3,
          },
          animate: {
            opacity: 1,
            y: [0, -14, 0],
            scale: 1,
            rotate: [0, index % 2 === 0 ? -1.2 : 1.2, 0],
          },
          transition: {
            opacity: { delay: 0.04 + index * 0.06, duration: 0.38, ease: easeOut },
            scale: { delay: 0.04 + index * 0.06, duration: 0.42, ease: easeOut },
            y: {
              delay: 0.4 + index * 0.06,
              duration: 2 + (index % 3) * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              delay: 0.4 + index * 0.06,
              duration: 2.6 + (index % 3) * 0.35,
              repeat: Infinity,
              ease: 'easeInOut',
            },
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
        animate: { y: [0, -20, 0], rotate: [0, 1.8, 0, -1.8, 0] },
        transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
      }
    : {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pulse: any = on
    ? {
        animate: { scale: [1, 1.12, 1] },
        transition: { duration: 1.25, repeat: Infinity, ease: 'easeInOut' },
      }
    : {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navBounce = (index = 0): any =>
    on
      ? {
          animate: { y: [0, -8, 0] },
          transition: {
            duration: 1.45,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.14,
          },
        }
      : {}

  return {
    mode,
    animated: on,
    page,
    item,
    float,
    pulse,
    navBounce,
    hover: on
      ? { y: -16, scale: 1.05, rotate: -1.2, transition: springSoft }
      : undefined,
    tap: on ? { scale: 0.92, rotate: 1 } : undefined,
  }
}
