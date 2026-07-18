import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface AgentCueContextValue {
  cueMessage: string | null
  setCueMessage: (message: string | null) => void
  showCue: (message: string) => void
  clearCue: () => void
}

const AgentCueContext = createContext<AgentCueContextValue | null>(null)

export function AgentCueProvider({ children }: { children: ReactNode }) {
  const [cueMessage, setCueMessage] = useState<string | null>(null)

  const showCue = useCallback((message: string) => {
    setCueMessage(message)
  }, [])

  const clearCue = useCallback(() => {
    setCueMessage(null)
  }, [])

  const value = useMemo(
    () => ({ cueMessage, setCueMessage, showCue, clearCue }),
    [clearCue, cueMessage, showCue],
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
