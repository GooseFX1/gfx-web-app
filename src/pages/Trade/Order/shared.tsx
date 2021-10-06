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
