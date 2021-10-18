import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'
import { AvailableSynth, AvailableSynthsSelector } from '../shared'
import { SynthToken } from '../../SynthToken'
import { ArrowDropdown } from '../../../../components'
import { ISwapToken, useSynthSwap } from '../../../../context'
import { CenteredDiv, CenteredImg } from '../../../../styles'

const WRAPPER = styled(CenteredDiv)`
  position: absolute;
  top: 0;
  left: 0;
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
      {availableSynths.map((synth, index) => (
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
  otherToken?: ISwapToken
  side: 'in' | 'out'
  token?: ISwapToken
}> = ({ otherToken, side, token }) => {
  const [arrowRotation, setArrowRotation] = useState(false)
  const [visible, setVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setVisible(!visible)
  }

  return (
    <WRAPPER>
      {token ? <SynthToken size="large" synth={token.symbol} /> : <span>CHOOSE</span>}
      <ArrowDropdown
        arrowRotation={arrowRotation}
        measurements="12px"
        offset={[10, 30]}
        onVisibleChange={handleClick}
        onClick={handleClick}
        overlay={
          <Overlay otherToken={otherToken} setArrowRotation={setArrowRotation} setVisible={setVisible} side={side} />
        }
        visible={visible}
      />
    </WRAPPER>
  )
}
