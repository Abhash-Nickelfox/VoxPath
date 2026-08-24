import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useCanHover } from '../../hooks/useCanHover.js'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { SPRING } from '../../lib/motion.js'

// Wraps a button/link so it subtly follows the cursor within its bounds,
// then springs back on release/leave. Desktop-only, reduced-motion-safe.
export default function MagneticButton({ children, className = '', strength = 0.3 }) {
  const ref = useRef(null)
  const canHover = useCanHover()
  const prefersReducedMotion = usePrefersReducedMotion()
  const enabled = canHover && !prefersReducedMotion

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 })

  function handleMouseMove(event) {
    if (!enabled) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={enabled ? { x: springX, y: springY } : undefined}
      className={`inline-block ${className}`}
    >
      <motion.div
        whileHover={enabled ? { scale: 1.03 } : undefined}
        whileTap={{ scale: 0.96 }}
        transition={SPRING.snappy}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
