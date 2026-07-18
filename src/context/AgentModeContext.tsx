import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AgentMode } from '../types'

const STORAGE_KEY = 'virtual-agent-mode'

interface AgentModeContextValue {
  mode: AgentMode
  setMode: (mode: AgentMode) => void
  toggleMode: () => void
}

const AgentModeContext = createContext<AgentModeContextValue | null>(null)

function readStoredMode(): AgentMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'animated' ? 'animated' : 'static'
  } catch {
    return 'static'
  }
}

export function AgentModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AgentMode>(() => {
    const initial = readStoredMode()
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.agentMode = initial
    }
    return initial
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
    document.documentElement.dataset.agentMode = mode
  }, [mode])

  const setMode = useCallback((next: AgentMode) => {
    setModeState(next)
  }, [])

  const toggleMode = useCallback(() => {
    setModeState((current) => (current === 'static' ? 'animated' : 'static'))
  }, [])

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode, setMode, toggleMode],
  )

  return <AgentModeContext.Provider value={value}>{children}</AgentModeContext.Provider>
}

export function useAgentMode() {
  const ctx = useContext(AgentModeContext)
  if (!ctx) throw new Error('useAgentMode must be used within AgentModeProvider')
  return ctx.mode
}

export function useAgentModeControls() {
  const ctx = useContext(AgentModeContext)
  if (!ctx) throw new Error('useAgentModeControls must be used within AgentModeProvider')
  return ctx
}
