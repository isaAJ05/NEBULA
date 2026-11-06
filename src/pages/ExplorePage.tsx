import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter'
import CosmicCard from '../components/CosmicCard'
import DarkPatternModal from '../components/DarkPatternModal'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Loader from '../components/Loader'
import SearchBar from '../components/SearchBar'
import { CATEGORIES, DEFAULT_CATEGORY } from '../data/categories'
import { useAsync } from '../hooks/useAsync'
import { searchCosmos } from '../services/nasa'
import type { SortOption } from '../types/nasa'

const SORTS: { value: SortOption; label: string }[] = [
  { value: 'recent', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'az', label: 'Title A → Z' },
]

export default function ExplorePage() {
  // El estado de la búsqueda vive en la URL: así se conserva al volver desde el detalle.
  const [params, setParams] = useSearchParams()
  const topic = params.get('topic') ?? DEFAULT_CATEGORY
  const filter = params.get('q') ?? ''
  const sort = (params.get('sort') as SortOption | null) ?? 'recent'
  const center = params.get('center') ?? 'all'

  const { data, loading, error, retry } = useAsync((signal) => searchCosmos(topic, signal), [topic])

  function updateParam(key: string, value: string | null) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === null || value === '') next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )
  }

  function changeTopic(query: string) {
    setParams({ topic: query })
  }

  const centers = useMemo(() => [...new Set((data ?? []).map((o) => o.center))].sort(), [data])

  // Filtrado + orden en tiempo real (en el cliente)
  const visible = useMemo(() => {
    if (!data) return []
    const term = filter.trim().toLowerCase()
    const filtered = data.filter((obj) => {
      const matchesCenter = center === 'all' || obj.center === center
      const matchesText =
        !term ||
        obj.title.toLowerCase().includes(term) ||
        obj.description.toLowerCase().includes(term) ||
        obj.keywords.some((k) => k.toLowerCase().includes(term))
      return matchesCenter && matchesText
    })
    return [...filtered].sort((a, b) => {
      if (sort === 'az') return a.title.localeCompare(b.title, 'en')
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime()
      return sort === 'recent' ? diff : -diff
    })
  }, [data, filter, sort, center])

  const activeCategory = CATEGORIES.find((c) => c.query === topic)

  return (
    <div className="mx-auto max-w-7xl px-6 pt-12">
      <header className="animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-plasma-400">Observatory</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
          Explore the <span className="text-glow">cosmos</span>
        </h1>
        <p className="mt-3 max-w-2xl text-nebula-300/70">
          Type to instantly filter what’s already loaded, or press <kbd className="rounded bg-cosmos-700 px-1.5 py-0.5 text-xs text-white">Enter</kbd> to search the entire NASA archive.
        </p>
      </header>

      {/* Controles */}
      <section aria-label="Search and filters" className="mt-8 space-y-5">
        <SearchBar
          value={filter}
          onChange={(value) => updateParam('q', value)}
          onSubmit={(value) => setParams({ topic: value })}
        />
        <CategoryFilter categories={CATEGORIES} active={topic} onSelect={changeTopic} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-sm text-nebula-300/70">
            {loading
              ? 'Scanning the sky…'
              : data && (
                  <>
                    Showing <strong className="text-white">{visible.length}</strong> of {data.length} objects
                    {!activeCategory && (
                      <>
                        {' '}for <strong className="text-plasma-400">“{topic}”</strong>
                      </>
                    )}
                  </>
                )}
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="center-filter" className="text-sm text-nebula-300/70">Center</label>
              <select
                id="center-filter"
                value={center}
                onChange={(e) => updateParam('center', e.target.value === 'all' ? null : e.target.value)}
                className="rounded-full border border-nebula-400/25 bg-cosmos-900 px-4 py-2 text-sm text-white focus:border-plasma-500 focus:outline-none"
              >
                <option value="all">All</option>
                {centers.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-sm text-nebula-300/70">Sort by</label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="rounded-full border border-nebula-400/25 bg-cosmos-900 px-4 py-2 text-sm text-white focus:border-plasma-500 focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section aria-label="Results" className="mt-10">
        {loading && <Loader variant="grid" message="Loading NASA images…" />}

        {error && <ErrorState message={error.message} onRetry={retry} />}

        {!loading && !error && data && data.length === 0 && (
          <EmptyState
            icon="🕳️"
            title="Absolute void"
            message={`NASA found no images for “${topic}”. Try another term, like “mars” or “andromeda”.`}
            action={
              <button type="button" onClick={() => changeTopic(DEFAULT_CATEGORY)} className="rounded-full bg-linear-to-r from-nebula-500 to-plasma-500 px-6 py-3 font-semibold text-white">
                Back to galaxies
              </button>
            }
          />
        )}

        {!loading && !error && data && data.length > 0 && visible.length === 0 && (
          <EmptyState
            icon="🔭"
            title="Nothing in sight"
            message={`No loaded object matches “${filter}”. Want to search the whole archive?`}
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setParams({ topic: filter.trim() })}
                  className="rounded-full bg-linear-to-r from-nebula-500 to-plasma-500 px-6 py-3 font-semibold text-white shadow-[0_0_25px_-6px_rgb(232_121_249/0.9)]"
                >
                  Search “{filter.trim()}” on NASA
                </button>
                <button
                  type="button"
                  onClick={() => setParams({ topic: topic })}
                  className="rounded-full px-6 py-3 font-semibold text-nebula-300 ring-1 ring-nebula-400/40 hover:bg-white/5"
                >
                  Clear filters
                </button>
              </div>
            }
          />
        )}

        {!loading && !error && visible.length > 0 && (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((obj, i) => (
              <li key={obj.id}>
                <CosmicCard object={obj} index={i} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <DarkPatternModal />
    </div>
  )
}
