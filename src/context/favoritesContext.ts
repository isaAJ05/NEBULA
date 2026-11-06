import { createContext } from 'react'
import type { CosmicObject, FavoriteObject } from '../types/nasa'

export interface FavoritesContextValue {
  favorites: FavoriteObject[]
  isFavorite: (id: string) => boolean
  addFavorite: (obj: CosmicObject) => void
  removeFavorite: (id: string) => void
  clearFavorites: () => void
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)
