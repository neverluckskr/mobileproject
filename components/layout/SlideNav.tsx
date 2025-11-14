import { useEffect, useState } from 'react'

type SlideNavItem = {
  id: number
}

type SlideNavProps = {
  slides: SlideNavItem[]
}

export function SlideNav({ slides }: SlideNavProps) {
  const [active, setActive] = useState(slides[0]?.id ?? 1)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const value = entry.target.getAttribute('data-slide-id')
            if (value) {
              setActive(Number(value))
            }
          }
        })
      },
      {
        threshold: 0.55
      }
    )

    const elements = slides
      .map(slide => document.querySelector<HTMLElement>(`[data-slide-id="${slide.id}"]`))
      .filter((node): node is HTMLElement => Boolean(node))

    elements.forEach(element => observer.observe(element))

    return () => observer.disconnect()
  }, [slides])

  return (
    <nav
      aria-label="Навігація по слайдах"
      className="fixed top-5 left-1/2 z-40 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-[#cfd1e5] backdrop-blur-3xl shadow-[0_30px_120px_rgba(0,0,0,0.8)]"
    >
      {slides.map(slide => (
        <a
          key={slide.id}
          href={`#slide-${slide.id}`}
          aria-label={`Перейти до слайда ${slide.id}`}
          aria-current={active === slide.id ? 'true' : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-full border text-[0.7rem] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6ee7ff] ${
            active === slide.id
              ? 'scale-110 border-transparent bg-gradient-to-br from-[#ff8ab6] to-[#6ee7ff] text-white shadow-[0_0_25px_rgba(110,231,255,0.7)]'
              : 'border-white/10 bg-white/5 text-[#cfd1e5]/80 hover:border-[#6ee7ff]/60'
          }`}
        >
          {slide.id}
        </a>
      ))}
    </nav>
  )
}
