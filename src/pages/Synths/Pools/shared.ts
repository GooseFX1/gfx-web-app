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

export const AvailableSynth = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 24%;

  &:hover {
    background-color: #1f1f1f;
    cursor: pointer;
  }

  > div {
    ${({ theme }) => theme.measurements(theme.margins['3x'])}
    margin-right: ${({ theme }) => theme.margins['2x']};
  }

  > span {
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.margins['1.5x']} 0;
    font-size: 12px;
    font-weight: bold;

    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.margins['1.5x']};
    }
  }
`

export const AvailableSynthsSelector = styled.div`
  position: relative;
  height: 160px;
  width: 200px;
  padding: ${({ theme }) => theme.margins['1.5x']} 0;
  ${({ theme }) => theme.smallBorderRadius}
  overflow-y: scroll;
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
