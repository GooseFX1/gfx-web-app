import React, { useState, FC } from 'react'
import styled from 'styled-components'
import { Toggle } from './Toggle'
import { SearchBar, Categories } from '../../components'
import { Button, Radio } from 'antd'
import { useFarmContext } from '../../context'
import { checkMobile } from '../../utils'
import tw from "twin.macro"
import 'styled-components/macro'

const STYLED_FARM_HEADER = styled.div`
  ${tw`sm:block sm:px-[15px] sm:pt-[20px] sm:pb-[8px] flex flex-row items-center justify-between pb-[23px]`}
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
    transition: background 500ms ease-in-out 0s;
  }

    @media (max-width: 500px){
    .search-bar {
      background: ${({ theme }) => theme.searchbarBackground} !important;
      input {
        bbackground: ${({ theme }) => theme.searchbarBackground} !important;
      }
    }
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
  ${tw`sm:m-auto cursor-pointer text-center border-none border-0 font-semibold text-base ml-[5px] mr-2.5 w-[112px] h-[44px] rounded-[36px]`}
  font-family: 'Montserrat';
  line-height: normal;
  background: none;
  color: ${({ theme }) => theme.text17};
  :disabled {
    cursor: wait;
  }

  @media(max-width: 500px){
    margin: auto;
  }
`

const ButtonContainer = styled.div`
  ${tw`mr-0 flex flex-row`}
`

const RefreshIcon = styled.a`
 ${tw`cursor-pointer h-10 w-10 pt-1 mr-[25px] ml-10`}
`

const IconContainer = styled.div`
${tw`flex flex-row`}
`

const Wrapper = styled.div`
${tw`mt-6 flex flex-row`}
`

const poolTypes = [{ name: 'All pools' }, { name: 'SSL' }, { name: 'Staking' }]

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
