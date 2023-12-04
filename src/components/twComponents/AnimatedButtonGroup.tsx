import React, { ReactElement, cloneElement, ReactNode, useRef } from 'react'
import tw, { TwStyle } from 'twin.macro'
import { useAnimateButtonSlide } from '../Farm/generic'
import { useRewardToggle } from '../../context'

interface AnimatedButtonGroupProps {
  children: ReactNode[]
  containerStyle?: TwStyle[]
  animatedButtonStyle?: TwStyle[]
  buttonWrapperStyle?: TwStyle[]
  index?: number
}

function AnimatedButtonGroup({
  children,
  containerStyle,
  animatedButtonStyle,
  buttonWrapperStyle
}: AnimatedButtonGroupProps): JSX.Element {
  const slideRef = useRef<HTMLDivElement>()
  const buttonRefs = useRef<HTMLDivElement[]>([])
  const { panelIndex } = useRewardToggle()
  const { handleSlide, setButtonRef } = useAnimateButtonSlide(slideRef, buttonRefs, panelIndex)
  return (
    <div css={[tw`relative`].concat(containerStyle ?? [])}>
      <div
        ref={slideRef}
        css={[tw`bg-white text-black min-md:bg-blue-1 h-7.5 rounded-[36px] z-[-1] absolute transition-all z-[1]`]
          .concat(animatedButtonStyle ?? [])
          .flat()}
      />
      {children.map((child: ReactElement, idx) => (
        <div
          key={`animated_${idx}`}
          css={[tw`z-[2] relative`].concat(buttonWrapperStyle ?? []).flat()}
          ref={setButtonRef}
        >
          {cloneElement(child, {
            onClick: (...args: any) => {
              handleSlide(idx)
              child.props.onClick(args)
            }
          })}
        </div>
      ))}
    </div>
  )
}

export default AnimatedButtonGroup
