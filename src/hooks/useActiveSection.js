import { useCallback, useEffect, useRef, useState } from 'react'

// How long scrolling must be quiet before we trust scroll-driven detection
// again after a nav click's programmatic scroll.
const SETTLE_DELAY_MS = 150
// Absolute upper bound in case a click never produces scroll events at all
// (e.g. clicking the section you're already viewing) — without this the
// pin would never release and detection would freeze.
const MAX_PIN_MS = 2500

/**
 * Tracks which section id is "active" — the section whose top has most
 * recently crossed a fixed activation line just below the header — rather
 * than picking whichever section has the highest IntersectionObserver
 * ratio. Ratio-based picks are unreliable across sections of very different
 * heights, and worse, IntersectionObserver only reports entries whose ratio
 * changed since the last callback, not a full snapshot, so a naive
 * "sort visible entries by ratio" implementation can lag a section behind
 * the one actually on screen.
 *
 * Returns [activeId, activateSection]. Call activateSection(id) right when
 * a nav link is clicked to pin the active id immediately and suppress
 * scroll-driven recomputation until the resulting smooth scroll settles —
 * otherwise the scroll listener fights the click and can flicker back to
 * the previous section mid-animation.
 */
export function useActiveSection(sectionIds, { headerOffset = 0 } = {}) {
  const [activeId, setActiveId] = useState(null)
  const suppressRef = useRef(false)
  const settleTimerRef = useRef(null)
  const pinSafetyTimerRef = useRef(null)
  const rafRef = useRef(null)

  const computeActiveId = useCallback(() => {
    // The line just below the fixed header — whichever section's top has
    // scrolled up past this line (and none later has) is the one currently
    // occupying the viewport under the header.
    const activationLine = headerOffset + 1
    let current = null
    let anyFound = false

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (!el) continue
      anyFound = true
      if (el.getBoundingClientRect().top <= activationLine) {
        current = id
      }
    }

    // On a page with none of these section ids at all (e.g. /discuss), there
    // is no "active" section — falling back to sectionIds[0] here is what
    // made the navbar point at Overview while on an unrelated page.
    if (!anyFound) return null

    return current ?? sectionIds[0]
  }, [sectionIds, headerOffset])

  const scheduleRecompute = useCallback(() => {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      if (!suppressRef.current) {
        setActiveId(computeActiveId())
      }
    })
  }, [computeActiveId])

  useEffect(() => {
    function handleScroll() {
      scheduleRecompute()

      if (suppressRef.current) {
        if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
        settleTimerRef.current = setTimeout(() => {
          suppressRef.current = false
          scheduleRecompute()
        }, SETTLE_DELAY_MS)
      }
    }

    scheduleRecompute()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', scheduleRecompute)

    // Re-sync when sections mount/unmount — e.g. an animated route
    // transition swapping which page's section ids exist in the DOM.
    const mutationObserver = new MutationObserver(scheduleRecompute)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', scheduleRecompute)
      mutationObserver.disconnect()
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current)
        settleTimerRef.current = null
      }
      if (pinSafetyTimerRef.current) {
        clearTimeout(pinSafetyTimerRef.current)
        pinSafetyTimerRef.current = null
      }
    }
  }, [scheduleRecompute])

  const activateSection = useCallback(
    (id) => {
      suppressRef.current = true
      setActiveId(id)

      if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
      if (pinSafetyTimerRef.current) clearTimeout(pinSafetyTimerRef.current)
      pinSafetyTimerRef.current = setTimeout(() => {
        suppressRef.current = false
        scheduleRecompute()
      }, MAX_PIN_MS)
    },
    [scheduleRecompute],
  )

  return [activeId, activateSection]
}
