import { TokenAmount } from '@solana/web3.js'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Input, InputRef } from 'antd'
import useRewards from '../../../../context/rewardsContext'
import { getAccurateNumber } from '../../../../utils'
import tw from 'twin.macro'

interface RewardsInputProps {
  userGoFxBalance: TokenAmount
  isStakeSelected: boolean
  onInputChange?: (value: number) => void
}

export default function RewardsInput({
  userGoFxBalance,
  isStakeSelected,
  onInputChange
}: RewardsInputProps): JSX.Element {
  const inputRef = useRef<InputRef>(null)
  const { totalStaked } = useRewards()
  const [inputValue, setInputValue] = useState<number>(0.0)
  const handleHalf = useCallback(async () => {
    let half: number
    if (isStakeSelected) {
      if (userGoFxBalance.uiAmount <= 0) return
      half = userGoFxBalance.uiAmount / 2
    } else {
      if (totalStaked <= 0) return
      half = totalStaked / 2
    }

    setInputValue(getAccurateNumber(half, 9))
  }, [userGoFxBalance, totalStaked, isStakeSelected])
  const handleMax = useCallback(async () => {
    let max = userGoFxBalance.uiAmount
    if (!isStakeSelected) max = totalStaked
    setInputValue(getAccurateNumber(max, 9))
  }, [userGoFxBalance, isStakeSelected, totalStaked])
  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [inputRef])
  const handleInputChange = useCallback((e) => {
    const value = parseFloat(e.target.value)
    setInputValue(isNaN(value) ? 0.0 : value)
  }, [])
  useEffect(() => {
    onInputChange(inputValue)
  }, [inputValue])
  return (
    <div
      onClick={focusInput}
      css={[
        tw`order-3 min-sm:flex-two-thirds
        relative rounded-[100px] h-[40px] w-full min-md:min-w-[200px] bg-grey-5 dark:bg-black-1
          dark:border-black-1 items-center flex justify-center
        `
      ]}
    >
      <div
        css={[
          tw`text-regular absolute font-bold  left-[15px] z-[1] flex flex-row gap-[15px]
            `
        ]}
      >
        <p
          onClick={handleHalf}
          css={[
            tw`mb-0 text-grey-1 cursor-not-allowed dark:text-grey-1`,
            userGoFxBalance.uiAmount > 0.0 ? tw`cursor-pointer text-primary-gradient-1 dark:text-grey-5` : tw``
          ]}
        >
          Half
        </p>
        <p
          onClick={handleMax}
          css={[
            tw`mb-0 text-grey-1 cursor-not-allowed dark:text-grey-1`,
            userGoFxBalance.uiAmount > 0.0 ? tw`cursor-pointer text-primary-gradient-1 dark:text-grey-5` : tw``
          ]}
        >
          Max
        </p>
      </div>

      <Input
        css={[
          tw`text-lg h-10  w-full rounded-[100px] bg-grey-5 text-grey-1
            placeholder-grey-1  border-transparent active:border-grey-1 hover:border-grey-1  focus:border-grey-1
            dark:bg-black-1 dark:text-grey-2 focus:dark:border-grey-2 active:dark:border-grey-2
            hover:dark:border-grey-2 pr-[80px] dark:placeholder-grey-2 h-10
            `
        ]}
        ref={inputRef}
        maxLength={12}
        pattern="\d+(\.\d+)?"
        placeholder={'0'}
        onChange={handleInputChange}
        type={'number'}
        value={inputValue > 0.0 ? inputValue : ''}
      />
      <p
        css={[
          tw`mb-0 text-lg absolute right-[15px] z-[1] text-grey-1
            dark:text-grey-2 font-semibold
            `
        ]}
      >
        GOFX
      </p>
    </div>
  )
}
