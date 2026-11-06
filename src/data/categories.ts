import type { Category } from '../components/CategoryFilter'

// Solo son los "temas" de búsqueda; los datos reales siempre vienen de la API de la NASA.
export const CATEGORIES: Category[] = [
  { label: 'Galaxies', query: 'galaxy', emoji: '🌌' },
  { label: 'Nebulae', query: 'nebula', emoji: '☁️' },
  { label: 'Planets', query: 'planet', emoji: '🪐' },
  { label: 'Stars', query: 'star cluster', emoji: '✨' },
  { label: 'Black holes', query: 'black hole', emoji: '🕳️' },
  { label: 'James Webb', query: 'webb telescope', emoji: '🔭' },
  { label: 'Comets', query: 'comet', emoji: '☄️' },
  { label: 'Moon', query: 'moon surface', emoji: '🌙' },
]

export const DEFAULT_CATEGORY = CATEGORIES[0].query
