import React from 'react'
import tw from 'twin.macro'
import Button from '../../twComponents/Button'
import AnimatedButtonGroup from '../../twComponents/AnimatedButtonGroup'
import { useRewardToggle } from '../../../context'

function TopLinks(): JSX.Element {
  const { panelIndex, changePanel } = useRewardToggle()
  return (
    <AnimatedButtonGroup
      containerStyle={[tw`flex flex-row gap-2 font-semibold text-tiny`]}
      animatedButtonStyle={[tw`bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2 h-[35px]`]}
    >
      <Button
        cssClasses={[
          tw`font-sans h-[35px] !px-5 !py-1.875 font-semibold text-white`,
          panelIndex !== 0 && tw`dark:text-white text-black`
        ]}
        onClick={() => changePanel(0)}
      >
        Earn
      </Button>
      <Button
        cssClasses={[
          tw`font-sans h-[35px] !px-5 !py-1.875 font-semibold text-white`,
          panelIndex !== 1 && tw`dark:text-white text-black`
        ]}
        onClick={() => changePanel(1)}
      >
        Refer
      </Button>
      {/*<Button*/}
      {/*  cssClasses={[tw`font-sans h-[35px] !px-5 !py-1.875 font-semibold text-white`]}*/}
      {/*  onClick={() => changePanel(2)}*/}
      {/*>*/}
      {/*  Win*/}
      {/*</Button>*/}
    </AnimatedButtonGroup>
  )
}

export default TopLinks
