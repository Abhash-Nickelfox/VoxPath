import { useEffect, useState } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

// True only for desktop-class pointers — gates mouse-parallax/tilt effects
// that would otherwise misbehave or feel pointless on touch devices.
export function useCanHover() {
  const [canHover, setCanHover] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY)
    const handleChange = (event) => setCanHover(event.matches)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return canHover
}
