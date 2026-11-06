# 🌌 Nébula · Explorador del Universo

SPA hecha con **React + TypeScript + Vite + Tailwind CSS + React Router**. Sirve para explorar galaxias, nebulosas, planetas y otros objetos astronómicos con imágenes reales de la NASA, guardar descubrimientos y armar una colección personal.

## 🛰️ APIs

| API | Uso | Key |
|---|---|---|
| [NASA Image and Video Library](https://images.nasa.gov) `https://images-api.nasa.gov` | Lista (`/search?q=`), detalle por ID (`/search?nasa_id=`) e imagen HD (`/asset/{id}`) | No necesita |
| [NASA APOD](https://api.nasa.gov) `https://api.nasa.gov/planetary/apod` | Imagen astronómica del día en la página de inicio (si falla, se usa una imagen del día elegida de la NASA Image Library, sin key) | `DEMO_KEY` o la tuya |

> Para tener tu propia key gratis, regístrate en https://api.nasa.gov y crea un archivo `.env` con `VITE_NASA_API_KEY=tu_key` (ver `.env.example`). En Vercel se agrega en *Settings → Environment Variables*.

## 🚀 Correr el proyecto

```bash
npm install
npm run dev      # desarrollo
npm run build    # build de producción
npm run preview  # probar el build
```

## 🗺️ Rutas

| Ruta | Página |
|---|---|
| `/` | Inicio (hero, imagen del día y categorías) |
| `/explore` | Grid de tarjetas, búsqueda, filtros y orden (**fetch de lista**) |
| `/explore/:id` | Detalle de un objeto (**fetch individual por ID**, ruta dinámica) |
| `/collection` | Favoritos guardados |
| `/contact` | Formulario controlado con validación |
| `*` | Página 404 |

## ✅ Requisitos cumplidos

- **Vite + React + TypeScript**: props tipadas, `useState<T>` y tipos de la API en `src/types/nasa.ts`.
- **React Router**: `useParams`, `NavLink` con estado activo y `useSearchParams` (los filtros se guardan en la URL).
- **Dos fetches**: `searchCosmos()` (lista) y `getCosmicObject()` (detalle por ID) en `src/services/nasa.ts`, ambos con `useEffect` + `async/await` + `AbortController` (hook `useAsync`).
- **Estados de UI**: Loading (esqueletos y órbita animada), Error (con reintento) y Empty (búsqueda sin resultados, colección vacía, ID inexistente).
- **Búsqueda y filtrado en tiempo real**: filtro por texto al escribir, categorías, centro NASA y orden. Con Enter se busca en todo el archivo de la NASA.
- **Favoritos**: viven en un Context (`FavoritesProvider`) que envuelve al router, así persisten entre rutas. También se guardan en `localStorage`.
- **Formulario controlado**: nombre, email y mensaje con validación, errores al salir del campo, contador de caracteres y botón `disabled`.
- **Toasts** de éxito, error e info con auto-dismiss, hechos desde cero con `useState` + `setTimeout` (`ToastProvider`).
- **Modal de confirmación** con `<dialog>` nativo + `useRef` + `showModal()` (`ConfirmDialog.tsx`). Se usa al quitar de favoritos, al vaciar la colección y al enviar el formulario.
- **Modal con dark pattern intencional** (`DarkPatternModal.tsx`): aparece en Explorar a los 5 segundos, una vez por sesión. El comentario del código explica cada patrón: confirmshaming, falsa urgencia, casilla premarcada, prueba social falsa, jerarquía visual engañosa e interrupción.
- **Tailwind CSS** responsive con `sm:`, `md:`, `lg:` y `xl:`, y un tema propio en `@theme` (`src/index.css`).
- **Accesibilidad**: `alt` en todas las imágenes, `role` (`search`, `alert`, `status`, `group`), `aria-label`, `aria-pressed`, `aria-invalid`, `aria-live`, `htmlFor`, HTML semántico (`header`, `nav`, `main`, `article`, `section`, `figure`, `dl`), link para saltar al contenido y soporte para `prefers-reduced-motion`.
- **15 componentes** en archivos `.tsx` separados dentro de `src/components/`.

## 📁 Estructura

```
src/
├── components/   Navbar, Footer, Layout, StarField, CosmicCard, FavoriteButton, SearchBar,
│                 CategoryFilter, Loader, ErrorState, EmptyState, ConfirmDialog,
│                 DarkPatternModal, ToastContainer, ApodHero
├── context/      FavoritesProvider, ToastProvider (+ sus contextos)
├── hooks/        useAsync, useFavorites, useToast
├── pages/        HomePage, ExplorePage, DetailPage, FavoritesPage, ContactPage, NotFoundPage
├── services/     nasa.ts (todas las llamadas a la API)
├── types/        nasa.ts
├── data/         categories.ts (solo los temas de búsqueda, no datos)
└── utils/        format.ts
```

## ☁️ Despliegue en Vercel

El archivo `vercel.json` redirige todas las rutas a `index.html`. Así, al recargar `/explore/:id` no aparece un 404 de Vercel.
