import { TokenAmount } from '@solana/web3.js'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useRewards from '../../../../context/rewardsContext'
import { getAccurateNumber } from '../../../../utils'
import { Button, cn, Input, InputElementLeft, InputElementRight, InputGroup } from 'gfx-component-lib'

interface RewardsInputProps {
  userGoFxBalance: TokenAmount
  isStakeSelected: boolean
  onInputChange?: (value: string) => void
}

export default function RewardsInput({
  userGoFxBalance,
  isStakeSelected,
  onInputChange
}: RewardsInputProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const { totalStaked } = useRewards()
  const [inputValue, setInputValue] = useState<string>()
  const handleHalf = useCallback(async () => {
    let half: number
    if (isStakeSelected) {
      if (userGoFxBalance.uiAmount <= 0) return
      half = userGoFxBalance.uiAmount / 2
    } else {
      if (totalStaked <= 0) return
      half = totalStaked / 2
    }
    const number = getAccurateNumber(half, 9)
    setInputValue(number.toString())
  }, [userGoFxBalance, totalStaked, isStakeSelected])
  const handleMax = useCallback(async () => {
    let max = userGoFxBalance.uiAmount
    if (!isStakeSelected) max = totalStaked
    max = getAccurateNumber(max, 9)
    setInputValue(max.toString())
  }, [userGoFxBalance, isStakeSelected, totalStaked])
  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [inputRef])
  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value)
    console.log
  }, [])
  useEffect(() => {
    onInputChange(inputValue)
  }, [inputValue])
  const disabled = isStakeSelected ? userGoFxBalance.uiAmount <= 0.0 : totalStaked <= 0.0
  return (
    <InputGroup
      onClick={focusInput}
      className={cn('flex-grow flex-shrink min-sm:order-1')}
      leftItem={
        <InputElementLeft>
          <Button
            variant={'ghost'}
            onClick={handleHalf}
            className={cn(`p-1.5`, !disabled && `text-text-blue dark:text-text-darkmode-primary`)}
            size={'sm'}
            disabled={disabled}
          >
            Half
          </Button>
          <Button
            variant={'ghost'}
            onClick={handleMax}
            className={cn(`p-1.5`, !disabled && `text-text-blue dark:text-text-darkmode-primary`)}
            size={'sm'}
            disabled={disabled}
          >
            Max
          </Button>
        </InputElementLeft>
      }
      rightItem={<InputElementRight>GOFX</InputElementRight>}
    >
      <Input
        ref={inputRef}
        maxLength={12}
        pattern="\d+(\.\d+)?"
        placeholder={'0'}
        onChange={handleInputChange}
        value={inputValue}
        type={'number'}
        className={'text-right'}
      />
    </InputGroup>
  )
}
