import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import CosmicCard from '../components/CosmicCard'
import EmptyState from '../components/EmptyState'
import SearchBar from '../components/SearchBar'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import { formatYear } from '../utils/format'

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites()
  const { showToast } = useToast()
  const [filter, setFilter] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  const visible = useMemo(() => {
    const term = filter.trim().toLowerCase()
    if (!term) return favorites
    return favorites.filter(
      (f) => f.title.toLowerCase().includes(term) || f.keywords.some((k) => k.toLowerCase().includes(term)),
    )
  }, [favorites, filter])

  const stats = useMemo(() => {
    const years = favorites.map((f) => Number(formatYear(f.date))).filter((y) => !Number.isNaN(y))
    return {
      total: favorites.length,
      oldest: years.length ? Math.min(...years) : '—',
      centers: new Set(favorites.map((f) => f.center)).size,
    }
  }, [favorites])

  function handleClear() {
    clearFavorites()
    setConfirmClear(false)
    showToast('info', 'Your collection is now empty. Time for new discoveries!')
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-12">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-plasma-400">Your personal atlas</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
            My <span className="text-glow">collection</span>
          </h1>
        </div>
        {favorites.length > 0 && (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="self-start rounded-full px-5 py-2.5 text-sm font-medium text-rose-300 ring-1 ring-rose-400/40 transition hover:bg-rose-500/10 sm:self-auto"
          >
            Clear collection
          </button>
        )}
      </header>

      {favorites.length === 0 ? (
        <EmptyState
          icon="🌠"
          title="Your collection is empty"
          message="You haven’t saved any discoveries yet. Explore the cosmos and tap the ⭐ on anything that amazes you."
          action={
            <Link
              to="/explore"
              className="rounded-full bg-linear-to-r from-nebula-500 to-plasma-500 px-7 py-3.5 font-semibold text-white shadow-[0_0_30px_-6px_rgb(232_121_249)]"
            >
              Start exploring
            </Link>
          }
        />
      ) : (
        <>
          <dl className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: 'Discoveries', value: stats.total },
              { label: 'Oldest image', value: stats.oldest },
              { label: 'NASA centers', value: stats.centers },
            ].map((s) => (
              <div key={s.label} className="rounded-3xl p-5 text-center glass sm:p-6">
                <dt className="text-xs uppercase tracking-wider text-nebula-300/60">{s.label}</dt>
                <dd className="mt-2 font-display text-2xl font-bold text-glow sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <SearchBar
              value={filter}
              onChange={setFilter}
              label="Filter my collection"
              placeholder="Filter your collection…"
            />
          </div>

          {visible.length === 0 ? (
            <EmptyState icon="🔍" title="No matches" message={`Nothing in your collection matches “${filter}”.`} />
          ) : (
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((obj, i) => (
                <li key={obj.id}>
                  <CosmicCard object={obj} index={i} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmClear}
        tone="danger"
        title="Clear your entire collection?"
        message={`Your ${favorites.length} saved discoveries will be deleted. This action cannot be undone.`}
        confirmLabel="Yes, clear it"
        onConfirm={handleClear}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  )
}
