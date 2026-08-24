import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { DURATION, EASE_EXPO, STAGGER, VIEWPORT, directionOffset } from '../../lib/motion.js'

/**
 * Single-element scroll reveal. Wraps children in a motion element that
 * animates in via whileInView, honoring prefers-reduced-motion by rendering
 * a plain static element instead.
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = DURATION.base,
  className = '',
  as = 'div',
  viewport = VIEWPORT,
  ...rest
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const Tag = as

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = motion[as] ?? motion.div
  const offset = directionOffset(direction)

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={viewport}
      transition={{ duration, delay, ease: EASE_EXPO }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Stagger container — pairs with <RevealItem> children. Triggers once when
 * scrolled into view and cascades each child's own variants.
 */
export function RevealGroup({
  children,
  stagger = STAGGER.base,
  delayChildren = 0,
  className = '',
  as = 'div',
  viewport = VIEWPORT,
  ...rest
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const Tag = as

  if (prefersReducedMotion) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{ visible: { transition: { staggerChildren: stagger, delayChildren } } }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/** Child of <RevealGroup> — declares its own hidden/visible variant. */
export function RevealItem({
  children,
  direction = 'up',
  duration = DURATION.base,
  ease = EASE_EXPO,
  delay = 0,
  spring,
  className = '',
  as = 'div',
  ...rest
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const Tag = as

  if (prefersReducedMotion) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  const MotionTag = motion[as] ?? motion.div
  const offset = directionOffset(direction)
  const transition = spring ? { ...spring, delay } : { duration, ease, delay }

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset },
        visible: { opacity: 1, y: 0, x: 0, scale: 1, transition },
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
