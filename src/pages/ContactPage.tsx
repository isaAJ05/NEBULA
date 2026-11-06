import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../hooks/useToast'

interface FormValues {
  name: string
  email: string
  message: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const INITIAL: FormValues = { name: '', email: '', message: '' }
const MAX_MESSAGE = 500
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (values.name.trim().length < 3) errors.name = 'Your name must be at least 3 characters long.'
  if (!EMAIL_REGEX.test(values.email.trim())) errors.email = 'Enter a valid email, for example: astro@nebula.com'
  if (values.message.trim().length < 10) errors.message = 'Your message must be at least 10 characters long.'
  else if (values.message.length > MAX_MESSAGE) errors.message = `Maximum ${MAX_MESSAGE} characters.`
  return errors
}

export default function ContactPage() {
  const [values, setValues] = useState<FormValues>(INITIAL)
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const { showToast } = useToast()

  const errors = validate(values)
  const isValid = Object.keys(errors).length === 0

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid) {
      setTouched({ name: true, email: true, message: true })
      showToast('error', 'Please check the highlighted fields before sending.')
      return
    }
    setConfirmOpen(true)
  }

  function handleConfirmSend() {
    setConfirmOpen(false)
    setSending(true)
    // Simulación de envío (no hay backend)
    setTimeout(() => {
      setSending(false)
      setValues(INITIAL)
      setTouched({})
      showToast('success', `Message sent to the station, ${values.name.trim().split(' ')[0]}! 🚀`)
    }, 1200)
  }

  const fieldClass = (field: keyof FormValues) =>
    `w-full rounded-2xl border bg-cosmos-900/70 px-5 py-3.5 text-white placeholder:text-nebula-300/35 backdrop-blur transition focus:outline-none focus:shadow-[0_0_30px_-8px_rgb(232_121_249/0.8)] ${
      touched[field] && errors[field]
        ? 'border-rose-400/70 focus:border-rose-400'
        : touched[field]
          ? 'border-emerald-400/50 focus:border-plasma-500'
          : 'border-nebula-400/25 focus:border-plasma-500'
    }`

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 pt-12 lg:grid-cols-[1fr_1.2fr]">
      <header className="animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-plasma-400">Control station</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
          Send a <span className="text-glow">transmission</span>
        </h1>
        <p className="mt-5 leading-relaxed text-nebula-300/75">
          Found something amazing, have an idea or spotted a bug? Write to us and our mission control team will
          reply at the speed of light (more or less).
        </p>
        <div aria-hidden="true" className="mt-10 hidden text-8xl animate-float lg:block">🛰️</div>
      </header>

      <form onSubmit={handleSubmit} noValidate aria-label="Contact form" className="space-y-6 rounded-[2rem] p-7 glass glow sm:p-9">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-nebula-300">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Carl Sagan"
            autoComplete="name"
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
            className={fieldClass('name')}
          />
          {touched.name && errors.name && (
            <p id="name-error" role="alert" className="mt-2 text-sm text-rose-300">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-nebula-300">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="astro@nebula.com"
            autoComplete="email"
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
            className={fieldClass('email')}
          />
          {touched.email && errors.email && (
            <p id="email-error" role="alert" className="mt-2 text-sm text-rose-300">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label htmlFor="message" className="block text-sm font-medium text-nebula-300">Message</label>
            <span
              aria-live="polite"
              className={`text-xs ${values.message.length > MAX_MESSAGE ? 'text-rose-300' : 'text-nebula-300/50'}`}
            >
              {values.message.length}/{MAX_MESSAGE}
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tell us what you discovered…"
            aria-invalid={Boolean(touched.message && errors.message)}
            aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
            className={`${fieldClass('message')} resize-none`}
          />
          {touched.message && errors.message && (
            <p id="message-error" role="alert" className="mt-2 text-sm text-rose-300">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || sending}
          className="w-full rounded-full bg-linear-to-r from-nebula-500 via-plasma-500 to-pink-400 py-4 font-semibold text-white shadow-[0_0_35px_-6px_rgb(232_121_249)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {sending ? 'Transmitting…' : 'Send transmission 🚀'}
        </button>
        {!isValid && (
          <p className="text-center text-xs text-nebula-300/50">Fill in all fields to enable sending.</p>
        )}
      </form>

      <ConfirmDialog
        open={confirmOpen}
        title="Send your transmission?"
        message={`We will send your message from ${values.email.trim()}. Ready for liftoff?`}
        confirmLabel="Yes, send"
        cancelLabel="Review"
        onConfirm={handleConfirmSend}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
