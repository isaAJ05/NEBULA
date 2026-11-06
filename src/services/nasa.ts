import type {
  Apod,
  CosmicObject,
  NasaAssetResponse,
  NasaItem,
  NasaSearchResponse,
} from '../types/nasa'

const IMAGES_API = 'https://images-api.nasa.gov'
const APOD_API = 'https://api.nasa.gov/planetary/apod'
// La Images API no necesita key. APOD sí: usa la tuya (variable de entorno) o DEMO_KEY.
const NASA_KEY: string = import.meta.env.VITE_NASA_API_KEY ?? 'DEMO_KEY'

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

/** Quita etiquetas HTML que a veces vienen dentro de las descripciones. */
function cleanText(text = ''): string {
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Las URLs de la NASA a veces vienen en http o con espacios. */
function safeUrl(url: string): string {
  let result = url
  try {
    result = encodeURI(decodeURI(url))
  } catch {
    result = url.replace(/ /g, '%20')
  }
  return result.replace(/^http:\/\//, 'https://')
}

function toCosmicObject(item: NasaItem): CosmicObject | null {
  const data = item.data[0]
  const preview = item.links?.find((link) => link.rel === 'preview' && link.render === 'image')
  if (!data || !preview) return null

  return {
    id: data.nasa_id,
    title: cleanText(data.title),
    description: cleanText(data.description),
    date: data.date_created,
    center: data.center ?? 'NASA',
    keywords: (data.keywords ?? []).slice(0, 10),
    thumbnail: safeUrl(preview.href),
    credit: data.photographer ?? data.secondary_creator,
  }
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`NASA responded with an error (${response.status}). Please try again.`)
  }
  return (await response.json()) as T
}

/** FETCH 1 — Lista: busca imágenes en el archivo de la NASA. */
export async function searchCosmos(query: string, signal?: AbortSignal): Promise<CosmicObject[]> {
  const params = new URLSearchParams({ q: query, media_type: 'image', page_size: '60' })
  const json = await getJson<NasaSearchResponse>(`${IMAGES_API}/search?${params}`, signal)

  // Quitamos duplicados y elementos sin imagen.
  const seen = new Set<string>()
  return json.collection.items
    .map(toCosmicObject)
    .filter((obj): obj is CosmicObject => {
      if (!obj || seen.has(obj.id)) return false
      seen.add(obj.id)
      return true
    })
}

/** FETCH 2 — Detalle: trae un solo objeto por su nasa_id. */
export async function getCosmicObject(id: string, signal?: AbortSignal): Promise<CosmicObject> {
  const params = new URLSearchParams({ nasa_id: id })
  const json = await getJson<NasaSearchResponse>(`${IMAGES_API}/search?${params}`, signal)
  const item = json.collection.items[0]
  const obj = item ? toCosmicObject(item) : null
  if (!obj) throw new NotFoundError('This object got lost in deep space.')
  return obj
}

/** Imagen en alta resolución (opcional; si falla se usa la miniatura). */
export async function getHdImage(id: string, signal?: AbortSignal): Promise<string | null> {
  try {
    const json = await getJson<NasaAssetResponse>(
      `${IMAGES_API}/asset/${encodeURIComponent(id)}`,
      signal,
    )
    const hrefs = json.collection.items.map((i) => i.href)
    const pick =
      hrefs.find((h) => h.includes('~large.')) ??
      hrefs.find((h) => h.includes('~medium.')) ??
      hrefs.find((h) => /~orig\.(jpe?g|png)$/i.test(h))
    return pick ? safeUrl(pick) : null
  } catch (error) {
    if (signal?.aborted) throw error
    return null
  }
}

/** Fecha de hoy en formato YYYY-MM-DD (hora local). */
function todayKey(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Número estable a partir de un texto: el mismo día siempre da la misma imagen. */
function hash(text: string): number {
  let h = 0
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

const DAILY_TOPICS = ['nebula hubble', 'galaxy webb', 'star cluster', 'supernova', 'spiral galaxy', 'planetary nebula']

/**
 * Respaldo SIN API key: elige una "imagen del día" de la NASA Image Library.
 * La elección depende de la fecha, así que cambia cada día y es igual para todos.
 */
async function getLibraryImageOfTheDay(signal?: AbortSignal): Promise<Apod> {
  const day = todayKey()
  const seed = hash(day)
  const topic = DAILY_TOPICS[seed % DAILY_TOPICS.length]
  const items = await searchCosmos(topic, signal)
  if (items.length === 0) throw new Error('We couldn’t find an image for today.')
  const pick = items[seed % items.length]
  return {
    date: day,
    title: pick.title,
    explanation: pick.description,
    url: pick.thumbnail,
    media_type: 'image',
    copyright: pick.credit,
    source: 'library',
    nasa_id: pick.id,
  }
}

async function getNasaApod(signal?: AbortSignal): Promise<Apod> {
  const params = new URLSearchParams({ api_key: NASA_KEY, thumbs: 'true' })
  const apod = await getJson<Apod>(`${APOD_API}?${params}`, signal)
  const image = apod.media_type === 'image' ? apod.url : apod.thumbnail_url
  if (!image && apod.media_type !== 'video') throw new Error('APOD returned no image.')
  return { ...apod, source: 'apod' }
}

/**
 * Imagen del día: primero intenta APOD; si falla (límite de DEMO_KEY, caída del servicio…)
 * usa la NASA Image Library, que no necesita key. Solo APOD se cachea (por día), así
 * si APOD vuelve a funcionar más tarde ese mismo día, se muestra.
 */
export async function getApod(signal?: AbortSignal): Promise<Apod> {
  const cacheKey = `nebula:daily:${todayKey()}`
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) return JSON.parse(cached) as Apod
  } catch {
    /* localStorage no disponible */
  }

  let result: Apod
  try {
    result = await getNasaApod(signal)
  } catch (error) {
    if (signal?.aborted) throw error
    result = await getLibraryImageOfTheDay(signal)
  }

  if (result.source === 'apod') {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(result))
    } catch {
      /* ignorar */
    }
  }
  return result
}
