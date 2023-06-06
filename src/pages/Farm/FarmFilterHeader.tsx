import React, { useEffect, useState, FC, ReactElement, MutableRefObject, useCallback } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Toggle } from './Toggle'
import { SearchBar, Pill } from '../../components'
import { useFarmContext, usePriceFeedFarm } from '../../context'
import { checkMobile, moneyFormatterWithComma } from '../../utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { CenteredDiv } from '../../styles'

const ABSTRACT = styled.div`
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
`
const WRAPPER = styled.div`
  ${tw`flex flex-col items-center`}
  font-family: 'Montserrat';
`

const STYLED_FARM_HEADER = styled.div`
  ${tw`w-[100%] sm:mt-0`}
  ${tw`sm:block sm:pt-[2px] sm:pb-[8px] sm:px-[15px] flex flex-row items-center justify-between pb-[23px]`}
  .search-bar {
    ${tw`h-[60px] m-0 mr-52 sm:mr-0 w-[25vw] sm:w-[400px] sm:!pl-[15px]`}
    input {
      ${tw`dark:bg-black-2 bg-grey-1 text-white`}
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
    color: white !important;
    transition: 500ms ease-in-out;
    @media (max-width: 500px) {
      background: none;
    }
  }
`
export const STYLED_BUTTON = styled.button`
  ${tw`sm:m-auto cursor-pointer w-[120px] sm:w-[100px] text-center border-none border-0 sm:font-medium
  font-semibold text-base h-[44px] sm:h-10 rounded-[36px] duration-700 text-[15px] text-grey-1`}
  background: none;

  :disabled {
    ${tw`cursor-wait`}
  }
`

export const ButtonContainer = styled.div<{ $poolIndex: number }>`
  ${tw`relative z-0 sm:mt-2`}
  .slider-animation {
    ${tw`absolute w-1/4 h-[44px] rounded-[36px] z-[-1]`}
    //left: ${({ $poolIndex }) => $poolIndex * 33 + 4.5}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: all 500ms ease-in-out;
  }
  .slider-animation-web {
    ${tw`absolute w-[30%] h-[44px] rounded-[36px] z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 33 + 2}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: all 500ms ease-in-out;
  }
`

export const RefreshIcon = styled.button`
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

//TEMP_DEP_DISABLE
const TEMP_BANNER = styled.h2`
  margin: 28px 0 24px;
  color: ${({ theme }) => theme.text1};
  text-align: center;
  font-weight: 600;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    background-color: ${({ theme }) => theme.bg1};
    margin: 1rem;
    border-radius: 10px;
  `}
