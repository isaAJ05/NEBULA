import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  message: string
  action?: ReactNode
}

export default function EmptyState({ icon = '🔭', title, message, action }: EmptyStateProps) {
  return (
    <div role="status" className="mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center">
      <div aria-hidden="true" className="relative mb-6 grid h-28 w-28 place-items-center">
        <span className="absolute inset-0 rounded-full border border-dashed border-nebula-400/30 animate-spin-slow" />
        <span className="absolute inset-3 rounded-full bg-nebula-500/10 blur-md" />
        <span className="relative text-5xl animate-float">{icon}</span>
      </div>
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-nebula-300/70">{message}</p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  )
}
