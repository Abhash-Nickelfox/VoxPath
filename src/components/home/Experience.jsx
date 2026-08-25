import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Icon from '../shared/Icon.jsx'
import { Reveal, RevealGroup, RevealItem } from '../shared/Reveal.jsx'
import { useTilt } from '../../hooks/useTilt.js'
import { SPRING } from '../../lib/motion.js'
import learnerDashboard from '../../assets/images/learner.png'
import moderatorDashboard from '../../assets/images/mederator.png'
import adminDashboard from '../../assets/images/superadmin.png'

const LEARNER_FEATURES = [
  { icon: 'check_circle', label: 'Objective AI Scoring' },
  { icon: 'check_circle', label: 'Visual Progress Tracking' },
  { icon: 'check_circle', label: 'Targeted Micro-Feedback' },
]

const MODERATOR_FEATURES = [
  { icon: 'tune', label: 'Intuitive Audio Controls' },
  { icon: 'reorder', label: 'Dynamic Speaking Order' },
  { icon: 'timer', label: 'Seamless Session Timing' },
]

const ADMIN_FEATURES = [
  { icon: 'analytics', label: 'Global Trend Analysis' },
  { icon: 'monitor_heart', label: 'Real-time Session Monitoring' },
  { icon: 'admin_panel_settings', label: 'Efficient Approval Workflows' },
]

const GLOW_CARD = 'rounded-2xl flex items-center justify-center shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)]'

const ICON_POP_VARIANTS = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: SPRING.snappy },
}

function FeatureList({ items, as = 'ul', containerClassName = 'flex flex-col gap-4 mt-4', itemClassName }) {
  return (
    <RevealGroup as={as} stagger={0.06} className={containerClassName}>
      {items.map((feature) => (
        <RevealItem
          key={feature.label}
          as={as === 'ul' ? 'li' : 'div'}
          direction="up"
          duration={0.35}
          className={itemClassName ?? 'flex items-center gap-3 text-on-surface text-base font-medium'}
        >
          <motion.span variants={ICON_POP_VARIANTS} className="inline-flex">
            <Icon name={feature.icon} className="text-primary text-xl" />
          </motion.span>{' '}
          {feature.label}
        </RevealItem>
      ))}
    </RevealGroup>
  )
}

// The card hugs the image instead of stretching to match the text column:
// `cardMaxWidthClass` sizes the outer glow-card (image width + whatever
// `paddingClass` adds on each side), and the grid uses `items-center` rather
// than `items-stretch` so the card's height comes from its own content, not
// the taller sibling. The image gets the same `rounded-2xl` as the card so it
// reads as filling the card, not floating inside a separate frame.
// `matchHeightPx`, when given, sizes the image by HEIGHT instead of width —
// used for the Super Admin card, whose landscape image would otherwise
// render much shorter than its sibling text column (a wide/short image vs. a
// tall text block). Below `lg` it still behaves like the other cards
// (full-width, natural height); at `lg`+ it switches to matching the text
// column's real height, width following from the image's own aspect ratio.
function TiltImageCard({
  src,
  alt,
  direction,
  delay = 0.15,
  background,
  maxWidthClass = 'max-w-md',
  cardMaxWidthClass = 'max-w-[480px]',
  paddingClass = 'p-4',
  matchHeightPx,
  className = '',
}) {
  const { containerRef, style: tiltStyle, handlers: tiltHandlers } = useTilt({ max: 4 })

  const cardWidthClass = matchHeightPx ? `${cardMaxWidthClass} lg:max-w-none` : cardMaxWidthClass
  const imgClassName = matchHeightPx
    ? 'w-full h-auto lg:w-auto lg:h-[var(--match-h)] lg:max-w-full object-contain rounded-2xl'
    : 'w-full h-auto object-contain rounded-2xl'

  return (
    <Reveal
      direction={direction}
      delay={delay}
      duration={0.6}
      className={`${background} ${GLOW_CARD} ${paddingClass} ${cardWidthClass} w-full mx-auto ${className}`}
    >
      <motion.div
        ref={containerRef}
        style={tiltStyle}
        {...tiltHandlers}
        className={matchHeightPx ? 'relative' : `relative w-full ${maxWidthClass}`}
      >
        <img
          alt={alt}
          className={imgClassName}
          style={matchHeightPx ? { '--match-h': `${matchHeightPx}px` } : undefined}
          src={src}
        />
      </motion.div>
    </Reveal>
  )
}

// superadmin.png is 1376x768 (landscape). Matching the text column's full
// height would sometimes need the image wider than its own grid column has
// room for — object-contain would then letterbox it (visible empty padding)
// rather than crop it. Capping the target height by what the column's width
// can honor at this image's real aspect ratio keeps it letterbox-free at
// every viewport, falling back to the narrower dimension when space is tight.
const ADMIN_IMAGE_ASPECT = 1376 / 768

