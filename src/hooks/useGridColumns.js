import { useEffect, useState } from 'react'

// Tracks how many columns a responsive Tailwind grid (grid-cols-1 md:grid-cols-2
// lg:grid-cols-3) is currently rendering, so scroll-reveal stagger can group
// items by their actual visual row at the current breakpoint.
export function useGridColumns({ md = 2, lg = 3 } = {}) {
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const mdQuery = window.matchMedia('(min-width: 768px)')
    const lgQuery = window.matchMedia('(min-width: 1024px)')

    function sync() {
      setColumns(lgQuery.matches ? lg : mdQuery.matches ? md : 1)
    }

    sync()
    mdQuery.addEventListener('change', sync)
    lgQuery.addEventListener('change', sync)

    return () => {
      mdQuery.removeEventListener('change', sync)
      lgQuery.removeEventListener('change', sync)
    }
  }, [md, lg])

  return columns
}
