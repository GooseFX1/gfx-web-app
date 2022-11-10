import React, { useEffect, useState, FC } from 'react'
import styled from 'styled-components'
import { Toggle } from './Toggle'
import { SearchBar } from '../../components'
import { useFarmContext, usePriceFeedFarm } from '../../context'
import { checkMobile, moneyFormatterWithComma } from '../../utils'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useWallet } from '@solana/wallet-adapter-react'
import { LoaderLeftSpace } from './Columns'
import { CenteredDiv } from '../../styles'

const ABSTRACT = styled.div`
  .lastRefreshed {
    ${tw`flex w-full justify-center font-medium text-center text-base
   sm:text-sm`}
    color: ${({ theme }) => theme.tabNameColor};
    animation: openAnimation 1s forwards;
  }
  .totalContainer {
    padding: 4px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
  }

  .hide {
    animation: closeMe 0.5s;
  }
  @keyframes closeMe {
    0% {
      height: 45px;
    }
    100% {
      height: 0px;
    }
  }
  @keyframes openAnimation {
    0% {
      height: 0px;
    }
    100% {
      height: 45px;
    }
  }
  .generalStatsBg {
    display: flex;
    ${tw`overflow-hidden h-9 whitespace-nowrap font-semibold text-sm mb-1`}
    border: 1px solid #fff;
    border-style: solid none;
    background-image: linear-gradient(91deg, rgba(247, 147, 26, 0.8) 0%, rgba(220, 31, 255, 0.6) 100%);
  }
  .scroll {
    animation: marquee 120s linear infinite;
    ${tw`text-white flex items-center pr-[15px]	`}
    div {
      margin-right: 12px;
    }
  }
  @keyframes marquee {
    0% {
      transform: translate(50%, 0);
    }
    100% {
      transform: translate(-650%, 0);
    }
  }
  td {
    ${tw`text-white font-semibold text-sm pl-2.5 pr-2.5`}
  }
  .toggle {
    ${tw`ml-4`}
  }
  .textContainer {
    ${tw`flex w-11/12 text-white z-10 flex-row   
    items-center justify-between mb-9 sm:mb-5 mt-2 text-sm font-semibold`}
    @media(max-width: 500px) {
      width: 200vw;
      overflow-y: hidden;
      overflow-x: auto;
      flex: none;
      color: #fff;
      z-index: 10;
      opacity: 1;
      position: absolute;
    }
  }
  .statsBackground {
    ${tw`h-9 w-[100vw] opacity-80 z-0 absolute
    left-0 flex flex-row  m-auto items-center justify-between pr-16 pl-16`};
    border: 1px solid #fff;
    border-style: solid none;
    background-image: linear-gradient(91deg, #f7931a 0%, #ac1cc7 100%);
    @media (max-width: 500px) {
      overflow-y: hidden;
      overflow-x: auto;
      width: 200vw;
      z-index: 5;
      flex: none;
      position: absolute;
    }
  }
`
const WRAPPER = styled.div`
  ${tw`flex flex-col items-center`}
  font-family: 'Montserrat';
`

const STYLED_FARM_HEADER = styled.div`
  ${tw`w-[100%] sm:mt-0`}
  ${tw`sm:block sm:pt-[2px] sm:pb-[8px] sm:px-[15px] flex flex-row items-center justify-between pb-[23px]`}
  .search-bar {
    ${tw`h-[60px] m-0 bg-black mr-52 sm:mr-0 w-[25vw] sm:w-[400px] sm:!pl-[15px]`}
    input {
      ${tw`bg-black `}
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
    transition: 500ms ease-in-out;
    @media (max-width: 500px) {
      background: none;
    }
  }
`
const STYLED_BUTTON = styled.button`
  ${tw`sm:m-auto sm:w-1/3 cursor-pointer w-[120px] text-center border-none border-0 
  font-semibold text-base h-[44px] rounded-[36px] duration-700 `}
  font-family: 'Montserrat';
  background: none;
  color: ${({ theme }) => theme.text17};
  :disabled {
    ${tw`cursor-wait`}
  }
`

