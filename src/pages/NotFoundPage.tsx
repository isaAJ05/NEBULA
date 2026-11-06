import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section aria-labelledby="nf-title" className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
      <div aria-hidden="true" className="relative mb-4">
        <span className="font-display text-[9rem] font-extrabold leading-none text-glow sm:text-[13rem]">404</span>
        <span className="absolute -right-6 top-6 text-6xl animate-float">👨‍🚀</span>
      </div>
      <h1 id="nf-title" className="font-display text-3xl font-bold text-white sm:text-4xl">
        Lost in the void
      </h1>
      <p className="mt-4 max-w-md text-nebula-300/75">
        This page was swallowed by a black hole or never existed. Let’s get back to a safe orbit.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className="rounded-full bg-linear-to-r from-nebula-500 to-plasma-500 px-7 py-3.5 font-semibold text-white shadow-[0_0_30px_-6px_rgb(232_121_249)]"
        >
          Back to Earth
        </Link>
        <Link to="/explore" className="rounded-full px-7 py-3.5 font-semibold text-nebula-300 ring-1 ring-nebula-400/40 hover:bg-white/5">
          Explore the cosmos
        </Link>
      </div>
    </section>
  )
}
