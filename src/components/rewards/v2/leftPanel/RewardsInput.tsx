import { TokenAmount } from '@solana/web3.js'
import React, { useCallback, useEffect, useState } from 'react'
import useRewards from '@/context/rewardsContext'
import { getAccurateNumber } from '@/utils'
import TokenInput from '@/components/common/TokenInput'

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

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value)
    console.log
  }, [])
  useEffect(() => {
    onInputChange(inputValue)
  }, [inputValue])
  const disabled = isStakeSelected ? userGoFxBalance.uiAmount <= 0.0 : totalStaked <= 0.0
  return (
    <TokenInput
      handleHalf={handleHalf}
      handleMax={handleMax}
      onChange={handleInputChange}
      minMaxDisabled={disabled}
      disabled={disabled}
      value={inputValue}
      tokenSymbol={'GOFX'}
    />
  )
}
