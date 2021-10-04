import styled from 'styled-components'

export const Menu = styled.ul`
  width: fit-content;
  min-width: 140px;
  padding: ${({ theme }) => theme.margins['1.5x']} ${({ theme }) => theme.margins['2x']};
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
    margin-bottom: ${({ theme }) => theme.margins['1.5x']};
  }

  img {
    ${({ theme }) => theme.measurements(theme.margins['1.5x'])}
    margin-left: ${({ theme }) => theme.margins['1x']};
    object-fit: contain;
  }

  span {
    font-size: 12px;
    text-transform: capitalize;
    color: ${({ theme }) => theme.text1};
  }
`
