import { useEffect, useRef, useState } from 'react'
import { useToast } from '../hooks/useToast'

const SESSION_KEY = 'nebula:premium-modal-seen'
const DELAY_MS = 5000

/**
 * ⚠️ MODAL CON DARK PATTERN INTENCIONAL (requisito académico) ⚠️
 *
 * Este modal es un ejemplo de lo que NO se debe hacer en una interfaz real.
 * Combina varios dark patterns a propósito:
 *
 * 1. CONFIRMSHAMING: el botón de rechazo culpa al usuario
 *    ("No, I prefer to stay in cosmic ignorance").
 * 2. INTERFERENCIA VISUAL / FALSA JERARQUÍA: aceptar es un botón enorme y brillante,
 *    mientras que rechazar es un enlace pequeño, gris y de bajo contraste.
 * 3. FALSA URGENCIA: un contador regresivo que se reinicia y no tiene ningún efecto real.
 * 4. CASILLA PREMARCADA: "I agree to receive 7 emails a day" ya viene marcada.
 * 5. PRUEBA SOCIAL INVENTADA: "2,341 explorers joined today" (dato falso).
 * 6. INTERRUPCIÓN: aparece solo, a los pocos segundos de navegar, sin que el usuario lo pida.
 *
 * Al cerrar o aceptar se muestra un toast que explica que era un dark pattern,
 * para que la intención educativa sea evidente. No se envía ningún dato.
 */
export default function DarkPatternModal() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [seconds, setSeconds] = useState(59)
  const [spamChecked, setSpamChecked] = useState(true) // ← dark pattern #4: premarcada
  const { showToast } = useToast()

  // Se abre automáticamente una vez por sesión (dark pattern #6)
  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      /* ignorar */
    }
    if (seen) return

    const timer = setTimeout(() => {
      dialogRef.current?.showModal()
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        /* ignorar */
      }
    }, DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  // Falsa urgencia: el contador vuelve a 59 al llegar a 0 (dark pattern #3)
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => (s <= 1 ? 59 : s - 1)), 1000)
    return () => clearInterval(interval)
  }, [])

  function close(accepted: boolean) {
    dialogRef.current?.close()
    showToast(
      'info',
      accepted
        ? '🕵️ Gotcha! That was a sample dark pattern. Nothing was sent.'
        : 'Well done: you resisted a dark pattern (confirmshaming + false urgency).',
    )
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="premium-title"
      onCancel={() => showToast('info', 'You closed the modal with Esc. It was a sample dark pattern 😉')}
      className="m-auto w-[min(94vw,30rem)] overflow-hidden rounded-[2rem] p-0 text-stardust glass glow backdrop:bg-black/80 backdrop:backdrop-blur-md open:animate-fade-up"
    >
      <div className="relative">
        <div aria-hidden="true" className="absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-plasma-500/40 blur-3xl" />
        <div className="relative p-8 text-center">
          <span className="inline-block rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose-300 ring-1 ring-rose-400/40">
            {/* Falsa urgencia */}
            ⏳ Offer ends in 00:{seconds.toString().padStart(2, '0')}
          </span>
          <div aria-hidden="true" className="my-5 text-6xl animate-float">🚀</div>
          <h2 id="premium-title" className="font-display text-2xl font-bold text-white">
            Join the <span className="text-glow">Premium Crew</span>!
          </h2>
          <p className="mt-3 text-nebula-300/80">
            8K images, early access to black holes and an official astronaut certificate.
          </p>
          {/* Prueba social inventada */}
          <p className="mt-2 text-sm text-plasma-400">🔥 2,341 explorers joined today</p>

          <label htmlFor="spam-optin" className="mt-5 flex items-start gap-2 text-left text-[11px] leading-snug text-nebula-300/40">
            <input
              id="spam-optin"
              type="checkbox"
              checked={spamChecked}
              onChange={(e) => setSpamChecked(e.target.checked)}
              className="mt-0.5 accent-nebula-500"
            />
            I agree to receive 7 emails a day and share my data with intergalactic partners.
          </label>

          {/* Botón de aceptar: enorme y brillante */}
          <button
            type="button"
            onClick={() => close(true)}
            className="mt-6 w-full rounded-full bg-linear-to-r from-nebula-500 via-plasma-500 to-pink-400 py-4 text-lg font-bold text-white shadow-[0_0_40px_-5px_rgb(232_121_249)] transition hover:scale-[1.02] hover:brightness-110"
          >
            Yes, I want to conquer the universe!
          </button>

          {/* Confirmshaming: rechazo diminuto, gris y culpabilizador */}
          <button
            type="button"
            onClick={() => close(false)}
            className="mt-4 text-[11px] text-nebula-300/30 underline underline-offset-2 hover:text-nebula-300/50"
          >
            No, I prefer to stay in cosmic ignorance
          </button>
        </div>
      </div>
    </dialog>
  )
}
