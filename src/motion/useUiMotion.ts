import { useReducedMotion } from '../hooks/useReducedMotion'
import { useLiteMotion } from '../hooks/useLiteMotion'
import { useAgentMode } from '../hooks/useAgentMode'
import {
  staggerContainer,
  staggerContainerStatic,
  staggerItem,
  staggerItemStatic,
} from '../lib/motionVariants'

const easeOut = [0.16, 1, 0.3, 1] as const
const pressTransition = { duration: 0.15, ease: 'easeOut' } as const
const hoverTransition = { duration: 0.22, ease: 'easeOut' } as const

/** Shared UI motion: dramatic when animated mode, frozen when static / reduced-motion. */
export function useUiMotion() {
  const mode = useAgentMode()
  const reduced = useReducedMotion()
  const lite = useLiteMotion()
  const animated = mode === 'animated'
  const on = animated && !reduced
  /** Full desktop loops; mobile keeps animated mode but without infinite bobbing/blur. */
  const lively = on && !lite

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page: any = on
    ? lite
      ? {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, ease: easeOut },
        }
      : {
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
    lively
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
      : on
        ? {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0, scale: 1, rotate: 0 },
            transition: {
              delay: 0.03 + index * 0.04,
              duration: 0.28,
              ease: easeOut,
            },
          }
        : {
            initial: false,
            animate: { opacity: 1, y: 0, scale: 1, rotate: 0 },
            transition: { duration: 0 },
          }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const float: any = lively
    ? {
        animate: { y: [0, -20, 0], rotate: [0, 1.8, 0, -1.8, 0] },
        transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
      }
    : {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pulse: any = lively
    ? {
        animate: { scale: [1, 1.12, 1] },
        transition: { duration: 1.25, repeat: Infinity, ease: 'easeInOut' },
      }
    : {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navBounce = (index = 0): any =>
    lively
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
    reduced,
    lite,
    page,
    item,
    float,
    pulse,
    navBounce,
    /** Global card/surface hover: translateY + scale only (animated mode). */
    hover: on
      ? lite
        ? { y: -6, scale: 1.02, transition: hoverTransition }
        : { y: -14, scale: 1.06, transition: hoverTransition }
      : undefined,
    optionHover: on
      ? lite
        ? { y: -4, scale: 1.02, transition: hoverTransition }
        : { y: -8, scale: 1.04, x: -2, transition: hoverTransition }
      : undefined,
    btnHover: on
      ? lite
        ? { y: -2, scale: 1.02, transition: hoverTransition }
        : { y: -6, scale: 1.05, transition: hoverTransition }
      : undefined,
    tap: on ? { scale: 0.97, transition: pressTransition } : undefined,
    staggerContainer: on ? staggerContainer : staggerContainerStatic,
    staggerItem: on ? staggerItem : staggerItemStatic,
    staggerProps: on
      ? { initial: 'hidden' as const, whileInView: 'visible' as const, viewport: { once: true, amount: 0.15 } }
      : { initial: false as const, animate: 'visible' as const },
  }
}
