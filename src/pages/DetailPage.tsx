import { Link, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FavoriteButton from '../components/FavoriteButton'
import Loader from '../components/Loader'
import { useAsync } from '../hooks/useAsync'
import { getCosmicObject, getHdImage, NotFoundError } from '../services/nasa'
import { formatDate } from '../utils/format'

export default function DetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // FETCH 2: detalle por ID (+ imagen en alta resolución en paralelo)
  const { data, loading, error, retry } = useAsync(async (signal) => {
    const [object, hd] = await Promise.all([getCosmicObject(id, signal), getHdImage(id, signal)])
    return { object, hd }
  }, [id])

  function goBack() {
    // Si llegó directo por URL no hay historial: vamos a explorar
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/explore')
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-10">
      <button
        type="button"
        onClick={goBack}
        className="group mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-nebula-300 ring-1 ring-nebula-400/30 transition hover:bg-white/5 hover:text-white"
      >
        <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">←</span>
        Back
      </button>

      {loading && <Loader message="Zooming in with the telescope…" />}

      {error instanceof NotFoundError && (
        <EmptyState
          icon="🌑"
          title="Object not found"
          message={error.message}
          action={
            <Link to="/explore" className="rounded-full bg-linear-to-r from-nebula-500 to-plasma-500 px-6 py-3 font-semibold text-white">
              Keep exploring
            </Link>
          }
        />
      )}

      {error && !(error instanceof NotFoundError) && <ErrorState message={error.message} onRetry={retry} />}

      {data && (
        <article className="grid gap-10 lg:grid-cols-[1.3fr_1fr] animate-fade-up">
          <figure className="group relative self-start overflow-hidden rounded-[2rem] glass glow">
            <img
              src={data.hd ?? data.object.thumbnail}
              alt={`NASA image: ${data.object.title}`}
              className="max-h-[75vh] w-full bg-cosmos-900 object-contain"
            />
            {data.hd && (
              <a
                href={data.hd}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 right-4 rounded-full bg-black/55 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-nebula-500/70"
              >
                View in high resolution ↗
              </a>
            )}
            <figcaption className="sr-only">{data.object.title}</figcaption>
          </figure>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-plasma-400">{data.object.center}</p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {data.object.title}
            </h1>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4 glass">
                <dt className="text-xs uppercase tracking-wider text-nebula-300/60">Date</dt>
                <dd className="mt-1 font-medium text-white">{formatDate(data.object.date)}</dd>
              </div>
              <div className="rounded-2xl p-4 glass">
                <dt className="text-xs uppercase tracking-wider text-nebula-300/60">NASA ID</dt>
                <dd className="mt-1 truncate font-mono text-sm text-white" title={data.object.id}>{data.object.id}</dd>
              </div>
              {data.object.credit && (
                <div className="col-span-2 rounded-2xl p-4 glass">
                  <dt className="text-xs uppercase tracking-wider text-nebula-300/60">Credit</dt>
                  <dd className="mt-1 font-medium text-white">{data.object.credit}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6">
              <FavoriteButton object={data.object} variant="full" />
            </div>

            <section aria-labelledby="desc-title" className="mt-8">
              <h2 id="desc-title" className="font-display text-lg font-semibold text-white">Description</h2>
              <p className="mt-3 max-h-80 overflow-y-auto pr-2 leading-relaxed text-nebula-300/80">
                {data.object.description || 'NASA did not include a description for this image.'}
              </p>
            </section>

            {data.object.keywords.length > 0 && (
              <section aria-labelledby="tags-title" className="mt-8">
                <h2 id="tags-title" className="font-display text-lg font-semibold text-white">Explore related topics</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {data.object.keywords.map((k) => (
                    <li key={k}>
                      <Link
                        to={`/explore?topic=${encodeURIComponent(k)}`}
                        className="inline-block rounded-full bg-nebula-500/10 px-3 py-1.5 text-sm text-nebula-300 ring-1 ring-nebula-400/25 transition hover:bg-nebula-500/25 hover:text-white"
                      >
                        #{k}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </article>
      )}
    </div>
  )
}
