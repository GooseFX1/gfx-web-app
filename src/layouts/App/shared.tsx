import styled from 'styled-components'
import tw from 'twin.macro'

export const Menu = styled.ul`
  ${tw`min-w-[140px] list-none py-3 px-4 rounded-[8px]`}
  width: fit-content;
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.smallShadow}

  * {
    font-family: 'Montserrat' !important;
  }
`

export const MenuItem = styled.li`
  ${tw`flex items-center justify-between cursor-pointer py-[5.6px] px-0`}

  &:hover span {
    color: ${({ theme }) => theme.secondary4};
  }

  img {
    ${tw`w-3 h-3 ml-2 object-contain`}
  }

  span {
    ${tw`text-xs capitalize`}
    line-height: normal;
    color: ${({ theme }) => theme.text1};
  }
`
