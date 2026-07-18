import { useEffect, useMemo, useState } from 'react'
import { useAgentCue } from '../../context/AgentCueContext'
import { useAgentScript } from '../../hooks/useCourseData'
import { AgentBubble } from './AgentBubble'

const FALLBACK_MESSAGES = ['أنا هنا لمساعدتك أثناء التعلم.']

/** Keep messages on screen longer so students can read comfortably. */
const MIN_VISIBLE_MS = 10000
const MAX_VISIBLE_MS = 16000
const HOLD_AFTER_SPEAK_MS = 2500

interface AgentSpeechProps {
  context: string
  onSpeakingChange?: (speaking: boolean) => void
}

function visibleDuration(message: string) {
  return Math.min(MAX_VISIBLE_MS, Math.max(MIN_VISIBLE_MS, message.length * 95))
}

export function AgentSpeech({ context, onSpeakingChange }: AgentSpeechProps) {
  const script = useAgentScript(context)
  const { cueMessage } = useAgentCue()
  const messages = useMemo(
    () => script?.messages ?? FALLBACK_MESSAGES,
    [script?.messages],
  )
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [context])

  const activeMessage = cueMessage ?? messages[index] ?? FALLBACK_MESSAGES[0]

  useEffect(() => {
    const duration = visibleDuration(activeMessage)
    const speakingFor = Math.max(4200, duration - HOLD_AFTER_SPEAK_MS)

    onSpeakingChange?.(true)
    const speakTimer = window.setTimeout(() => onSpeakingChange?.(false), speakingFor)

    // Pause rotation while a hover/cue message is active.
    let nextTimer: number | undefined
    if (!cueMessage) {
      nextTimer = window.setTimeout(() => {
        setIndex((current) => (current + 1) % messages.length)
      }, duration)
    }

    return () => {
      window.clearTimeout(speakTimer)
      if (nextTimer) window.clearTimeout(nextTimer)
    }
  }, [activeMessage, cueMessage, messages.length, onSpeakingChange])

  return <AgentBubble message={activeMessage} />
}
