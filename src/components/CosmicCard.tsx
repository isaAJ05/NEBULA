import { Link } from 'react-router-dom'
import type { CosmicObject } from '../types/nasa'
import { formatYear } from '../utils/format'
import FavoriteButton from './FavoriteButton'

interface CosmicCardProps {
  object: CosmicObject
  index?: number
}

export default function CosmicCard({ object, index = 0 }: CosmicCardProps) {
  return (
    <article
      className="group relative overflow-hidden rounded-3xl glass transition-all duration-500 hover:-translate-y-1.5 hover:border-nebula-400/50 hover:shadow-[0_20px_60px_-15px_rgb(168_85_247/0.6)] animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
    >
      <Link to={`/explore/${encodeURIComponent(object.id)}`} className="block focus-visible:outline-offset-[-3px]">
        <div className="relative aspect-[4/3] overflow-hidden bg-cosmos-800">
          <img
            src={object.thumbnail}
            alt={`NASA image: ${object.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-void via-void/10 to-transparent opacity-90" />
          <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-nebula-300 ring-1 ring-white/10 backdrop-blur">
            {formatYear(object.date)} · {object.center}
          </span>
        </div>
        <div className="p-5">
          <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-white transition-colors group-hover:text-nebula-300">
            {object.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-nebula-300/60">
            {object.description || 'No description available.'}
          </p>
        </div>
      </Link>
      <div className="absolute right-3 top-3">
        <FavoriteButton object={object} />
      </div>
    </article>
  )
}
