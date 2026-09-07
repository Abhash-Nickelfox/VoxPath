import { motion } from 'framer-motion'
import heroDashboard from '../../assets/images/overview.png'
import heroBg from '../../assets/hero-bg.png'
import { SITE } from '../../lib/constants.js'
import { Reveal, RevealGroup, RevealItem } from '../shared/Reveal.jsx'
import MotionLink from '../shared/MotionLink.jsx'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { useTilt } from '../../hooks/useTilt.js'
import { STAGGER, VIEWPORT_EAGER, floatLoop } from '../../lib/motion.js'

export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { containerRef, style: tiltStyle, handlers: tiltHandlers } = useTilt({ max: 3 })

  return (
    <section
      id="overview"
      className="relative min-h-dvh flex items-center pt-20 pb-4 md:pt-16 md:pb-3 lg:pt-20 lg:pb-16 xl:pt-32 xl:pb-32 overflow-hidden bg-background"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0" />
      <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-[10px] items-center">
          <div className="lg:col-span-5 flex flex-col gap-3 lg:gap-6">
            {/* line-height is inline, not a `leading-*` class: Tailwind's
                responsive md:text-5xl/lg:text-6xl utilities each carry their
                own bundled line-height:1, which — being in a later media-query
                block — beats a plain `leading-*` class of equal specificity at
                those breakpoints. That 1:1 ratio clipped the "g" descender in
                "Progress." An inline style always wins regardless of cascade
                order, so it stays correct at every breakpoint. */}
            <RevealGroup
              as="h1"
              stagger={STAGGER.base}
              viewport={VIEWPORT_EAGER}
              className="text-[26px] md:text-[32px] lg:text-[44px] xl:text-[55px] font-bold tracking-tighter text-on-surface"
              style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}
            >
              <RevealItem as="span" direction="up" className="block whitespace-nowrap">
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
              className="font-body-lg text-on-surface-variant max-w-xl text-sm md:text-sm lg:text-base xl:text-lg font-light leading-normal lg:leading-normal xl:leading-relaxed"
            >
              {SITE.description}
            </Reveal>
            <Reveal direction="up" delay={0.5} viewport={VIEWPORT_EAGER} className="mt-1 lg:mt-2">
              <MotionLink
                to="/discuss"
                className="inline-flex items-center justify-center bg-primary text-white px-6 py-2 lg:px-7 lg:py-2.5 xl:px-8 xl:py-3 rounded-full font-label-md font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                {SITE.homeCtaLabel}
              </MotionLink>
            </Reveal>
          </div>

          <div className="lg:col-span-7 relative">
            <motion.div
              animate={prefersReducedMotion ? undefined : floatLoop}
              className="relative w-full lg:w-[calc(100%+8px)] mt-3 lg:mt-0 lg:ml-4 flex flex-col items-center justify-center"
            >
              <motion.div
                ref={containerRef}
                style={tiltStyle}
                {...tiltHandlers}
                className="relative w-full z-10"
              >
                <img
                  alt="VoxPath AI Dashboard"
                  className="w-full h-auto max-h-[82vh] md:max-h-[38vh] lg:max-h-[62vh] xl:max-h-[82vh] object-contain rounded-3xl mx-auto"
                  decoding="async"
                  fetchPriority="high"
                  loading="eager"
                  src={heroDashboard}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
