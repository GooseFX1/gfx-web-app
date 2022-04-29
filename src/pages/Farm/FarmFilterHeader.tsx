import React from 'react'
import styled from 'styled-components'
import { Toggle } from './Toggle'
import { SearchBar, Categories } from '../../components'
import { Button } from 'antd'
import { useFarmContext } from '../../context'

const STYLED_FARM_HEADER = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 23px;
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
    margin-left: ${({ theme }) => theme.margin(4.5)};
    > span {
      font-family: Montserrat;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }
  }
  .live {
    margin-left: ${({ theme }) => theme.margin(4.5)};
  }
  .selectedBackground {
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%) !important;
    color: white;
  }
`
const STYLED_BUTTON = styled.button`
  width: 112px;
  height: 44px;
  border-radius: 36px;
  border: none;
  margin-left: 5px;
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  background: none;
  color: ${({ theme }) => theme.text17};
  margin-right: 10px;
`

const ButtonContainer = styled.div`
  margin-right: 0px;
  display: flex;
`

const RefreshIcon = styled.a`
  cursor: pointer;
  height: 40px;
  width: 40px;
  padding-top: 4px;
  margin-right: 25px;
  margin-left: 40px;
`

const IconContainer = styled.div`
  display: flex;
`

const poolTypes = [{ name: 'All pools' }, { name: 'SSL' }, { name: 'Staking' }]

export const FarmFilter = () => {
  const { poolFilter, setPoolFilter, setSearchFilter, setCounter } = useFarmContext()

  return (
    <>
      <STYLED_FARM_HEADER>
        <ButtonContainer>
          {poolTypes.map((pool) => (
            <STYLED_BUTTON
              key={pool.name}
              onClick={() => setPoolFilter(pool.name)}
              className={pool.name === poolFilter ? 'selectedBackground' : ''}
            >
              {pool.name}
            </STYLED_BUTTON>
          ))}
        </ButtonContainer>

        <SearchBar className="search-bar" placeholder="Search by token symbol" setSearchFilter={setSearchFilter} />
        <IconContainer>
          <RefreshIcon onClick={() => setCounter((prev) => prev + 1)}>
            <img src={'/img/assets/refresh.svg'} />
          </RefreshIcon>
          <Toggle className="toggle" text="Show Deposited" defaultUnchecked />
        </IconContainer>
      </STYLED_FARM_HEADER>
    </>
  )
}
