import { HTMLAttributes } from 'react'

interface TypographyProps<T> extends HTMLAttributes<T> {
  className?: string
}

export function SlideCaption({
  className = '',
  ...props
}: TypographyProps<HTMLParagraphElement>) {
  return (
    <p
      className={`text-[0.7rem] uppercase tracking-[0.35em] text-[#cfd1e5] ${className}`}
      {...props}
    />
  )
}

export function SlideTitle({
  className = '',
  ...props
}: TypographyProps<HTMLHeadingElement>) {
  return (
    <h2
      className={`text-2xl font-semibold text-white md:text-3xl ${className}`}
      {...props}
    />
  )
}

export function CardHeading({
  className = '',
  ...props
}: TypographyProps<HTMLParagraphElement>) {
  return (
    <p
      className={`mb-1 text-[0.65rem] uppercase tracking-[0.25em] text-[#6ee7ff] sm:text-xs ${className}`}
      {...props}
    />
  )
}

export function CardText({
  className = '',
  ...props
}: TypographyProps<HTMLParagraphElement>) {
  return (
    <p
      className={`text-[0.85rem] leading-relaxed text-white sm:text-sm ${className}`}
      {...props}
    />
  )
}
