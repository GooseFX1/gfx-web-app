import React from 'react'
import { cn } from 'gfx-component-lib'

function H1({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  className?: string
}) {
  return (
    <h1 className={cn(`text-text-lightmode-primary dark:text-text-darkmode-primary`, className)} {...props}>
      {children}
    </h1>
  )
}
function H2({
              children,
              className,
              ...props
            }: React.HTMLAttributes<HTMLHeadingElement> & {
  className?: string
}) {
  return (
    <h2 className={cn(`text-text-lightmode-primary dark:text-text-darkmode-primary`, className)} {...props}>
      {children}
    </h2>
  )
}
function H3({
              children,
              className,
              ...props
            }: React.HTMLAttributes<HTMLHeadingElement> & {
  className?: string
}) {
  return (
    <h3 className={cn(`text-text-lightmode-primary dark:text-text-darkmode-primary`, className)} {...props}>
      {children}
    </h3>
  )
}
function H4({
              children,
              className,
              ...props
            }: React.HTMLAttributes<HTMLHeadingElement> & {
  className?: string
}) {
  return (
    <h4 className={cn(`text-text-lightmode-primary dark:text-text-darkmode-primary`, className)} {...props}>
      {children}
    </h4>
  )
}
function H5({
              children,
              className,
              ...props
            }: React.HTMLAttributes<HTMLHeadingElement> & {
  className?: string
}) {
  return (
    <h5 className={cn(`text-text-lightmode-primary dark:text-text-darkmode-primary`, className)} {...props}>
      {children}
    </h5>
  )
}
function H6({
              children,
              className,
              ...props
            }: React.HTMLAttributes<HTMLHeadingElement> & {
  className?: string
}) {
  return (
    <h6 className={cn(`text-text-lightmode-primary dark:text-text-darkmode-primary`, className)} {...props}>
      {children}
    </h6>
  )
}


type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> & { className?: string }

function P({ children, className, ...props }: ParagraphProps) {
  return (
    <p
      className={cn(
        `text-b1 font-semibold text-text-lightmode-secondary dark:text-text-darkmode-secondary`,
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export {H1,H2,H3,H4,H5,H6,P}
