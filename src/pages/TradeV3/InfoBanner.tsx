/* eslint-disable */
import { Skeleton } from 'antd'
import React, { FC, useMemo, useState } from 'react'
import tw, { styled } from 'twin.macro'
import { useCrypto, usePriceFeed, useDarkMode, useOrderBook } from '../../context'
import { DropdownPairs } from './DropdownPairs'
import { DepositWithdraw } from './perps/DepositWithdraw'
import { PopupCustom } from '../NFTs/Popup/PopupCustom'
import { getPerpsPrice, truncateBigNumber } from './perps/utils'
import { useTraderConfig } from '../../context/trader_risk_group'
import useBlacklisted from '../../utils/useBlacklisted'
import 'styled-components/macro'
import useWindowSize from '../../utils/useWindowSize'
import { checkMobile } from '../../utils'

const SETTING_MODAL = styled(PopupCustom)`
  ${tw`!h-[356px] !w-[628px] rounded-half`}
  background-color: ${({ theme }) => theme.bg25};

  .ant-modal-header {
    ${tw`rounded-t-half rounded-tl-half rounded-tr-half px-[25px] pt-5 pb-0 border-b-0`}
    background-color: ${({ theme }) => theme.bg25};
  }
  .ant-modal-content {
    ${tw`shadow-none`}

    .ant-modal-close {
      ${tw`top-[30px]`}
    }
  }
  .ant-modal-body {
    ${tw`py-0 px-[25px]`}
  }
`
const STYLED_POPUP = styled(PopupCustom)`
  .ant-modal-header {
    ${tw`dark:bg-black-2 bg-grey-5 rounded-t-bigger text-center`}
    border-bottom: none;
  }
  .ant-modal-content {
    ${tw`h-full dark:bg-black-2 bg-grey-5 rounded-bigger`}
  }
  .ant-modal-close-x {
    > img {
      ${tw`sm:!h-4 sm:!w-4 absolute bottom-2 opacity-60`}
    }
  }
  .ant-modal-body {
    ${tw`sm:p-[15px]`}
  }
  .wrapper {
    .subText {
      ${tw`font-semibold text-center text-regular dark:text-grey-2 mb-6 text-grey-1 sm:w-[292px] sm:text-[13px]`}
    }
    .learn-more {
      ${tw`dark:text-grey-5 text-blue-1 font-semibold text-regular cursor-pointer text-center block mx-auto`}
      text-decoration: underline;
    }
  }
`

const INFO_WRAPPER = styled.div`
  ${tw`py-0 px-[30px] flex flex-row sm:justify-center`}
  .spot-toggle .perps {
    ${tw`cursor-pointer mr-5`}
  }
  .spot-toggle .spot {
    ${tw`cursor-pointer`}
  }
  .spot-toggle .selected {
    ${tw`!text-white border border-solid border-black`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  }
  .spot-toggle .toggle {
    ${tw`rounded-[36px] h-10 leading-[40px] inline-block text-center border-0 border-none align-middle w-[90px]`}
    font-size: 16px;
    color: ${({ theme }) => theme.text16};
  }
  .spot-toggle .geoblocked {
    cursor: not-allowed;
  }
`
const INFO_STATS = styled.div`
  ${tw`ml-5 leading-5`}
  .barContainer {
    display: inline-flex;
    align-items: center;
  }
  div:first-child {
    ${tw`text-tiny font-medium`}
    color: ${({ theme }) => theme.text22};
  }
  .price {
    ${tw`text-tiny font-semibold text-grey-1 dark:text-grey-2`}
  }
  div:nth-child(2) {
    ${tw`text-regular font-semibold text-center flex`}
    color: ${({ theme }) => theme.text21};
    span:nth-child(2) {
      ${tw`mx-2.5 text-center flex`}
      .verticalLines {
        ${tw`h-3 w-[3px] ml-[3px] rounded-tiny`}
      }
      .coloured {
        background: linear-gradient(88.42deg, #f7931a 4.59%, #e649ae 98.77%);
      }
      .grey {
        background-color: ${({ theme }) => theme.bg18};
      }
    }
  }
  img {
    ${tw`m-1`}
  }
`

const LOCK_LAYOUT_CTN = styled.div<{ $isLocked: boolean; isSpot: boolean }>`
  ${tw`h-10 w-[65px] ml-3.75 rounded-[36px] text-center cursor-pointer p-0.5`}
  height: 40px;
  width: 65px;
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
  margin-left: ${({ $isSpot, $isLocked }) =>
    $isSpot && $isLocked ? 'auto' : $isSpot && !$isLocked ? '10px' : '15px'};

  .white-background {
    ${tw`h-full w-full rounded-[36px]`}
    background: ${({ theme }) => theme.bg20};
  }
`

