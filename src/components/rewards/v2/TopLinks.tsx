import React from 'react'
import tw from 'twin.macro'
import Button from '../../twComponents/Button'
import AnimatedButtonGroup from '../../twComponents/AnimatedButtonGroup'
import { useRewardToggle } from '../../../context'

function TopLinks(): JSX.Element {
  const { changePanel } = useRewardToggle()
  return (
    <AnimatedButtonGroup
      containerStyle={[tw`flex flex-row gap-2 font-semibold text-tiny`]}
      animatedButtonStyle={[tw`bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2 h-[35px]`]}
    >
      <Button
        cssClasses={[tw`font-sans h-[35px] !px-5 !py-1.875 font-semibold text-white`]}
        onClick={() => changePanel(0)}
      >
        Earn
      </Button>
      {/* <Button
        cssClasses={[tw`font-sans h-[35px] !px-5 !py-1.875 font-semibold text-white`]}
        onClick={() => changePanel(1)}
      >
        Win
      </Button> */}
      <Button
        cssClasses={[tw`font-sans h-[35px] !px-5 !py-1.875 font-semibold text-white`]}
        onClick={() => changePanel(1)}
      >
        Refer
      </Button>
    </AnimatedButtonGroup>
  )
}

export default TopLinks
