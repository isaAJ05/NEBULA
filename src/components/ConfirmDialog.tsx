import { useEffect, useRef, type MouseEvent } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'primary'
  onConfirm: () => void
  onCancel: () => void
}

/** Modal de confirmación con <dialog> nativo + useRef + showModal(). */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Clic fuera del contenido (en el backdrop) = cancelar
  function handleBackdropClick(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onCancel()
  }

  const confirmStyles =
    tone === 'danger'
      ? 'bg-linear-to-r from-rose-500 to-plasma-500 shadow-[0_0_25px_-5px_rgb(244_63_94/0.8)]'
      : 'bg-linear-to-r from-nebula-500 to-plasma-500 shadow-[0_0_25px_-5px_rgb(192_132_252/0.9)]'

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      onClick={handleBackdropClick}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      className="m-auto w-[min(92vw,28rem)] rounded-3xl p-0 text-stardust glass glow backdrop:bg-black/70 backdrop:backdrop-blur-sm open:animate-fade-up"
    >
      <div className="p-7">
        <div
          aria-hidden="true"
          className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl text-2xl ${tone === 'danger' ? 'bg-rose-500/15' : 'bg-nebula-500/20'}`}
        >
          {tone === 'danger' ? '☄️' : '🛰️'}
        </div>
        <h2 id="confirm-title" className="font-display text-xl font-semibold text-white">
          {title}
        </h2>
        <p id="confirm-message" className="mt-3 leading-relaxed text-nebula-300/80">
          {message}
        </p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-5 py-2.5 font-medium text-nebula-300 ring-1 ring-nebula-400/30 transition hover:bg-white/5 hover:text-white"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-full px-5 py-2.5 font-semibold text-white transition hover:brightness-110 ${confirmStyles}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
