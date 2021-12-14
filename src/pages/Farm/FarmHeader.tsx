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
  .categories {
    height: 60px;
    min-width: 150px;
    margin-left: ${({ theme }) => theme.margins['4.5x']};
  }
  .live {
    margin-left: ${({ theme }) => theme.margins['4.5x']};
  }
`

const STYLED_RIGHT = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: ${({ theme }) => theme.margins['11x']};c
`
export const FarmHeader = () => (
  <STYLED_FARM_HEADER>
    <Toggle text="Staked Only" />
    <STYLED_RIGHT>
      <SearchBar className="search-bar" placeholder="Search by token symbol" />
      <Categories className="categories" categories={categories} />
      <Toggle className="live" checkedChildren="Unlive" unCheckedChildren="Live" defaultChecked />
    </STYLED_RIGHT>
  </STYLED_FARM_HEADER>
)
