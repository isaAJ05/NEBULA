// ── Tipos crudos que devuelve la NASA Image and Video Library ──
// Docs: https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf

export interface NasaItemData {
  nasa_id: string
  title: string
  description?: string
  date_created: string
  center?: string
  keywords?: string[]
  media_type: 'image' | 'video' | 'audio'
  photographer?: string
  secondary_creator?: string
  location?: string
}

export interface NasaLink {
  href: string
  rel: string
  render?: string
}

export interface NasaItem {
  href: string
  data: NasaItemData[]
  links?: NasaLink[]
}

export interface NasaSearchResponse {
  collection: {
    items: NasaItem[]
    metadata?: { total_hits: number }
  }
}

export interface NasaAssetResponse {
  collection: {
    items: { href: string }[]
  }
}

// ── Tipo de la Astronomy Picture of the Day (APOD) ──
export interface Apod {
  date: string
  title: string
  explanation: string
  url: string
  hdurl?: string
  media_type: 'image' | 'video' | 'other'
  copyright?: string
  thumbnail_url?: string
  /** De dónde salió la imagen: APOD o, si APOD falla, la NASA Image Library. */
  source?: 'apod' | 'library'
  /** Solo cuando source === 'library': id para enlazar a la página de detalle. */
  nasa_id?: string
}

// ── Modelo limpio que usa la app ──
export interface CosmicObject {
  id: string
  title: string
  description: string
  date: string
  center: string
  keywords: string[]
  thumbnail: string
  credit?: string
}

export interface FavoriteObject extends CosmicObject {
  savedAt: string
}

export type SortOption = 'recent' | 'oldest' | 'az'
