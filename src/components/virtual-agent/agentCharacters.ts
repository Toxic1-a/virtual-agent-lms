export type AgentMood = 'idle' | 'talk' | 'happy' | 'think'

export interface AgentCharacterConfig {
  src: string
  artboard?: string
  /** Prefer state machine playback (e.g. face-tracking) */
  useStateMachine?: boolean
  stateMachine?: string
  animations?: {
    idle?: string
    talk?: string
    happy?: string
    think?: string
  }
}

/** Animated agent: mouse-following face tracking character */
export const ANIMATED_AGENT_CHARACTER: AgentCharacterConfig = {
  src: '/rive/face-tracking.riv',
  artboard: 'MichiFaceTracker',
  useStateMachine: true,
  stateMachine: 'FaceTracking-StateMachine',
  animations: {
    idle: 'strength18',
    talk: 'GlassesOn',
    happy: 'BlushOn',
    think: 'GlassesOff',
  },
}

/** Static agent: face-tracking character frozen (no mouse follow / no motion) */
export const STATIC_AGENT_CHARACTER: AgentCharacterConfig = {
  src: '/rive/face-tracking-static.riv',
  artboard: 'MichiFaceTracker',
  useStateMachine: true,
  stateMachine: 'FaceTracking-StateMachine',
}

/** @deprecated use ANIMATED_AGENT_CHARACTER */
export const AGENT_CHARACTER = ANIMATED_AGENT_CHARACTER
