import { useState } from 'react'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import type { CosmicObject } from '../types/nasa'
import ConfirmDialog from './ConfirmDialog'

interface FavoriteButtonProps {
  object: CosmicObject
  variant?: 'icon' | 'full'
}

/** Agrega a la colección al instante; para quitar pide confirmación con un <dialog>. */
export default function FavoriteButton({ object, variant = 'icon' }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { showToast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const saved = isFavorite(object.id)

  function handleClick() {
    if (saved) {
      setConfirmOpen(true)
    } else {
      addFavorite(object)
      showToast('success', `“${object.title}” joined your collection ✨`)
    }
  }

  function handleConfirm() {
    removeFavorite(object.id)
    setConfirmOpen(false)
    showToast('info', `“${object.title}” left your collection`)
  }

  const label = saved ? `Remove “${object.title}” from my collection` : `Save “${object.title}” to my collection`

  return (
    <>
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={handleClick}
          aria-label={label}
          aria-pressed={saved}
          title={saved ? 'Remove from my collection' : 'Save to my collection'}
          className={`grid h-11 w-11 place-items-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 ${
            saved
              ? 'bg-plasma-500/90 text-white shadow-[0_0_22px_rgb(232_121_249/0.9)]'
              : 'bg-black/40 text-white/90 ring-1 ring-white/20 hover:bg-nebula-500/60'
          }`}
        >
          <StarIcon filled={saved} />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          aria-pressed={saved}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
            saved
              ? 'bg-plasma-500/15 text-plasma-400 ring-1 ring-plasma-500/50 hover:bg-plasma-500/25'
              : 'bg-linear-to-r from-nebula-500 to-plasma-500 text-white shadow-[0_0_30px_-6px_rgb(232_121_249/0.9)] hover:brightness-110'
          }`}
        >
          <StarIcon filled={saved} />
          {saved ? 'In your collection' : 'Save discovery'}
        </button>
      )}

      <ConfirmDialog
        open={confirmOpen}
        tone="danger"
        title="Release this object into space?"
        message={`“${object.title}” will be removed from your personal collection. You can save it again anytime.`}
        confirmLabel="Yes, remove"
        cancelLabel="Keep it"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path strokeLinejoin="round" d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8L12 2.8z" />
    </svg>
  )
}
