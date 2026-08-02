import type { ReactNode } from 'react'
import { useRegisterAgentHost } from '../../context/AgentHostContext'
import type { AgentMood } from '../virtual-agent/agentCharacters'

interface PageShellProps {
  children: ReactNode
  agentContext: string
  showAgent?: boolean
  wide?: boolean
  agentMood?: AgentMood
}

/**
 * Page body wrapper: registers agent chrome with the persistent AppLayout host.
 * Does NOT remount Header/Footer/Rive — those live in AppLayout outside route transitions.
 */
export function PageShell({
  children,
  agentContext,
  showAgent = true,
  wide = false,
  agentMood = 'idle',
}: PageShellProps) {
  useRegisterAgentHost({
    context: agentContext,
    showAgent,
    wide,
    mood: agentMood,
  })

  return <>{children}</>
}
