import styled from 'styled-components'

export const Menu = styled.ul`
  width: fit-content;
  min-width: 140px;
  padding: ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(2)};
  ${({ theme }) => theme.smallBorderRadius}
  list-style-type: none;
  ${({ theme }) => theme.smallShadow}
  background-color: ${({ theme }) => theme.bg3};
`

export const MenuItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:hover span {
    color: ${({ theme }) => theme.secondary4};
  }

  &:not(:last-child) {
    padding-bottom: ${({ theme }) => theme.margin(1.5)};
  }

  img {
    ${({ theme }) => theme.measurements(theme.margin(1.5))}
    margin-left: ${({ theme }) => theme.margin(1)};
    object-fit: contain;
  }

  span {
    font-size: 12px;
    text-transform: capitalize;
    color: ${({ theme }) => theme.text1};
  }
`
