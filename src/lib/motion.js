// Centralized motion language for VoxPath — one source of truth for easing,
// durations, springs, and stagger timing so every section moves consistently.

export const EASE_EXPO = [0.16, 1, 0.3, 1]
export const EASE_OUT = [0.22, 1, 0.36, 1]

export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.7,
}

export const SPRING = {
  snappy: { type: 'spring', stiffness: 300, damping: 20 },
  soft: { type: 'spring', stiffness: 200, damping: 24 },
  bounce: { type: 'spring', stiffness: 260, damping: 18, mass: 0.8 },
}

export const STAGGER = {
  tight: 0.06,
  base: 0.08,
  loose: 0.12,
}

// Fires slightly before the element enters the viewport, and only once.
export const VIEWPORT = { once: true, margin: '-80px 0px -80px 0px', amount: 0.2 }
export const VIEWPORT_EAGER = { once: true, margin: '-40px 0px -40px 0px', amount: 0.1 }

const OFFSETS = {
  up: { y: 24, scale: 0.98 },
  down: { y: -24, scale: 0.98 },
  left: { x: -32 },
  right: { x: 32 },
  scale: { scale: 0.94 },
  none: {},
}

export function directionOffset(direction = 'up') {
  return OFFSETS[direction] ?? {}
}

export function fadeUp({ y = 24, delay = 0, duration = DURATION.base, ease = EASE_EXPO } = {}) {
  return {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration, delay, ease } },
  }
}

export function fadeIn({ delay = 0, duration = DURATION.base, ease = EASE_EXPO } = {}) {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration, delay, ease } },
  }
}

export function slideIn({ direction = 'left', delay = 0, duration = DURATION.base, ease = EASE_EXPO } = {}) {
  const offset = directionOffset(direction)
  return {
    hidden: { opacity: 0, ...offset },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration, delay, ease } },
  }
}

export function scaleIn({ scale = 0.94, delay = 0, duration = DURATION.base, ease = EASE_EXPO } = {}) {
  return {
    hidden: { opacity: 0, scale },
    visible: { opacity: 1, scale: 1, transition: { duration, delay, ease } },
  }
}

export function staggerContainer({ stagger = STAGGER.base, delayChildren = 0 } = {}) {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  }
}

// Continuous ambient loops — used sparingly so the page never feels fully static.
export const floatLoop = {
  y: [0, -8, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
}

export const breatheLoop = {
  opacity: [0.2, 0.4, 0.2],
  transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
}
