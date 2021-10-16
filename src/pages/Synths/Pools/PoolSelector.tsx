import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'
import { ArrowDropdown } from '../../../components'
import { useSynths } from '../../../context'
import { CenteredDiv, CenteredImg, SVGToWhite } from '../../../styles'

const ARROW = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['1.5x'])};
  margin-left: ${({ theme }) => theme.margins['2x']};
  cursor: pointer;
`

const SELECTOR = styled.div`
  position: relative;
  ${({ theme }) => theme.flexCenter}
  flex-direction: column;
  padding: ${({ theme }) => theme.margins['1.5x']} 0;
  ${({ theme }) => theme.smallBorderRadius}
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

const WRAPPER = styled(CenteredDiv)`
  padding: ${({ theme }) => theme.margins['3x']};
  ${({ theme }) => theme.largeBorderRadius}
  ${({ theme }) => theme.largeShadow}
  background-color: ${({ theme }) => theme.primary2};

  > span {
    margin-right: ${({ theme }) => theme.margins['3x']};
    font-size: 12px;
    font-weight: bold;
    color: white !important;
  }
`

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setVisible: Dispatch<SetStateAction<boolean>>
}> = ({ setArrowRotation, setVisible }) => {
  const { availablePools, setPoolName } = useSynths()

  const handleClick = useCallback(
    (pool: string) => {
      setArrowRotation(false)
      setPoolName(pool)
      setVisible(false)
    },
    [setArrowRotation, setPoolName, setVisible]
  )

  return (
    <SELECTOR>
      {availablePools.map(([pool], index) => (
        <span key={index} onClick={() => handleClick(pool)}>
          {pool}
        </span>
      ))}
    </SELECTOR>
  )
}

export const PoolSelector: FC = () => {
  const { poolName } = useSynths()
  const [arrowRotation, setArrowRotation] = useState(false)
  const [visible, setVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setVisible(!visible)
  }

  return (
    <WRAPPER>
      <span>{poolName}</span>
      <ArrowDropdown
        arrowRotation={arrowRotation}
        measurements="16px"
        offset={[28, 30]}
        onVisibleChange={handleClick}
        onClick={handleClick}
        overlay={<Overlay setArrowRotation={setArrowRotation} setVisible={setVisible} />}
        visible={visible}
      >
        <ARROW>
          <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`} alt="" />
        </ARROW>
      </ArrowDropdown>
    </WRAPPER>
  )
}
