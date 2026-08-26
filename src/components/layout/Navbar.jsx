import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '../shared/Icon.jsx'
import MotionLink from '../shared/MotionLink.jsx'
import { NAV_LINKS, SITE } from '../../lib/constants.js'
import { useActiveSection } from '../../hooks/useActiveSection.js'
import { EASE_OUT, SPRING } from '../../lib/motion.js'
import { smoothScrollTo } from '../../lib/scroll.js'

const SECTION_IDS = NAV_LINKS.map((link) => link.id)

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(80)
  const barRef = useRef(null)
  const [activeId, activateSection] = useActiveSection(SECTION_IDS, { headerOffset: headerHeight })

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Measure the actual header bar height rather than assuming a fixed
  // number — section activation needs to account for whatever the header
  // really occupies, including if that ever changes across breakpoints.
  useEffect(() => {
    const el = barRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height
      if (height) setHeaderHeight(height)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function handleNavClick(event, link) {
    // Let modified/middle clicks behave natively (open in new tab, etc).
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    const target = document.getElementById(link.id)
    if (!target) return

    event.preventDefault()

    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight
    smoothScrollTo(Math.max(top, 0))
    window.history.pushState(null, '', link.href)

    // Set the clicked section active immediately, and hold it there through
    // the smooth-scroll animation instead of letting scroll-driven
    // detection fight over it mid-flight and settle on the wrong section.
    activateSection(link.id)
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 w-full z-50">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-outline-variant/30"
        initial={false}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      />
      <div
        ref={barRef}
        className="relative max-w-container-max mx-auto px-6 md:px-margin-desktop h-20 flex justify-between items-center"
      >
        <Link to="/" className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity">
          <span className="font-headline-md font-bold tracking-tight text-4xl text-on-surface">{SITE.name}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.id}
              href={link.href}
              onClick={(event) => handleNavClick(event, link)}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              className={`relative font-label-md uppercase text-sm pb-2 transition-colors duration-300 ${
                activeId === link.id ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.label}
              {activeId === link.id ? (
                <motion.span
                  layoutId="nav-active-indicator"
                  className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-primary rounded-full"
                  transition={SPRING.soft}
                />
              ) : (
                <motion.span
                  aria-hidden="true"
                  variants={{ rest: { scaleX: 0, opacity: 0 }, hover: { scaleX: 1, opacity: 1 } }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  style={{ transformOrigin: 'left' }}
                  className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-primary/40 rounded-full"
                />
              )}
            </motion.a>
          ))}
        </nav>

        <MotionLink
          to="/discuss"
          className="hidden lg:inline-flex items-center justify-center bg-primary text-white px-6 py-2 rounded-full font-label-md font-semibold hover:bg-primary/90 transition-colors shadow-sm"
        >
          {SITE.navCtaLabel}
        </MotionLink>

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          className="lg:hidden text-on-surface"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <Icon name={isMenuOpen ? 'close' : 'menu'} className="text-2xl" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            // Fixed + full remaining viewport height (not `relative`/`height:
            // auto`) so the panel always covers everything below the header,
            // regardless of viewport height — otherwise it only grows to fit
            // its own links, leaving the page underneath visible right below
            // the last one (verified: looked like a broken/double-rendered
            // page on tall phone screens). `100dvh` (not `100vh`) accounts
            // for mobile browser chrome that resizes the viewport.
            className="lg:hidden fixed inset-x-0 bottom-0 bg-background border-t border-outline-variant/30 px-6 py-8 flex flex-col gap-5 overflow-y-auto"
            style={{ top: headerHeight, height: `calc(100dvh - ${headerHeight}px)` }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(event) => handleNavClick(event, link)}
                className={`font-label-md uppercase text-sm transition-colors duration-300 ${
                  activeId === link.id ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {link.label}
              </a>
            ))}
            <MotionLink
              to="/discuss"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex items-center justify-center bg-primary text-white px-6 py-2.5 rounded-full font-label-md font-semibold"
            >
              {SITE.navCtaLabel}
            </MotionLink>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
