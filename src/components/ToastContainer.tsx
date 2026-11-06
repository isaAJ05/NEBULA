import { useToast } from '../hooks/useToast'
import type { ToastType } from '../context/toastContext'

const styles: Record<ToastType, { icon: string; ring: string; bar: string; label: string }> = {
  success: { icon: '✨', ring: 'ring-emerald-400/40', bar: 'from-emerald-400 to-teal-300', label: 'Success' },
  error: { icon: '☄️', ring: 'ring-rose-400/40', bar: 'from-rose-500 to-plasma-500', label: 'Error' },
  info: { icon: '🪐', ring: 'ring-nebula-400/40', bar: 'from-nebula-500 to-indigo-400', label: 'Info' },
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  return (
    <section
      aria-label="Notifications"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,24rem)] flex-col gap-3"
    >
      {toasts.map((toast) => {
        const s = styles[toast.type]
        return (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl p-4 pr-10 ring-1 glass animate-toast-in shadow-[0_15px_40px_-10px_rgb(0_0_0/0.7)] ${s.ring}`}
          >
            <span aria-hidden="true" className="text-xl">{s.icon}</span>
            <p className="text-sm leading-relaxed text-white">
              <span className="sr-only">{s.label}: </span>
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Close notification"
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full text-nebula-300 hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
            {/* Barra de progreso del auto-dismiss */}
            <span
              aria-hidden="true"
              className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-linear-to-r ${s.bar}`}
              style={{ animation: 'toast-progress 3.5s linear forwards' }}
            />
          </div>
        )
      })}
    </section>
  )
}
