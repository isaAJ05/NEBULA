interface LoaderProps {
  message?: string
  variant?: 'orbit' | 'grid'
  count?: number
}

/** Estado de carga: órbita animada o esqueletos de tarjetas. */
export default function Loader({ message = 'Calibrating the telescope…', variant = 'orbit', count = 8 }: LoaderProps) {
  if (variant === 'grid') {
    return (
      <div role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">{message}</span>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
          {Array.from({ length: count }, (_, i) => (
            <li key={i} className="overflow-hidden rounded-3xl glass">
              <div className="aspect-[4/3] skeleton" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-4/5 rounded-full skeleton" />
                <div className="h-3 w-full rounded-full skeleton" />
                <div className="h-3 w-2/3 rounded-full skeleton" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-6 py-24">
      <div className="relative h-24 w-24" aria-hidden="true">
        <div className="absolute inset-[30%] rounded-full bg-linear-to-br from-fuchsia-300 to-nebula-600 shadow-[0_0_40px_rgb(192_132_252/0.9)]" />
        <div className="absolute inset-0 animate-spin rounded-full border border-dashed border-nebula-400/40 [animation-duration:3s]">
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-plasma-400 shadow-[0_0_14px_rgb(244_114_182)]" />
        </div>
      </div>
      <p className="animate-pulse text-nebula-300">{message}</p>
    </div>
  )
}
