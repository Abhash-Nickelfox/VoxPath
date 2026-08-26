export const SITE = {
  name: 'VoxPath',
  legalName: 'VoxPath',
  taglineBase: 'English Learning',
  taglineAccent: 'Built Around Real Progress.',
  description:
    'An elite AI-driven platform for focused, measurable language mastery. Every learner follows a clear, personalized path from first assessment to advanced practice, while moderators and admins get real-time visibility into who’s progressing and who needs support.',
  // The header CTA (shared across every page via Navbar) and the Home
  // page's own in-content CTAs (Hero, closing Impact section) intentionally
  // read differently now, so they're separate labels rather than one
  // shared `ctaLabel`.
  navCtaLabel: "Let's Discuss",
  ctaLabel: "Let's Connect",
  year: new Date().getFullYear(),
}

export const NAV_LINKS = [
  { label: 'Overview', href: '/#overview', id: 'overview' },
  { label: 'Challenge', href: '/#challenge', id: 'challenge' },
  { label: 'Solution', href: '/#solution', id: 'solution' },
  { label: 'Experience', href: '/#experience', id: 'experience' },
  { label: 'Impact', href: '/#impact', id: 'impact' },
]
