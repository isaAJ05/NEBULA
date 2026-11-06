import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, select, label, [role="button"], input, textarea'

/**
 * Halo morado brillante que sigue al cursor y crece sobre elementos interactivos.
 * - Solo se activa con mouse (pointer: fine); en celulares no aparece.
 * - Mueve el elemento con transform dentro de requestAnimationFrame (sin re-renders de React).
 * - Con prefers-reduced-motion sigue al cursor sin la estela suavizada.
 */
export default function CursorGlow() {
  const haloRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const halo = haloRef.current
    if (!halo || !window.matchMedia('(pointer: fine)').matches) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    const zoom = { current: 1, target: 1 }
    const raf = { id: 0 }

    function onMove(e: PointerEvent) {
      target.x = e.clientX
      target.y = e.clientY
      const el = e.target instanceof Element ? e.target : null
      zoom.target = el?.closest(INTERACTIVE) ? 1.8 : 1
      halo!.style.opacity = '1'
    }

    function onLeave() {
      halo!.style.opacity = '0'
    }

    function tick() {
      const ease = reduceMotion ? 1 : 0.18
      pos.x += (target.x - pos.x) * ease
      pos.y += (target.y - pos.y) * ease
      zoom.current += (zoom.target - zoom.current) * 0.15
      halo!.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${zoom.current})`
      raf.id = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    raf.id = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf.id)
    }
  }, [])

  return (
    <div
      ref={haloRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] h-9 w-9 rounded-full bg-[radial-gradient(circle,rgb(192_132_252/0.6)_0%,rgb(147_51_234/0.28)_45%,transparent_70%)] opacity-0 mix-blend-screen blur-[2px] transition-opacity duration-300"
    />
  )
}
