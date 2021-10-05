import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { ArrowDropdown } from '../../../components'
import { CenteredImg, SVGToWhite } from '../../../styles'

const ARROW = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])};
  margin-left: ${({ theme }) => theme.margins['2x']};
  cursor: pointer;
`

const Overlay: FC<{ setArrowRotation: (x: boolean) => void }> = ({ setArrowRotation }) => {
  return (
    <div>
      A
    </div>
  )
}

export const MarketSelector: FC = () => {
  const [arrowRotation, setArrowRotation] = useState(false)

  return (
    <ArrowDropdown
      arrowRotation={arrowRotation}
      offset={[0, 0]}
      overlay={<Overlay setArrowRotation={setArrowRotation} />}
      setArrowRotation={setArrowRotation}
    >
      <ARROW>
        <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`} alt="" />
      </ARROW>
    </ArrowDropdown>
  )
}
