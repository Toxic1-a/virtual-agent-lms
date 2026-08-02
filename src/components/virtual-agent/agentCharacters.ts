import { assetUrl } from '../../lib/assetUrl'

/**
 * High-level agent moods for the LMS personality layer.
 * Rive face-tracking exposes glasses/blush/tracking booleans — glasses kept off
 * (baked lens glare). Artboard also includes demo BLUSH/GLASSES toggles (cropped in RiveAgent).
 */
export type AgentMood =
  | 'idle'
  | 'talk'
  | 'happy'
  | 'think'
  | 'greeting'
  | 'encouraging'
  | 'pointing'
  | 'explaining'
  | 'celebrating'
  | 'goodbye'

export interface AgentCharacterConfig {
  src: string
  artboard?: string
  /** Prefer state machine playback (e.g. face-tracking) */
  useStateMachine?: boolean
  stateMachine?: string
  /** Named timeline clips available on the artboard (expression helpers, not lip-sync). */
  animations?: {
    idle?: string
    talk?: string
    happy?: string
    think?: string
  }
}

/** Animated agent: mouse-following face tracking character */
export const ANIMATED_AGENT_CHARACTER: AgentCharacterConfig = {
  src: assetUrl('/rive/face-tracking.riv'),
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
  src: assetUrl('/rive/face-tracking-static.riv'),
  artboard: 'MichiFaceTracker',
  useStateMachine: true,
  stateMachine: 'FaceTracking-StateMachine',
}

/** @deprecated use ANIMATED_AGENT_CHARACTER */
export const AGENT_CHARACTER = ANIMATED_AGENT_CHARACTER
