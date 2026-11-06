import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { FavoritesProvider } from './context/FavoritesProvider'
import { ToastProvider } from './context/ToastProvider'
import ContactPage from './pages/ContactPage'
import DetailPage from './pages/DetailPage'
import ExplorePage from './pages/ExplorePage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    // Los providers envuelven al router: el estado sobrevive a cualquier cambio de ruta.
    <ToastProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="explore/:id" element={<DetailPage />} />
              <Route path="collection" element={<FavoritesPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </ToastProvider>
  )
}
