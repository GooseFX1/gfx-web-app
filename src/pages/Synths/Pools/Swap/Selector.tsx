import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
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
  padding: 10px ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['1.5x']};
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
    whitespace: no-wrap;
  }
`

const Overlay: FC<{
  otherToken?: ISwapToken
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setVisible: Dispatch<SetStateAction<boolean>>
  side: 'in' | 'out'
}> = ({ otherToken, setArrowRotation, setVisible, side }) => {
  const { availableSynths, setInToken, setOutToken } = useSynthSwap()

  const handleClick = useCallback(
    ([symbol, { address, decimals }]) => {
      setArrowRotation(false)
      side === 'in' ? setInToken({ address, decimals, symbol }) : setOutToken({ address, decimals, symbol })
      setVisible(false)
    },
    [setArrowRotation, setInToken, setOutToken, setVisible, side]
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

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setVisible(!visible)
  }

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
      {balance > 0 && <span>Balance: {balance.toFixed(3)}</span>}
    </WRAPPER>
  )
}
