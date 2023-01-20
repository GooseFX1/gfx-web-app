import { Skeleton } from 'antd'
import React, { FC, useMemo, useState } from 'react'
import tw, { styled } from 'twin.macro'
import { useCrypto, usePriceFeed, useDarkMode } from '../../context'
import { DropdownPairs } from './DropdownPairs'
import { DepositWithdraw } from './perps/DepositWithdraw'
import { PopupCustom } from '../NFTs/Popup/PopupCustom'

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

const INFO_WRAPPER = styled.div`
  ${tw`py-0 px-[30px] flex flex-row`}
  .spot-toggle .perps {
    ${tw`cursor-pointer mr-[35px]`}
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
`
const INFO_STATS = styled.div`
  ${tw`ml-[30px] leading-5`}
  div:first-child {
    ${tw`text-tiny font-medium`}
    color: ${({ theme }) => theme.text22};
  }
  div:nth-child(2) {
    ${tw`text-tiny font-semibold text-center flex`}
    color: ${({ theme }) => theme.text21};
    span:nth-child(2) {
      ${tw`mx-2.5 text-center flex`}
      .verticalLines {
        ${tw`h-3 w-[3px] ml-[3px]`}
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

const REFRESH_DATA = styled.div`
  ${tw`h-10 w-10 rounded-circle bg-[#5855ff] text-center cursor-pointer`}
  img {
    ${tw`h-10 w-10`}
  }
`

const LOCK_LAYOUT_CTN = styled.div<{ $isLocked: boolean }>`
  ${tw`h-10 w-[65px] ml-5 rounded-[36px] text-center cursor-pointer pt-px pl-px`}
  height: 40px;
  width: 65px;
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
  background: ${({ $isLocked }) =>
    $isLocked ? '' : 'linear-gradient(90deg, rgba(247, 147, 26, 0.3) 12.88%, rgba(220, 31, 255, 0.3) 100%)'};
`

const LOCK_LAYOUT = styled.div<{ $isLocked: boolean }>`
  ${tw`w-[63px] leading-[38px] rounded-[36px] text-center`}
  background-color: ${({ theme }) => theme.bg20};
  background: ${({ $isLocked }) =>
    $isLocked ? '' : 'linear-gradient(90deg, rgba(247, 147, 26, 0.3) 12.88%, rgba(220, 31, 255, 0.3) 100%)'};
  img {
    ${tw`relative bottom-0.5`}
  }
`
const DEPOSIT_WRAPPER = styled.div`
  ${tw`w-[158px] h-10 rounded-[36px] flex items-center justify-center ml-auto cursor-pointer p-px mr-3.75`}
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
`

const DEPOSIT_BTN = styled.div`
  ${tw`w-full h-full rounded-[36px] flex items-center justify-center text-tiny font-semibold`}
  background: ${({ theme }) => theme.bg20};
  color: ${({ theme }) => theme.text11};
`

const RESET_LAYOUT_BUTTON_CTN = styled.div`
  ${tw`w-[130px] cursor-pointer h-10 p-px rounded-[36px] flex items-center justify-center`}
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
`

const RESET_LAYOUT_BUTTON = styled.div`
  ${tw`h-[38px] w-full rounded-[36px] text-tiny flex items-center justify-center font-semibold`}
  background: ${({ theme }) => theme.bg20};
  color: ${({ theme }) => theme.text11};
`

const HEADER = styled.div`
  ${tw`flex items-center`}

  .cta {
    ${tw`rounded-bigger w-[120px] h-[30px] mr-[13px] cursor-pointer`}

    .btn {
      ${tw`flex items-center justify-center text-tiny font-semibold w-full h-full`}
      color: ${({ theme }) => theme.text30};
    }

    .gradient-bg {
      ${tw`h-full w-full rounded-bigger`}
      background-image: linear-gradient(to right, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
    }
  }

  .white-background {
    ${tw`h-full w-full rounded-bigger`}
  }

  .active {
    ${tw`p-0.5 cursor-auto`}
    background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);

    .btn {
      background-color: ${({ theme }) => theme.bg25};
      color: ${({ theme }) => theme.text28};
    }

    .white-background {
      background-color: white;
    }
  }

  img {
    ${tw`ml-auto h-10 w-10 cursor-pointer mr-[50px]`}
  }
