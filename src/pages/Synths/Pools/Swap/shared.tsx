import styled from 'styled-components'
import { FlexColumnDiv, SpaceBetweenDiv } from '../../../../styles'

export const Amount = styled(FlexColumnDiv)<{ $height: string }>`
  position: relative;
  align-items: center;
  justify-content: flex-end;
  height: ${({ $height }) => $height};
  padding: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['2.5x']}
    ${({ theme }) => theme.margins['1x']} 0;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.textBox};

  > div:last-child {
    width: 100%;
  }

  > span {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
  }

  > span:last-child {
    text-align: right;
  }
`

export const Header = styled(SpaceBetweenDiv)`
  position: absolute;
  top: -20px;
  width: 90%;

  span {
    font-weight: bold;
  }

  span:last-child {
    font-size: 11px;
    color: ${({ theme }) => theme.text1h};

    &:hover {
      color: ${({ theme }) => theme.text1};
      cursor: pointer;
    }
  }
`

export const Wrapper = styled(FlexColumnDiv)`
  position: relative;
  flex: 1;
`
