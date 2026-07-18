import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type SoundKind = 'click' | 'navigate' | 'select' | 'success' | 'error'

interface SoundContextValue {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
  play: (kind: SoundKind) => void
}

const STORAGE_KEY = 'interface-sounds-enabled'
const SoundContext = createContext<SoundContextValue | null>(null)

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(() => {
    try {
      return window.localStorage.getItem(STORAGE_KEY) !== 'false'
    } catch {
      return true
    }
  })
  const contextRef = useRef<AudioContext | null>(null)

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value)
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // Sound preference remains active for the current session.
    }
  }, [])

  const play = useCallback(
    (kind: SoundKind) => {
      if (!enabled) return

      const AudioContextClass =
        window.AudioContext || (window as AudioWindow).webkitAudioContext
      if (!AudioContextClass) return

      const context = contextRef.current ?? new AudioContextClass()
      contextRef.current = context
      if (context.state === 'suspended') void context.resume()

      const tone = (
        frequency: number,
        start: number,
        duration: number,
        endFrequency = frequency,
        volume = 0.025,
      ) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        const startsAt = context.currentTime + start
        const endsAt = startsAt + duration

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(frequency, startsAt)
        oscillator.frequency.exponentialRampToValueAtTime(
          Math.max(1, endFrequency),
          endsAt,
        )
        gain.gain.setValueAtTime(0.0001, startsAt)
        gain.gain.exponentialRampToValueAtTime(volume, startsAt + 0.008)
        gain.gain.exponentialRampToValueAtTime(0.0001, endsAt)
        oscillator.connect(gain)
        gain.connect(context.destination)
        oscillator.start(startsAt)
        oscillator.stop(endsAt + 0.01)
      }

      if (kind === 'click') tone(460, 0, 0.055, 380, 0.018)
      if (kind === 'select') tone(610, 0, 0.06, 670, 0.018)
      if (kind === 'navigate') {
        tone(390, 0, 0.07, 480, 0.016)
        tone(560, 0.045, 0.08, 650, 0.014)
      }
      if (kind === 'success') {
        tone(523.25, 0, 0.13, 523.25, 0.022)
        tone(659.25, 0.09, 0.14, 659.25, 0.021)
        tone(783.99, 0.18, 0.18, 783.99, 0.02)
      }
      if (kind === 'error') tone(260, 0, 0.16, 210, 0.018)
    },
    [enabled],
  )

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const control = target?.closest<HTMLElement>(
        'button, a, label, [role="button"]',
      )
      if (!control || control.dataset.sound === 'off') return
      if (
        control instanceof HTMLButtonElement &&
        (control.disabled || control.getAttribute('aria-disabled') === 'true')
      ) {
        return
      }

      if (control.dataset.sound === 'success') play('success')
      else if (control.dataset.sound === 'error') play('error')
      else if (control instanceof HTMLAnchorElement) play('navigate')
      else if (control instanceof HTMLLabelElement) play('select')
      else play('click')
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [play])

  const value = useMemo(
    () => ({ enabled, setEnabled, play }),
    [enabled, play, setEnabled],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) throw new Error('useSound must be used within SoundProvider')
  return context
}
