/* eslint-disable */
import { Skeleton } from 'antd'
import React, { FC, useMemo, useState } from 'react'
import tw from 'twin.macro'
import { useCrypto, usePriceFeed, useDarkMode, useOrderBook, useConnectionConfig } from '../../context'
import { DropdownPairs } from './DropdownPairs'
import { DepositWithdrawDialog } from './perps/DepositWithdraw'
import { DepositWithdraw } from './perps/DepositWithdrawNew'
import { getPerpsPrice, truncateBigNumber } from './perps/utils'
import { useTraderConfig } from '../../context/trader_risk_group'
import styled from 'styled-components/macro'
import useWindowSize from '../../utils/useWindowSize'
import { Tooltip, PopupCustom } from '../../components'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  Button,
  Container,
  ContainerTitle,
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseDefault,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
  IconTooltip,
  Tabs,
  TabsList,
  TabsTrigger,
  cn
} from 'gfx-component-lib'
import { InfoLabel, TitleLabel } from './perps/components/PerpsGenericComp'

export const SETTING_MODAL = styled(PopupCustom)`
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

const INFO_WRAPPER = styled.div`
  ${tw`py-0 px-3 flex flex-row sm:justify-center`}
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
    font-size: 14px;
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
  h4:first-child {
    ${tw`text-regular`}
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
  .tooltipIcon {
    ${tw`!m-0 !h-4 !w-4`}
  }
`

const LOCK_LAYOUT_CTN = styled.div`
  ${tw`h-10 w-[65px] ml-3.75 rounded-[36px] text-center cursor-pointer p-0.5`}
  height: 40px;
  width: 65px;
  margin-left: 15px;

  .white-background {
    ${tw`h-full w-full rounded-[36px]`}
  }
`

const LOCK_LAYOUT = styled.div<{ $isLocked: boolean }>`
  ${tw`w-[63px] leading-[38px] rounded-[36px] text-center h-full flex items-center justify-center`}
  /* background: linear-gradient(90deg, rgba(247, 147, 26, 0.3) 12.88%, rgba(220, 31, 255, 0.3) 100%); */
  img {
    ${tw`relative bottom-0.5`}
  }
`
const DEPOSIT_WRAPPER = styled.div<{ $isLocked: boolean }>`
  ${tw`w-[158px] h-10 rounded-[36px] flex items-center justify-center cursor-pointer p-0.5 ml-auto sm:ml-0`}
  margin-left: ${({ $isLocked }) => ($isLocked ? 'auto' : '15px')};

  .white-background {
    ${tw`h-full w-full rounded-[36px]`}
    background: ${({ theme }) => theme.bg20};
  }
`

const DEPOSIT_BTN = styled.div`
  ${tw`w-full h-full rounded-[36px] flex items-center justify-center text-regular font-bold`}
  background: linear-gradient(94deg, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
  color: ${({ theme }) => theme.text11};
`

const RESET_LAYOUT_BUTTON = styled.div`
  ${tw`h-[38px] text-tiny text-center flex items-center text-regular font-bold underline cursor-pointer ml-auto`}
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

const Loader: FC = () => <Skeleton.Button active size="small" style={{ display: 'flex', height: '12px' }} />

export const ModalHeader: FC<{ setTradeType: (tradeType: string) => void; tradeType: string }> = ({
  setTradeType,
  tradeType
}) => {
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])

  const { isDevnet } = useCrypto()
  return (
    <div className={cn('h-10 w-full p-2.5')}>
      <Tabs className="p-[0px] mb-2 h-full" defaultValue="1">
        <TabsList>
          <TabsTrigger
            className={cn('w-[85px] h-8.75')}
            size="xl"
            value="1"
            variant="primary"
            onClick={() => setTradeType('deposit')}
          >
            <TitleLabel whiteText={tradeType === 'deposit'}>Deposit</TitleLabel>
          </TabsTrigger>
          <TabsTrigger
            className={cn('w-[85px] h-8.75')}
            size="xl"
            value="2"
            variant="primary"
            onClick={() => !isDevnet && setTradeType('withdraw')}
          >
            <TitleLabel whiteText={tradeType === 'withdraw'}>Withdraw</TitleLabel>
          </TabsTrigger>
          {publicKey && (
            <TabsTrigger
              className={cn('w-[85px] h-8.75')}
              size="xl"
              value="3"
              variant="primary"
              onClick={() => !isDevnet && setTradeType('account')}
            >
              <TitleLabel whiteText={tradeType === 'account'}>Account</TitleLabel>
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>
    </div>
  )
}

export const InfoBanner: FC<{
  isLocked: boolean
  setIsLocked: (a: boolean) => void
  resetLayout: () => void
}> = ({ isLocked, setIsLocked, resetLayout }) => {
  const { selectedCrypto, isDevnet, setIsDevnet } = useCrypto()
  const { prices, tokenInfo } = usePriceFeed()
  const { orderBook } = useOrderBook()
  const { mode } = useDarkMode()
  const { traderInfo } = useTraderConfig()
  const { blacklisted } = useConnectionConfig()
  const [tradeType, setTradeType] = useState<string>('deposit')
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)
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
    const num = Number(traderInfo.openInterests)
    if (!num) return '0.00'
    else return truncateBigNumber(num)
  }, [traderInfo.openInterests, isDevnet])

  const calculateRangeValue = (range, marketData) => {
    const priceO = getPerpsPrice(orderBook)
    if (!range || !range.min || !range.max || !priceO) return { bars: 0 }
    const difference = +range.max - +range.min,
      size = difference / 6,
      price = priceO
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
    bars = useMemo(() => calculateRangeValue(range, marketData), [selectedCrypto.pair, range, isDevnet, orderBook])

  const changeValue = tokenInfos ? tokenInfos.change : ' '
  let classNameChange = ''
  if (changeValue && changeValue.substring(0, 1) === '-') classNameChange = 'down24h'
  else if (changeValue && changeValue.substring(0, 1) === '+') classNameChange = 'up24h'

  const tokenPrice = useMemo(() => {
    const oPrice = getPerpsPrice(orderBook)
    return !oPrice ? <Loader /> : <span>$ {oPrice}</span>
  }, [isDevnet, selectedCrypto, orderBook])

  const tokenPriceChange = useMemo(() => {
    const oPrice = getPerpsPrice(orderBook)
    const changeValue = tokenInfos ? Number(tokenInfos.change.substring(1)) : 0
    return !oPrice ? <Loader /> : <span>$ {(oPrice * (changeValue / 100)).toFixed(2)}</span>
  }, [isDevnet, selectedCrypto, orderBook, tokenInfos])

  const handleToggle = (e) => {
    if (e === 'spot') setIsDevnet(true)
    else setIsDevnet(false)
  }

  return (
    <INFO_WRAPPER>
      <DepositWithdrawDialog
        depositWithdrawModal={depositWithdrawModal}
        setDepositWithdrawModal={setDepositWithdrawModal}
      />

      {/*<div className="spot-toggle">
        <span
          className={'spot toggle ' + (!isDevnet ? 'selected' : '')}
          css={[tw`text-2xl font-bold`]}
          key="spot"
          onClick={() => handleToggle('perps')}
        >
          Mainnet
        </span>
        <span
          className={'perps toggle ' + (blacklisted ? 'geoblocked' : isDevnet ? 'selected' : '')}
          css={[tw`text-2xl font-bold`]}
          key="perps"
          onClick={blacklisted ? null : () => handleToggle('spot')}
        >
          Devnet
        </span>
      </div>*/}

      <DropdownPairs />
      {
        <>
          <Container
            variant="outline"
            colorScheme="primaryGradient"
            size="sm"
            className="max-w-[100px] min-h-[42px]
           ml-4"
          >
            <ContainerTitle>
              <h6>Market Price:&nbsp;</h6>
              {/* TODO Placement bottom */}
              <IconTooltip tooltipType={'outline'}>
                <p>The current price at which a good or service can be purchased or sold.</p>
              </IconTooltip>
            </ContainerTitle>
            <InfoLabel>
              <h4 className="leading-4">{tokenPrice}</h4>
            </InfoLabel>
          </Container>
          <Container
            variant="outline"
            colorScheme="primaryGradient"
            size="sm"
            className="max-w-[115px] min-h-[42px] ml-4"
          >
            <ContainerTitle>
              <h6>24H Change:&nbsp;</h6>
              {/* TODO Placement bottom */}
              <IconTooltip tooltipType={'outline'}>
                <p>Volatility of the current asset selected in a time period of 24H.</p>
              </IconTooltip>
            </ContainerTitle>
            <InfoLabel>
              <h4 className="leading-4">
                {tokenPriceChange}
                <span className={classNameChange}>{' (' + changeValue + '%)'}</span>
              </h4>
            </InfoLabel>
          </Container>

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
      {/* {width > 1400 && (
        <INFO_STATS>
          <h4>Daily Range</h4>
          {!range ? (
            <Loader />
          ) : (
            <div>
              <span>$ {range.min}</span>
              <span className="barContainer">
                {[0, 1, 2, 3, 4, 5].map((item, index) => {
                  //@ts-ignore
                  if (item < bars) return <div key={index} className="verticalLines coloured"></div>
                  else return <div key={index} className="verticalLines grey"></div>
                })}
              </span>
              <span>$ {range.max}</span>
            </div>
          )}
        </INFO_STATS>
      )} */}
      {
        <>
          <Container
            variant="outline"
            colorScheme="primaryGradient"
            size="sm"
            className="max-w-[105px] min-h-[42px] ml-4"
          >
            <ContainerTitle>
              <h6>Open Interest:&nbsp;</h6>
              {/* TODO Placement bottom */}
              <IconTooltip tooltipType={'outline'}>
                <p>The total number of outstanding derivative contracts for an asset.</p>
              </IconTooltip>
            </ContainerTitle>
            <>
              {!traderInfo.openInterests ? (
                <Loader />
              ) : (
                <h4 className="leading-4">
                  <span>{openInterestFormatted} SOL</span>
                </h4>
              )}
            </>
          </Container>
        </>
      }
      {/* {
        <INFO_STATS>
          <>
            <div tw="flex flex-row">
              <h4>1H Funding</h4>
              <Tooltip
                placement="rightTop"
                notInherit={true}
                color={mode === 'dark' ? '#1c1c1c' : '#ffffff'}
                overlayClassName={`funding-tooltip ${mode}`}
              >
                <div tw="font-medium text-tiny dark:text-grey-5 text-grey-1 mb-2">
                  Funding rate is determined every hour. If funding is <span tw="text-green-1">positive</span>,
                  longs pay shorts. If it's
                  <span tw="text-red-2"> negative</span>, short positions pay longs.{' '}
                  <a
                    href="https://docs.goosefx.io/features/defi-derivatives/understanding-perpetual-futures/funding-rates"
                    tw="font-medium text-tiny dark:text-grey-5 text-blue-1 underline hover:dark:text-grey-5 hover:text-blue-1 hover:underline"
                    target="_blank"
                  >
                    Learn More
                  </a>
                </div>
              </Tooltip>
            </div>
            {!traderInfo.fundingRate ? <Loader /> : <div> {Number(traderInfo.fundingRate).toFixed(4)}%</div>}
          </>
        </INFO_STATS>
      }
      {
        <INFO_STATS>
          <>
            <h4>1YR Funding</h4>
            {!traderInfo.fundingRate ? (
              <Loader />
            ) : (
              <div> {(Number(traderInfo.fundingRate) * 24 * 365).toFixed(4)}%</div>
            )}
          </>
        </INFO_STATS>
      } */}
      {isDevnet && blacklisted && (
        <div tw="flex ml-auto relative top-[23px]">
          <img src={`/img/assets/georestricted_${mode}.svg`} alt="geoblocked-icon" />
          <div tw="ml-2 text-tiny font-semibold dark:text-grey-5 text-grey-1">
            GooseFX DEX is unavailable <br /> in your location.
          </div>
        </div>
      )}
      {!isLocked && (
        <RESET_LAYOUT_BUTTON onClick={() => resetLayout()}>
          <p className="text-blue-1 dark:text-grey-8 text-regular underline">Reset Layout</p>
        </RESET_LAYOUT_BUTTON>
      )}
      {
        <DEPOSIT_WRAPPER $isLocked={isLocked}>
          {/* <div className="white-background">
            <DEPOSIT_BTN onClick={() => setDepositWithdrawModal(true)}>Deposit / Withdraw </DEPOSIT_BTN>
          </div> */}
          <Button
            variant="default"
            className={cn('h-[30px]')}
            colorScheme="blue"
            onClick={() => setDepositWithdrawModal(true)}
          >
            Deposit / Withdraw
          </Button>
        </DEPOSIT_WRAPPER>
      }
      {
        <div onClick={() => setIsLocked(!isLocked)}>
          <div className="white-background">
            <div onClick={() => setIsLocked(!isLocked)}>
              <img
                className={cn('h-10 w-10 mx-2')}
                src={isLocked ? `/img/assets/${mode}Lock.svg` : `/img/assets/${mode}Unlock.svg`}
                alt="lock"
              />
            </div>
          </div>
        </div>
      }
    </INFO_WRAPPER>
  )
}
