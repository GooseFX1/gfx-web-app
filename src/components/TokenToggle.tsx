import { FC } from 'react'
import styled from 'styled-components'
import { MODE_ICON, SpaceBetweenDiv, TOKENTOGGLE } from '../styles'

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

const Toggle = styled(TOKENTOGGLE)`
  height: 25px;
  width: 50px;
  border-radius: 40px;
`

export const TokenToggle: FC<{ token: string; toggleToken: () => void }> = ({ token, toggleToken }) => {
  return (
    <WRAPPER>
      <MODE_ICON>SOL</MODE_ICON>

      <Toggle $mode={token} onClick={toggleToken}>
        <div />
      </Toggle>

      <MODE_ICON>GOFX</MODE_ICON>
    </WRAPPER>
  )
}
