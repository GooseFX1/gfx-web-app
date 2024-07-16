/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from 'gfx-component-lib'
import { FC, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'

export const BlackGradientBg: FC<{ children: ReactNode }> = ({ children }) => (
  <div
    className="fixed bottom-0 left-0 w-full h-20  bg-gradient-lite-3 dark:bg-gradient-2
z-50 flex justify-center items-center"
  >
    {children}
  </div>
)

export const InfoLabel: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div>
    <h5 className={cn('text-black-4 dark:text-grey-8', className)}>{children}</h5>
  </div>
)
export const InfoLabelNunito: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div>
    <p className={cn('text-black-4 dark:text-grey-8 text-[13px]', className)}>{children}</p>
  </div>
)
export const GradientBorder: FC<{ children: ReactNode; radius: number }> = ({
  children,
  radius
}): ReactElement => (
  <div className={`w-full p-[1px] bg-gradient-1 rounded-[${radius}px] h-10`}>
    <div className={`bg-grey-5 dark:bg-black-1 h-full rounded-[${radius}px]`}>{children}</div>
  </div>
)
export const GradientButtonWithBorder: FC<{ children: ReactNode; radius: number; height: number }> = ({
  children,
  radius,
  height
}): ReactElement => {
  const ref = useRef(null)

  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth)
    }
  }, [children])

  return (
    <div className="relative">
      <div className={`w-full p-[1px] bg-gradient-1 rounded-[${radius}px] h-[${height}px]`}>
        <div className={`bg-grey-5 dark:bg-black-1 h-full rounded-[${radius - 1}px]`}>
          <div className={`w-full p-[1px] bg-gradient-1 rounded-[${radius - 1}px] h-full opacity-50`}></div>
        </div>
      </div>
      <div
        ref={ref}
        style={{
          width: 'fit-content',
          marginLeft: `${(43 - width) / 2}px`
        }}
        className={`absolute mt-[-21px] h-[${height}px]`}
      >
        {children}
      </div>
    </div>
  )
}

export const PerpsLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <div className={cn(`flex flex-col flex-1 h-full dark:bg-black-2 bg-white rounded-[3px] max-sm:rounded-[10px] 
  overflow-y-scroll`)}>
    {children}</div>
)

export const AccountsLabel: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div>
    <h5 className={cn('text-grey-9 dark:text-grey-1', className)}>{children}</h5>
  </div>
)
export const ContentLabel: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div>
    <h5 className={cn('text-grey-1 dark:text-grey-2', className)}>{children}</h5>
  </div>
)
export const TitleLabel: FC<{ children: ReactNode; whiteText?: boolean }> = ({ children, whiteText }) => (
  <div>
    <h5
      className={cn(`dark:text-grey-1 text-grey-9 duration-200 max-sm:text-tiny
  ${whiteText && `!text-white`}`)}
    >
      {children}
    </h5>
  </div>
)

export const InfoImage: FC<{ mode: string }> = ({ mode }) => (
  <img src={`/img/assets/Tooltip${mode}.svg`} alt="heart-icon" tw="ml-2 h-5 w-5 ml-1.5" />
)
