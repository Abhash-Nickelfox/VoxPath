import { useCallback, useEffect, useRef } from 'react'
import { Reveal } from '../shared/Reveal.jsx'
import Icon from '../shared/Icon.jsx'

const CHALLENGES = [
  {
    number: '01',
    title: 'Human Assessors',
    description:
      'Human-led assessments can be subjective, inconsistent, and difficult to scale, leaving learners without a clear, objective view of their English proficiency.',
  },
  {
    number: '02',
    title: 'No Improvement Guidance',
    description:
      "A score tells learners where they stand, not what to improve. Without actionable feedback, it's difficult to turn assessment into progress.",
  },
  {
    number: '03',
    title: 'Unstructured Practice',
    description:
      'Speaking practice is often informal and unstructured, with no scheduled sessions or proficiency-based matching to keep learners practicing at the right level.',
  },
  {
    number: '04',
    title: 'No Feedback Loop',
    description:
      'Without meaningful feedback after practice, learners struggle to identify their weaknesses and turn each session into measurable improvement.',
  },
  {
    number: '05',
    title: 'No Moderator Control',
    description:
      'Without moderator controls, group sessions can become difficult to manage, with no structured turn-taking or effective participant control.',
  },
  {
    number: '06',
    title: 'Progress Invisible',
    description:
      'Without a clear view of their progress over time, learners struggle to see how their English is improving and stay motivated to keep practicing.',
  },
  {
    number: '07',
    title: 'No Continuation',
    description:
      'Without feedback and a clear next step after each session, learners can struggle to turn individual practice sessions into sustained improvement.',
  },
]

// Step the visible card count up gradually as width allows, instead of
// jumping straight from 1 to 3: below md, one card fills the track with no
// neighbor peek (nothing else fits yet). At md (~768px, tablet) exactly 2
// full cards fit side by side with no peek. At lg (~1024px, small laptop)
// there's room for 2 full cards plus a peek of a 3rd. At xl (1280px+,
// desktop) the peek layout grows to 3 full cards plus a peek of a 4th.
const CARD_WIDTH_CLASSES = 'w-full md:w-[calc(50%-12px)] lg:w-[38%] xl:w-[27%]'

function ChallengeCard({ item, cardRef }) {
  return (
    <div
      ref={cardRef}
      className="relative flex h-full flex-col rounded-xl border border-outline-variant/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-5 lg:p-6"
    >
      <span aria-hidden="true" className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-primary/50" />
      <div className="flex items-center gap-4 mb-3">
        <span className="font-headline-lg text-4xl font-bold text-primary md:text-3xl lg:text-4xl">{item.number}</span>
      </div>
      <h3 className="font-headline-md mb-3 text-on-surface text-xl md:text-lg lg:text-xl">{item.title}</h3>
      <p className="text-on-surface-variant font-body-md text-base md:text-sm lg:text-base">{item.description}</p>
    </div>
  )
}

// A card partly clipped by the track's right edge fades toward the
// background instead of just being cut off. The forward/back arrow
// controls are NOT part of any card — they're fixed at the track's own
// edges (like the fade overlays) so they read as controls for the whole
// row, not a button embedded in whichever card happens to sit at the
// boundary. Their visibility and scroll target are still computed from
// each card's visible fraction, updated straight on the DOM (not React
// state) so scrolling stays smooth with no per-frame re-renders.
function useCarouselControls(cardCount) {
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const arrowRef = useRef(null)
  const backArrowRef = useRef(null)
  const fadeRef = useRef(null)
  const backFadeRef = useRef(null)
  const rafRef = useRef(null)
  const forwardTargetRef = useRef(-1)
  const backTargetRef = useRef(-1)

  const update = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const trackRect = track.getBoundingClientRect()
    const fractions = []

    cardRefs.current.forEach((card, index) => {
      if (!card) {
        fractions[index] = 0
        return
      }
      const rect = card.getBoundingClientRect()
      const visibleLeft = Math.max(rect.left, trackRect.left)
      const visibleRight = Math.min(rect.right, trackRect.right)
      const visibleWidth = Math.max(0, visibleRight - visibleLeft)
      const fraction = rect.width > 0 ? Math.min(1, Math.max(0, visibleWidth / rect.width)) : 1
      fractions[index] = fraction
      card.style.opacity = String(0.35 + 0.65 * fraction)
    })

    const isAtStart = fractions[0] >= 0.98
    const isAtEnd = fractions[cardCount - 1] >= 0.98
    let forwardBoundary = -1
    let backBoundary = -1

    // Forward targets the card just past the last fully-visible one, as
    // long as there's still more beyond it. Back targets the card just
    // before the first fully-visible one, as long as there's still
    // something before it. Both can be true at once for any middle
    // position, so both controls show together there.
    if (!isAtEnd) {
      for (let i = 0; i < cardCount - 1; i += 1) {
        if (fractions[i] >= 0.98 && fractions[i + 1] < 0.98) {
          forwardBoundary = i
        }
      }
    }

    if (!isAtStart) {
      for (let i = 0; i < cardCount; i += 1) {
        if (fractions[i] >= 0.98) {
          backBoundary = i
          break
        }
      }
    }

    forwardTargetRef.current = forwardBoundary >= 0 ? forwardBoundary + 1 : -1
    backTargetRef.current = backBoundary > 0 ? backBoundary - 1 : -1

    if (arrowRef.current) {
      const visible = forwardTargetRef.current >= 0
      arrowRef.current.style.opacity = visible ? '1' : '0'
      arrowRef.current.style.pointerEvents = visible ? 'auto' : 'none'
    }

    if (backArrowRef.current) {
      const visible = backTargetRef.current >= 0
      backArrowRef.current.style.opacity = visible ? '1' : '0'
      backArrowRef.current.style.pointerEvents = visible ? 'auto' : 'none'
    }

    if (fadeRef.current) {
      fadeRef.current.style.opacity = isAtEnd ? '0' : '1'
    }
    if (backFadeRef.current) {
      backFadeRef.current.style.opacity = isAtStart ? '0' : '1'
    }
  }, [cardCount])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const onScrollOrResize = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        update()
        rafRef.current = null
      })
    }

    update()
    track.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      track.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [update])

  const setCardRef = (index) => (el) => {
    cardRefs.current[index] = el
  }

  // Centers the given card index in the track, matching the snap-center
  // behavior so a click lands exactly where native scrolling would.
  const scrollToIndex = (index) => {
    const track = trackRef.current
    const card = cardRefs.current[index]
    if (!track || !card) return
    const trackRect = track.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    const delta = cardRect.left + cardRect.width / 2 - (trackRect.left + trackRect.width / 2)
    track.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const scrollForward = () => {
    if (forwardTargetRef.current >= 0) scrollToIndex(forwardTargetRef.current)
  }

  const scrollBack = () => {
    if (backTargetRef.current >= 0) scrollToIndex(backTargetRef.current)
  }

  return {
    trackRef,
    fadeRef,
    backFadeRef,
    arrowRef,
    backArrowRef,
    setCardRef,
    scrollForward,
    scrollBack,
  }
}

