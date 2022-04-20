import styled from 'styled-components'

// TODO: Refactor to use single button
export const ButtonWrapper = styled.button`
  border: none;
  padding: 0 12px;
  cursor: pointer;
  align-items: center;
  display: flex;
  ${({ theme }) => theme.roundedBorders};
  span {
    font-size: 12px;
    font-weight: bold;
    color: white;
  }
`
