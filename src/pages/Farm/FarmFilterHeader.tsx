import React, { useState } from 'react'
import styled from 'styled-components'
import { Toggle } from './Toggle'
import { SearchBar } from '../../components'
import { useFarmContext, usePriceFeedFarm } from '../../context'
import { checkMobile } from '../../utils'
import tw from 'twin.macro'
import 'styled-components/macro'

const STYLED_FARM_HEADER = styled.div`
  ${tw`sm:block sm:pt-[20px] sm:pb-[8px] sm:px-[15px] flex flex-row items-center justify-between pb-[23px]`}
  .search-bar {
    ${tw`h-[60px] m-0 bg-black sm:!bg-[#2a2a2a] sm:!pl-[15px]`}
    input {
      ${tw`bg-black sm:!bg-[#2a2a2a]`}
    }
  }
  .pools {
    ${tw`h-[60px] max-w-[132px] ml-9`}
    > span {
      ${tw`text-[14px] font-semibold text-white`}
      font-family: Montserrat;
    }
  }
  .live {
    ${tw`ml-9`}
  }
  .selectedBackground {
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%) !important;
    color: white;
    transition: background 500ms ease-in-out 0s;
  }
`
const STYLED_BUTTON = styled.button`
  ${tw`sm:m-auto cursor-pointer text-center border-none border-0 font-semibold text-base ml-[5px] mr-2.5 w-[112px] h-[44px] rounded-[36px]`}
  font-family: 'Montserrat';
  line-height: normal;
  background: none;
  color: ${({ theme }) => theme.text17};
  :disabled {
    ${tw`cursor-wait`}
  }
`

const ButtonContainer = styled.div`
  ${tw`mr-0 flex flex-row`}
`

const RefreshIcon = styled.button`
  ${tw`cursor-pointer mr-[25px] ml-10 rounded-full border-0 p-0 bg-transparent`}
`

const IconContainer = styled.div`
  ${tw`flex flex-row`}
`

const Wrapper = styled.div`
  ${tw`mt-6 flex flex-row`}
`

const poolTypes = [{ name: 'All pools' }, { name: 'SSL' }, { name: 'Staking' }]

export const FarmFilter = () => {
  const { poolFilter, setPoolFilter, setSearchFilter, operationPending } = useFarmContext()
  const { refreshTokenData } = usePriceFeedFarm()
  const [arrowRotation, setArrowRotation] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }

  if (checkMobile()) {
    return (
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

  if (checkMobile()) {
    return (
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
          <RefreshIcon onClick={() => refreshTokenData()}>
            <img src={'/img/assets/refresh.svg'} alt="refresh" />
          </RefreshIcon>
          <Toggle className="toggle" text="Show Deposited" defaultUnchecked />
        </IconContainer>
      </STYLED_FARM_HEADER>
    </>
  )
}