export default function Challenge() {
  const { trackRef, fadeRef, backFadeRef, arrowRef, backArrowRef, setCardRef, scrollForward, scrollBack } =
    useCarouselControls(CHALLENGES.length)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 })

  // Mouse-only click-and-drag scrolling for desktop — touch already gets
  // native swipe scrolling from the browser, so touch events are left alone.
  const handleMouseDown = (event) => {
    const el = trackRef.current
    if (!el) return
    isDraggingRef.current = true
    dragStartRef.current = { x: event.pageX, scrollLeft: el.scrollLeft }
  }

  const handleMouseMove = (event) => {
    if (!isDraggingRef.current) return
    const el = trackRef.current
    if (!el) return
    event.preventDefault()
    const delta = event.pageX - dragStartRef.current.x
    el.scrollLeft = dragStartRef.current.scrollLeft - delta
  }

  const endDrag = () => {
    isDraggingRef.current = false
  }

  return (
    <section className="pt-12 md:pt-16 pb-9 md:pb-12 bg-surface" id="challenge">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
        <Reveal direction="up" className="mb-10 max-w-3xl">
          <h2 className="font-label-md text-primary tracking-widest uppercase mb-6 font-semibold text-2xl sm:text-4xl">
            THE FRAGMENTED LEARNING GAP
          </h2>
          <p className="font-body-lg text-on-surface-variant text-lg font-light">
            English speaking development is often fragmented: assessment, practice, and feedback happen separately, making it
            difficult for learners to know their true proficiency, practice at the right level, and see how
            they’re improving.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.1} className="relative">
          <div
            ref={trackRef}
            role="region"
            aria-label="The seven challenges, scroll horizontally to see all"
            tabIndex={0}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 lg:gap-8 overflow-x-auto scroll-smooth py-2 cursor-grab select-none active:cursor-grabbing"
          >
            {CHALLENGES.map((item, index) => (
              <div key={item.number} className={`flex-none snap-center ${CARD_WIDTH_CLASSES}`}>
                <ChallengeCard item={item} cardRef={setCardRef(index)} />
              </div>
            ))}
          </div>

          {/* Soft fades on both edges — the cards peeking through them read
              as continuing off-screen rather than being cut off. */}
          <div
            ref={fadeRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent transition-opacity duration-300"
          />
          <div
            ref={backFadeRef}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent transition-opacity duration-300"
          />

          {/* Fixed scroll controls, anchored to the track's own edges — not
              inside any card — so they read as navigation for the whole row
              rather than a button that belongs to whichever card is at the
              boundary. */}
          <button
            type="button"
            ref={arrowRef}
            onClick={scrollForward}
            aria-label="Scroll to see more challenges"
            style={{ opacity: 0, pointerEvents: 'none' }}
            className="absolute right-0 lg:right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/30 bg-white text-primary shadow-md transition-opacity duration-300 hover:border-primary/60 hover:shadow-lg animate-nudge-right"
          >
            <Icon name="arrow_forward" className="text-xl" />
          </button>
          <button
            type="button"
            ref={backArrowRef}
            onClick={scrollBack}
            aria-label="Scroll back to previous challenges"
            style={{ opacity: 0, pointerEvents: 'none' }}
            className="absolute left-0 lg:left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/30 bg-white text-primary shadow-md transition-opacity duration-300 hover:border-primary/60 hover:shadow-lg animate-nudge-left"
          >
            <Icon name="arrow_back" className="text-xl" />
          </button>
        </Reveal>
      </div>
    </section>
  )
}
