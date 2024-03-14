import { cn } from 'gfx-component-lib'
import { FC, ReactNode } from 'react'

export const InfoLabel: FC<{ children: ReactNode }> = ({ children }) => (
  <div>
    <h5 className={cn('text-black-4 dark:text-grey-8')}>{children}</h5>
  </div>
)

export const PerpsLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <div className={cn('h-full dark:bg-black-2 bg-white border-solid')}>{children}</div>
)

export const ContentLabel: FC<{ children: ReactNode }> = ({ children }) => (
  <div>
    <h5 className={cn('text-grey-1 dark:text-grey-2')}>{children}</h5>
  </div>
)
export const TitleLabel: FC<{ children: ReactNode; whiteText?: boolean }> = ({ children, whiteText }) => (
  <div>
    <h5
      className={cn(`dark:text-grey-1 text-grey-9 duration-200
  ${whiteText && `!text-white`}`)}
    >
      {children}
    </h5>
  </div>
)

export const InfoImage: FC<{ mode: string }> = ({ mode }) => (
  <img src={`/img/assets/Tooltip${mode}.svg`} alt="heart-icon" tw="ml-2 h-5 w-5 ml-1.5" />
)
