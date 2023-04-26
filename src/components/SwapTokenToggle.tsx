import { useState, FC, useCallback } from 'react'
import styled from 'styled-components'
import { SpaceBetweenDiv, CenteredDiv } from '../styles'
import { Image } from 'antd'
import tw from 'twin.macro'
import { useSwap } from '../context/swap'

const WRAPPER = styled(SpaceBetweenDiv)`
  padding: 0.75rem 1.5rem 0.75rem 0rem;
  border-radius: 12px;
  width: 200px;
  float: right;
  background-color: inherit;

  div {
    &:nth-child(2) {
      margin-inline: ${({ theme }) => theme.margin(1)};
    }
  }
`

const CLICKER_ICON = styled(Image)`
  overflow: hidden;
  ${tw`h-12 w-12 rounded-circle`}
`

const Toggle = styled(CenteredDiv)<{ $mode: number }>`
  height: 25px;
  width: 50px;
  border-radius: 40px;
  margin-right: ${({ theme }) => theme.margin(5)};
  cursor: pointer;
  background: ${({ $mode }) =>
    $mode === 0
      ? 'linear-gradient(263.3deg,#f7931a 2.39%,#ac1cc7 97.61%);'
      : 'linear-gradient(96.79deg, #5855FF 4.25%, #DC1FFF 97.61%);'};

  > div {
    ${({ theme }) => theme.measurements('24px')}
    ${({ theme }) => theme.roundedBorders}
    background-color: #fff;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.25);
    transform: translateX(${({ $mode }) => ($mode === 0 ? '-' : '')}${({ theme }) => theme.margin(1.7)});
  }
`

export const SwapTokenToggle: FC<{ toggleToken: () => void }> = ({ toggleToken }) => {
  const [position, setPosition] = useState<number>(0)
  const { tokenA, tokenB } = useSwap()
  const handleToggle = useCallback(() => {
    setPosition((prev) => (prev === 0 ? 1 : 0))
    toggleToken()
  }, [toggleToken])

  return (
    <WRAPPER>
      <CLICKER_ICON
        draggable={false}
        preview={false}
        src={`/img/crypto/${tokenA?.symbol}.svg`}
        fallback={tokenA.logoURI || '/img/crypto/Unknown.svg'}
        alt="inputToken"
      />
      <Toggle $mode={position} onClick={handleToggle}>
        <div />
      </Toggle>

      <CLICKER_ICON
        draggable={false}
        preview={false}
        src={`/img/crypto/${tokenB?.symbol}.svg`}
        fallback={tokenB.logoURI || '/img/crypto/Unknown.svg'}
        alt="inputToken"
      />
    </WRAPPER>
  )
}
