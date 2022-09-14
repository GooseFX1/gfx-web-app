import React, { useState } from 'react'
import styled from 'styled-components'
import { Toggle } from './Toggle'
import { SearchBar } from '../../components'
import { useFarmContext, usePriceFeedFarm } from '../../context'
import { checkMobile, moneyFormatterWithComma } from '../../utils'
import tw from 'twin.macro'
import 'styled-components/macro'

const WRAPPER = styled.div`
  ${tw`flex flex-col`}
  font-family: 'Montserrat';
  .textContainer {
    ${tw`flex w-11/12 text-white z-10 flex-row 
    items-center justify-between m-auto pr-20 pl-12 mb-9 -mt-7 text-sm font-semibold`}
  }
  .statsBackground {
    ${tw`h-9 w-11/12 opacity-80 z-0 rounded-lg flex flex-row  m-auto items-center justify-between pr-16 pl-16`};
    border: 1px solid #fff;
    background-image: linear-gradient(91deg, #f7931a 0%, #ac1cc7 100%);
  }
`

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
    ${tw`text-white`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    @media (max-width: 500px) {
      background: none;
    }
  }
`
const STYLED_BUTTON = styled.button`
  ${tw`sm:m-auto sm:w-1/3 cursor-pointer text-center border-none border-0 
  font-semibold text-base ml-[5px] mr-2.5 w-[112px] h-[44px] rounded-[36px]`}
  font-family: 'Montserrat';
  background: none;
  color: ${({ theme }) => theme.text17};
  :disabled {
    ${tw`cursor-wait`}
  }
`

const ButtonContainer = styled.div<{ $poolIndex: number }>`
  ${tw`relative z-0`}
  .slider-animation {
    ${tw`absolute w-1/4 h-[44px] rounded-[36px] z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 33 + 4}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
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
  const { poolFilter, setPoolFilter, setSearchFilter, operationPending, farmDataContext, farmDataSSLContext } =
    useFarmContext()
  const { refreshTokenData } = usePriceFeedFarm()
  const { prices, statsData } = usePriceFeedFarm()
  const [poolIndex, setPoolIndex] = useState(0)

  const handleClick = (name, index) => {
    setPoolFilter(name)
    setPoolIndex(index)
  }

  if (checkMobile()) {
    return (
      <STYLED_FARM_HEADER>
        <ButtonContainer $poolIndex={poolIndex}>
          <div className="slider-animation"></div>
          {poolTypes.map((pool, index) => (
            <STYLED_BUTTON
              disabled={operationPending}
              key={pool.name}
              onClick={() => handleClick(pool.name, index)}
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
    <WRAPPER>
      <div className="statsBackground" />
      <div className="textContainer">
        <div>GooseFX TVL: {statsData && ` $ ` + moneyFormatterWithComma(statsData.tvl)}</div>
        <div>Pools: {farmDataContext?.length + farmDataSSLContext?.length}</div>
        <div>7d Volume: {statsData && ` $ ` + moneyFormatterWithComma(statsData.volume7dSum)} </div>
        <div>GOFX Price: {prices && ` $ ` + prices['GOFX/USDC']?.current} </div>
      </div>
      <STYLED_FARM_HEADER>
        <ButtonContainer $poolIndex={poolIndex}>
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
    </WRAPPER>
  )
}