export default function Experience() {
  const adminTextRef = useRef(null)
  const [adminImageHeight, setAdminImageHeight] = useState(null)

  useEffect(() => {
    const el = adminTextRef.current
    if (!el) return undefined

    const observer = new ResizeObserver((entries) => {
      const { height, width } = entries[0].contentRect
      if (height > 0 && width > 0) {
        setAdminImageHeight(Math.min(height, width / ADMIN_IMAGE_ASPECT))
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-surface" id="experience">
      <div className="flex flex-col">
        <div className="section-padding border-b border-outline-variant/20 bg-background">
          <Reveal direction="up" className="max-w-container-max mx-auto px-6 md:px-margin-desktop text-center mb-20">
            <h2 className="font-label-md text-primary tracking-widest uppercase mb-6 font-semibold text-4xl">
              DESIGNED AROUND EVERY ROLE
            </h2>
            <p className="font-body-lg text-on-surface-variant text-lg font-light max-w-3xl mx-auto">
              Every participant interacts with VoxPath differently — from the learner building confidence to the
              moderator guiding the conversation and the admin orchestrating the entire ecosystem.
            </p>
          </Reveal>

          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal
                direction="left"
                delay={0}
                className="flex flex-col justify-center gap-6 order-2 lg:order-1"
              >
                <div className="inline-block font-label-md text-primary tracking-widest uppercase mb-1 font-semibold">
                  The Learner Experience
                </div>
                <h2 className="font-headline-lg text-on-surface text-3xl md:text-4xl">Clarity &amp; Growth.</h2>
                <p className="font-body-lg text-on-surface-variant text-base font-light">
                  The Learner Dashboard is built for motivation and transparency. At a glance, learners see their
                  precise proficiency level (e.g., B2), watch their progress build over time, and get immediate,
                  specific feedback on things like pronunciation and fluency.
                </p>
                <FeatureList items={LEARNER_FEATURES} />
              </Reveal>
              <TiltImageCard
                src={learnerDashboard}
                alt="Learner App Experience"
                direction="right"
                background="bg-slate-100"
                className="order-1 lg:order-2"
              />
            </div>
          </div>
        </div>

        <div className="section-padding border-b border-outline-variant/20 bg-slate-50">
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <TiltImageCard
                src={moderatorDashboard}
                alt="Moderator App Experience"
                direction="left"
                background=""
                paddingClass=""
                cardMaxWidthClass="max-w-md"
              />
              <Reveal direction="right" delay={0} className="flex flex-col justify-center gap-6">
                <div className="inline-block font-label-md text-primary tracking-widest uppercase mb-1 font-semibold">
                  The Moderator Experience
                </div>
                <h2 className="font-headline-lg text-on-surface text-3xl md:text-4xl">Control &amp; Flow.</h2>
                <p className="font-body-lg text-on-surface-variant text-base font-light">
                  Managing a live session takes focus. The Moderator UI clears away distractions — set the
                  speaking order, manage audio, and keep time, all from one screen, so every participant gets a
                  fair chance to speak.
                </p>
                <FeatureList items={MODERATOR_FEATURES} />
              </Reveal>
            </div>
          </div>
        </div>

        <div className="section-padding bg-slate-100">
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Wrapped in a plain div (not just <Reveal>, which doesn't
                  forward refs) so its rendered height can be measured and
                  matched by the image card alongside it. */}
              <div ref={adminTextRef} className="order-2 lg:order-1">
                <Reveal direction="left" delay={0} className="flex flex-col justify-center gap-6">
                  <div className="inline-block font-label-md text-primary tracking-widest uppercase mb-1 font-semibold">
                    The Super Admin Experience
                  </div>
                  <h2 className="font-headline-lg text-on-surface text-3xl md:text-4xl">Oversight &amp; Scale.</h2>
                  <p className="font-body-lg text-on-surface-variant text-base font-light">
                    The Super Admin dashboard gives you a real-time view of the whole platform — user growth, active
                    sessions, and moderator approvals, all in one place — so scaling to more institutions never
                    means losing visibility.
                  </p>
                  <FeatureList
                    items={ADMIN_FEATURES}
                    as="div"
                    containerClassName="flex flex-wrap gap-6 mt-4"
                    itemClassName="flex items-center gap-2 text-on-surface text-sm font-medium"
                  />
                </Reveal>
              </div>
              <TiltImageCard
                src={adminDashboard}
                alt="Super Admin Dashboard"
                direction="right"
                background=""
                paddingClass=""
                maxWidthClass="max-w-lg"
                cardMaxWidthClass="max-w-lg"
                matchHeightPx={adminImageHeight}
                className="order-1 lg:order-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
