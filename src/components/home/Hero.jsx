import { motion } from 'framer-motion'
import heroDashboard from '../../assets/images/overview.png'
import heroBg from '../../assets/hero-bg.png'
import { SITE } from '../../lib/constants.js'
import { Reveal, RevealGroup, RevealItem } from '../shared/Reveal.jsx'
import MotionLink from '../shared/MotionLink.jsx'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { useTilt } from '../../hooks/useTilt.js'
import { STAGGER, VIEWPORT_EAGER, breatheLoop, floatLoop } from '../../lib/motion.js'

export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { containerRef, style: tiltStyle, handlers: tiltHandlers } = useTilt({ max: 3 })

  return (
    <section
      id="overview"
      className="relative min-h-[90vh] flex items-center pt-32 pb-24 overflow-hidden bg-background"
      style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0" />
      <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <RevealGroup
              as="h1"
              stagger={STAGGER.base}
              viewport={VIEWPORT_EAGER}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-on-surface leading-snug"
              style={{ letterSpacing: '-0.03em' }}
            >
              <RevealItem as="span" direction="up" className="block">
                {SITE.taglineBase}
              </RevealItem>
              <RevealItem as="span" direction="up" delay={0.08} className="block text-gradient-accent">
                {SITE.taglineAccent}
              </RevealItem>
            </RevealGroup>
            <Reveal
              direction="up"
              delay={0.35}
              viewport={VIEWPORT_EAGER}
              className="font-body-lg text-on-surface-variant max-w-xl text-lg font-light"
            >
              {SITE.description}
            </Reveal>
            <Reveal direction="up" delay={0.5} viewport={VIEWPORT_EAGER} className="mt-2">
              <MotionLink
                to="/discuss"
                className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-full font-label-md font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                {SITE.ctaLabel}
              </MotionLink>
            </Reveal>
          </div>

          <Reveal
            direction="scale"
            delay={0.45}
            duration={0.7}
            viewport={VIEWPORT_EAGER}
            className="lg:col-span-7 relative"
          >
            <motion.div
              animate={prefersReducedMotion ? undefined : floatLoop}
              className="relative w-full mt-12 lg:mt-0 flex flex-col items-center justify-center"
            >
              <motion.div
                aria-hidden="true"
                animate={prefersReducedMotion ? undefined : breatheLoop}
                className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full z-0 transform scale-75"
              />
              <motion.div
                ref={containerRef}
                style={tiltStyle}
                {...tiltHandlers}
                className="relative w-full z-10"
              >
                <img
                  alt="VoxPath AI Dashboard"
                  className="w-full h-auto max-h-[76vh] object-contain rounded-3xl shadow-2xl shadow-primary/10 mx-auto"
                  src={heroDashboard}
                />
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
