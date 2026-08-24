import { motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import ScrollToTop from './components/shared/ScrollToTop.jsx'
import ScrollProgressBar from './components/shared/ScrollProgressBar.jsx'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion.js'
import { EASE_OUT } from './lib/motion.js'
import Home from './pages/Home.jsx'
import Discuss from './pages/Discuss.jsx'
import NotFound from './pages/NotFound.jsx'

// Enter-only transition: React Router swaps routes synchronously (no exit
// phase to animate), so this fades/slides the incoming page in rather than
// hard-cutting. Deliberately NOT wrapped in AnimatePresence — that breaks
// every whileInView scroll-reveal nested underneath it (verified: with
// AnimatePresence present, all whileInView children resolve to their final
// state immediately on mount regardless of scroll position).
export default function App() {
  const location = useLocation()
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main>
        <motion.div
          key={location.pathname}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discuss" element={<Discuss />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
