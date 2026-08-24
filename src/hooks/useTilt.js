import { useRef } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useCanHover } from './useCanHover.js'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

// Subtle cursor-follow 3D tilt for device mockups — desktop-only, disabled
// entirely under prefers-reduced-motion.
export function useTilt({ max = 4 } = {}) {
  const ref = useRef(null)
  const canHover = useCanHover()
  const prefersReducedMotion = usePrefersReducedMotion()
  const enabled = canHover && !prefersReducedMotion

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), springConfig)

  function handleMouseMove(event) {
    if (!enabled) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((event.clientX - rect.left) / rect.width - 0.5)
    y.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return {
    containerRef: ref,
    style: enabled ? { rotateX, rotateY, transformPerspective: 800 } : undefined,
    handlers: enabled ? { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave } : {},
  }
}
