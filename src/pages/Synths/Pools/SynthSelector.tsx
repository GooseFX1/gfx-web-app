import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'
import { AvailableSynth, AvailableSynthsSelector } from './shared'
import { SynthToken } from '../SynthToken'
import { ArrowDropdown } from '../../../components'
import { useSynths } from '../../../context'
import { CenteredDiv, CenteredImg } from '../../../styles'

const WRAPPER = styled(CenteredDiv)`
  cursor: pointer;
`

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setVisible: Dispatch<SetStateAction<boolean>>
}> = ({ setArrowRotation, setVisible }) => {
  const { availableSynths, setSynth } = useSynths()

  const handleClick = useCallback(
    (synth: string) => {
      setArrowRotation(false)
      setSynth(synth)
      setVisible(false)
    },
    [setArrowRotation, setSynth, setVisible]
  )

  return (
    <AvailableSynthsSelector>
      {availableSynths
        .filter(([synth, _]) => synth !== 'GOFX')
        .map(([synth], index) => (
          <AvailableSynth key={index} onClick={() => handleClick(synth)}>
            <CenteredImg>
              <img src={`${process.env.PUBLIC_URL}/img/synth/${synth}.svg`} alt="" />
            </CenteredImg>
            <span>{synth}</span>
          </AvailableSynth>
        ))}
    </AvailableSynthsSelector>
  )
}

export const SynthSelector: FC = () => {
  const { synth } = useSynths()
  const [arrowRotation, setArrowRotation] = useState(false)
  const [visible, setVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setVisible(!visible)
  }

  return (
    <WRAPPER onClick={handleClick}>
      <SynthToken size="large" synth={synth} />
      <ArrowDropdown
        arrowRotation={arrowRotation}
        measurements="12px"
        offset={[10, 30]}
        onVisibleChange={handleClick}
        onClick={handleClick}
        overlay={<Overlay setArrowRotation={setArrowRotation} setVisible={setVisible} />}
        visible={visible}
      />
    </WRAPPER>
  )
}
