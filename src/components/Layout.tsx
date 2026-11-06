import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import StarField from './StarField'
import ToastContainer from './ToastContainer'
import CursorGlow from './CursorGlow'

export default function Layout() {
  const { pathname } = useLocation()

  // Volver arriba al cambiar de página
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="relative flex min-h-dvh flex-col">
      <a
        href="#content"
        className="sr-only z-50 rounded-full bg-nebula-500 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <StarField />
      <Navbar />
      <main id="content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
      <CursorGlow />
    </div>
  )
}