`

const Loader: FC = () => <Skeleton.Button active size="small" style={{ display: 'flex', height: '12px' }} />

const ModalHeader: FC<{ setTradeType: (tradeType: string) => void; tradeType: string }> = ({
  setTradeType,
  tradeType
}) => (
  <HEADER>
    <div className={tradeType === 'deposit' ? 'active cta' : 'cta'} onClick={() => setTradeType('deposit')}>
      <div className="white-background">
        <div className={tradeType === 'deposit' ? 'gradient-bg btn' : 'btn'}>Deposit</div>
      </div>
    </div>
    <div className={tradeType === 'withdraw' ? 'active cta' : 'cta'} onClick={() => setTradeType('withdraw')}>
      <div className="white-background">
        <div className={tradeType === 'withdraw' ? 'gradient-bg btn' : 'btn'}>Withdraw</div>
      </div>
    </div>
    <img src="/img/assets/refresh.svg" alt="refresh-icon" />
  </HEADER>
)

export const InfoBanner: FC<{
  isLocked: boolean
  setIsLocked: (a: boolean) => void
  resetLayout: () => void
}> = ({ isLocked, setIsLocked, resetLayout }) => {
  const { selectedCrypto, isSpot, setIsSpot } = useCrypto()
  const { prices, tokenInfo, refreshTokenData } = usePriceFeed()
  const { mode } = useDarkMode()
  const [tradeType, setTradeType] = useState<string>('deposit')
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)
  const marketData = useMemo(() => prices[selectedCrypto.pair], [prices, selectedCrypto.pair])
  const tokenInfos = useMemo(() => tokenInfo[selectedCrypto.pair], [tokenInfo[selectedCrypto.pair]])
  const formatDisplayVolume = (volume) => {
    if (!volume) return null
    const stringLength = volume.length
    if (stringLength < 6) return volume
    else {
      const [numberBeforeDecimal, numberAfterDecimal] = volume.split('.'),
        reverseNumber = numberBeforeDecimal.split('').reverse().join('')
      let answer = ''
      for (let i = 0; i < reverseNumber.length; i++) {
        answer += reverseNumber.substring(i, i + 1)
        if (i % 3 === 2 && i !== reverseNumber.length - 1) answer = answer + ','
      }
      const reversedResult = answer.split('').reverse().join('')
      return reversedResult + '.' + numberAfterDecimal
    }
  }

  const calculateRangeValue = (range, marketData) => {
    if (!range || !range.min || !range.max || !marketData || !marketData.current) return { bars: 0 }
    const difference = +range.max - +range.min,
      size = difference / 6,
      price = marketData.current
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
    bars = useMemo(() => calculateRangeValue(range, marketData), [selectedCrypto.pair, range])

  const changeValue = tokenInfos ? tokenInfos.change : ' '
  let classNameChange = ''
  if (changeValue && changeValue.substring(0, 1) === '-') classNameChange = 'down24h'
  else if (changeValue && changeValue.substring(0, 1) === '+') classNameChange = 'up24h'

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
      <div className="spot-toggle">
        <span
          className={'spot toggle ' + (isSpot ? 'selected' : '')}
          key="spot"
          onClick={() => handleToggle('spot')}
        >
          Spot
        </span>
        <span
          className={'perps toggle ' + (!isSpot ? 'selected' : '')}
          key="perps"
          onClick={() => handleToggle('perps')}
        >
          Perps
        </span>
      </div>
      <DropdownPairs />
      <INFO_STATS>
        <>
          <div>Price</div>
          {!marketData || !marketData.current ? <Loader /> : <div>$ {marketData.current}</div>}
        </>
      </INFO_STATS>
      <INFO_STATS>
        <>
          <div>24hr Volume</div>
          {!displayVolume ? <Loader /> : <div>$ {displayVolume}</div>}
        </>
      </INFO_STATS>
      <INFO_STATS>
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
      </INFO_STATS>
      <INFO_STATS>
        <div>Daily Range</div>
        {!range ? (
          <Loader />
        ) : (
          <div>
            <span>$ {range.min}</span>
            <span>
              {[0, 1, 2, 3, 4, 5].map((item, index) => {
                if (item < bars) return <div key={index} className="verticalLines coloured"></div>
                else return <div key={index} className="verticalLines grey"></div>
              })}
            </span>
            <span>$ {range.max}</span>
          </div>
        )}
      </INFO_STATS>
      <DEPOSIT_WRAPPER>
        <DEPOSIT_BTN onClick={() => setDepositWithdrawModal(true)}>Deposit / Withdraw </DEPOSIT_BTN>
      </DEPOSIT_WRAPPER>
      {isLocked ? (
        <REFRESH_DATA onClick={() => refreshTokenData(null)}>
          <img src={`/img/assets/refreshButton.png`} alt="refresh" />
        </REFRESH_DATA>
      ) : (
        <RESET_LAYOUT_BUTTON_CTN>
          <RESET_LAYOUT_BUTTON onClick={() => resetLayout()}>Reset Layout</RESET_LAYOUT_BUTTON>
        </RESET_LAYOUT_BUTTON_CTN>
      )}
      <LOCK_LAYOUT_CTN $isLocked={isLocked} onClick={() => setIsLocked(!isLocked)}>
        <LOCK_LAYOUT $isLocked={isLocked} onClick={() => setIsLocked(!isLocked)}>
          <img src={isLocked ? `/img/assets/${mode}_lock.svg` : `/img/assets/${mode}_unlock.svg`} alt="lock" />
        </LOCK_LAYOUT>
      </LOCK_LAYOUT_CTN>
    </INFO_WRAPPER>
  )
}
