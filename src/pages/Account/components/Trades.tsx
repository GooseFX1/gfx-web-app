/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto, useDarkMode } from '../../../context'
import { Connect } from '../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'
import { httpClient } from '../../../api'
import { GET_USER_TRADES_HISTORY } from '../../TradeV3/perps/perpsConstants'
import { useTraderConfig } from '../../../context/trader_risk_group'
import { Pagination } from './Pagination'
import { convertUnixTimestampToFormattedDate } from '../../TradeV3/perps/utils'
import { DepositWithdrawDialog } from '@/pages/TradeV3/perps/DepositWithdraw'
import { ContentLabel, InfoLabel } from '@/pages/TradeV3/perps/components/PerpsGenericComp'

const WRAPPER = styled.div`
  ${tw`flex flex-col w-full !pb-0`}
  padding: 15px;
  h1 {
    font-size: 18px;
    color: ${({ theme }) => theme.text2};
  }
`

const HISTORY = styled.div`
  ${tw`flex flex-col w-full h-full`}
  border-top: 1px solid #3c3c3c;
  border-top: none;
  height: calc(100vh - 180px);

  .history-items-root-container {
    height: 100%;
  }

  .history-items-container {
    height: calc(100% - 40px);
    color: ${({ theme }) => theme.text2};
    overflow: auto;
  }
  .pair-container {
    ${tw`flex gap-x-1 items-center`}
  }
  .pair-container img {
    height: 24px;
    width: 24px;
  }
  .pagination-container {
    height: 40px;
  }
  .history-item {
    ${tw`grid grid-cols-8  items-center !border-t-0 !border-l-0 !border-r-0
    w-full dark:border-b-black-4 border border-b-grey-4`}
    padding: 10px;
    font-size: 13px;
  }
  .history-item span:first-child {
    ${tw`pl-1`}
  }

  .history-item:last-child {
    border-bottom: none;
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
    color: ${({ theme }) => theme.text2};
    font-size: 15px;
    font-weight: 600;
  }

  .deposit {
    background: linear-gradient(97deg, #f7931a 4.25%, #ac1cc7 97.61%);
    border-radius: 70px;
    padding: 3px 18px;
    font-size: 15px;
    font-weight: 600;
  }
  .Long {
    color: #80ce00;
  }
  .filled {
    color: #80ce00;
  }
  .Short {
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

  const { isDevnet } = useCrypto()
  const { traderInfo } = useTraderConfig()
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20 })
  const [filledTrades, setFilledTrades] = useState([])
  const [totalItemsCount, setTotalItemsCount] = useState(0)

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
    setTotalItemsCount(res.data.totalCount)
  }

  useEffect(() => {
    if (publicKey && traderInfo.traderRiskGroupKey !== null) {
      fetchFilledTrades()
    } else {
      setFilledTrades([])
    }
  }, [connected, publicKey, pagination, traderInfo.traderRiskGroupKey])

  // if the trader is the maker side displayed should be the opposite
  const getDisplayTradeSide = (trade: any) => {
    if (trade.taker == traderInfo.traderRiskGroupKey.toString()) {
      return trade.side === 'Bid' ? 'Long' : 'Short'
    } else {
      return trade.side === 'Ask' ? 'Long' : 'Short'
    }
  }

  return (
    <WRAPPER>
      {depositWithdrawModal && (
        <DepositWithdrawDialog
          depositWithdrawModal={depositWithdrawModal}
          setDepositWithdrawModal={setDepositWithdrawModal}
        />
      )}
      <InfoLabel>
        <h1 className="mb-4">Trades</h1>
      </InfoLabel>
      <div
        className="grid grid-cols-8 items-center rounded-t-[3px] px-2.5 bg-white
      dark:bg-black-2 w-full py-2 dark:border-b-black-4 border-grey-4 border border-l-0 border-r-0 border-t-0"
      >
        {columns.map((item, index) => (
          <ContentLabel className="h-5" key={index}>
            {item}
          </ContentLabel>
        ))}
      </div>

      <HISTORY>
        {filledTrades.length ? (
          <div className="history-items-root-container">
            <div className="history-items-container dark:bg-black-5 bg-white">
              {filledTrades.map((trade) => (
                <div key={trade._id} className="history-item">
                  <div className="pair-container">
                    <img src={`${assetIcon}`} alt="SOL icon" />
                    <InfoLabel>
                      <p className="text-[13px]">{selectedCrypto.pair}</p>
                    </InfoLabel>
                  </div>
                  <InfoLabel className={getDisplayTradeSide(trade)}>
                    <p className="text-[13px]">{getDisplayTradeSide(trade)}</p>
                  </InfoLabel>
                  <InfoLabel>
                    <p className="text-[13px]">{trade.qty.toFixed(3)} SOL</p>
                  </InfoLabel>
                  <InfoLabel>
                    <p className="text-[13px]">${(trade.qty * trade.price).toFixed(2)}</p>
                  </InfoLabel>
                  <InfoLabel>
                    <p className="text-[13px]">${trade.price.toFixed(2)}</p>
                  </InfoLabel>
                  <InfoLabel>
                    <p className="text-[13px]">${((trade.qty * trade.price * 0.1) / 100).toFixed(3)}</p>
                  </InfoLabel>
                  <InfoLabel className="!text-green-4">
                    <p className="text-[13px]">Filled</p>
                  </InfoLabel>
                  <InfoLabel>
                    <p className="text-[13px]">{convertUnixTimestampToFormattedDate(trade.time * 1000)}</p>
                  </InfoLabel>
                </div>
              ))}
            </div>
            <div className="pagination-container">
              <Pagination
                pagination={pagination}
                setPagination={setPagination}
                totalItemsCount={totalItemsCount}
              />
            </div>
          </div>
        ) : (
          <div className="no-trades-found">
            <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-trades-found" />
            <p>No Trades Found</p>
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
