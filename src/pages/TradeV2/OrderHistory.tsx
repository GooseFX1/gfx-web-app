import React, { FC, useEffect, useMemo } from 'react'
import { Skeleton } from 'antd'
import styled from 'styled-components'
import { useCrypto, useTradeHistory } from '../../context'
import moment from 'moment'
const HEADER = styled.div`
  width: 100%;
  height: 70px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg12};
  padding-top: 10px;
  div {
    padding-left: 10px;
    padding-right: 10px;
    color: #e7e7e7;
    font-size: 15px;
  }
  div:nth-child(2) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    color: ${({ theme }) => theme.text20};

    span {
      display: inline-block;
      width: 33%;
      font-size: 11px;
    }
    span:nth-child(2) {
      text-align: center;
    }
    span:nth-child(3) {
      text-align: right;
    }
  }
`
const WRAPPER = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg3};
`

const LOADER = styled(Skeleton.Input)`
  width: 100%;
  max-height: 328px;
  height: 20px;
  .ant-skeleton-input {
    width: 100%;
  }
  span {
    height: 10px !important;

    &:first-child {
      margin-top: ${({ theme }) => theme.margin(0.5)};
    }
  }
`
const TRADE_WRAPPER = styled.div`
  height: calc(100% - 70px);
  overflow-y: auto;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
`

const TRADE_ROW = styled.div<{ $side: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  height: 20px;
  padding: 0px 10px;
  span {
    display: inline-block;
    width: 33%;
    font-size: 13px;
    color: ${({ theme }) => theme.text18};
  }
  span:first-child {
    color: ${({ $side }) => ($side ? '#50BB35' : '#F06565')};
  }
  span:nth-child(2) {
    text-align: center;
  }
  span:nth-child(3) {
    text-align: right;
  }
`
const Loader: FC = () => (
  <>
    {[...Array(10).keys()].map((_, index) => (
      <LOADER key={index} active size="small" />
    ))}
  </>
)

export const OrderHistory: FC = () => {
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedCrypto } = useCrypto()
  const bid = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])
  const ask = useMemo(() => getAskSymbolFromPair(selectedCrypto.pair), [getAskSymbolFromPair, selectedCrypto.pair])
  const { tradeHistory } = useTradeHistory()

  return (
    <WRAPPER>
      <HEADER>
        <div>Market Trades</div>
        <div>
          <span>Price({bid})</span>
          <span>Size({ask})</span>
          <span>Time</span>
        </div>
      </HEADER>
      {!tradeHistory.length ? (
        <Loader />
      ) : (
        <TRADE_WRAPPER>
          {tradeHistory.map((item) => {
            return (
              <TRADE_ROW $side={item.side === 'buy'}>
                <span>{item.price}</span>
                <span>{item.size}</span>
                <span>{moment(item.time).format('LTS')}</span>
              </TRADE_ROW>
            )
          })}
        </TRADE_WRAPPER>
      )}
    </WRAPPER>
  )
}
