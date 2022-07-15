import React, { useState, FC } from 'react'
import styled from 'styled-components'
import { Toggle } from './Toggle'
import { SearchBar, Categories } from '../../components'
import { Button, Radio } from 'antd'
import { useFarmContext } from '../../context'
import { checkMobile } from '../../utils'
import tw from "twin.macro"
import 'styled-components/macro'
import { ArrowDropdown } from '../../components'
import { MenuItem } from '../../layouts/App/shared'

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

  @media (max-width: 500px){
    display: block;
    padding: 20px 15px 8px;
    border-radius: 15px 15px 0 0;

    .search-bar {
      background: #2a2a2a !important;
      input {
        background: #2a2a2a !important;
      }
    }
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
  :disabled {
    cursor: wait;
  }

  @media(max-width: 500px){
    margin: auto;
  }
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

const DropdownContainer = styled.div`
  width: 102px;
  height: 45px;
  background: #9625ae;
  border-radius: 23px;
  display: flex;
  justify-content: center;
`
const Wrapper = styled.div`
display: flex;
margin-top: 24px;
`

const PoolSelector = styled.div`
  width: 250px;
  background: #1e1e1e;
  padding: 20px 21px 20px;

  li:last-child{
    margin: 0;
  }

 li{
  margin-bottom: 26px;
  span{
    font-family: Avenir;
    font-size: 15px;
    font-weight: 900;
    text-align: center;
    color: #fff;
  }
  &:hover span {
    color: #fff;
  }
 }

input[type='radio'] {
  width: 15px;
  height: 15px;
}

input[type='radio']:checked:after {
  width: 15px;
  height: 15px;
  border-radius: 10px;
  background-color: #50bb35;
  content: '';
  display: inline-block;
  visibility: visible;
  border: 1px solid #0f0f0f;
  position: relative;
  top: -1px;
}
`

const poolTypes = [{ name: 'All pools' }, { name: 'SSL' }, { name: 'Staking' }]

const Overlay: any = ({ setPoolFilter, poolFilter }) => {
  return(
      <PoolSelector>
        {poolTypes.map((pool, index) => {
          return(
            <MenuItem key={index}> 
              <span>{pool.name}</span>
              <input type="radio" name="pool" value={pool.name} checked={poolFilter==pool.name ? true: false} onChange={(e)=>setPoolFilter(pool.name)}/>
            </MenuItem> 
          )
        })}
      </PoolSelector>
  )
}

export const FarmFilter = () => {
  const { poolFilter, setPoolFilter, setSearchFilter, setCounter, operationPending } = useFarmContext()
  const [arrowRotation, setArrowRotation] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }

  if(checkMobile()){
    return(
      <STYLED_FARM_HEADER>
          <ButtonContainer>
            {poolTypes.map((pool) => (
              <STYLED_BUTTON
                disabled={operationPending}
                key={pool.name}
                onClick={() => setPoolFilter(pool.name)}
                className={pool.name === poolFilter ? 'selectedBackground' : ''}
              >
                {pool.name}
              </STYLED_BUTTON>
            ))}
        </ButtonContainer>
        <Wrapper>
          <SearchBar className="search-bar" placeholder="Search by token" setSearchFilter={setSearchFilter} />
          <Toggle className="toggle" text="Deposited" defaultUnchecked />
        </Wrapper>
        </STYLED_FARM_HEADER>
    )
  }

  return (
    <>
      <STYLED_FARM_HEADER>
        <ButtonContainer>
          {poolTypes.map((pool) => (
            <STYLED_BUTTON
              disabled={operationPending}
              key={pool.name}
              title={pool.name === 'SSL' ? 'Single Sided Liquidity' : ''}
              onClick={() => setPoolFilter(pool.name)}
              className={pool.name === poolFilter ? 'selectedBackground' : ''}
            >
              {pool.name}
            </STYLED_BUTTON>
          ))}
        </ButtonContainer>

        <SearchBar className="search-bar" placeholder="Search by token symbol" setSearchFilter={setSearchFilter} />
        <IconContainer>
          <RefreshIcon href={'/farm'}>
            <img src={'/img/assets/refresh.svg'} />
          </RefreshIcon>
          <Toggle className="toggle" text="Show Deposited" defaultUnchecked />
        </IconContainer>
      </STYLED_FARM_HEADER>
    </>
  )
}
