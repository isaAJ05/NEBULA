import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/explore', label: 'Explore', end: false },
  { to: '/collection', label: 'My collection', end: false },
  { to: '/contact', label: 'Contact', end: false },
]

function navClass({ isActive }: { isActive: boolean }) {
  return [
    'relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
    isActive
      ? 'bg-nebula-500/20 text-white shadow-[0_0_20px_-4px_rgb(192_132_252/0.8)] ring-1 ring-nebula-400/40'
      : 'text-nebula-300/80 hover:bg-white/5 hover:text-white',
  ].join(' ')
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { favorites } = useFavorites()

  return (
    <header className="sticky top-0 z-40 border-b border-nebula-400/10 bg-void/60 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-3" aria-label="Nebula, go to home">
          <span className="relative grid h-10 w-10 place-items-center">
            <span className="absolute inset-0 rounded-full bg-linear-to-br from-fuchsia-300 via-nebula-500 to-purple-950 shadow-[0_0_25px_rgb(168_85_247/0.7)] transition-transform duration-500 group-hover:scale-110" />
            <span className="absolute h-3 w-14 -rotate-[20deg] rounded-[50%] border-2 border-plasma-500/80" />
          </span>
          <span className="font-display text-lg font-bold tracking-wider text-white">
            NEBULA
          </span>
        </Link>

        {/* Escritorio */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} className={navClass}>
                {link.label}
                {link.to === '/collection' && favorites.length > 0 && (
                  <span
                    className="ml-2 inline-grid h-5 min-w-5 place-items-center rounded-full bg-linear-to-r from-nebula-500 to-plasma-500 px-1.5 text-[11px] font-bold text-white"
                    aria-label={`${favorites.length} saved`}
                  >
                    {favorites.length}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Botón móvil */}
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-nebula-300 ring-1 ring-nebula-400/30 transition hover:bg-white/5 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="flex flex-col gap-1 border-t border-nebula-400/10 px-4 pb-4 pt-2 md:hidden">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} className={navClass} onClick={() => setOpen(false)}>
                {link.label}
                {link.to === '/collection' && favorites.length > 0 && ` (${favorites.length})`}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
