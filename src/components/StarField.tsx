import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  baseAlpha: number
  speed: number
  phase: number
  hue: number
}

/** Fondo animado: estrellas que titilan + nebulosas de color. Puramente decorativo. */
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Estado mutable de la animación (fuera del ciclo de render de React)
    const st = { stars: [] as Star[], frame: 0, width: 0, height: 0 }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      st.width = window.innerWidth
      st.height = window.innerHeight
      canvas!.width = st.width * dpr
      canvas!.height = st.height * dpr
      canvas!.style.width = `${st.width}px`
      canvas!.style.height = `${st.height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(260, Math.floor((st.width * st.height) / 5200))
      st.stars = Array.from({ length: count }, () => ({
        x: Math.random() * st.width,
        y: Math.random() * st.height,
        r: Math.random() < 0.08 ? Math.random() * 1.6 + 1 : Math.random() * 1 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.3,
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        // mayoría blancas/lavanda, algunas fucsia o azuladas
        hue: [270, 280, 300, 220, 0][Math.floor(Math.random() * 5)],
      }))
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, st.width, st.height)
      for (const s of st.stars) {
        const twinkle = reduceMotion ? 1 : 0.6 + 0.4 * Math.sin(time * s.speed * 0.1 + s.phase)
        const alpha = s.baseAlpha * twinkle
        const sat = s.hue === 0 ? 0 : 90
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${s.hue}, ${sat}%, 88%, ${alpha})`
        if (s.r > 1) {
          ctx!.shadowBlur = 8
          ctx!.shadowColor = `hsla(${s.hue}, 100%, 75%, ${alpha})`
        } else {
          ctx!.shadowBlur = 0
        }
        ctx!.fill()
      }
      if (!reduceMotion) st.frame = requestAnimationFrame(draw)
    }

    resize()
    st.frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(st.frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      {/* Nebulosas */}
      <div className="absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-nebula-600/25 blur-[120px] animate-pulse-glow" />
      <div className="absolute -right-32 top-1/3 h-[32rem] w-[32rem] rounded-full bg-plasma-500/15 blur-[130px] animate-pulse-glow [animation-delay:1.5s]" />
      <div className="absolute -bottom-48 left-1/4 h-[30rem] w-[40rem] rounded-full bg-indigo-600/20 blur-[140px]" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Viñeta para dar profundidad */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(7_2_15/0.85)_100%)]" />
    </div>
  )
}
