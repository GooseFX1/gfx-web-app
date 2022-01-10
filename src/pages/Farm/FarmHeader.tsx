import React from 'react'
import styled from 'styled-components'
import { Toggle } from './Toggle'
import { SearchBar, Categories } from '../../components'
import { categories } from './mockData'

const STYLED_FARM_HEADER = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.margins['4x']} ${({ theme }) => theme.margins['5x']};
  background: #181818;
  .search-bar {
    height: 60px;
    margin: 0;
    background: #000;
    input {
      background: #000;
    }
  }
  .pools {
    height: 60px;
    max-width: 132px;
    margin-left: ${({ theme }) => theme.margins['4.5x']};
    > span {
      font-family: Montserrat;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }
  }
  .live {
    margin-left: ${({ theme }) => theme.margins['4.5x']};
  }
`

const STYLED_RIGHT = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: ${({ theme }) => theme.margins['11x']};
`
export const FarmHeader = ({ onFilter }: any) => (
  <STYLED_FARM_HEADER>
    <Toggle className="toggle" text="Staked Only" defaultUnchecked />
    <STYLED_RIGHT>
      <SearchBar className="search-bar" placeholder="Search by token symbol" />
      <Categories className="pools" categories={categories} />
      <Toggle className="live" checkedChildren="Ended" unCheckedChildren="Live" defaultUnchecked />
    </STYLED_RIGHT>
  </STYLED_FARM_HEADER>
)
