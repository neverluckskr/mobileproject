import { ReactNode } from 'react'
import { motion } from 'framer-motion'

import { SlideCaption, SlideTitle } from '../ui/Typography'

type SlideProps = {
  id: string
  index: number
  caption: string
  title: string
  children: ReactNode
}

const slideVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 }
}

export function Slide({ id, index, caption, title, children }: SlideProps) {
  return (
    <section
      id={id}
      data-slide-id={index}
      className="relative flex min-h-screen w-full snap-start items-center justify-center px-4 py-20 sm:px-6 lg:px-8"
    >
      <motion.div
        className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 text-white shadow-[0_45px_140px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:p-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        variants={slideVariants}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-40" />
        <div className="pointer-events-none absolute -left-6 top-20 hidden h-32 w-[2px] bg-gradient-to-b from-transparent via-[#6ee7ff]/70 to-transparent sm:block" />
        <div className="pointer-events-none absolute right-8 top-6 hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[0.57rem] uppercase tracking-[0.3em] text-[#cfd1e5]/75 sm:flex">
          EU • SCHENGEN • NATO
        </div>
        <div className="pointer-events-none absolute bottom-6 right-6 hidden h-12 w-12 rounded-full border border-white/10 bg-white/5 blur-xl sm:block" />

        <div className="relative z-10 flex flex-col gap-3">
          <SlideCaption>{caption}</SlideCaption>
          <SlideTitle>{title}</SlideTitle>
        </div>

        <div className="relative z-10 mt-6 space-y-6">{children}</div>
      </motion.div>
    </section>
  )
}
