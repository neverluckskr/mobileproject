import { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`group rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.55)] transition-all duration-500 ease-out will-change-transform hover:-translate-y-1 hover:border-[#6ee7ff]/60 hover:shadow-[0_25px_80px_rgba(0,0,0,0.8)] sm:p-5 ${className}`}
      {...props}
    />
  )
}
