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

// Sized so 3 full cards fit with a small symmetric peek of the neighbor on
// *both* sides at once (not just a right-edge peek) — cards snap to center,
// so whichever one you land on shows its two neighbors fully and a sliver
// of the next one out on each edge.
const CARD_WIDTH_CLASSES = 'w-[74%] md:w-[38%] lg:w-[27%]'

// Extra breathing room on the track itself (inside the scroll box, not the
// section's own container padding) so an arrow badge straddling a card's
// edge always has room to render in full — without this, a badge sitting
// right at the scrollport's own boundary gets sliced in half by the
// overflow clipping instead of just visually straddling the card.
const TRACK_EDGE_PADDING = 'px-8 md:px-10'

function ChallengeCard({ item, cardRef }) {
  return (
    <div
      ref={cardRef}
      className="relative flex h-full flex-col rounded-xl border border-outline-variant/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <span aria-hidden="true" className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-primary/50" />
      <div className="flex items-center gap-4 mb-3">
        <span className="font-headline-lg text-4xl font-bold text-primary">{item.number}</span>
      </div>
      <h3 className="font-headline-md mb-3 text-on-surface text-xl">{item.title}</h3>
      <p className="text-on-surface-variant font-body-md text-base">{item.description}</p>
    </div>
  )
}

// A card partly clipped by the track's right edge fades toward the
// background instead of just being cut off, and the card that's currently
// the last one *fully* visible gets a small animated arrow badge — both
// computed continuously from each card's own visible fraction, and written
// straight to the DOM (not React state) so scrolling stays smooth with no
// per-frame re-renders. Once the final card itself is fully visible (nothing
// left to reveal on the right), the forward badge hands off to a back badge
// on the left of the first visible card instead of just vanishing — there's
// always exactly one arrow on screen, pointing at whichever direction still
// has something to reveal.
function useEdgeFade(cardCount) {
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const arrowRefs = useRef([])
  const backArrowRefs = useRef([])
  const fadeRef = useRef(null)
  const backFadeRef = useRef(null)
  const rafRef = useRef(null)

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
    let forwardBadgeIndex = -1
    let backBadgeIndex = -1

    // Forward points at the last fully-visible card, as long as there's
    // still more beyond it. Back points at the first fully-visible card, as
    // long as there's still something before it. Both can be true at once
    // for any middle position, so both arrows show together there.
    if (!isAtEnd) {
      for (let i = 0; i < cardCount - 1; i += 1) {
        if (fractions[i] >= 0.98 && fractions[i + 1] < 0.98) {
          forwardBadgeIndex = i
        }
      }
    }

    if (!isAtStart) {
      for (let i = 0; i < cardCount; i += 1) {
        if (fractions[i] >= 0.98) {
          backBadgeIndex = i
          break
        }
      }
    }

    arrowRefs.current.forEach((arrow, index) => {
      if (!arrow) return
      const visible = index === forwardBadgeIndex
      arrow.style.opacity = visible ? '1' : '0'
      arrow.style.pointerEvents = visible ? 'auto' : 'none'
    })

    backArrowRefs.current.forEach((arrow, index) => {
      if (!arrow) return
      const visible = index === backBadgeIndex
      arrow.style.opacity = visible ? '1' : '0'
      arrow.style.pointerEvents = visible ? 'auto' : 'none'
    })

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

  const setArrowRef = (index) => (el) => {
    arrowRefs.current[index] = el
  }

  const setBackArrowRef = (index) => (el) => {
    backArrowRefs.current[index] = el
  }

  return { trackRef, fadeRef, backFadeRef, setCardRef, setArrowRef, setBackArrowRef }
}

export default function Challenge() {
  const { trackRef, fadeRef, backFadeRef, setCardRef, setArrowRef, setBackArrowRef } = useEdgeFade(CHALLENGES.length)
  const cardElsRef = useRef([])
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 })

  const registerCard = (index) => (el) => {
    cardElsRef.current[index] = el
    setCardRef(index)(el)
  }

  // Cards snap to center now, so advancing means centering the *next* card
  // in the track rather than aligning its left edge — otherwise the click
  // would fight the browser's own snap and settle somewhere else.
  const scrollToNextCard = (index) => {
    const track = trackRef.current
    const nextCard = cardElsRef.current[index + 1]
    if (!track || !nextCard) return
    const trackRect = track.getBoundingClientRect()
    const nextRect = nextCard.getBoundingClientRect()
    const delta = nextRect.left + nextRect.width / 2 - (trackRect.left + trackRect.width / 2)
    track.scrollBy({ left: delta, behavior: 'smooth' })
  }

  // Mirror of scrollToNextCard for the back badge.
  const scrollToPrevCard = (index) => {
    const track = trackRef.current
    const prevCard = cardElsRef.current[index - 1]
    if (!track || !prevCard) return
    const trackRect = track.getBoundingClientRect()
    const prevRect = prevCard.getBoundingClientRect()
    const delta = prevRect.left + prevRect.width / 2 - (trackRect.left + trackRect.width / 2)
    track.scrollBy({ left: delta, behavior: 'smooth' })
  }

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
          <h2 className="font-label-md text-primary tracking-widest uppercase mb-6 font-semibold text-4xl">
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
            className={`no-scrollbar flex snap-x snap-mandatory gap-6 lg:gap-8 overflow-x-auto scroll-smooth py-2 cursor-grab select-none active:cursor-grabbing ${TRACK_EDGE_PADDING}`}
          >
            {CHALLENGES.map((item, index) => (
              <div key={item.number} className={`relative flex-none snap-center ${CARD_WIDTH_CLASSES}`}>
                <ChallengeCard item={item} cardRef={registerCard(index)} />
                {index < CHALLENGES.length - 1 && (
                  <button
                    type="button"
                    ref={setArrowRef(index)}
                    onClick={() => scrollToNextCard(index)}
                    aria-label="Scroll to see more challenges"
                    style={{ opacity: 0, pointerEvents: 'none' }}
                    className="absolute right-0 top-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-white text-primary shadow-md transition-opacity duration-300 hover:border-primary/60 hover:shadow-lg animate-nudge-right"
                  >
                    <Icon name="arrow_forward" className="text-xl" />
                  </button>
                )}
                {index > 0 && (
                  <button
                    type="button"
                    ref={setBackArrowRef(index)}
                    onClick={() => scrollToPrevCard(index)}
                    aria-label="Scroll back to previous challenges"
                    style={{ opacity: 0, pointerEvents: 'none' }}
                    className="absolute left-0 top-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-white text-primary shadow-md transition-opacity duration-300 hover:border-primary/60 hover:shadow-lg animate-nudge-left"
                  >
                    <Icon name="arrow_back" className="text-xl" />
                  </button>
                )}
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
        </Reveal>
      </div>
    </section>
  )
}
