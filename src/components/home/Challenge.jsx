import { motion } from 'framer-motion'
import { Reveal, RevealGroup, RevealItem } from '../shared/Reveal.jsx'
import { useGridColumns } from '../../hooks/useGridColumns.js'
import { EASE_OUT, SPRING } from '../../lib/motion.js'

const CHALLENGES = [
  {
    number: '01',
    title: 'Human Assessors',
    description: 'Inconsistent evaluations and subjective grading create confusion for learners.',
  },
  {
    number: '02',
    title: 'No Improvement Guidance',
    description: 'Learners get a score, but no concrete steps for improving their specific weaknesses.',
  },
  {
    number: '03',
    title: 'No Structure',
    description: 'Sessions happen ad hoc, with no clear, progressive curriculum to follow.',
  },
  {
    number: '04',
    title: 'No Feedback Loop',
    description: 'Mistakes go uncorrected, so incorrect habits get reinforced instead of fixed.',
  },
  {
    number: '05',
    title: 'No Moderator Control',
    description: 'Live sessions lack tools for effective group management and balanced participation.',
  },
  {
    number: '06',
    title: 'Progress Invisible',
    description: 'Learners cannot easily track their advancement over time, reducing motivation.',
  },
  {
    number: '07',
    title: 'No Continuation',
    description: 'Learning stops when the session ends, with no targeted materials to reinforce what was covered.',
  },
]

// Row-by-row scroll reveal: every card in a row shares the same delay, so
// rows animate in as a clearly distinct unit — row 1, then row 2, then row 3
// — with enough of a gap that the sequence reads while scrolling normally,
// not just under frame-by-frame inspection.
const ROW_STAGGER = 0.35
const ROW_DURATION = 0.65

// Splits the flat item list into the rows it actually forms at the current
// column count (1/2/3 columns responsive), e.g. at 3 columns:
// [[01,02,03], [04,05,06], [07]]
function groupIntoRows(items, columns) {
  const rows = []
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns))
  }
  return rows
}

function ChallengeCard({ item }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: '0 16px 30px -16px rgba(15, 23, 42, 0.18)' }}
      whileTap={{ scale: 1.01 }}
      transition={SPRING.snappy}
      className="relative flex flex-col h-full p-6 rounded-xl bg-white/0 hover:bg-white border border-transparent hover:border-black/5"
    >
      <span aria-hidden="true" className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-primary/50" />
      <div className="flex items-center gap-4 mb-3">
        <span className="font-headline-lg text-4xl font-bold text-primary">{item.number}</span>
      </div>
      <h3 className="font-headline-md mb-3 text-on-surface text-xl">{item.title}</h3>
      <p className="text-on-surface-variant font-body-md text-base">{item.description}</p>
    </motion.div>
  )
}

export default function Challenge() {
  const columns = useGridColumns({ md: 2, lg: 3 })
  const rows = groupIntoRows(CHALLENGES, columns)

  return (
    <section className="section-padding bg-surface" id="challenge">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
        <Reveal direction="up" className="mb-20 max-w-3xl">
          <h2 className="font-label-md text-primary tracking-widest uppercase mb-6 font-semibold text-4xl">
            THE FRAGMENTED LEARNING GAP
          </h2>
          <p className="font-body-lg text-on-surface-variant text-lg font-light">
            Traditional language learning is fragmented: assessment, practice, and feedback happen in silos, with
            no clear way to measure real progress.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-10"
        >
          {rows.map((row, rowIndex) =>
            row.map((item) => (
              <RevealItem
                key={item.number}
                direction="up"
                duration={ROW_DURATION}
                ease={EASE_OUT}
                delay={rowIndex * ROW_STAGGER}
                className="h-full"
              >
                <ChallengeCard item={item} />
              </RevealItem>
            )),
          )}
        </RevealGroup>
      </div>
    </section>
  )
}
