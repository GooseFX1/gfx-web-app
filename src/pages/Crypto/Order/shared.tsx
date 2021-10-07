import styled from 'styled-components'

export const FieldHeader = styled.span`
  display: block;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.margins['0.5x']};
  padding: 0 ${({ theme }) => theme.margins['0.5x']};
  font-size: 11px;
  text-align: left;
  color: ${({ theme }) => theme.text2};
`

export const Picker = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-left: ${({ theme }) => theme.margins['1.5x']};
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
