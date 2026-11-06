import { Link } from 'react-router-dom'
import ApodHero from '../components/ApodHero'
import { CATEGORIES } from '../data/categories'
import { useFavorites } from '../hooks/useFavorites'

const features = [
  { icon: '🔭', title: 'Explore', text: 'Thousands of real images from NASA telescopes and missions.' },
  { icon: '⭐', title: 'Discover', text: 'Save the objects that amaze you with a single click.' },
  { icon: '🌌', title: 'Collect', text: 'Build your own personal cosmic atlas, always with you.' },
]

export default function HomePage() {
  const { favorites } = useFavorites()

  return (
    <>
      {/* ── HERO ── */}
      <section aria-labelledby="hero-title" className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pt-24">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-nebula-500/10 px-4 py-1.5 text-sm font-medium text-nebula-300 ring-1 ring-nebula-400/30">
            <span className="h-2 w-2 animate-pulse rounded-full bg-plasma-400 shadow-[0_0_10px_rgb(244_114_182)]" />
            Live data from NASA
          </p>
          <h1 id="hero-title" className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl xl:text-7xl">
            Explore the <span className="text-glow">universe</span> without leaving home
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-nebula-300/80">
            Travel through galaxies, nebulae and planets with real NASA images. Save your discoveries and
            build your personal cosmic collection.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/explore"
              className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-nebula-500 via-plasma-500 to-pink-400 px-7 py-4 font-semibold text-white shadow-[0_0_45px_-8px_rgb(232_121_249)] transition hover:scale-[1.03] hover:brightness-110"
            >
              Start exploring
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold text-nebula-300 ring-1 ring-nebula-400/40 transition hover:bg-white/5 hover:text-white"
            >
              My collection {favorites.length > 0 && `(${favorites.length})`}
            </Link>
          </div>
        </div>

        {/* Planeta decorativo */}
        <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-md animate-float">
          <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_30%_30%,#f5d0fe_0%,#c084fc_25%,#7e22ce_55%,#2e1065_80%,#0e0620_100%)] shadow-[0_0_120px_-10px_rgb(168_85_247/0.9),inset_-30px_-30px_60px_rgb(7_2_15/0.8)]" />
          <div className="absolute inset-[12%] rounded-full bg-[repeating-linear-gradient(-25deg,transparent_0_18px,rgb(255_255_255/0.05)_18px_30px)] mix-blend-overlay" />
          <div className="absolute left-1/2 top-1/2 h-[28%] w-[125%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-[50%] border-[6px] border-plasma-500/50 shadow-[0_0_40px_rgb(232_121_249/0.5)]" />
          <div className="absolute inset-0 animate-spin-slow">
            <span className="absolute right-[6%] top-[18%] h-6 w-6 rounded-full bg-linear-to-br from-indigo-200 to-indigo-600 shadow-[0_0_25px_rgb(129_140_248)]" />
          </div>
          <div className="absolute inset-[-8%] animate-spin rounded-full border border-dashed border-nebula-400/20 [animation-duration:40s]">
            <span className="absolute bottom-[10%] left-[8%] h-3 w-3 rounded-full bg-pink-300 shadow-[0_0_18px_rgb(249_168_212)]" />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section aria-label="What you can do" className="mx-auto max-w-7xl px-6">
        <ul className="grid gap-5 sm:grid-cols-3">
          {features.map((f, i) => (
            <li key={f.title} className="rounded-3xl p-7 glass animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
              <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-2xl bg-nebula-500/15 text-2xl ring-1 ring-nebula-400/30">
                {f.icon}
              </span>
              <h2 className="mt-5 font-display text-lg font-semibold text-white">{f.title}</h2>
              <p className="mt-2 text-nebula-300/70">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── APOD ── */}
      <section aria-labelledby="apod-title" className="mx-auto mt-24 max-w-7xl px-6">
        <h2 id="apod-title" className="mb-8 font-display text-3xl font-bold text-white sm:text-4xl">
          Today’s <span className="text-glow">astronomy</span> picture
        </h2>
        <ApodHero />
      </section>

      {/* ── CATEGORÍAS ── */}
      <section aria-labelledby="cats-title" className="mx-auto mt-24 max-w-7xl px-6">
        <h2 id="cats-title" className="font-display text-3xl font-bold text-white sm:text-4xl">
          Where are we headed?
        </h2>
        <p className="mt-3 text-nebula-300/70">Pick a destination and start discovering.</p>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <li key={cat.query}>
              <Link
                to={`/explore?topic=${encodeURIComponent(cat.query)}`}
                className="group flex h-full flex-col items-start gap-3 rounded-3xl p-6 glass transition-all duration-300 hover:-translate-y-1 hover:border-plasma-500/50 hover:shadow-[0_15px_50px_-15px_rgb(232_121_249/0.7)]"
              >
                <span aria-hidden="true" className="text-3xl transition-transform duration-300 group-hover:scale-125">
                  {cat.emoji}
                </span>
                <span className="font-display font-semibold text-white">{cat.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
