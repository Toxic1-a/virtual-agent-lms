import { useEffect, useRef } from 'react'
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from '@rive-app/react-canvas'
import type { AgentCharacterConfig, AgentMood } from './agentCharacters'

interface RiveAgentProps {
  character: AgentCharacterConfig
  mood?: AgentMood
  speaking?: boolean
  pointerEngaged?: boolean
}

function pickAnimation(
  available: string[],
  preferred?: string,
  mood: AgentMood = 'idle',
) {
  if (preferred && available.includes(preferred)) return preferred

  const lower = available.map((name) => name.toLowerCase())
  const find = (...needles: string[]) => {
    const idx = lower.findIndex((name) => needles.some((needle) => name.includes(needle)))
    return idx >= 0 ? available[idx] : undefined
  }

  if (mood === 'talk') {
    return find('talking', 'talk', 'speak') || available[0]
  }
  if (mood === 'happy') {
    return find('gesture', 'happy', 'smile', 'wave') || find('idle') || available[0]
  }
  if (mood === 'think') {
    return find('blink', 'think', 'idle') || available[0]
  }
  return find('gesture', 'idle', 'blink') || available[0]
}

/**
 * Map any page pointer position to a point on the Rive canvas so the face
 * looks toward the mouse even when the cursor is far outside the image box.
 */
function mapPagePointerToCanvas(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
) {
  const rect = canvas.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // How far the mouse must travel from the face for a full look turn.
  const rangeX = Math.max(window.innerWidth * 0.42, rect.width * 2)
  const rangeY = Math.max(window.innerHeight * 0.42, rect.height * 2)

  const nx = Math.max(-1, Math.min(1, (clientX - centerX) / rangeX))
  const ny = Math.max(-1, Math.min(1, (clientY - centerY) / rangeY))

  const localX = ((nx + 1) / 2) * rect.width
  const localY = ((ny + 1) / 2) * rect.height

  return {
    clientX: rect.left + localX,
    clientY: rect.top + localY,
    localX,
    localY,
  }
}

function dispatchCanvasPointer(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
  type: 'pointerenter' | 'pointermove' | 'pointerleave' = 'pointermove',
) {
  const mapped = mapPagePointerToCanvas(canvas, clientX, clientY)
  const base = {
    clientX: mapped.clientX,
    clientY: mapped.clientY,
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: 'mouse' as const,
  }

  canvas.dispatchEvent(new PointerEvent(type, base))
  if (type === 'pointermove') {
    canvas.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: mapped.clientX,
        clientY: mapped.clientY,
        bubbles: true,
      }),
    )
  }

  return mapped
}

export function RiveAgent({
  character,
  mood = 'idle',
  speaking = false,
  pointerEngaged = false,
}: RiveAgentProps) {
  const activeMood: AgentMood = speaking ? 'talk' : pointerEngaged ? 'happy' : mood
  const containerRef = useRef<HTMLDivElement>(null)
  const stateMachineName = character.stateMachine || 'FaceTracking-StateMachine'

  const { rive, RiveComponent } = useRive({
    src: character.src,
    artboard: character.artboard,
    stateMachines: character.useStateMachine ? stateMachineName : undefined,
    autoplay: true,
    shouldDisableRiveListeners: false,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  })

  const trackingInput = useStateMachineInput(
    rive,
    character.useStateMachine ? stateMachineName : undefined,
    'Parent-isTracking',
  )
  const glassesInput = useStateMachineInput(
    rive,
    character.useStateMachine ? stateMachineName : undefined,
    'isOnGlasses',
  )
  const blushInput = useStateMachineInput(
    rive,
    character.useStateMachine ? stateMachineName : undefined,
    'isOnBlush',
  )

  useEffect(() => {
    if (!trackingInput) return
    trackingInput.value = true
  }, [trackingInput])

  useEffect(() => {
    if (!glassesInput) return
    glassesInput.value = speaking || pointerEngaged
  }, [glassesInput, speaking, pointerEngaged])

  useEffect(() => {
    if (!blushInput) return
    blushInput.value = activeMood === 'happy' || speaking
  }, [blushInput, activeMood, speaking])

  // Keep the face awake and follow the mouse anywhere on the page.
  useEffect(() => {
    if (!rive || !character.useStateMachine) return

    const canvas = containerRef.current?.querySelector('canvas')
    if (!canvas) return

    const activate = () => {
      const inputs = rive.stateMachineInputs(stateMachineName)
      const tracking = inputs?.find((input) => input.name === 'Parent-isTracking')
      if (tracking) tracking.value = true
      dispatchCanvasPointer(
        canvas,
        window.innerWidth / 2,
        window.innerHeight / 2,
        'pointerenter',
      )
      dispatchCanvasPointer(canvas, window.innerWidth / 2, window.innerHeight / 2)
    }

    activate()
    const bootTimer = window.setTimeout(activate, 150)

    const onMove = (event: PointerEvent) => {
      dispatchCanvasPointer(canvas, event.clientX, event.clientY)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.clearTimeout(bootTimer)
      window.removeEventListener('pointermove', onMove)
    }
  }, [rive, character.useStateMachine, stateMachineName])

  useEffect(() => {
    if (!rive) return

    rive.resizeDrawingSurfaceToCanvas()

    const animationNames = [...(rive.animationNames ?? [])]
    const stateMachineNames = [...(rive.stateMachineNames ?? [])]

    try {
      if (character.useStateMachine) {
        const sm =
          (character.stateMachine && stateMachineNames.includes(character.stateMachine)
            ? character.stateMachine
            : stateMachineNames.find((name) => /face/i.test(name)) ||
              stateMachineNames[0]) || stateMachineName

        rive.play(sm)

        const inputs = rive.stateMachineInputs(sm)
        const tracking = inputs?.find((input) => input.name === 'Parent-isTracking')
        if (tracking) tracking.value = true
        return
      }

      const preferred = character.animations?.[activeMood] || character.animations?.idle
      const chosen = pickAnimation(animationNames, preferred, activeMood)
      if (chosen) {
        rive.stop()
        rive.play(chosen)
      } else if (stateMachineNames[0]) {
        rive.play(stateMachineNames[0])
      } else {
        rive.play()
      }
    } catch {
      try {
        rive.play()
      } catch {
        /* ignore */
      }
    }
  }, [rive, character, activeMood, stateMachineName])

  useEffect(() => {
    if (!rive) return
    const onResize = () => rive.resizeDrawingSurfaceToCanvas()
    window.addEventListener('resize', onResize)
    const timer = window.setTimeout(onResize, 80)
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(timer)
    }
  }, [rive])

  return (
    <div className="mx-auto w-full max-w-[200px] sm:max-w-[260px] lg:max-w-[300px]" ref={containerRef}>
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#DCEBFF] to-[#F7FBFF] sm:h-60 lg:h-72">
        <RiveComponent className="h-full w-full" style={{ width: '100%', height: '100%' }} />
      </div>
      <span className="sr-only">
        الوكيل الافتراضي المتحرك — الحالة:{' '}
        {activeMood === 'talk'
          ? 'يتحدث'
          : activeMood === 'happy'
            ? 'سعيد'
            : activeMood === 'think'
              ? 'يفكر'
              : 'انتظار'}
      </span>
    </div>
  )
}
