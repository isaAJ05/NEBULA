interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export default function ErrorState({ title = 'We lost the signal', message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="mx-auto flex max-w-lg flex-col items-center rounded-3xl p-10 text-center glass">
      <div aria-hidden="true" className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-rose-500/10 text-4xl ring-1 ring-rose-400/30 shadow-[0_0_40px_-10px_rgb(244_63_94/0.8)]">
        📡
      </div>
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-nebula-300/75">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-full bg-linear-to-r from-nebula-500 to-plasma-500 px-6 py-3 font-semibold text-white shadow-[0_0_25px_-6px_rgb(232_121_249/0.9)] transition hover:brightness-110"
        >
          Retry connection
        </button>
      )}
    </div>
  )
}
