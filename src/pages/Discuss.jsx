import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '../components/shared/Icon.jsx'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { SITE } from '../lib/constants.js'
import { supabase } from '../lib/supabase.js'
import { directionOffset, EASE_OUT, SPRING } from '../lib/motion.js'
import discussBg from '../assets/hero-bg.png'

const INTERESTS = ['Learner Platform', 'Moderator Tools', 'Enterprise / Institution', 'Partnership', 'Other']

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  interest: INTERESTS[0],
  message: '',
}

const FIELD_CLASSES =
  'w-full bg-transparent border-0 border-b border-outline-variant py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-300'

const FEATURES = [
  'Personalized platform demo',
  'Deployment & onboarding guidance',
  'Transparent pricing & rollout plan',
]

// Short stagger between the 7 left-column entrance items (label, heading,
// paragraph, 3 benefits, trust line).
const LEFT_STAGGER = 0.08

// This is a dedicated page (not a long homepage scroll section), so its
// entrance should play on mount regardless of initial scroll position —
// unlike the site's whileInView-based <Reveal>, which only triggers once an
// element crosses into the viewport. On mobile the stacked layout pushes
// the form mostly below the fold on load, so a whileInView version of this
// would leave it invisible until the user scrolled far enough (verified).
function EntranceItem({ as: Tag = 'div', direction = 'up', delay = 0, duration = 0.6, className, style, children }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    )
  }

  const MotionTag = motion[Tag] ?? motion.div
  const offset = directionOffset(direction)

  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </MotionTag>
  )
}

export default function Discuss() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    const { error } = await supabase.from('discuss_submissions').insert([form])

    if (error) {
      setStatus('error')
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
      return
    }

    setStatus('success')
    setForm(INITIAL_FORM)
  }

  return (
    <section className="min-h-screen bg-background pt-28 pb-12 lg:h-screen lg:pt-24 lg:pb-8 lg:flex lg:items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0" />
      <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 lg:items-center">
          <div className="relative lg:col-span-5">
            {/* Subtle product-identity visual, scoped to this column only — never behind the form. */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-10 -inset-y-16 -z-10 overflow-hidden"
              style={{
                backgroundImage: `url(${discussBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.09,
                maskImage: 'radial-gradient(ellipse 70% 60% at 30% 25%, black 0%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 30% 25%, black 0%, transparent 75%)',
              }}
            />

            <div className="relative flex flex-col gap-4 lg:gap-4">
              <EntranceItem
                as="div"
                delay={0}
                className="font-label-md text-primary tracking-widest uppercase font-semibold"
              >
                Let's Discuss
              </EntranceItem>
              {/* line-height is inline, not `leading-snug`: Tailwind's
                  responsive md:text-5xl utility carries its own bundled
                  line-height:1, which beats a plain `leading-*` class at that
                  breakpoint (same cascade-order gotcha as the Hero heading —
                  see Hero.jsx). */}
              <EntranceItem
                as="h1"
                delay={1 * LEFT_STAGGER}
                className="text-4xl md:text-5xl font-bold tracking-tighter text-on-surface"
                style={{ lineHeight: 1.2 }}
              >
                Bring <span className="text-gradient-accent">{SITE.name}</span> to your learners.
              </EntranceItem>
              <EntranceItem
                as="p"
                delay={2 * LEFT_STAGGER}
                className="font-body-lg text-on-surface-variant text-lg font-light max-w-md"
              >
                Tell us about your organization and goals. Our team will follow up with a tailored walkthrough of
                the platform and how it fits your language program.
              </EntranceItem>

              <div className="flex flex-col gap-3 mt-1">
                {FEATURES.map((label, index) => (
                  <EntranceItem
                    key={label}
                    as="div"
                    delay={(3 + index) * LEFT_STAGGER}
                    className="flex items-center gap-3 text-on-surface text-base font-medium"
                  >
                    <Icon name="check_circle" className="text-primary text-xl shrink-0" />
                    {label}
                  </EntranceItem>
                ))}
              </div>

              <EntranceItem
                as="p"
                duration={0.5}
                delay={6 * LEFT_STAGGER}
                className="text-on-surface-variant/70 text-sm mt-1"
              >
                We'll get back to you soon.
              </EntranceItem>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <div
              aria-hidden="true"
              className="absolute -inset-6 bg-primary/10 blur-3xl rounded-[2.5rem] -z-10"
            />
            <EntranceItem
              as="div"
              delay={0.3}
              duration={0.65}
              className="glass-panel glow-effect rounded-3xl p-6 md:p-7 lg:p-6 overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                    className="flex flex-col items-center text-center gap-4 py-12"
                  >
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={SPRING.bounce}
                    >
                      <Icon name="mark_email_read" className="text-primary text-5xl" />
                    </motion.div>
                    <h2 className="font-headline-md text-2xl text-on-surface">Thank you.</h2>
                    <p className="text-on-surface-variant font-body-md max-w-sm">
                      We've received your message and will get back to you shortly.
                    </p>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={SPRING.snappy}
                      onClick={() => setStatus('idle')}
                      className="mt-2 font-label-md text-primary uppercase tracking-widest hover:opacity-80"
                    >
                      Send another message
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <h2 className="font-headline-lg text-xl md:text-2xl text-on-surface">
                        Let's build the right learning experience.
                      </h2>
                      {/* <p className="text-on-surface-variant font-body-md text-sm">
                        Tell us a little about your organization and we'll take it from there.
                      </p> */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="font-label-md text-on-surface-variant uppercase tracking-widest text-xs">
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Jane Doe"
                          className={FIELD_CLASSES}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="font-label-md text-on-surface-variant uppercase tracking-widest text-xs">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="jane@company.com"
                          className={FIELD_CLASSES}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="font-label-md text-on-surface-variant uppercase tracking-widest text-xs">
                          Phone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className={FIELD_CLASSES}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="organization"
                          className="font-label-md text-on-surface-variant uppercase tracking-widest text-xs"
                        >
                          Organization
                        </label>
                        <input
                          id="organization"
                          name="organization"
                          type="text"
                          value={form.organization}
                          onChange={handleChange}
                          placeholder="Company / Institution"
                          className={FIELD_CLASSES}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="interest" className="font-label-md text-on-surface-variant uppercase tracking-widest text-xs">
                        I'm interested in
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        value={form.interest}
                        onChange={handleChange}
                        className={`${FIELD_CLASSES} rounded-none`}
                      >
                        {INTERESTS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="font-label-md text-on-surface-variant uppercase tracking-widest text-xs">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        required
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your learners and goals..."
                        className={`${FIELD_CLASSES} resize-none`}
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-error text-sm font-medium">{errorMessage}</p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={status === 'submitting'}
                      whileHover={
                        status === 'submitting'
                          ? undefined
                          : { scale: 1.03, y: -2, boxShadow: '0 16px 30px -10px rgba(6, 182, 212, 0.45)' }
                      }
                      whileTap={status === 'submitting' ? undefined : { scale: 0.97, y: 0 }}
                      transition={SPRING.snappy}
                      className="inline-flex items-center justify-center bg-dark-section text-on-dark px-8 py-3 rounded-full font-label-md font-semibold hover:bg-primary transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed self-start"
                    >
                      {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </EntranceItem>
          </div>
        </div>
      </div>
    </section>
  )
}
