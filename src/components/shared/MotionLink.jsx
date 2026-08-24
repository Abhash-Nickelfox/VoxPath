import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SPRING } from '../../lib/motion.js'

const MotionRouterLink = motion.create(
  forwardRef((props, ref) => <Link ref={ref} {...props} />),
)

// Router <Link> with the site-wide button/link hover micro-interaction:
// a small spring-based scale, consistent everywhere it's used.
export default function MotionLink({ children, className = '', whileTap, whileHover, ...props }) {
  return (
    <MotionRouterLink
      className={className}
      whileHover={whileHover ?? { scale: 1.03 }}
      whileTap={whileTap ?? { scale: 0.97 }}
      transition={SPRING.snappy}
      {...props}
    >
      {children}
    </MotionRouterLink>
  )
}
