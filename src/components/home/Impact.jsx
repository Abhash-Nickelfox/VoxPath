import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MagneticButton from '../shared/MagneticButton.jsx'
import { Reveal, RevealGroup, RevealItem } from '../shared/Reveal.jsx'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { SPRING, STAGGER, breatheLoop } from '../../lib/motion.js'
import { SITE } from '../../lib/constants.js'

const TRANSFORMATIONS = [
  { title: 'Assessment', before: 'Subjective Human Grading', after: 'Objective AI Evaluation' },
  { title: 'Guidance', before: 'A Score, No Next Steps', after: 'Personalized Action Plans' },
  { title: 'Practice', before: 'Unstructured Ad-hoc Sessions', after: 'Curated Progressive Modules' },
  { title: 'Feedback', before: 'Vague or Non-existent', after: 'Actionable Micro-Corrections' },
  { title: 'Progress', before: 'Invisible and Unmeasured', after: 'Clear Visual Tracking' },
  { title: 'Moderation', before: 'Chaotic Group Dynamics', after: 'Structured Flow Control' },
  { title: 'Continuation', before: 'Learning Stops Post-Session', after: 'Targeted Review Materials' },
  { title: 'Oversight', before: 'Growth Outpaces Visibility', after: 'Real-Time Platform Insight' },
  { title: 'Access', before: 'Practice Tied to Class Schedules', after: 'On-Demand Speaking Practice' },
]

function TransformationCard({ item }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
      transition={SPRING.snappy}
      className="relative h-full flex flex-col overflow-hidden rounded-[28px] border border-outline-variant/15 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_36px_-20px_rgba(15,23,42,0.14)] transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_40px_-18px_rgba(15,23,42,0.16)]"
    >
      <RevealGroup stagger={0.35} className="flex min-h-0 flex-1 flex-col justify-center gap-3 p-8">
        <RevealItem as="h4" direction="up" duration={0.4} className="font-headline-md text-xl font-semibold text-on-surface tracking-tight">
          {item.title}
        </RevealItem>
        <RevealItem
          direction="up"
          duration={0.4}
          className="flex flex-col gap-1 text-on-surface-variant/60"
        >
          <span className="font-label-md text-[10px] uppercase tracking-[0.2em]">Before</span>
          <span className="text-sm leading-relaxed">{item.before}</span>
        </RevealItem>
      </RevealGroup>

      <RevealItem
        direction="up"
        duration={0.4}
        delay={0.15}
        className="flex min-h-0 flex-1 flex-col justify-center gap-1 bg-dark-section p-8"
      >
        <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
          VoxPath
        </span>
        <span className="text-base font-semibold leading-snug text-white">{item.after}</span>
      </RevealItem>
    </motion.div>
  )
}

export default function Impact() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <>
      <section className="section-padding bg-background relative overflow-hidden" id="impact">
        <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
          <Reveal direction="up" className="text-center mb-14 max-w-3xl mx-auto">
            <div className="inline-block font-label-md text-primary tracking-widest uppercase mb-4 font-semibold text-2xl sm:text-4xl">
              MEASURABLE TRANSFORMATION
            </div>
            <p className="font-body-lg text-on-surface-variant text-lg font-light">
              VoxPath closes the gaps between assessment, practice, feedback, and progress, turning a fragmented
              process into one connected, measurable experience.
            </p>
          </Reveal>

          <RevealGroup
            stagger={STAGGER.tight}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {TRANSFORMATIONS.map((item) => (
              <RevealItem key={item.title} direction="up" duration={0.5} className="h-full">
                <TransformationCard item={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section-padding bg-dark-section border-t border-outline-variant/20 text-center relative overflow-hidden">
        <motion.div
          aria-hidden="true"
          animate={prefersReducedMotion ? undefined : breatheLoop}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent z-0"
        />
        <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop relative z-10 flex flex-col items-center gap-6">
          <Reveal direction="up" as="h2" className="font-display-lg text-white text-3xl md:text-5xl tracking-tight">
            Ready to Transform Your Learning?
          </Reveal>
          <Reveal
            direction="up"
            delay={0.1}
            as="p"
            className="font-body-lg text-base md:text-lg max-w-2xl font-light text-slate-300"
          >
            See how VoxPath can bring structure, feedback, and measurable progress to your language program.
          </Reveal>
          <Reveal direction="up" delay={0.2} className="mt-4">
            <MagneticButton>
              <Link
                to="/discuss"
                className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-full font-label-md font-semibold hover:bg-primary/90 transition-colors duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                {SITE.ctaLabel}
              </Link>
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </>
  )
}
