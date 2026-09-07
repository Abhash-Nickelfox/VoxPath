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
  { icon: 'check_circle', label: 'Objective AI Assessment' },
  { icon: 'check_circle', label: 'Visual Progress Tracking' },
  { icon: 'check_circle', label: 'Detailed Skill Feedback' },
  { icon: 'check_circle', label: 'Pronunciation & Fluency Analysis' },
]

const MODERATOR_FEATURES = [
  { icon: 'tune', label: 'Intuitive Audio Controls' },
  { icon: 'reorder', label: 'Dynamic Speaking Order' },
  { icon: 'timer', label: 'Seamless Session Timing' },
  { icon: 'forum', label: 'Live Chat & Engagement Insights' },
]

const ADMIN_FEATURES = [
  { icon: 'analytics', label: 'Global Trend Analysis' },
  { icon: 'monitor_heart', label: 'Real-time Session Monitoring' },
  { icon: 'admin_panel_settings', label: 'Efficient Approval Workflows' },
  { icon: 'payments', label: 'Revenue & Monetization Insights' },
]

const GLOW_CARD = 'rounded-2xl flex items-center justify-center shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)]'

const ICON_POP_VARIANTS = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: SPRING.snappy },
}

function FeatureList({ items, as = 'ul', containerClassName = 'flex flex-col gap-2 mt-2', itemClassName }) {
  return (
    <RevealGroup as={as} stagger={0.06} className={containerClassName}>
      {items.map((feature) => (
        <RevealItem
          key={feature.label}
          as={as === 'ul' ? 'li' : 'div'}
          direction="up"
          duration={0.35}
          className={itemClassName ?? 'flex items-center gap-3 text-on-surface text-base font-medium lg:text-sm xl:text-base'}
        >
          <motion.span variants={ICON_POP_VARIANTS} className="inline-flex">
            <Icon name={feature.icon} className="text-primary text-xl lg:text-lg xl:text-xl" />
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
  // `lg:mx-auto` centers the card inside its (wider) grid column, leaving
  // unused space on whichever side faces the navbar's edge. Callers pass
  // `lg:ml-auto`/`lg:mr-auto` instead, so the card hugs the boundary it's
  // visually meant to align with (the same one the navbar spans to) —
  // any slack becomes extra gap toward the text column, not dead space.
  alignClass = 'lg:mx-auto',
  mobileLayoutClass = 'w-full mx-auto',
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
      // Below `lg`, keep dashboard screenshots contained and centered so they
      // scale proportionally inside the page padding. `lg:` reverts to the
      // desktop grid alignment supplied by each caller.
      className={`${background} ${GLOW_CARD} ${paddingClass} ${cardWidthClass} ${mobileLayoutClass} lg:w-full ${alignClass} ${className}`}
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
          decoding="async"
          loading="lazy"
          style={matchHeightPx ? { '--match-h': `${matchHeightPx}px` } : undefined}
          src={src}
        />
      </motion.div>
    </Reveal>
  )
}

// All three dashboard images are landscape (wide/short), so at a fixed width
// they render noticeably shorter than their sibling text column (a tall
// stack of heading + paragraph + feature list). Matching image height to the
// text column's real height — rather than sizing the image by width and
// letting height just follow — is what makes the two columns feel balanced.
// Aspect ratios must track the actual files, not be assumed: a stale
// constant here previously caused letterboxing (verified) when an asset was
// swapped for one with different dimensions.
const LEARNER_IMAGE_ASPECT = 1376 / 768
const MODERATOR_IMAGE_ASPECT = 1672 / 941
const ADMIN_IMAGE_ASPECT = 1774 / 887

// Measures `ref`'s rendered height (the text column) and returns the target
// height for its sibling image. Capped by `imageAvailableWidth / aspect` —
// matching the full text height would sometimes need the image wider than
// its grid column has room for, and object-contain would letterbox rather
// than crop it (visible empty padding exposing the section's background —
// verified). Falls back to the narrower dimension instead, so it's always
// letterbox-free.
//
// `imageWidthRatio` converts the measured TEXT column's width into the
// IMAGE column's width — they're no longer equal since the grid uses an
// asymmetric fr split (e.g. 3fr/5fr) to give the image more room. fr units
// divide space proportionally regardless of the fixed gap between them, so
// imageWidth = textWidth * (imageFr / textFr) exactly (verified against the
// rendered grid-template-columns). Passing 1 recovers the old 1:1 behavior.
//
// `cardPaddingPx`, for a card that keeps its own padding around the image,
// is subtracted from the available width *before* dividing by aspect, and
// from the target height too — both dimensions of the card's content box
// shrink by the same padding, so both sides of the ratio need to account
// for it, not just the final height (folding it in only after
// the width-based cap was computed against the un-padded width, which
// undershoots the achievable height — verified).
function useMatchHeight(ref, aspect, imageWidthRatio = 1, cardPaddingPx = 0) {
  const [height, setHeight] = useState(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const observer = new ResizeObserver((entries) => {
      const { height: h, width } = entries[0].contentRect
      if (h > 0 && width > 0) {
        const targetHeight = h - cardPaddingPx
        const imageAvailableWidth = width * imageWidthRatio - cardPaddingPx
        setHeight(Math.max(Math.min(targetHeight, imageAvailableWidth / aspect), 0))
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, aspect, imageWidthRatio, cardPaddingPx])

  return height
}

// Each block's grid ratio, matched to its own ` lg:grid-cols-[...]`. Learner
// now shares Moderator's exact 7:4 image:text ratio, so both blocks give
// their text and image columns the same proportional width. Super Admin
// keeps its own tuned ratio: pushing it to match would narrow its text
// column enough to flip its feature-tag row onto an extra line, jumping its
// target height up rather than down (verified) — text wrapping changes in
// discrete steps, not smoothly, so that block still needs its own value.
const LEARNER_WIDTH_RATIO = 7 / 4
const MODERATOR_WIDTH_RATIO = 7 / 4
const ADMIN_WIDTH_RATIO = 1.8375

export default function Experience() {
  const learnerTextRef = useRef(null)
  const moderatorTextRef = useRef(null)
  const adminTextRef = useRef(null)

  // All three cards are borderless/paddingless now (0) — Learner previously
  // kept its own p-4 + bg-slate-100 frame, but that's what was creating an
  // unwanted background around the image; removed for consistency with
  // Moderator and Super Admin.
  const learnerImageHeight = useMatchHeight(learnerTextRef, LEARNER_IMAGE_ASPECT, LEARNER_WIDTH_RATIO, 0)
  const moderatorTextHeight = useMatchHeight(moderatorTextRef, MODERATOR_IMAGE_ASPECT, MODERATOR_WIDTH_RATIO)
  const adminImageHeight = useMatchHeight(adminTextRef, ADMIN_IMAGE_ASPECT, ADMIN_WIDTH_RATIO)

  return (
    <section className="bg-surface" id="experience">
      <div className="flex flex-col">
        <div className="pt-9 md:pt-12 pb-12 md:pb-16 border-b border-outline-variant/20 bg-background">
          {/* Container sizing lives on this static wrapper, not on the
              <Reveal> itself — matching every other section on the site.
              Putting `max-w-container-max` directly on an animated Reveal
              (as this used to) briefly shrinks its measured width to 98% of
              the navbar's during the scale-in transition, which is exactly
              the kind of alignment drift this container pattern is meant to
              prevent. */}
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
            <Reveal direction="up" className="text-center mb-14">
              <h2 className="font-label-md text-primary tracking-widest uppercase mb-6 font-semibold text-2xl sm:text-4xl">
                DESIGNED AROUND EVERY ROLE
              </h2>
              <p className="font-body-lg text-on-surface-variant text-lg font-light max-w-3xl mx-auto">
                Every user interacts with VoxPath differently, from learners building their English proficiency to 
                moderators guiding sessions and admins managing the platform.
              </p>
            </Reveal>
          </div>

          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
            {/* Asymmetric at lg+ (2fr text / 3fr image, not an even 50/50)
                so the image column has enough width to reach the text
                column's real height without cropping — these are landscape
                screenshots, and at an even split they render shorter than
                the text stack next to them. 2fr is still a comfortably
                readable paragraph width. */}
            <div className="grid grid-cols-1 lg:grid-cols-[4fr_7fr] gap-16 lg:gap-10 xl:gap-16 items-center">
              <div ref={learnerTextRef} className="order-1">
                <Reveal direction="left" delay={0} className="flex flex-col justify-center gap-6 lg:gap-4 xl:gap-6">
                  <div className="inline-block font-label-md text-primary tracking-widest uppercase mb-1 font-semibold">
                    The Learner Experience
                  </div>
                  <h2 className="font-headline-lg text-on-surface text-3xl md:text-4xl lg:text-3xl xl:text-4xl">Clarity &amp; Growth.</h2>
                  <p className="font-body-lg text-on-surface-variant text-base font-light lg:text-sm xl:text-base">
                    The learner experience brings assessment, practice, feedback, and progress into one connected journey. 
                    Learners see their proficiency level, review performance across key English skills, receive detailed 
                    feedback after sessions, and track their improvement over time.
                  </p>
                  <FeatureList items={LEARNER_FEATURES} />
                </Reveal>
              </div>
              <TiltImageCard
                src={learnerDashboard}
                alt="Learner App Experience"
                direction="right"
                background=""
                paddingClass=""
                maxWidthClass="max-w-[544px]"
                cardMaxWidthClass="max-w-[544px]"
                matchHeightPx={learnerImageHeight}
                alignClass="lg:mr-0 lg:ml-auto"
                className="order-2"
              />
            </div>
          </div>
        </div>

        <div className="section-padding border-b border-outline-variant/20 bg-slate-50">
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
            {/* 3fr/2fr (inverted from Learner/Super Admin's 2fr/3fr): the
                image sits in the first track here, so it needs the *larger*
                share to get the same extra width — same reasoning as above. */}
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_4fr] gap-16 lg:gap-10 xl:gap-16 items-center">
              <TiltImageCard
                src={moderatorDashboard}
                alt="Moderator App Experience"
                direction="left"
                background=""
                paddingClass=""
                maxWidthClass="max-w-[544px]"
                cardMaxWidthClass="max-w-[544px]"
                matchHeightPx={moderatorTextHeight}
                alignClass="lg:ml-0 lg:mr-auto"
                className="order-2 lg:order-1"
              />
              <div ref={moderatorTextRef} className="order-1 lg:order-2">
                <Reveal direction="right" delay={0} className="flex flex-col justify-center gap-6 lg:gap-4 xl:gap-6">
                  <div className="inline-block font-label-md text-primary tracking-widest uppercase mb-1 font-semibold">
                    The Moderator Experience
                  </div>
                  <h2 className="font-headline-lg text-on-surface text-3xl md:text-4xl lg:text-3xl xl:text-4xl">Control &amp; Flow.</h2>
                  <p className="font-body-lg text-on-surface-variant text-base font-light lg:text-sm xl:text-base">
                    Managing a live session takes focus. The Moderator UI clears away distractions: set the
                    speaking order, manage audio, and keep time, all from one screen, so every participant gets a
                    fair chance to speak.
                  </p>
                  <FeatureList items={MODERATOR_FEATURES} />
                </Reveal>
              </div>
            </div>
          </div>
        </div>

        <div className="section-padding bg-slate-100">
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-[4fr_7.35fr] gap-16 lg:gap-10 xl:gap-16 items-center">
              {/* Wrapped in a plain div (not just <Reveal>, which doesn't
                  forward refs) so its rendered height can be measured and
                  matched by the image card alongside it. */}
              <div ref={adminTextRef} className="order-1">
                <Reveal direction="left" delay={0} className="flex flex-col justify-center gap-6 lg:gap-4 xl:gap-6">
                  <div className="inline-block font-label-md text-primary tracking-widest uppercase mb-1 font-semibold">
                    The Super Admin Experience
                  </div>
                  <h2 className="font-headline-lg text-on-surface text-3xl md:text-4xl lg:text-3xl xl:text-4xl">Oversight &amp; Scale.</h2>
                  <p className="font-body-lg text-on-surface-variant text-base font-light lg:text-sm xl:text-base">
                    The Super Admin dashboard gives you a real-time view of the whole platform: user growth, active
                    sessions, and moderator approvals, all in one place. Scaling to more institutions never
                    means losing visibility.
                  </p>
                  {/* A fixed 2-column grid (not flex-wrap) wraps deterministically
                      at exactly 2 items per row regardless of the column's
                      exact width — flex-wrap's row count shifted with small
                      width changes, which threw off the height-matching math
                      below (verified). */}
                  <FeatureList
                    items={ADMIN_FEATURES}
                    as="div"
                    containerClassName="grid grid-cols-2 gap-x-6 gap-y-3 mt-4 lg:gap-x-4 lg:gap-y-2 xl:gap-x-6 xl:gap-y-3"
                    itemClassName="flex items-center gap-2 text-on-surface text-sm font-medium lg:text-xs xl:text-sm"
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
                alignClass="lg:mr-0 lg:ml-auto"
                className="order-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
