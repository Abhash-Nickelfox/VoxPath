import { motion } from 'framer-motion'
import MotionLink from '../shared/MotionLink.jsx'
import { NAV_LINKS, SITE } from '../../lib/constants.js'
import { SPRING } from '../../lib/motion.js'

export default function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-outline-variant/30 w-full">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-8">
        <MotionLink to="/" className="flex items-center gap-3 text-on-surface">
          <span className="font-headline-md text-2xl font-bold tracking-tight">{SITE.name}</span>
        </MotionLink>

        <nav className="flex flex-wrap justify-center gap-8 text-sm font-semibold tracking-wide text-on-surface-variant">
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.id}
              href={link.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING.snappy}
              className="font-label-md hover:text-primary transition-colors uppercase"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>
      </div>

      <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop pt-8 mt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant/70">
          © {SITE.year} {SITE.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
