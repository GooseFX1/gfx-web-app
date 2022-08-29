import { useState, FC } from 'react'
import styled from 'styled-components'
import { CenteredImg, SpaceBetweenDiv, CenteredDiv } from '../styles'
import tw from 'twin.macro'

const WRAPPER = styled(SpaceBetweenDiv)`
  padding: 0.75rem 1.5rem 0.75rem 0rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  width: 200px;
  float: right;
  background-color: inherit;

  div {
    &:nth-child(2) {
      margin-inline: ${({ theme }) => theme.margin(1)};
    }
  }
`

const CLICKER_ICON = styled(CenteredImg)`
  ${tw`h-12 w-12 mr-1 rounded-circle`}
`

const Toggle = styled(CenteredDiv)<{ $mode: number }>`
  height: 25px;
  width: 50px;
  border-radius: 40px;
  margin-right: ${({ theme }) => theme.margin(5)};
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.25);
  background: ${({ $mode }) =>
    $mode === 0
      ? 'linear-gradient(263.3deg,#f7931a 2.39%,#ac1cc7 97.61%);'
      : 'linear-gradient(96.79deg, #5855FF 4.25%, #DC1FFF 97.61%);'};
  &:hover {
    cursor: pointer;
  }
  > div {
    ${({ theme }) => theme.measurements(theme.margin(3.125))}
    ${({ theme }) => theme.roundedBorders}
    background-color: #fff;
    font-weight: 600;
    transform: translateX(${({ $mode }) => ($mode === 0 ? '-' : '')}${({ theme }) => theme.margin(1.5)});
  }
`

export const SwapTokenToggle: FC<{ toggleToken: () => void; tokenA: any; tokenB: any }> = ({
  toggleToken,
  tokenA,
  tokenB
}) => {
  const [position, setPosition] = useState<number>(0)

  const handleToggle = () => {
    setPosition((prev) => (prev === 0 ? 1 : 0))
    toggleToken()
  }

  return (
    <WRAPPER>
      <CLICKER_ICON>
        <img
          src={`/img/crypto/${tokenA?.symbol}.svg`}
          alt="inputToken"
          onError={(e) => (e.currentTarget.src = tokenA.logoURI || '/img/crypto/Unknown.svg')}
        />
      </CLICKER_ICON>

      <Toggle $mode={position} onClick={handleToggle}>
        <div />
      </Toggle>

      <CLICKER_ICON>
        <img
          src={`/img/crypto/${tokenB?.symbol}.svg`}
          alt="outputToken"
          onError={(e) => (e.currentTarget.src = tokenB.logoURI || '/img/crypto/Unknown.svg')}
        />
      </CLICKER_ICON>
    </WRAPPER>
  )
}
