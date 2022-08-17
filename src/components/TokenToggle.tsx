import { useState, FC } from 'react'
import styled from 'styled-components'
import { MODE_ICON, SpaceBetweenDiv, CenteredDiv } from '../styles'

const WRAPPER = styled(SpaceBetweenDiv)`
  padding: 0.75rem 1.5rem 0.75rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  width: 170px;
  float: right;
  background-color: ${({ theme }) => theme.bg1};

  div {
    &:nth-child(2) {
      margin-inline: ${({ theme }) => theme.margin(1)};
    }
  }
`

export const Toggle = styled(CenteredDiv)<{ $mode: number }>`
  height: 25px;
  width: 50px;
  border-radius: 40px;
  margin-right: ${({ theme }) => theme.margin(5)};
  background: ${({ $mode }) =>
    $mode === 0
      ? 'linear-gradient(96.79deg, #F7931A 4.25%, #AC1CC7 97.61%);'
      : 'linear-gradient(96.79deg, #5855FF 4.25%, #DC1FFF 97.61%);'};
  &:hover {
    cursor: pointer;
  }
  > div {
    ${({ theme }) => theme.measurements(theme.margin(2.5))}
    ${({ theme }) => theme.roundedBorders}
    background-color: #fff;
    font-weight: 600;
    transform: translateX(${({ $mode }) => ($mode === 0 ? '-' : '')}${({ theme }) => theme.margin(1.5)});
  }
`

export const TokenToggle: FC<{ toggleToken: () => void }> = ({ toggleToken }) => {
  const [position, setPosition] = useState<number>(0)

  const handleToggle = () => {
    setPosition((prev) => (prev === 0 ? 1 : 0))
    toggleToken()
  }

  return (
    <WRAPPER>
      <MODE_ICON>SOL</MODE_ICON>

      <Toggle $mode={position} onClick={handleToggle}>
        <div />
      </Toggle>

      <MODE_ICON>GOFX</MODE_ICON>
    </WRAPPER>
  )
}
