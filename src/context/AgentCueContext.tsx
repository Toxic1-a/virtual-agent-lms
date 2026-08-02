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
import type { AgentMood } from '../components/virtual-agent/agentCharacters'
import {
  buildReaction,
  type AgentReactionKind,
} from '../lib/agentReactions'
import { useAgentMode } from '../hooks/useAgentMode'

export interface ShowCueOptions {
  mood?: AgentMood
  holdMs?: number
  /** Skip if a higher-priority cue is still holding (default normal). */
  priority?: 'low' | 'normal' | 'high'
}

interface AgentCueContextValue {
  cueMessage: string | null
  cueMood: AgentMood | null
  speechMuted: boolean
  setSpeechMuted: (muted: boolean) => void
  lastMessage: string | null
  lastMood: AgentMood | null
  interactionEpoch: number
  showCue: (message: string, options?: ShowCueOptions) => void
  clearCue: () => void
  replayLastCue: () => void
  react: (kind: AgentReactionKind) => void
  bumpInteraction: () => void
  /** Transient flash mood (no message) — animated mode reactions. */
  flashMood: (mood: AgentMood, ms?: number) => void
  flashMoodActive: AgentMood | null
}

const AgentCueContext = createContext<AgentCueContextValue | null>(null)

const PRIORITY_RANK = { low: 0, normal: 1, high: 2 } as const

export function AgentCueProvider({ children }: { children: ReactNode }) {
  const mode = useAgentMode()
  const [cueMessage, setCueMessage] = useState<string | null>(null)
  const [cueMood, setCueMood] = useState<AgentMood | null>(null)
  const [speechMuted, setSpeechMutedState] = useState(false)
  const [lastMessage, setLastMessage] = useState<string | null>(null)
  const [lastMood, setLastMood] = useState<AgentMood | null>(null)
  const [interactionEpoch, setInteractionEpoch] = useState(0)
  const [flashMoodActive, setFlashMoodActive] = useState<AgentMood | null>(null)

  const clearTimerRef = useRef<number>()
  const flashTimerRef = useRef<number>()
  const activePriorityRef = useRef(0)
  const mutedRef = useRef(false)

  useEffect(() => {
    mutedRef.current = speechMuted
  }, [speechMuted])

  const clearCue = useCallback(() => {
    if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current)
    setCueMessage(null)
    setCueMood(null)
    activePriorityRef.current = 0
  }, [])

  const showCue = useCallback(
    (message: string, options?: ShowCueOptions) => {
      const priority = options?.priority ?? 'normal'
      if (PRIORITY_RANK[priority] < activePriorityRef.current && cueMessage) {
        return
      }

      if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current)

      setCueMessage(message)
      setCueMood(options?.mood ?? null)
      setLastMessage(message)
      setLastMood(options?.mood ?? null)
      activePriorityRef.current = PRIORITY_RANK[priority]
      setInteractionEpoch((n) => n + 1)

      const hold = options?.holdMs
      if (hold && hold > 0) {
        clearTimerRef.current = window.setTimeout(() => {
          setCueMessage(null)
          setCueMood(null)
          activePriorityRef.current = 0
        }, hold)
      }
    },
    [cueMessage],
  )

  const setSpeechMuted = useCallback((muted: boolean) => {
    setSpeechMutedState(muted)
    try {
      localStorage.setItem('virtual-agent-speech-muted', muted ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    try {
      setSpeechMutedState(localStorage.getItem('virtual-agent-speech-muted') === '1')
    } catch {
      /* ignore */
    }
  }, [])

  const replayLastCue = useCallback(() => {
    if (!lastMessage) return
    showCue(lastMessage, { mood: lastMood ?? 'talk', holdMs: 8000, priority: 'high' })
  }, [lastMessage, lastMood, showCue])

  const react = useCallback(
    (kind: AgentReactionKind) => {
      if (mode !== 'animated') return
      if (mutedRef.current && kind === 'idle') return
      const reaction = buildReaction(kind)
      showCue(reaction.message, {
        mood: reaction.mood,
        holdMs: reaction.holdMs,
        priority: kind === 'idle' ? 'low' : kind === 'correct' || kind === 'incorrect' ? 'high' : 'normal',
      })
    },
    [mode, showCue],
  )

  const bumpInteraction = useCallback(() => {
    setInteractionEpoch((n) => n + 1)
  }, [])

  const flashMood = useCallback((mood: AgentMood, ms = 700) => {
    if (mode !== 'animated') return
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current)
    setFlashMoodActive(mood)
    flashTimerRef.current = window.setTimeout(() => setFlashMoodActive(null), ms)
    setInteractionEpoch((n) => n + 1)
  }, [mode])

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current)
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current)
    }
  }, [])

  const value = useMemo(
    () => ({
      cueMessage,
      cueMood,
      speechMuted,
      setSpeechMuted,
      lastMessage,
      lastMood,
      interactionEpoch,
      showCue,
      clearCue,
      replayLastCue,
      react,
      bumpInteraction,
      flashMood,
      flashMoodActive,
    }),
    [
      bumpInteraction,
      clearCue,
      cueMessage,
      cueMood,
      flashMood,
      flashMoodActive,
      interactionEpoch,
      lastMessage,
      lastMood,
      react,
      replayLastCue,
      setSpeechMuted,
      showCue,
      speechMuted,
    ],
  )

  return <AgentCueContext.Provider value={value}>{children}</AgentCueContext.Provider>
}

export function useAgentCue() {
  const context = useContext(AgentCueContext)
  if (!context) {
    throw new Error('useAgentCue must be used within AgentCueProvider')
  }
  return context
}