const LOCK_LAYOUT = styled.div<{ $isLocked: boolean }>`
  ${tw`w-[63px] leading-[38px] rounded-[36px] text-center`}
  background: linear-gradient(90deg, rgba(247, 147, 26, 0.3) 12.88%, rgba(220, 31, 255, 0.3) 100%);
  img {
    ${tw`relative bottom-0.5`}
  }
`
const DEPOSIT_WRAPPER = styled.div`
  ${tw`w-[158px] h-10 rounded-[36px] flex items-center justify-center cursor-pointer p-0.5 ml-auto sm:ml-0`}
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
  margin-left: ${({ $isLocked }) => ($isLocked ? 'auto' : '15px')};

  .white-background {
    ${tw`h-full w-full rounded-[36px]`}
    background: ${({ theme }) => theme.bg20};
  }
`

const DEPOSIT_BTN = styled.div`
  ${tw`w-full h-full rounded-[36px] flex items-center justify-center text-tiny font-semibold`}
  background: linear-gradient(94deg, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
  color: ${({ theme }) => theme.text11};
`

const RESET_LAYOUT_BUTTON = styled.div`
  ${tw`h-[38px] text-tiny text-center flex items-center font-semibold underline cursor-pointer ml-auto`}
  color: ${({ theme }) => theme.text11};
`

const HEADER = styled.div`
  ${tw`flex items-center`}

  .cta {
    ${tw`rounded-bigger w-[120px] h-[40px] mr-[13px] cursor-pointer`}

    .btn {
      ${tw`flex items-center justify-center text-regular font-semibold w-full h-full`}
      color: ${({ theme }) => theme.text37};
    }

    .gradient-bg {
      ${tw`h-full w-full rounded-bigger `}
      background-image: linear-gradient(to right, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
    }
  }

  .background-container {
    ${tw`h-full w-full rounded-bigger`}
  }

  .active {
    ${tw`p-0.5 cursor-auto`}
    background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);

    .btn {
      color: ${({ theme }) => theme.text32};
    }

    .white-background {
      background-color: ${({ theme }) => theme.white};
    }
  }

  img {
    ${tw`ml-auto h-10 w-10 cursor-pointer mr-[50px]`}
  }
`

const WRAPPER = styled.div`
  ${tw`flex items-center justify-center`}
  color: ${({ theme }) => theme.text7};
`

const Title = () => {
  const { traderInfo } = useTraderConfig()
  return (
    <div>
      <div tw="text-lg font-semibold dark:text-grey-5 text-black-4 my-3.75">Current Funding Rate</div>
      {!traderInfo.fundingRate ? (
        <Loader />
      ) : (
        <div tw="text-lg font-semibold text-red-2">{Number(traderInfo.fundingRate).toFixed(4)}%</div>
      )}
    </div>
  )
}
const Loader: FC = () => <Skeleton.Button active size="small" style={{ display: 'flex', height: '12px' }} />

const ModalHeader: FC<{ setTradeType: (tradeType: string) => void; tradeType: string }> = ({
  setTradeType,
  tradeType
}) => {
  const { mode } = useDarkMode()
  return (
    <HEADER>
      <div className={tradeType === 'deposit' ? 'active cta' : 'cta'} onClick={() => setTradeType('deposit')}>
        <div className={mode !== 'dark' ? 'white-background background-container' : 'background-container'}>
          <div className={tradeType === 'deposit' ? 'gradient-bg btn' : 'btn'}>Deposit</div>
        </div>
      </div>
      <div className={tradeType === 'withdraw' ? 'active cta' : 'cta'} onClick={() => setTradeType('withdraw')}>
        <div className={mode !== 'dark' ? 'white-background background-container' : 'background-container'}>
          <div className={tradeType === 'withdraw' ? 'gradient-bg btn' : 'btn'}>Withdraw</div>
        </div>
      </div>
      {/*<img src="/img/assets/refresh.svg" alt="refresh-icon" />*/}
    </HEADER>
  )
}

