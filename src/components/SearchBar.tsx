import type { FormEvent } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  label?: string
}

/** Input controlado: filtra en tiempo real; Enter busca en todo el archivo de la NASA. */
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search galaxies, nebulae, planets…',
  label = 'Search astronomical objects',
}: SearchBarProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (value.trim()) onSubmit?.(value.trim())
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative w-full">
      <label htmlFor="cosmic-search" className="sr-only">
        {label}
      </label>
      <span aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-nebula-400">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
      </span>
      <input
        id="cosmic-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-full border border-nebula-400/25 bg-cosmos-900/70 py-4 pl-14 pr-28 sm:pr-40 text-white placeholder:text-nebula-300/40 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] backdrop-blur-md transition focus:border-plasma-500/70 focus:shadow-[0_0_35px_-8px_rgb(232_121_249/0.8)] focus:outline-none"
      />
      {onSubmit && (
        <button
          type="submit"
          disabled={!value.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-nebula-500 to-plasma-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="sm:hidden">Search</span>
          <span className="hidden sm:inline">Search NASA</span>
        </button>
      )}
    </form>
  )
}
