import Icon from '../components/shared/Icon.jsx'
import MotionLink from '../components/shared/MotionLink.jsx'
import { Reveal } from '../components/shared/Reveal.jsx'

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0" />
      <Reveal
        direction="up"
        className="relative z-10 max-w-container-max mx-auto px-6 text-center flex flex-col items-center gap-6"
      >
        <Icon name="explore_off" className="text-primary text-6xl" />
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-on-surface">404</h1>
        <p className="font-body-lg text-on-surface-variant max-w-md text-lg font-light">
          This page has wandered off the learning path. Let's get you back on track.
        </p>
        <MotionLink
          to="/"
          className="inline-flex items-center justify-center bg-dark-section text-on-dark px-8 py-3 rounded-full font-label-md font-semibold hover:bg-primary transition-colors duration-300 mt-2"
        >
          Back to Home
        </MotionLink>
      </Reveal>
    </section>
  )
}