const ButtonContainer = styled.div<{ $poolIndex: number }>`
  ${tw`relative z-0 sm:mt-2`}
  .slider-animation {
    ${tw`absolute w-1/4 h-[44px] rounded-[36px] z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 33 + 4.5}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
  .slider-animation-web {
    ${tw`absolute w-[30%] h-[44px] rounded-[36px] z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 33 + 2}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
`

const RefreshIcon = styled.button`
  ${tw`cursor-pointer  sm:ml-10 rounded-full border-0 p-0 bg-transparent`}
  .rotateRefreshBtn {
    -webkit-animation: cog 1s infinite;
    -moz-animation: cog 1s infinite;
    -ms-animation: cog 1s infinite;
    animation: cog 1s infinite;
    -webkit-animation-timing-function: linear;
    -moz-animation-timing-function: linear;
    -ms-animation-timing-function: linear;
    animation-timing-function: linear;
    @keyframes cog {
      100% {
        -moz-transform: rotate(-360deg);
        -ms-transform: rotate(-360deg);
        transform: rotate(-360deg);
      }
    }
  }
`

const IconContainer = styled.div`
  ${tw`flex flex-row`}
`

const MobileWrapper = styled.div`
  ${tw`mt-4 flex flex-row `}
  width: 92vw;
`

const HOLD = styled.div`
  ${tw`items-center flex`}
`

//TEMP_DEP_DISABLE
const TEMP_BANNER = styled.h2`
  color: ${({ theme }) => theme.text1};
`

const poolTypes = [{ name: 'All pools' }, { name: 'SSL' }, { name: 'Staking' }]

export const FarmFilter: FC = () => {
  const {
    poolFilter,
    setPoolFilter,
    setSearchFilter,
    operationPending,
    farmDataContext,
    farmDataSSLContext,
    refreshClass,
    setLastRefreshedClass,
    lastRefreshedClass
  } = useFarmContext()
  const { prices, statsData } = usePriceFeedFarm()
  const [poolIndex, setPoolIndex] = useState(0)
  const { publicKey } = useWallet()
  const [firstPageLoad, setFirstPageLoad] = useState<boolean>(true)

  const handleClick = (name, index) => {
    setPoolFilter(name)
    setPoolIndex(index)
  }
  useEffect(() => {
    setFirstPageLoad(false)
  }, [])

  useEffect(() => {
    if (refreshClass === '' && !firstPageLoad) {
      setLastRefreshedClass('lastRefreshed')
    }
  }, [refreshClass])

  useEffect(() => {
    if (lastRefreshedClass !== 'hide' && !firstPageLoad) {
      setTimeout(() => {
        setLastRefreshedClass('hide')
      }, 2500)
    }
  }, [lastRefreshedClass])

  if (checkMobile()) {
    return (
      <ABSTRACT>
        <LastRefreshedAnimation lastRefreshedClass={lastRefreshedClass} />
        <GeneralStatsBarMobile />
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
          <MobileWrapper>
            <SearchBar className="search-bar" placeholder="Search by token" setSearchFilter={setSearchFilter} />
            {publicKey && <Toggle className="toggle" text="Deposited" defaultUnchecked />}
          </MobileWrapper>
        </STYLED_FARM_HEADER>
      </ABSTRACT>
    )
  }

  return (
    <ABSTRACT>
      <LastRefreshedAnimation lastRefreshedClass={lastRefreshedClass} />
      <WRAPPER>
        <div className="statsBackground" />
        <div className="textContainer">
          <HOLD>TVL: {statsData ? ` $ ` + moneyFormatterWithComma(statsData.tvl) : <LoaderLeftSpace />}</HOLD>
          <HOLD>Pools: {farmDataContext?.length + farmDataSSLContext?.length}</HOLD>
          <HOLD>
            7d Volume:
            {statsData ? ` $ ` + moneyFormatterWithComma(statsData.volume7dSum) : <LoaderLeftSpace />}{' '}
          </HOLD>
          <HOLD>
            Total Volume Trade:{' '}
            {statsData ? ` $ ` + moneyFormatterWithComma(statsData.totalVolumeTrade) : <LoaderLeftSpace />}
          </HOLD>
          <HOLD>
            GOFX Price: {prices['GOFX/USDC'] ? ` $ ` + prices['GOFX/USDC']?.current : <LoaderLeftSpace />}{' '}
          </HOLD>
        </div>
        {/* TEMP_DEP_DISABLE */}
        <CenteredDiv>
          <TEMP_BANNER>⚠️ SSL Pools Have Temporarily Disabled Deposits</TEMP_BANNER>
        </CenteredDiv>
        <STYLED_FARM_HEADER>
          <ButtonContainer $poolIndex={poolIndex}>
            <div className="slider-animation-web"></div>
            {poolTypes.map((pool, index) => (
              <STYLED_BUTTON
                disabled={operationPending}
                key={pool.name}
                title={pool.name === 'SSL' ? 'Single Sided Liquidity' : ''}
                onClick={() => handleClick(pool.name, index)}
                className={pool.name === poolFilter ? 'selectedBackground' : ''}
              >
                {pool.name}
              </STYLED_BUTTON>
            ))}
          </ButtonContainer>
          <SearchBar
            className="search-bar"
            placeholder="Search by token symbol"
            setSearchFilter={setSearchFilter}
          />
          <IconContainer>
            <RefreshBtnWithAnimation />
            {publicKey && <Toggle className="toggle" text="Show Deposited" defaultUnchecked />}
          </IconContainer>
        </STYLED_FARM_HEADER>
      </WRAPPER>
    </ABSTRACT>
  )
}

export const RefreshBtnWithAnimation: FC = () => {
  const { refreshClass, setRefreshClass, setCounter } = useFarmContext()
  const refreshFeed = () => {
    setRefreshClass('rotateRefreshBtn')
    setCounter((prev) => prev + 1)
  }
  return (
    <RefreshIcon onClick={() => refreshFeed()}>
      <img src={'/img/assets/refresh.svg'} className={refreshClass} alt="refresh" />
    </RefreshIcon>
  )
}
const LastRefreshedAnimation = ({ lastRefreshedClass }: any) => (
  <div className={lastRefreshedClass}>
    {lastRefreshedClass === 'lastRefreshed' && (
      <div>
        Last updated: {checkMobile() && <br />}{' '}
        {
          //@ts-ignore
          new Date().toGMTString()
        }
      </div>
    )}
  </div>
)

const GeneralStatsBarMobile = () => {
  const { farmDataContext, farmDataSSLContext } = useFarmContext()
  const { prices, statsData } = usePriceFeedFarm()
  const [divArr, setDivArr] = useState<any[]>([])

  useEffect(() => {
    if (statsData) {
      const arr = []
      for (let i = 0; i < 20; i++)
        arr.push(
          <div className="scroll" key={i}>
            <div>TVL: {` $ ` + moneyFormatterWithComma(statsData.tvl)}</div>
            <div>7d Volume: {` $ ` + moneyFormatterWithComma(statsData.volume7dSum)}</div>
            <div>Pools: {farmDataContext?.length + farmDataSSLContext?.length}</div>
            <div>
              Total Volume Trade:
              {` $ ` + moneyFormatterWithComma(statsData.totalVolumeTrade)}
            </div>
            <div> GOFX Price: {prices && ` $ ` + prices['GOFX/USDC']?.current}</div>
          </div>
        )
      setDivArr(arr)
    }
  }, [statsData])

  return <div className="generalStatsBg">{divArr}</div>
}
