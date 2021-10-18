import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'
import { SynthToken } from '../SynthToken'
import { ArrowDropdown } from '../../../components'
import { useSynths } from '../../../context'
import { CenteredDiv, CenteredImg } from '../../../styles'

const SELECTOR = styled.div`
  position: relative;
  height: 160px;
  width: 200px;
  padding: ${({ theme }) => theme.margins['1.5x']} 0;
  ${({ theme }) => theme.smallBorderRadius}
  overflow-y: scroll;
  background-color: #525252;

  > span {
    padding: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['6x']};
    font-weight: bold;

    &:hover {
      background-color: #1f1f1f;
      cursor: pointer;
    }
  }
`

const SYNTH = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 24%;

  &:hover {
    background-color: #1f1f1f;
    cursor: pointer;
  }

  > div {
    ${({ theme }) => theme.measurements(theme.margins['3x'])}
    margin-right: ${({ theme }) => theme.margins['2x']};
  }

  > span {
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.margins['1.5x']} 0;
    font-size: 12px;
    font-weight: bold;

    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.margins['1.5x']};
    }
  }
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
    <SELECTOR>
      {availableSynths.map(([synth], index) => (
        <SYNTH key={index} onClick={() => handleClick(synth)}>
          <CenteredImg>
            <img src={`${process.env.PUBLIC_URL}/img/synth/${synth}.svg`} alt="" />
          </CenteredImg>
          <span>{synth}</span>
        </SYNTH>
      ))}
    </SELECTOR>
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
    <CenteredDiv>
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
    </CenteredDiv>
  )
}
