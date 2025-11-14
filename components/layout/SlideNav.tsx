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

  const scrollToSlide = (id: number) => {
    if (typeof window === 'undefined') return
    const element = document.getElementById(`slide-${id}`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const currentIndex = slides.findIndex(slide => slide.id === active)
  const prevId = slides[currentIndex - 1]?.id
  const nextId = slides[currentIndex + 1]?.id

  return (
    <>
      <nav
        aria-label="Навігація по слайдах"
        className="fixed inset-y-0 right-3 z-40 hidden flex-col items-center justify-center text-xs text-[#cfd1e5]/70 backdrop-blur-xl sm:flex md:right-6"
      >
        <span className="mb-3 rotate-180 transform whitespace-nowrap text-[0.58rem] uppercase tracking-[0.4em] text-[#cfd1e5]/60 [writing-mode:vertical-rl]">
          Слайди
        </span>

        <div className="relative flex flex-col items-center gap-2 rounded-[26px] border border-white/10 bg-white/5 px-3 py-4 shadow-[0_35px_120px_rgba(0,0,0,0.65)]">
          <div className="absolute left-1/2 top-6 h-[70%] w-[1.5px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#6ee7ff]/40 to-transparent" />
          <div className="flex flex-col items-center gap-2">
            {slides.map(slide => (
              <a
                key={slide.id}
                href={`#slide-${slide.id}`}
                aria-label={`Перейти до слайда ${slide.id}`}
                aria-current={active === slide.id ? 'true' : undefined}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full text-[0.65rem] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6ee7ff] ${
                  active === slide.id
                    ? 'border border-transparent bg-gradient-to-br from-[#6ee7ff] via-[#72d8ff] to-[#ff8ab6] text-[#05030a] shadow-[0_0_20px_rgba(110,231,255,0.6)]'
                    : 'border border-white/15 bg-white/5 text-[#cfd1e5]/70 hover:border-[#6ee7ff]/50'
                }`}
              >
                {slide.id}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <nav
        aria-label="Мобільна навігація по слайдах"
        className="fixed bottom-3 left-1/2 z-40 flex w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-[#cfd1e5] backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.6)] sm:hidden"
      >
        <button
          type="button"
          onClick={() => prevId && scrollToSlide(prevId)}
          disabled={!prevId}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-base text-white transition disabled:opacity-30"
        >
          ‹
        </button>
        <div className="flex flex-col items-center leading-tight">
          <span className="text-sm font-semibold text-white">{active}</span>
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-[#cfd1e5]/70">
            / {slides.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => nextId && scrollToSlide(nextId)}
          disabled={!nextId}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-base text-white transition disabled:opacity-30"
        >
          ›
        </button>
      </nav>
    </>
  )
}
