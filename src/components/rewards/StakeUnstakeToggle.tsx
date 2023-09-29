import React, { BaseSyntheticEvent, useCallback, useRef } from 'react'
import { InputRef } from 'antd'
import { TokenAmount } from '@solana/web3.js'
import { useAnimateButtonSlide } from '../../components/Farm/generic'
import useRewards from '../../context/rewardsContext'
import { clamp } from '../../utils'
import tw from 'twin.macro'
import 'styled-components/macro'

interface StakeUnstakeToggleProps {
  isStakeSelected: boolean
  setIsStakeSelected: (isStakeSelected: boolean) => void
  inputRef: React.MutableRefObject<InputRef>
  setInputValue: (value: number) => void
  userGoFxBalance: TokenAmount
  isStakeLoading: boolean
}
const StakeUnstakeToggle = ({
  isStakeSelected,
  setIsStakeSelected,
  inputRef,
  setInputValue,
  userGoFxBalance,
  isStakeLoading
}: StakeUnstakeToggleProps): JSX.Element => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLButtonElement[]>([])
  const { handleSlide } = useAnimateButtonSlide(sliderRef, buttonsRef, isStakeSelected ? 0 : 1)
  const { rewards, getUiAmount } = useRewards()
  const setSliderRef = useCallback(
    (el: HTMLButtonElement) => {
      const index = parseInt(el?.dataset?.index)
      if (isNaN(index)) {
        return
      }
      buttonsRef.current[index] = el
      handleSlide(isStakeSelected ? 0 : 1)
    },
    [isStakeSelected]
  )
  const handleStakeUnstakeToggle = useCallback(
    async (el: BaseSyntheticEvent) => {
      const index = parseInt(el.target.dataset.index)
      handleSlide(index)
      setIsStakeSelected(index === 0)
      const amount = parseFloat(inputRef.current?.input.value)

      if (!amount) {
        return
      }

      setInputValue(
        isStakeSelected
          ? clamp(amount, 0, userGoFxBalance.uiAmount)
          : clamp(amount, 0, getUiAmount(rewards.user.staking.userMetadata.totalStaked))
      )
    },
    [inputRef, rewards, userGoFxBalance]
  )
  return (
    <div css={tw`w-full min-md:w-max flex flex-row relative justify-between min-md:justify-start items-center `}>
      <div ref={sliderRef} css={tw`w-full bg-blue-1 h-[40px] rounded-[36px] z-[0] absolute transition-all`} />
      <button
        ref={setSliderRef}
        data-index={0}
        css={[
          tw` px-8 py-2.25 w-[165px] cursor-pointer min-md:w-[94px] z-[0] text-center border-none
                border-0 font-semibold text-regular h-[40px] rounded-[36px] duration-700 bg-transparent
                flex items-center justify-center
                `,
          isStakeSelected ? tw`text-white` : tw`text-grey-1`,
          isStakeLoading && !isStakeSelected && tw`cursor-not-allowed`
        ]}
        onClick={handleStakeUnstakeToggle}
        disabled={isStakeLoading && !isStakeSelected}
      >
        Stake
      </button>
      <button
        data-index={1}
        ref={setSliderRef}
        css={[
          tw` px-8 py-2.25 w-[165px] cursor-pointer min-md:w-[94px] z-[0] text-center border-none
                border-0 font-semibold text-regular h-[40px] rounded-[36px] duration-700 bg-transparent
                flex items-center justify-center
                `,
          !isStakeSelected ? tw`text-white` : tw`text-grey-1`,
          isStakeLoading && isStakeSelected && tw`cursor-not-allowed`
        ]}
        onClick={handleStakeUnstakeToggle}
        disabled={isStakeLoading && isStakeSelected}
      >
        Unstake
      </button>
    </div>
  )
}
export default StakeUnstakeToggle