export const InfoBanner: FC<{
  isLocked: boolean
  setIsLocked: (a: boolean) => void
  resetLayout: () => void
}> = ({ isLocked, setIsLocked, resetLayout }) => {
  const { selectedCrypto, isSpot, setIsSpot } = useCrypto()
  const { prices, tokenInfo } = usePriceFeed()
  const { orderBook } = useOrderBook()
  const { mode } = useDarkMode()
  const { traderInfo } = useTraderConfig()
  const isGeoBlocked = useBlacklisted()
  const [tradeType, setTradeType] = useState<string>('deposit')
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)
  const [showFundingRate, setShowFundingRate] = useState<boolean>(false)
  const { height, width } = useWindowSize()
  const marketData = useMemo(() => prices[selectedCrypto.pair], [prices, selectedCrypto.pair])
  const tokenInfos = useMemo(() => tokenInfo[selectedCrypto.pair], [tokenInfo[selectedCrypto.pair]])
  const formatDisplayVolume = (volume) => {
    if (!volume) return null
    //const stringLength = volume.length
    //if (stringLength < 6) return volume
    //else {
    //  const [numberBeforeDecimal, numberAfterDecimal] = volume.split('.'),
    //    reverseNumber = numberBeforeDecimal.split('').reverse().join('')
    //  let answer = ''
    //  for (let i = 0; i < reverseNumber.length; i++) {
    //    answer += reverseNumber.substring(i, i + 1)
    //    if (i % 3 === 2 && i !== reverseNumber.length - 1) answer = answer + ','
    //  }
    //  const reversedResult = answer.split('').reverse().join('')
    //  return reversedResult + '.' + numberAfterDecimal
    return truncateBigNumber(volume)
  }

  const openInterestFormatted = useMemo(() => {
    if (!isSpot) {
      const num = Number(traderInfo.openInterests)
      if (!num) return '0.00'
      else return truncateBigNumber(num)
    } else return '0.00'
  }, [traderInfo.openInterests, isSpot])

  const calculateRangeValue = (range, marketData) => {
    const priceO = isSpot ? marketData : getPerpsPrice(orderBook)
    if (
      !range ||
      !range.min ||
      !range.max ||
      (isSpot && (!marketData || !marketData.current)) ||
      (!isSpot && !priceO)
    )
      return { bars: 0 }
    const difference = +range.max - +range.min,
      size = difference / 6,
      price = isSpot ? marketData.current : priceO
    let bars = 0

    for (let i = 0; i < 6; i++) {
      if (price < +range.min + size * (i + 1)) {
        bars = i
        break
      }
    }
    return bars
  }

  const volume = tokenInfos && tokenInfos.volume
  const displayVolume = useMemo(() => formatDisplayVolume(volume), [selectedCrypto.pair, volume])

  const range = tokenInfos && tokenInfos.range,
    bars = useMemo(() => calculateRangeValue(range, marketData), [selectedCrypto.pair, range, isSpot, orderBook])

  const changeValue = tokenInfos ? tokenInfos.change : ' '
  let classNameChange = ''
  if (changeValue && changeValue.substring(0, 1) === '-') classNameChange = 'down24h'
  else if (changeValue && changeValue.substring(0, 1) === '+') classNameChange = 'up24h'

  const tokenPrice = useMemo(() => {
    if (isSpot) {
      return !marketData || !marketData.current ? <Loader /> : <span>$ {marketData.current}</span>
    } else {
      const oPrice = getPerpsPrice(orderBook)
      return !oPrice ? <Loader /> : <span>$ {oPrice}</span>
    }
  }, [isSpot, selectedCrypto, orderBook])

  const handleToggle = (e) => {
    if (e === 'spot') setIsSpot(true)
    else setIsSpot(false)
  }

  return (
    <INFO_WRAPPER>
      {depositWithdrawModal && (
        <SETTING_MODAL
          visible={true}
          centered={true}
          footer={null}
          title={<ModalHeader setTradeType={setTradeType} tradeType={tradeType} />}
          closeIcon={
            <img
              src={`/img/assets/close-${mode === 'lite' ? 'gray' : 'white'}-icon.svg`}
              height="20px"
              width="20px"
              onClick={() => setDepositWithdrawModal(false)}
            />
          }
        >
          <DepositWithdraw tradeType={tradeType} setDepositWithdrawModal={setDepositWithdrawModal} />
        </SETTING_MODAL>
      )}
      {showFundingRate && (
        <STYLED_POPUP
          height={checkMobile() ? '553px' : '530px'}
          width={checkMobile() ? '354px' : '500px'}
          title={<Title />}
          $hideClose={true}
          centered={true}
          visible={showFundingRate}
          onCancel={() => setShowFundingRate(false)}
          footer={null}
        >
          <WRAPPER>
            <div className="wrapper">
              <img
                src="/img/assets/FundingRateGraphic.svg"
                alt="graphic"
                height="171px"
                width="250px"
                tw="mx-auto block"
              />
              <div className="subText">
                Funding rate is 1/24th the average hourly premium calculated every hour. If is positive, longs pay
                shorts, If is negative, shorts pay longs.
              </div>
              <div className="subText">
                At this rate, longs would receive 0.00107% and shorts would pay 0.00107% at the end of the hour.
              </div>
              <a
                href="https://docs.goosefx.io/features/defi-derivatives/understanding-perpetual-futures/funding-rates"
                className="learn-more"
                target="_blank"
              >
                Learn More
              </a>
            </div>
          </WRAPPER>
        </STYLED_POPUP>
      )}
      {
        <div className="spot-toggle">
          <span
            className={'spot toggle ' + (isSpot ? 'selected' : '')}
            key="spot"
            onClick={() => handleToggle('spot')}
          >
            Spot
          </span>
          <span
            className={'perps toggle ' + (isGeoBlocked ? 'geoblocked' : !isSpot ? 'selected' : '')}
            key="perps"
            onClick={isGeoBlocked ? null : () => handleToggle('perps')}
          >
            Perps
          </span>
        </div>
      }
      <DropdownPairs />
      {
        <>
          <INFO_STATS>
            <>
              <span className="price">Price</span>
              <div>
                {tokenPrice}
                <span className={classNameChange}>{' (' + changeValue + '%)'}</span>
              </div>
            </>
          </INFO_STATS>
          {/* <INFO_STATS>
            <>
              <div>24H Volume</div>
              {!displayVolume ? <Loader /> : <div>$ {displayVolume}</div>}
            </>
          </INFO_STATS> */}
        </>
      }

      {/*<INFO_STATS>
        <>
          <div>24hr Change</div>
          {!changeValue ? (
            <Loader />
          ) : (
            <div className={classNameChange}>
              {classNameChange === 'up24h' ? (
                <img src="/img/assets/24hourup.png" height="10" alt="up-icon" />
              ) : (
                <img src="/img/assets/24hourdown.svg" height="10" alt="down-icon" />
              )}
              {changeValue} %
            </div>
          )}
        </>
         </INFO_STATS> */}
      {width > 1400 && (
        <INFO_STATS>
          <div>Daily Range</div>
          {!range ? (
            <Loader />
          ) : (
            <div>
              <span>$ {range.min}</span>
              <span className="barContainer">
                {[0, 1, 2, 3, 4, 5].map((item, index) => {
                  if (item < bars) return <div key={index} className="verticalLines coloured"></div>
                  else return <div key={index} className="verticalLines grey"></div>
                })}
              </span>
              <span>$ {range.max}</span>
            </div>
          )}
        </INFO_STATS>
      )}
      {!isSpot && (
        <INFO_STATS>
          <>
            <div>Open Interest</div>
            {!traderInfo.openInterests ? <Loader /> : <div> {openInterestFormatted} SOL</div>}
          </>
        </INFO_STATS>
      )}
      {!isSpot && (
        <INFO_STATS>
          <>
            <div tw="flex flex-row">
              <div>1H Funding</div>
              <img
                src={`/img/assets/tooltip_${mode}_mode_icon.svg`}
                alt="tooltip"
                tw="!m-1 cursor-pointer !h-4 !w-4"
                onClick={() => {
                  setShowFundingRate(true)
                }}
              />
            </div>
            {!traderInfo.fundingRate ? <Loader /> : <div> {Number(traderInfo.fundingRate).toFixed(4)}%</div>}
          </>
        </INFO_STATS>
      )}
      {isSpot && isGeoBlocked && (
        <div tw="flex ml-auto relative top-[23px]">
          <img src={`/img/assets/georestricted_${mode}.svg`} alt="geoblocked-icon" />
          <div tw="ml-2 text-tiny font-semibold dark:text-grey-5 text-grey-1">
            GooseFX DEX is unavailable <br /> in your location.
          </div>
        </div>
      )}
      {!isLocked && <RESET_LAYOUT_BUTTON onClick={() => resetLayout()}>Reset Layout</RESET_LAYOUT_BUTTON>}
      {!isSpot && (
        <DEPOSIT_WRAPPER $isLocked={isLocked}>
          <div className="white-background">
            <DEPOSIT_BTN onClick={() => setDepositWithdrawModal(true)}>Deposit / Withdraw </DEPOSIT_BTN>
          </div>
        </DEPOSIT_WRAPPER>
      )}
      {
        <LOCK_LAYOUT_CTN $isLocked={isLocked} $isSpot={isSpot} onClick={() => setIsLocked(!isLocked)}>
          <div className="white-background">
            <LOCK_LAYOUT $isLocked={isLocked} onClick={() => setIsLocked(!isLocked)}>
              <img src={isLocked ? `/img/assets/${mode}_lock.svg` : `/img/assets/${mode}_unlock.svg`} alt="lock" />
            </LOCK_LAYOUT>
          </div>
        </LOCK_LAYOUT_CTN>
      }
    </INFO_WRAPPER>
  )
}
