import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-nebula-400/10 bg-void/50 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-nebula-300/60 sm:flex-row">
        <p>
          <span className="font-display font-semibold text-nebula-300">NEBULA</span> · Images courtesy of the{' '}
          <a
            href="https://images.nasa.gov"
            target="_blank"
            rel="noreferrer"
            className="text-nebula-300 underline decoration-plasma-500/50 underline-offset-4 hover:text-white"
          >
            NASA Image Library
          </a>{' '}
          and APOD (with an automatic fallback if APOD is down).
        </p>
        <nav aria-label="Footer links" className="flex gap-5">
          <Link to="/explore" className="hover:text-white">Explore</Link>
          <Link to="/collection" className="hover:text-white">Collection</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}
