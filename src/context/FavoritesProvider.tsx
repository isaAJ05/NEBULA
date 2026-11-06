import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CosmicObject, FavoriteObject } from '../types/nasa'
import { FavoritesContext } from './favoritesContext'

const STORAGE_KEY = 'nebula:favorites'

function loadFavorites(): FavoriteObject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FavoriteObject[]) : []
  } catch {
    return []
  }
}

/**
 * El estado de favoritos vive AQUÍ, por encima del <Router>/<Routes>.
 * Como este componente nunca se desmonta al cambiar de página,
 * la colección persiste entre rutas. Además se guarda en localStorage.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteObject[]>(loadFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      /* almacenamiento lleno o bloqueado: el estado sigue en memoria */
    }
  }, [favorites])

  const isFavorite = useCallback((id: string) => favorites.some((f) => f.id === id), [favorites])

  const addFavorite = useCallback((obj: CosmicObject) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === obj.id) ? prev : [{ ...obj, savedAt: new Date().toISOString() }, ...prev],
    )
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const clearFavorites = useCallback(() => setFavorites([]), [])

  const value = useMemo(
    () => ({ favorites, isFavorite, addFavorite, removeFavorite, clearFavorites }),
    [favorites, isFavorite, addFavorite, removeFavorite, clearFavorites],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
