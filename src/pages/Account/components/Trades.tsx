import React, { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto, useDarkMode } from '../../../context'
import { Connect } from '../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'

import { ModalHeader, SETTING_MODAL } from '../../TradeV3/InfoBanner'

import { DepositWithdraw } from '../../TradeV3/perps/DepositWithdraw'
import { httpClient } from '../../../api'
import { GET_USER_TRADES_HISTORY } from '../../TradeV3/perps/perpsConstants'
import { useTraderConfig } from '../../../context/trader_risk_group'

const WRAPPER = styled.div`
  ${tw`flex flex-col w-full`}
  margin: 15px;
  h1 {
    font-size: 18px;
  }
`

const ACCOUNTHEADER = styled.div`
    ${tw`grid grid-cols-8  items-center w-full`}
    border: 1px solid #3C3C3C;
    margin-top: 10px;
    span {
        padding-top:10px;
        padding-bottom:10px;
    }
    span:first-child {
      ${tw`pl-3`}
    }
    span:last-child {
      ${tw`pr-16`}
    }
  }
`

const HISTORY = styled.div`
  ${tw`flex flex-col w-full h-full`}
  border: 1px solid #3c3c3c;
  border-top: none;

  .history-items-container {
    height: 450px;
    overflow: auto;
  }
  .pair-container {
    ${tw`flex gap-x-1 items-center`}
  }
  .pair-container img {
    height: 24px;
    width: 24px;
  }

  .history-item {
    ${tw`grid grid-cols-8  items-center w-full`}
    padding: 10px;
    font-size: 13px;
    border-bottom: 1px solid #3c3c3c;
  }
  .history-item span:first-child {
    ${tw`pl-1`}
  }
  .no-trades-found {
    max-width: 155px;
    display: flex;
    margin: auto;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .no-trades-found > p {
    margin: 0;
    margin-top: 15px;
    margin-bottom: 15px;
    color: #636363;
    font-size: 15px;
    font-weight: 600;
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #3c3c3c;
  }
  .pagination-container > div {
    display: flex;
    flex-wrap: nowrap;
  }

  .pagination-container .icons-container {
    display: flex;
    flex-direction: row;
  }

  .deposit {
    background: linear-gradient(97deg, #f7931a 4.25%, #ac1cc7 97.61%);
    border-radius: 70px;
    padding: 3px 18px;
    font-size: 15px;
    font-weight: 600;
  }
  .Bid {
    color: #80ce00;
  }
  .filled {
    color: #80ce00;
  }
  .Ask {
    color: #f35355;
  }
`

const columns = ['Market', 'Direction', 'Size', 'Notional', 'Entry Price', 'Fee', 'Status', 'Date']

type Pagination = {
  page: number
  limit: number
}
const Trades: FC = () => {
  const { mode } = useDarkMode()

  const { connected, publicKey } = useWallet()
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)

  const [tradeType, setTradeType] = useState<string>('deposit')
  const { isDevnet } = useCrypto()
  const { traderInfo } = useTraderConfig()
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20 })
  const [filledTrades, setFilledTrades] = useState([])

  const { selectedCrypto, getAskSymbolFromPair } = useCrypto()
  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, selectedCrypto.type])
  const fetchFilledTrades = async () => {
    const res = await httpClient('api-services').get(`${GET_USER_TRADES_HISTORY}`, {
      params: {
        API_KEY: 'zxMTJr3MHk7GbFUCmcFyFV4WjiDAufDp',
        devnet: isDevnet,
        traderRiskGroup: traderInfo.traderRiskGroupKey.toString(),
        page: pagination.page,
        limit: pagination.limit
      }
    })
    setFilledTrades(res.data.data)
  }

  useEffect(() => {
    if (traderInfo.traderRiskGroupKey !== null) {
      fetchFilledTrades()
    }
    console.log(setPagination)
  }, [connected, publicKey, traderInfo])

  function convertUnixTimestampToFormattedDate(unixTimestamp: number) {
    // Create a new Date object using the Unix timestamp (in milliseconds)
    const date = new Date(unixTimestamp * 1000)

    // Format the date as "MM/DD/YYYY hh:mmAM/PM"
    const formattedDate = `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-US')}`

    return formattedDate
  }
  return (
    <WRAPPER>
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
      <h1>Trades</h1>
      <ACCOUNTHEADER>
        {columns.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </ACCOUNTHEADER>
      <HISTORY>
        {filledTrades.length ? (
          <div>
            <div className="history-items-container">
              {filledTrades.map((trade) => (
                <div key={trade._id} className="history-item">
                  <div className="pair-container">
                    <img src={`${assetIcon}`} alt="SOL icon" />
                    <span>{selectedCrypto.pair}</span>
                  </div>
                  <span className={trade.side}>{trade.side === 'Bid' ? 'Long' : 'Short'}</span>
                  <span>{trade.qty.toFixed(3)} SOL</span>
                  <span>${(trade.qty * trade.price).toFixed(2)}</span>
                  <span>${trade.price.toFixed(2)}</span>
                  <span>${((trade.qty * trade.price * 0.1) / 100).toFixed(3)}</span>
                  <span className="filled">Filled</span>
                  <span>{convertUnixTimestampToFormattedDate(trade.time)}</span>
                </div>
              ))}
            </div>
            {/* <div className="pagination-container"> */}
            {/*   <div> */}
            {/*     <p>1 of 20 Transactions</p> */}
            {/*     <div className="icons-container"> */}
            {/*       <img */}
            {/*         src={ */}
            {/*           mode === 'lite' */}
            {/*             ? '/img/assets/arrow-circle-down-light-mode.svg' */}
            {/*             : '/img/assets/arrow-circle-down.svg' */}
            {/*         } */}
            {/*         alt="arrow-icon" */}
            {/*         height="16" */}
            {/*         width="16" */}
            {/*       /> */}
            {/*       <img */}
            {/*         src={ */}
            {/*           mode === 'lite' */}
            {/*             ? '/img/assets/arrow-circle-down-light-mode.svg' */}
            {/*             : '/img/assets/arrow-circle-down.svg' */}
            {/*         } */}
            {/*         alt="arrow-icon" */}
            {/*         height="16" */}
            {/*         width="16" */}
            {/*       /> */}
            {/*     </div> */}
            {/*   </div> */}
            {/* </div> */}
          </div>
        ) : (
          <div className="no-trades-found">
            <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-trades-found" />
            <p>No deposits Found</p>
            {!connected && <Connect />}
            {connected && (
              <button onClick={() => setDepositWithdrawModal(true)} className="deposit">
                Deposit Now
              </button>
            )}
          </div>
        )}
      </HISTORY>
    </WRAPPER>
  )
}

export default Trades
