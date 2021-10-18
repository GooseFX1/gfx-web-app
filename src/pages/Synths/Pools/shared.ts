import styled from 'styled-components'
import { MainButton } from '../../../components'
import { SpaceBetweenDiv } from '../../../styles'

export const Available = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 40%;
  text-align: left;

  > div {
    height: 39px;
    margin-top: ${({ theme }) => theme.margins['1x']};
    padding: 4px 11px;
    ${({ theme }) => theme.smallBorderRadius}
    background-color: ${({ theme }) => theme.bg5};
  }

  > span {
    font-size: 12px;
    font-weight: bold;
    color: ${({ theme }) => theme.text1};
  }
`

export const Button = styled(MainButton)`
  margin-left: auto;
`

export const InputHeader = styled(SpaceBetweenDiv)`
  margin-bottom: ${({ theme }) => theme.margins['1x']};

  span {
    font-size: 12px;
    font-weight: bold;
    color: ${({ theme }) => theme.text1};
  }

  > span:last-child {
    color: ${({ theme }) => theme.text1h};

    &:hover {
      color: ${({ theme }) => theme.text1};
      cursor: pointer;
    }
  }
`

export const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 60%;
  margin-right: ${({ theme }) => theme.margins['3x']};
`

export const Synth = styled.div`
  position: absolute;
  bottom: 7px;
  right: 10px;
`
