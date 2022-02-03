import styled from 'styled-components'
import { MainButton } from '../../../components'
import { SpaceBetweenDiv } from '../../../styles'

export const Available = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 40%;
  text-align: left;

  > div {
    height: 39px;
    margin-top: ${({ theme }) => theme.margin(1)};
    padding: 4px 11px;
    ${({ theme }) => theme.smallBorderRadius}
    background-color: ${({ theme }) => theme.bg5};

    > span:first-child {
      ${({ theme }) => theme.ellipse}
      margin-right: ${({ theme }) => theme.margin(1)};
    }
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
  padding: 0 15%;

  &:hover {
    background-color: #1f1f1f;
    cursor: pointer;
  }

  div {
    ${({ theme }) => theme.measurements(theme.margin(3))}
    margin-right: ${({ theme }) => theme.margin(2)};
  }

  span {
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.margin(1.5)} 0;
    font-size: 12px;
    font-weight: bold;
  }

  span:nth-child(3) {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
`

export const AvailableSynthsSelector = styled.div`
  position: relative;
  height: 200px;
  width: 250px;
  padding: ${({ theme }) => theme.margin(1.5)} 0;
  ${({ theme }) => theme.smallBorderRadius}
  overflow-y: scroll;
  background-color: #525252;

  > span {
    padding: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(6)};
    font-weight: bold;

    &:hover {
      background-color: #1f1f1f;
      cursor: pointer;
    }
  }
`

export const Bottom = styled.div`
  display: flex;
  align-items: center;

  > span {
    width: 30%;
    font-size: 10px;
    text-align: left;
    color: ${({ theme }) => theme.text1};
  }
`

export const Button = styled(MainButton)`
  margin-left: auto;
`

export const InputHeader = styled(SpaceBetweenDiv)`
  margin-bottom: ${({ theme }) => theme.margin(1)};

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
  margin-right: ${({ theme }) => theme.margin(3)};
`

export const Synth = styled.div`
  position: absolute;
  bottom: 7px;
  right: 10px;
`
