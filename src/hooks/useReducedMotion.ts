import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia(QUERY).matches
}

/** Returns true when the user prefers reduced motion (system accessibility setting). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(getPrefersReducedMotion)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setReduced(mq.matches)

    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
