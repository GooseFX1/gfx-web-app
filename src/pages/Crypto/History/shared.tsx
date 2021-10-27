import styled from 'styled-components'
import { SpaceBetweenDiv } from '../../../styles'

export const Entry = styled(SpaceBetweenDiv)<{ $entriesLength: number }>`
  width: 100%;

  > * {
    width: ${({ $entriesLength }) => 100 / $entriesLength}%;
  }

  > div {
    ${({ theme }) => theme.flexCenter}
  }

  > div > span {
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.secondary4};
    }
  }

  > span,
  > div > span {
    font-size: 12px;
    color: ${({ theme }) => theme.text1};
  }
`
