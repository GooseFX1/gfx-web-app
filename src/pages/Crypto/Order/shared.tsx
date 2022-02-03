import styled from 'styled-components'

export const FieldHeader = styled.span`
  display: block;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.margin(0.5)};
  padding: 0 ${({ theme }) => theme.margin(0.5)};
  font-size: 11px;
  text-align: left;
  color: ${({ theme }) => theme.text2};
`

export const Picker = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-left: ${({ theme }) => theme.margin(1.5)};
    font-size: 10px;
    font-weight: bold;
    whitespace: no-wrap;
    cursor: pointer;
    color: ${({ theme }) => theme.text1h};
    transition: color ${({ theme }) => theme.hapticTransitionTime} ease-in-out;

    &:hover {
      color: ${({ theme }) => theme.text1};
    }
  }
`
