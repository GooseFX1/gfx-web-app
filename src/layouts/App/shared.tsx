import styled from 'styled-components'

export const Menu = styled.ul`
  width: fit-content;
  min-width: 140px;
  padding: ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(2)};
  list-style-type: none;
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.smallBorderRadius}
  ${({ theme }) => theme.smallShadow}

  * {
    font-family: 'Montserrat' !important;
  }
`

export const MenuItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: ${({ theme }) => theme.margin(0.7)} 0;

  &:hover span {
    color: ${({ theme }) => theme.secondary4};
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
