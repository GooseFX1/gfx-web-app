import React, { FC } from 'react'
import styled from 'styled-components'

import { FarmFilter } from './FarmFilterHeader'

const STYLED_RIGHT = styled.div`
  width: 100%;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 20px !important;
  padding-left: ${({ theme }) => theme.margin(11)};
`
export const FarmHeader: FC<{ onFilter?: () => void }> = () => (
  <>
    <FarmFilter />
    <STYLED_RIGHT></STYLED_RIGHT>
  </>
)
