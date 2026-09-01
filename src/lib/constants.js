export const SITE = {
  name: 'VoxPath',
  legalName: 'VoxPath',
  taglineBase: 'English Learning',
  taglineAccent: 'Built Around Real Progress.',
  description:
    'VoxPath uses AI to assess your English proficiency, identify where you can improve, and guide you into the right speaking practice. Practice with AI or in moderated group sessions, get meaningful feedback, and see your progress over time.',
  // The header CTA (shared across every page via Navbar) and the Home
  // page's own in-content CTAs (Hero, closing Impact section) intentionally
  // read differently now, so they're separate labels rather than one
  // shared `ctaLabel`.
  navCtaLabel: "Let's Discuss",
  ctaLabel: "Let's Connect",
  homeCtaLabel:'Start Your Assessment',
  year: new Date().getFullYear(),
}

export const NAV_LINKS = [
  { label: 'Overview', href: '/#overview', id: 'overview' },
  { label: 'Challenge', href: '/#challenge', id: 'challenge' },
  { label: 'Solution', href: '/#solution', id: 'solution' },
  { label: 'Experience', href: '/#experience', id: 'experience' },
  { label: 'Impact', href: '/#impact', id: 'impact' },
]
