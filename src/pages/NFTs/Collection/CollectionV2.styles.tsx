/* eslint-disable @typescript-eslint/no-unused-vars */
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const COLLECTION_VIEW_WRAPPER = styled.div<{ navCollapsed }>`
  ${({ navCollapsed }) =>
    css`
      .nftStatsContainer {
        height: 110px;
        border: 1px solid;
      }
    `}
`

export const GRID_CONTAINER = styled.div<{ navCollapsed }>`
  ${({ navCollapsed }) => css`
    background: ${({ theme }) => theme.bg23};
    height: calc(100vh - 110px - ${navCollapsed ? '0px' : '80px'});
    ${tw`duration-500`}
    .filtersContainer {
      border: 2px solid #3c3c3c;
      ${tw`h-[70px]`}
    }
  `}
`
