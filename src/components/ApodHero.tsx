import { Link } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { getApod } from '../services/nasa'
import { formatDate } from '../utils/format'
import Loader from './Loader'

/** Imagen Astronómica del Día (NASA APOD, con respaldo en la NASA Image Library). */
export default function ApodHero() {
  const { data: apod, loading, error, retry } = useAsync((signal) => getApod(signal), [])

  if (loading) return <Loader message="Receiving today’s image…" />

  if (error || !apod) {
    return (
      <div role="alert" className="rounded-3xl p-8 text-center glass">
        <p className="text-nebula-300/80">
          📡 Today’s image isn’t available right now. Please try again in a moment.
        </p>
        <button type="button" onClick={retry} className="mt-4 rounded-full px-5 py-2 text-sm font-medium text-nebula-300 ring-1 ring-nebula-400/40 hover:bg-white/5 hover:text-white">
          Retry
        </button>
      </div>
    )
  }

  const image = apod.media_type === 'image' ? apod.url : apod.thumbnail_url

  return (
    <article className="grid overflow-hidden rounded-[2rem] glass glow lg:grid-cols-[1.25fr_1fr]">
      <div className="relative min-h-72 bg-cosmos-900">
        {apod.media_type === 'video' && !image ? (
          <iframe
            src={apod.url}
            title={apod.title}
            className="absolute inset-0 h-full w-full"
            allow="fullscreen"
          />
        ) : image ? (
          <a href={apod.hdurl ?? apod.url} target="_blank" rel="noreferrer" aria-label={`View “${apod.title}” in high resolution`}>
            <img src={image} alt={`Astronomy picture of the day: ${apod.title}`} className="absolute inset-0 h-full w-full object-cover" />
          </a>
        ) : null}
      </div>
      <div className="flex flex-col justify-center p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-plasma-400">
          Picture of the day · {formatDate(apod.date)}
        </p>
        <p className="mt-1 text-xs text-nebula-300/50">
          Source: {apod.source === 'library' ? 'NASA Image Library' : 'NASA APOD'}
        </p>
        <h3 className="mt-3 font-display text-2xl font-bold text-white lg:text-3xl">{apod.title}</h3>
        <p className="mt-4 line-clamp-6 leading-relaxed text-nebula-300/75">{apod.explanation}</p>
        {apod.copyright && <p className="mt-4 text-sm text-nebula-300/50">© {apod.copyright.trim()}</p>}
        {apod.source === 'library' && apod.nasa_id && (
          <Link
            to={`/explore/${encodeURIComponent(apod.nasa_id)}`}
            className="mt-6 self-start rounded-full px-5 py-2 text-sm font-medium text-nebula-300 ring-1 ring-nebula-400/40 hover:bg-white/5 hover:text-white"
          >
            View details
          </Link>
        )}
      </div>
    </article>
  )
}
