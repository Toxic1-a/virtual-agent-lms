import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AgentMood } from '../components/virtual-agent/agentCharacters'

export interface AgentHostConfig {
  context: string
  showAgent: boolean
  wide: boolean
  mood: AgentMood
}

interface AgentHostContextValue {
  config: AgentHostConfig
  setConfig: (next: Partial<AgentHostConfig>) => void
}

const DEFAULT_CONFIG: AgentHostConfig = {
  context: 'home',
  showAgent: true,
  wide: false,
  mood: 'idle',
}

const AgentHostContext = createContext<AgentHostContextValue | null>(null)

export function AgentHostProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<AgentHostConfig>(DEFAULT_CONFIG)

  const setConfig = useCallback((next: Partial<AgentHostConfig>) => {
    setConfigState((prev) => ({ ...prev, ...next }))
  }, [])

  const value = useMemo(() => ({ config, setConfig }), [config, setConfig])

  return <AgentHostContext.Provider value={value}>{children}</AgentHostContext.Provider>
}

export function useAgentHost() {
  const ctx = useContext(AgentHostContext)
  if (!ctx) throw new Error('useAgentHost must be used within AgentHostProvider')
  return ctx
}

/** Registers page agent chrome with the persistent host (does not remount Rive). */
export function useRegisterAgentHost(options: {
  context: string
  showAgent?: boolean
  wide?: boolean
  mood?: AgentMood
}) {
  const { setConfig } = useAgentHost()
  const { context, showAgent = true, wide = false, mood = 'idle' } = options

  useEffect(() => {
    setConfig({ context, showAgent, wide, mood })
  }, [context, showAgent, wide, mood, setConfig])
}
