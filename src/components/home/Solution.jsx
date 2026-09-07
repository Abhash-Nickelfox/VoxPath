import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import solutionVisual from '../../assets/images/solution.png'
import solutionNextVisual from '../../assets/images/solution-next.png'
import { Reveal } from '../shared/Reveal.jsx'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

const STEPS = [
  {
    number: '1',
    title: 'AI Voice Assessment',
    description: 'Objective English proficiency assessment through AI-powered voice conversations.',
  },
  {
    number: '2',
    title: 'Onboarding & Level Setup',
    description:
      'Tell VoxPath about your goals and background, then receive a proficiency level and practice recommendations matched to you.',
  },
  {
    number: '3',
    title: 'Session Discovery',
    description:
      'Discover speaking sessions matched to your proficiency level, with topics, schedules, and available seats clearly displayed.',
  },
  {
    number: '4',
    title: 'Live Speaking Sessions',
    description: 'Structured, moderated group discussions with controlled speaking turns and participant management.',
  },
  {
    number: '5',
    title: 'Progress Tracking',
    description: 'Visualize your proficiency level and session scores over time, so you can see how your English is improving.',
  },
  {
    number: '6',
    title: 'Moderator Controls',
    description: 'Manage speaking turns, mute or unmute participants, and keep every group session structured.',
  },
  {
    number: '7',
    title: 'Admin & Platform Management',
    description: 'Manage users, moderators, sessions, and platform activity from a centralized admin panel.',
  },
]

// Same 1:1 aspect ratio for both visuals, so the panel's box never resizes
// between them. The panel crossfades exactly once, at the boundary between
// the assessment steps and the live-session steps, instead of swapping per
// step.
const VISUALS = [
  { src: solutionVisual, alt: 'VoxPath Ecosystem Overview' },
  { src: solutionNextVisual, alt: 'VoxPath Advanced Learning Features' },
]
const VISUAL_FOR_STEP = [0, 0, 0, 1, 1, 1, 1]

// Inactive items sit at a dimmed-but-present opacity rather than fully
// invisible — a quieter "about to activate" state that avoids long dead
// stretches of empty space while scrolling toward the next reveal.
const IDLE_OPACITY = 0.16
const REVEAL_RATIO = 0.7
const ITEM_SPAN = 1 / STEPS.length

// Each step gets an even slice of the tracked scroll range, so its reveal
// lines up with the vertical line growing past its position.
const ITEM_RANGES = STEPS.map((_, i) => {
  const start = i * ITEM_SPAN
  return [start, start + ITEM_SPAN * REVEAL_RATIO]
})

