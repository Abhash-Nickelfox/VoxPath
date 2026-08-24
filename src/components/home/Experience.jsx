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

const GLOW_CARD = 'rounded-2xl flex items-center justify-center p-8 h-full shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)]'

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

function TiltImageCard({ src, alt, direction, delay = 0.15, background, maxWidthClass = 'max-w-sm', className = '' }) {
  const { containerRef, style: tiltStyle, handlers: tiltHandlers } = useTilt({ max: 4 })

  return (
    <Reveal direction={direction} delay={delay} duration={0.6} className={`${background} ${GLOW_CARD} ${className}`}>
      <motion.div
        ref={containerRef}
        style={tiltStyle}
        {...tiltHandlers}
        className={`relative w-full ${maxWidthClass} z-10 h-full flex flex-col justify-center`}
      >
        {/* max-h caps tall portrait mockups (learner/moderator are 768x1376)
            so the card — and the items-stretch row it drives — never grows
            taller than a comfortable viewport-relative height. */}
        <img alt={alt} className="w-full h-full max-h-[70vh] object-contain" src={src} />
      </motion.div>
    </Reveal>
  )
}

export default function Experience() {
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
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
                  The Learner Dashboard is designed for motivation and transparency. At a glance, users see their
                  precise proficiency level (e.g., B2), visualize their progress over time with elegant charts, and
                  receive immediate, actionable AI feedback on nuances like pronunciation and fluency.
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
              <TiltImageCard
                src={moderatorDashboard}
                alt="Moderator App Experience"
                direction="left"
                background="bg-slate-200"
              />
              <Reveal direction="right" delay={0} className="flex flex-col justify-center gap-6">
                <div className="inline-block font-label-md text-primary tracking-widest uppercase mb-1 font-semibold">
                  The Moderator Experience
                </div>
                <h2 className="font-headline-lg text-on-surface text-3xl md:text-4xl">Control &amp; Flow.</h2>
                <p className="font-body-lg text-on-surface-variant text-base font-light">
                  Managing live sessions requires focus. The Moderator UI strips away distractions, offering
                  powerful, intuitive controls. Set speaking orders, manage audio streams, and monitor the session
                  timer seamlessly, ensuring a balanced and productive environment for all participants.
                </p>
                <FeatureList items={MODERATOR_FEATURES} />
              </Reveal>
            </div>
          </div>
        </div>

        <div className="section-padding bg-slate-100">
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
              <Reveal
                direction="left"
                delay={0}
                className="flex flex-col justify-center gap-6 order-2 lg:order-1"
              >
                <div className="inline-block font-label-md text-primary tracking-widest uppercase mb-1 font-semibold">
                  The Super Admin Experience
                </div>
                <h2 className="font-headline-lg text-on-surface text-3xl md:text-4xl">Oversight &amp; Scale.</h2>
                <p className="font-body-lg text-on-surface-variant text-base font-light">
                  Built for scale, the Super Admin dashboard provides a commanding view of the entire platform.
                  Track global user growth, monitor active live sessions, and manage moderator approvals through a
                  sophisticated, high-performance web interface designed for operational excellence.
                </p>
                <FeatureList
                  items={ADMIN_FEATURES}
                  as="div"
                  containerClassName="flex flex-wrap gap-6 mt-4"
                  itemClassName="flex items-center gap-2 text-on-surface text-sm font-medium"
                />
              </Reveal>
              <TiltImageCard
                src={adminDashboard}
                alt="Super Admin Dashboard"
                direction="right"
                background="bg-slate-200"
                maxWidthClass="max-w-none"
                className="order-1 lg:order-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