`

const poolTypes = [{ name: 'All pools' }, { name: 'SSL' }, { name: 'Staking' }]
/**
 * Animates a absolute button components left, top and width to always match the button it is animating to
 * @param slideRef - the ref of the absolute button component that is to be animated
 * @param buttonRefs - the ref[] of the buttons that the slideRef is to be animated to
 * @param index - the index of the buttonRefs that the slideRef is to be animated to on mount
 */
export const useAnimateButtonSlide = (
  slideRef: MutableRefObject<HTMLDivElement | null>,
  buttonRefs: MutableRefObject<HTMLButtonElement[]>,
  index?: number,
  customCallback?: (index: number) => void
): ((index: number) => void) => {
  const handleSlide = useCallback(
    (index) => {
      if (!slideRef.current || !buttonRefs.current.length) {
        console.log('Warning: SlideRef or ButtonRefs not set', { slideRef, buttonRefs })
        return
      }
      if (!buttonRefs.current[index]) {
        console.log('Warning: ButtonRefs not set')
        return
      }
      if (customCallback) {
        customCallback(index)
        return
      }
      const left = `${buttonRefs.current[index].offsetLeft}px`
      const width = `${buttonRefs.current[index].offsetWidth}px`
      const top = `${buttonRefs.current[index].offsetTop}px`
      if (slideRef.current.style.left !== left) {
        slideRef.current.style.left = left
      }
      if (slideRef.current.style.width !== width) {
        slideRef.current.style.width = width
      }
      if (slideRef.current.style.top !== top) {
        slideRef.current.style.top = top
      }
    },
    [slideRef.current, buttonRefs.current, customCallback, index]
  )

  return handleSlide
}

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
  const { wallet } = useWallet()
  const [firstPageLoad, setFirstPageLoad] = useState<boolean>(true)
  const buttonRefs = useRef<HTMLButtonElement[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)
  const handleSlide = useAnimateButtonSlide(sliderRef, buttonRefs)
  const handleClick = (name, index) => {
    setPoolFilter(name)
    setPoolIndex(index)
    handleSlide(index)
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
    if (lastRefreshedClass !== ' ' && !firstPageLoad) {
      setTimeout(() => setLastRefreshedClass(' '), 3000)
    }
  }, [lastRefreshedClass])
  // TODO: memoize this file and optimize the recalculations
  const buttons = poolTypes.map((pool, index) => (
    <STYLED_BUTTON
      ref={(el) => {
        buttonRefs.current[index] = el
        if (index == poolIndex) {
          handleSlide(poolIndex)
        }
      }}
      disabled={operationPending}
      key={pool.name}
      onClick={() => handleClick(pool.name, index)}
      className={pool.name === poolFilter ? 'selectedBackground' : ''}
    >
      {pool.name}
    </STYLED_BUTTON>
  ))

  if (checkMobile()) {
    return (
      <ABSTRACT>
        <LastRefreshedAnimation lastRefreshedClass={lastRefreshedClass} />
        <GeneralStatsBarMobile />
        {/* TEMP_DEP_DISABLE */}
        <CenteredDiv>
          <TEMP_BANNER>⚠️ SSL v2 Pools Will Relaunch to the Public Soon</TEMP_BANNER>
        </CenteredDiv>
        <STYLED_FARM_HEADER>
          <ButtonContainer $poolIndex={poolIndex}>
            <div className="slider-animation"></div>
            {buttons}
          </ButtonContainer>
          <MobileWrapper>
            <SearchBar className="search-bar" placeholder="Search by token" setSearchFilter={setSearchFilter} />
            {wallet?.adapter?.publicKey && <Toggle className="toggle" text="Deposited" defaultUnchecked />}
          </MobileWrapper>
        </STYLED_FARM_HEADER>
      </ABSTRACT>
    )
  }

  return (
    <ABSTRACT>
      <LastRefreshedAnimation lastRefreshedClass={lastRefreshedClass} />
      {/* TEMP_DEP_DISABLE */}
      <CenteredDiv>
        <TEMP_BANNER>⚠️ SSL v2 Pools Will Relaunch to the Public Soon</TEMP_BANNER>
      </CenteredDiv>
      <WRAPPER>
        <div
          tw="flex w-full items-center justify-between 
          sm:mb-5 mb-[20px] sm:w-[200vw] sm:overflow-y-hidden sm:overflow-x-auto sm:flex-none sm:text-white 
          sm:z-10 sm:opacity-100 sm:absolute"
        >
          <Pill
            loading={!statsData}
            label={'TVL:'}
            value={statsData ? `$${moneyFormatterWithComma(statsData.tvl)}` : null}
          />
          <Pill
            loading={!statsData}
            label={'Pools: '}
            value={
              farmDataContext && farmDataSSLContext
                ? `${farmDataContext.length + farmDataSSLContext.length}`
                : null
            }
          />
          <Pill
            loading={!statsData}
            label={'7d Volume:'}
            value={statsData ? `$${moneyFormatterWithComma(statsData.volume7dSum)}` : null}
          />
          <Pill
            loading={!statsData}
            label={'Total Volume Trade:'}
            value={statsData ? `$${moneyFormatterWithComma(statsData.totalVolumeTrade)}` : null}
          />
          <Pill
            loading={!statsData}
            label={'GOFX Price:'}
            value={prices['GOFX/USDC'] ? `$ ${prices['GOFX/USDC']?.current}` : null}
          />
        </div>
        <STYLED_FARM_HEADER>
          <ButtonContainer $poolIndex={poolIndex}>
            <div ref={sliderRef} className="slider-animation-web"></div>
            {buttons}
          </ButtonContainer>
          <SearchBar
            className="search-bar"
            placeholder="Search by token symbol"
            setSearchFilter={setSearchFilter}
          />
          <IconContainer>
            <RefreshBtnWithAnimation />
            {wallet?.adapter?.publicKey && <Toggle className="toggle" text="Show Deposited" defaultUnchecked />}
          </IconContainer>
        </STYLED_FARM_HEADER>
      </WRAPPER>
    </ABSTRACT>
  )
}

export const RefreshBtnWithAnimation: FC = (): ReactElement => {
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
export const LastRefreshedAnimation: FC<{ lastRefreshedClass: string }> = ({
  lastRefreshedClass
}): ReactElement => (
  <div className={lastRefreshedClass}>
    {lastRefreshedClass === 'lastRefreshed' && (
      <strong>
        Last updated: {checkMobile() && <br />} {new Date().toUTCString()}
      </strong>
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
