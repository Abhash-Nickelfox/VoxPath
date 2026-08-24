import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { VIEWPORT } from '../lib/motion.js'

// Thin wrapper around Framer Motion's viewport tracking, kept as a hook for
// call sites that need raw in-view state rather than the <Reveal> component.
export function useReveal(options = VIEWPORT) {
  const ref = useRef(null)
  const isInView = useInView(ref, options)

  return [ref, isInView]
}
