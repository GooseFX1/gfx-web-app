import { HTMLAttributes } from 'react'
import { cn } from 'gfx-component-lib'

type ParagraphType = {
  as: "p"
} & HTMLAttributes<HTMLParagraphElement>
type HeadingType = {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
} & HTMLAttributes<HTMLHeadingElement>
type SpanType = {
  as: "span"
} & HTMLAttributes<HTMLSpanElement>
type TextProps = {
  children?: React.ReactNode | React.ReactNode[]
} & (ParagraphType | HeadingType | SpanType)

function Text({children, className, as='p', ...rest}: TextProps) : JSX.Element {
  const Comp = as
  const coloring = as == 'p' || as == 'span' ? 'text-text-lightmode-secondary dark:text-text-darkmode-secondary' :
    'text-text-lightmode-primary dark:text-text-darkmode-primary';
  return (
    <Comp className={cn(`
      font-semibold 
    `,coloring,className)}{...rest}>
      {children}
    </Comp>
  )
}

export default Text