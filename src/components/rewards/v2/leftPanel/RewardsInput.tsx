import { TokenAmount } from '@solana/web3.js'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useRewards from '../../../../context/rewardsContext'
import { getAccurateNumber } from '../../../../utils'
import { Button, cn, Input, InputElementLeft, InputElementRight, InputGroup } from 'gfx-component-lib'

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
  const inputRef = useRef<HTMLInputElement>(null)
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
    <InputGroup
      onClick={focusInput}
      className={cn('flex-grow flex-shrink min-sm:order-1')}
      leftItem={
        <InputElementLeft>
          <Button
            variant={'ghost'}
            onClick={handleHalf}
            className={cn(
              `p-1.5`,
              userGoFxBalance.uiAmount > 0.0 && `text-text-blue dark:text-text-darkmode-primary`
            )}
            size={'sm'}
            disabled={userGoFxBalance.uiAmount <= 0.0}
          >
            Half
          </Button>
          <Button
            variant={'ghost'}
            onClick={handleMax}
            className={cn(
              `p-1.5`,
              userGoFxBalance.uiAmount > 0.0 && `text-text-blue dark:text-text-darkmode-primary`
            )}
            size={'sm'}
            disabled={userGoFxBalance.uiAmount <= 0.0}
          >
            Max
          </Button>
        </InputElementLeft>
      }
      rightItem={
        <InputElementRight
          className={cn(
            inputValue > 0.0
              ? 'text-text-blue dark:text-text-darkmode-primary'
              : `text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`
          )}
        >
          GOFX
        </InputElementRight>
      }
    >
      <Input
        ref={inputRef}
        maxLength={12}
        pattern="\d+(\.\d+)?"
        placeholder={'0'}
        onChange={handleInputChange}
        type={'number'}
        value={inputValue > 0.0 ? inputValue : ''}
        className={'text-right'}
      />
    </InputGroup>
  )
}
