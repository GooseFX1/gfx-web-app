import { Skeleton } from 'antd'
import React, { FC, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useCrypto, usePriceFeed } from '../../context'
import { DropdownPairs } from './DropdownPairs'
import { PlaceOrder } from './perps/DepositWithdraw'
import { PopupCustom } from '../NFTs/Popup/PopupCustom'

const SETTING_MODAL = styled(PopupCustom)`
  height: 356px !important;
  width: 628px !important;
  background-color: ${({ theme }) => theme.bg20};
  border-radius: 25px;

  .ant-modal-header {
    background-color: ${({ theme }) => theme.bg20};
    border-bottom: none;
    padding: 20px 25px 0;
    border-radius: 25px 25px 0 0;
  }
  .ant-modal-content {
    box-shadow: none;

    .ant-modal-close {
      top: 30px;
    }
  }
  .ant-modal-body {
    padding: 0 25px;
  }
`

const INFO_WRAPPER = styled.div`
  padding: 0px 30px;
  display: flex;
  .spot-toggle .perps {
    cursor: pointer;
  }
  .spot-toggle .spot {
    cursor: pointer;
  }
  .spot-toggle .selected {
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    color: white !important;
    border: 1px solid black;
  }
  .spot-toggle .toggle {
    border-radius: 36px;
    height: 40px;
    line-height: 40px;
    vertical-align: middle;
    width: 90px;
    display: inline-block;
    text-align: center;
    font-size: 16px;
    color: ${({ theme }) => theme.text16};
    border: none;
  }
`
const INFO_STATS = styled.div`
  margin-left: 30px;
  line-height: 20px;
  div:first-child {
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.text22};
  }
  div:nth-child(2) {
    color: ${({ theme }) => theme.text21};
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    display: flex;
    span:nth-child(2) {
      display: flex;
      align-items: center;
      margin-left: 10px;
      margin-right: 10px;
      .verticalLines {
        height: 12px;
        width: 3px;
        margin-left: 3px;
      }
      .coloured {
        background: linear-gradient(88.42deg, #f7931a 4.59%, #e649ae 98.77%);
      }
      .grey {
        background-color: #2a2a2a;
      }
    }
  }
  img {
    margin: 4px;
  }
`

const REFRESH_DATA = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #5855ff;
  text-align: center;
  cursor: pointer;
  img {
    height: 40px;
    width: 40px;
  }
`

const LOCK_LAYOUT_CTN = styled.div<{ $isLocked: boolean }>`
  height: 40px;
  width: 65px;
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
  background: ${({ $isLocked }) =>
    $isLocked ? '' : 'linear-gradient(90deg, rgba(247, 147, 26, 0.3) 12.88%, rgba(220, 31, 255, 0.3) 100%)'};
  margin-left: 20px;
  border-radius: 36px;
  text-align: center;
  cursor: pointer;
  padding: 1px 0 0 1px;
`

const LOCK_LAYOUT = styled.div<{ $isLocked: boolean }>`
  line-height: 38px;
  width: 63px;
  background-color: ${({ theme }) => theme.bg20};
  background: ${({ $isLocked }) =>
    $isLocked ? '' : 'linear-gradient(90deg, rgba(247, 147, 26, 0.3) 12.88%, rgba(220, 31, 255, 0.3) 100%)'};
  border-radius: 36px;
  text-align: center;
  img {
    position: relative;
    bottom: 2px;
  }
`
const DEPOSIT_WRAPPER = styled.div`
  margin-left: auto;
  width: 158px;
  height: 40px;
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
  border-radius: 36px;
  margin-right: 15px;
  padding: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const DEPOSIT_BTN = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.bg20};
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
`

const RESET_LAYOUT_BUTTON_CTN = styled.div`
  cursor: pointer;
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
  height: 40px;
  padding: 1px;
  margin-left: auto;
  border-radius: 36px;
  color: ${({ theme }) => theme.text4};
`

const RESET_LAYOUT_BUTTON = styled.div`
  background-color: ${({ theme }) => theme.bg21};
  height: 38px;
  padding: 8px 20px;
  border-radius: 36px;
  color: ${({ theme }) => theme.text4};
`

const HEADER = styled.div`
  display: flex;
  align-items: center;

  .cta {
    background-color: ${({ theme }) => theme.bg21};
    border-radius: 20px;
    width: 120px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.text20};
    cursor: pointer;
  }
  .cta.active-text {
    color: ${({ theme }) => theme.text1};
  }

  .active {
    background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
    padding: 1px;
    border-radius: 20px;
    cursor: pointer;
  }

  img {
    margin-left: auto;
    margin-right: 50px;
    height: 40px;
    width: 40px;
    cursor: pointer;
  }
`

const Loader: FC = () => <Skeleton.Button active size="small" style={{ display: 'flex', height: '12px' }} />

const ModalHeader: FC<{ setTradeType: (tradeType: string) => void; tradeType: string }> = ({
  setTradeType,
  tradeType
}) => (
  <HEADER>
    <div className={tradeType === 'deposit' ? 'active' : ''} onClick={() => setTradeType('deposit')}>
      <div className={tradeType === 'deposit' ? 'active-text cta' : 'cta'}>Deposit</div>
    </div>
    <div className={tradeType === 'withdraw' ? 'active' : ''} onClick={() => setTradeType('withdraw')}>
      <div className={tradeType === 'withdraw' ? 'active-text cta' : 'cta'}>Withdraw</div>
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
          setVisible={true}
          visible={true}
          centered={true}
          footer={null}
          title={<ModalHeader setTradeType={setTradeType} tradeType={tradeType} />}
          closeIcon={
            <img
              src="/img/assets/close-gray-icon.svg"
              height="20px"
              width="20px"
              onClick={() => setDepositWithdrawModal(false)}
            />
          }
        >
          <PlaceOrder tradeType={tradeType} />
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
      {isLocked && (
        <DEPOSIT_WRAPPER>
          <DEPOSIT_BTN onClick={() => setDepositWithdrawModal(true)}>Deposit / Withdraw </DEPOSIT_BTN>
        </DEPOSIT_WRAPPER>
      )}
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
          <img src={isLocked ? `/img/assets/whiteLock.svg` : `/img/assets/whiteUnlock.svg`} alt="lock" />
        </LOCK_LAYOUT>
      </LOCK_LAYOUT_CTN>
    </INFO_WRAPPER>
  )
}
