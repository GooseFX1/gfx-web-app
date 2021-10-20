import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AvailableSynth, AvailableSynthsSelector } from '../shared'
import { SynthToken } from '../../SynthToken'
import { ArrowDropdown } from '../../../../components'
import { ISwapToken, useSynthSwap } from '../../../../context'
import { CenteredImg, FlexColumnDiv, SpaceBetweenDiv } from '../../../../styles'

const WRAPPER = styled(FlexColumnDiv)<{ $height: string }>`
  position: absolute;
  top: 0;
  left: 0;
  align-items: flex-start;
  height: ${({ $height }) => $height};
  width: 48%;
  padding: ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.grey5};
  z-index: 1;
  cursor: pointer;

  > div {
    ${({ theme }) => theme.measurements('100%')}

    > span {
      font-size: 10px;
      font-weight: bold;
    }
  }

  > span {
    font-size: 8px;
  }
`

const Overlay: FC<{
  otherToken?: ISwapToken
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setVisible: Dispatch<SetStateAction<boolean>>
  side: 'in' | 'out'
}> = ({ otherToken, setArrowRotation, setVisible, side }) => {
  const { availableSynths, setSynthSwap } = useSynthSwap()

  const handleClick = useCallback(
    ([symbol, { address, decimals }]) => {
      setArrowRotation(false)
      setSynthSwap((prevState) => ({
        ...prevState,
        [side === 'in' ? 'inToken' : 'outToken']: { address, decimals, symbol }
      }))
      setVisible(false)
    },
    [setArrowRotation, setSynthSwap, setVisible, side]
  )

  return (
    <AvailableSynthsSelector>
      {availableSynths
        .filter(([name]) => name !== otherToken?.symbol && name !== 'GOFX')
        .map((synth, index) => (
          <AvailableSynth key={index} onClick={() => handleClick(synth)}>
            <CenteredImg>
              <img src={`${process.env.PUBLIC_URL}/img/synth/${synth[0]}.svg`} alt="" />
            </CenteredImg>
            <span>{synth[0]}</span>
          </AvailableSynth>
        ))}
    </AvailableSynthsSelector>
  )
}

export const Selector: FC<{
  balance: number
  height: string
  otherToken?: ISwapToken
  side: 'in' | 'out'
  token?: ISwapToken
}> = ({ balance, height, otherToken, side, token }) => {
  const [arrowRotation, setArrowRotation] = useState(false)
  const [visible, setVisible] = useState(false)

  const userBalance = useMemo(() => 0, [])

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setVisible(!visible)
  }

  console.log(balance)

  return (
    <WRAPPER $height={height} onClick={handleClick}>
      <SpaceBetweenDiv>
        {token ? <SynthToken size="medium" synth={token.symbol} /> : <span>Select a token</span>}
        <ArrowDropdown
          arrowRotation={arrowRotation}
          measurements="12px"
          offset={[35, 30]}
          onVisibleChange={handleClick}
          onClick={handleClick}
          overlay={
            <Overlay otherToken={otherToken} setArrowRotation={setArrowRotation} setVisible={setVisible} side={side} />
          }
          visible={visible}
        />
      </SpaceBetweenDiv>
      {userBalance > 0 && <span>Balance: {userBalance}</span>}
    </WRAPPER>
  )
}
