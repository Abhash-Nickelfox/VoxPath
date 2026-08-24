import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from '../shared/Icon.jsx'
import MagneticButton from '../shared/MagneticButton.jsx'
import { Reveal, RevealGroup, RevealItem } from '../shared/Reveal.jsx'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { SPRING, STAGGER, breatheLoop } from '../../lib/motion.js'
import { SITE } from '../../lib/constants.js'

const TRANSFORMATIONS = [
  { title: 'Assessment', before: 'Subjective Human Grading', after: 'Objective AI Evaluation' },
  { title: 'Practice', before: 'Unstructured Ad-hoc Sessions', after: 'Curated Progressive Modules' },
  { title: 'Feedback', before: 'Vague or Non-existent', after: 'Actionable Micro-Corrections' },
  { title: 'Progress', before: 'Invisible and Unmeasured', after: 'Clear Visual Tracking' },
  { title: 'Moderation', before: 'Chaotic Group Dynamics', after: 'Structured Flow Control' },
  { title: 'Continuation', before: 'Learning Stops Post-Session', after: 'Targeted Review Materials' },
]

const CHECK_POP_VARIANTS = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: SPRING.bounce },
}

function TransformationCard({ item }) {
  return (
    <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:border-primary/30 transition-colors shadow-sm">
      <h4 className="font-headline-md text-xl mb-6 text-on-surface">{item.title}</h4>
      <RevealGroup stagger={0.35} className="flex flex-col gap-4">
        <RevealItem
          direction="up"
          duration={0.4}
          className="flex items-start gap-3 text-on-surface-variant/70"
        >
          <span className="font-label-md text-[10px] uppercase tracking-widest pt-1 w-12">Before</span>
          <div className="flex gap-2">
            <Icon name="close" className="text-on-surface-variant/50 text-base" />
            <span className="text-sm line-through">{item.before}</span>
          </div>
        </RevealItem>
        <RevealItem direction="up" duration={0.4} className="flex items-start gap-3 text-on-surface">
          <span className="font-label-md text-[10px] uppercase tracking-widest text-primary pt-1 w-12 font-semibold">
            Voxpath
          </span>
          <div className="flex gap-2">
            <motion.span variants={CHECK_POP_VARIANTS}>
              <Icon name="check" className="text-primary text-base" />
            </motion.span>
            <span className="text-sm font-medium">{item.after}</span>
          </div>
        </RevealItem>
      </RevealGroup>
    </div>
  )
}

export default function Impact() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <>
      <section className="section-padding bg-background relative overflow-hidden" id="impact">
        <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
          <Reveal direction="up" className="text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-block font-label-md text-primary tracking-widest uppercase mb-4 font-semibold text-4xl">
              MEASURABLE TRANSFORMATION
            </div>
            <p className="font-body-lg text-on-surface-variant text-lg font-light">
              VoxPath closes the gaps between assessment, practice, feedback and progress — turning fragmented
              learning into a measurable continuous experience.
            </p>
          </Reveal>

          <RevealGroup
            stagger={STAGGER.tight}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {TRANSFORMATIONS.map((item) => (
              <RevealItem key={item.title} direction="up" duration={0.5}>
                <TransformationCard item={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="py-24 bg-dark-section border-t border-outline-variant/20 text-center relative overflow-hidden">
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
            Join the elite AI-driven platform and experience the future of language mastery.
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
