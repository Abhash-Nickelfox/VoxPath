// A manually-driven smooth scroll. The native `window.scrollTo({behavior:
// 'smooth'})` animation is fragile — browsers cancel it outright if a
// layout-affecting DOM change happens mid-animation (verified: closing the
// mobile nav menu's AnimatePresence exit transition in the same tick as a
// native smooth scroll silently cancels the scroll). Driving position
// ourselves every frame isn't subject to that.
//
// Every per-frame call below must force `behavior: 'instant'` — the site
// sets `scroll-behavior: smooth` globally in index.css, and a bare
// `window.scrollTo(x, y)` inherits that CSS default. Without the explicit
// override, each of our ~35 per-frame calls would itself kick off a new
// competing native smooth-scroll animation targeting that frame's
// intermediate position, compounding into a slow, unpredictable crawl
// instead of the intended easing curve (verified).
export function smoothScrollTo(targetY, { duration = 600 } = {}) {
  const startY = window.scrollY
  const distance = targetY - startY
  const startTime = performance.now()

  function step(now) {
    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    const eased = 1 - (1 - t) ** 3
    window.scrollTo({ top: startY + distance * eased, left: 0, behavior: 'instant' })
    if (t < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}
