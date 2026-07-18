import { useState } from 'react'
import { RiveAgent } from './RiveAgent'
import { ANIMATED_AGENT_CHARACTER, type AgentMood } from './agentCharacters'

interface AnimatedAgentProps {
  speaking?: boolean
  mood?: AgentMood
}

export function AnimatedAgent({ speaking = false, mood = 'idle' }: AnimatedAgentProps) {
  const [pointerEngaged, setPointerEngaged] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative w-full cursor-pointer overflow-hidden rounded-card border border-secondary-100 bg-gradient-to-b from-primary-50 to-white p-2 shadow-card transition-shadow hover:shadow-lg ${
          speaking ? 'ring-2 ring-accent/40' : ''
        }`}
        onPointerEnter={() => setPointerEngaged(true)}
        onPointerLeave={() => setPointerEngaged(false)}
        onFocus={() => setPointerEngaged(true)}
        onBlur={() => setPointerEngaged(false)}
        tabIndex={0}
        aria-label="وكيل افتراضي متحرك وتفاعلي"
      >
        <RiveAgent
          character={ANIMATED_AGENT_CHARACTER}
          speaking={speaking}
          mood={mood}
          pointerEngaged={pointerEngaged}
        />
      </div>

      <p className="text-xs font-semibold text-secondary-600">الوكيل الافتراضي (متحرك)</p>
    </div>
  )
}