function StepItem({ step, range, progress }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [start, end] = range

  const opacity = useTransform(progress, [start, end], [IDLE_OPACITY, 1])
  const y = useTransform(progress, [start, end], [24, 0])
  const scale = useTransform(progress, [start, end], [0.98, 1])
  const numberOpacity = useTransform(progress, [start, end], [0.55, 1])

  if (prefersReducedMotion) {
    return (
      <div className="flex items-start gap-5">
        <div className="text-4xl font-display-lg text-primary font-bold leading-none">{step.number}</div>
        <div>
          <h4 className="font-headline-md text-xl mb-2 text-on-surface">{step.title}</h4>
          <p className="text-on-surface-variant font-body-md text-base">{step.description}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div style={{ opacity, y, scale }} className="flex items-start gap-5">
      <motion.div style={{ opacity: numberOpacity }} className="text-4xl font-display-lg text-primary font-bold leading-none">
        {step.number}
      </motion.div>
      <div>
        <h4 className="font-headline-md text-xl mb-2 text-on-surface">{step.title}</h4>
        <p className="text-on-surface-variant font-body-md text-base">{step.description}</p>
      </div>
    </motion.div>
  )
}

// The panel stays on the right for all 7 steps and never swaps layout — only
// its image content crossfades. It's independently sticky (not wrapped in a
// shared pin with the text list — that made the whole section feel frozen).
// `self-start` stops the grid's default stretch from forcing this column to
// the full row height, which is what gives `sticky` room to travel through
// as the (taller) step list scrolls past.
//
// `top-28` (112px) is the fixed navbar's real height (80px, verified) plus a
// clearance margin — kept constant here (not tuned smaller) so the gap below
// the navbar never shrinks or lets the image creep behind it at any step.
function StickyVisual({ progress }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [activeVisual, setActiveVisual] = useState(0)

  useMotionValueEvent(progress, 'change', (value) => {
    let activeStep = 0
    for (let i = 0; i < ITEM_RANGES.length; i += 1) {
      if (ITEM_RANGES[i][0] <= value) activeStep = i
    }
    setActiveVisual(VISUAL_FOR_STEP[activeStep])
  })

  const visual = VISUALS[activeVisual]

  return (
    <div className="lg:col-span-7 relative lg:sticky lg:top-28 self-start">
      <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full z-0 transform scale-75" />
      {/* Center the panel while stacked, then align it to the desktop grid edge
          once the sticky two-column layout takes over. */}
      <div className="relative w-full max-w-md mx-auto lg:ml-auto lg:mr-0 aspect-square z-10">
        <div aria-hidden="true" className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
          {VISUALS.map((item) => (
            <img key={item.src} alt="" decoding="async" loading="lazy" src={item.src} />
          ))}
        </div>
        <AnimatePresence initial={false}>
          <motion.img
            key={activeVisual}
            src={visual.src}
            alt={visual.alt}
            decoding="async"
            loading="lazy"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-contain rounded-[2rem] shadow-2xl shadow-primary/10"
          />
        </AnimatePresence>
      </div>
    </div>
  )
}

function ScrollProgressLine({ progress }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) return null

  return (
    <div
      aria-hidden="true"
      className="hidden lg:block absolute -left-6 top-2 bottom-2 w-px bg-outline-variant/30"
    >
      <motion.div style={{ scaleY: progress }} className="absolute inset-0 w-px bg-primary origin-top" />
    </div>
  )
}

export default function Solution() {
  const stepsRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ['start 0.7', 'end 0.6'] })
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  return (
    // No overflow-hidden here: it would silently break the sticky visual
    // panel below (position: sticky stops working under any ancestor with
    // overflow other than visible — verified). The decorative gradient is
    // already self-contained via inset-0, so nothing needs clipping.
    <section className="section-padding bg-background relative" id="solution">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent z-0" />
      <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop relative z-10">
        <Reveal direction="up" className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-block font-label-md text-primary tracking-widest uppercase mb-4 font-semibold text-2xl sm:text-4xl">
            A SEAMLESS SPEAKING JOURNEY
          </div>
          <h2 className="font-display-lg text-on-surface mb-6">One Connected Journey.</h2>
          <p className="font-body-lg text-on-surface-variant text-lg font-light">
            A connected learning experience that turns AI-powered assessment into level-matched practice, actionable feedback, and measurable progress.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div ref={stepsRef} className="relative flex flex-col gap-10">
              <ScrollProgressLine progress={progress} />
              {STEPS.map((step, i) => (
                <StepItem key={step.number} step={step} range={ITEM_RANGES[i]} progress={progress} />
              ))}
            </div>
            {/* Small fixed nudge (not a large dead-space spacer) closing the
                gap between the panel's natural CSS release point and step 7
                finishing its reveal — see StickyVisual comment. Kept outside
                `stepsRef` (the scroll-progress target) so nudging it doesn't
                also push back when each step reveals — it only extends the
                panel's containing block. Sized to match `top-28`: the release
                point is containerBottom - top - panelHeight, so raising top
                by 48px (from the previous top-16) needs this spacer 48px
                taller too, to keep the release exactly where it was. */}
            <div aria-hidden="true" className="hidden lg:block h-16" />
          </div>

          <StickyVisual progress={progress} />
        </div>
      </div>
    </section>
  )
}
