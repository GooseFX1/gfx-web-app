import React from 'react'
import { useRewardToggle } from '../../../context'
import { RadioGroup, RadioGroupItem } from 'gfx-component-lib'
const mappedValues = ['earn', 'refer', 'win']

function TopLinks(): JSX.Element {
  const { panelIndex, changePanel } = useRewardToggle()
  return (
    <RadioGroup defaultValue={'earn'} value={mappedValues[panelIndex]}>
      <RadioGroupItem
        value={'earn'}
        variant={'primary'}
        size={'lg'}
        // className={cn(
        //   `font-sans h-[35px] !px-5 !py-1.875 font-semibold text-white`,
        //   panelIndex !== 0 && `dark:text-white text-black`
        //   )}
        onClick={() => changePanel(0)}
      >
        Earn
      </RadioGroupItem>
      <RadioGroupItem
        value={'refer'}
        variant={'primary'}
        size={'lg'}
        // className={cn(`font-sans h-[35px] !px-5 !py-1.875 font-semibold text-white`,
        //   panelIndex !== 1 && `dark:text-white text-black`
        // )}
        onClick={() => changePanel(1)}
      >
        Refer
      </RadioGroupItem>
    </RadioGroup>
  )
}

export default TopLinks
