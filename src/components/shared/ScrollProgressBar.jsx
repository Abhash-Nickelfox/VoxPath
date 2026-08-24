import { motion, useScroll, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

export default function ScrollProgressBar() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  if (prefersReducedMotion) return null

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[60]"
      style={{ scaleX }}
    />
  )
}
