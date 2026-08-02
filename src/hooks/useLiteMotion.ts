import { useEffect, useState } from 'react'

/** Narrow viewports or touch/coarse pointers — throttle continuous motion. */
const QUERY = '(max-width: 768px), (pointer: coarse)'

function getLiteMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia(QUERY).matches
}

/** True on phones / touch devices where continuous CSS/JS loops should be cut. */
export function useLiteMotion(): boolean {
  const [lite, setLite] = useState(getLiteMotion)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setLite(mq.matches)

    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return lite
}
