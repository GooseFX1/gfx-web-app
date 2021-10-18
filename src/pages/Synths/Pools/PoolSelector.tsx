import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'
import { ArrowDropdown } from '../../../components'
import { useSynths } from '../../../context'
import { CenteredDiv } from '../../../styles'

const SELECTOR = styled(CenteredDiv)`
  position: relative;
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
        measurements="14px"
        offset={[28, 30]}
        onVisibleChange={handleClick}
        onClick={handleClick}
        overlay={<Overlay setArrowRotation={setArrowRotation} setVisible={setVisible} />}
        visible={visible}
      />
    </WRAPPER>
  )
}
