import React, { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto, useDarkMode } from '../../../../context'
import { Connect } from '../../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'

import { ModalHeader, SETTING_MODAL } from '../../../TradeV3/InfoBanner'

import { DepositWithdraw } from '@/pages/TradeV3/perps/DepositWithdrawNew'
import { httpClient } from '../../../../api'
import { GET_USER_TRADES_HISTORY } from '../../../TradeV3/perps/perpsConstants'
import { useTraderConfig } from '../../../../context/trader_risk_group'
import { Pagination } from '../Pagination'
import { convertUnixTimestampToFormattedDate } from '../../../TradeV3/perps/utils'
import { InfoLabel } from '@/pages/TradeV3/perps/components/PerpsGenericComp'

const WRAPPER = styled.div`
  ${tw`flex flex-col w-full`}
  padding: 5px;
  h1 {
    font-size: 18px;
    color: ${({ theme }) => theme.text2};
  }
`

const HISTORY = styled.div`
  ${tw`flex flex-col w-full h-full mt-[15px]`}

  .history-items-container {
    ${tw`flex flex-col`}
  }

  .history-items-container div:last-child {
    border-bottom: none;
  }

  .history-item {
    ${tw`flex flex-col w-full justify-between`}
    padding: 10px;
    color: ${({ theme }) => theme.text2};
    font-size: 13px;
    border: 1px solid #3c3c3c;
    border-top: none;
    height: 170px;
  }
  .history-item:first-child {
    border-top: 1px solid #3c3c3c;
    border-radius: 5px 5px 0px 0px;
  }

  .history-item:last-child {
    border-radius: 0px 0px 5px 5px;
  }
  .pair-container {
    ${tw`flex gap-x-1 items-center`}
  }
  .pair-container img {
    height: 18px;
    width: 18px;
  }
  .pagination-container {
    height: 40px;
  }
  .no-trades-found {
    display: flex;
    margin: auto;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #3c3c3c;
    width: 100%;
    height: calc(100vh - 160px);
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

type Pagination = {
  page: number
  limit: number
}
const MobileTrades: FC = () => {
  const { mode } = useDarkMode()

  const { connected, publicKey } = useWallet()
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)

  const [tradeType, setTradeType] = useState<string>('deposit')
  const { isDevnet } = useCrypto()
  const { traderInfo } = useTraderConfig()
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20 })
  const [totalItemsCount, setTotalItemsCount] = useState(0)
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
    setTotalItemsCount(res.data.totalCount)
  }

  useEffect(() => {
    if (traderInfo.traderRiskGroupKey !== null) {
      fetchFilledTrades()
    }
  }, [connected, publicKey, traderInfo.traderRiskGroupKey, pagination])

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
      <HISTORY>
        {filledTrades.length ? (
          <div className="history-items-root-container">
            <div className="history-items-container">
              {filledTrades.map((trade) => (
                <div key={trade._id} className="history-item">
                  <div className="flex">
                    <span>Market</span>
                    <div className="pair-container ml-auto">
                      <img src={`${assetIcon}`} alt="SOL icon" />
                      <span>{selectedCrypto.pair}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <span>Direction</span>
                    <span className={`${trade.side} ml-auto`}>{trade.side === 'Bid' ? 'Long' : 'Short'}</span>
                  </div>
                  <div className="flex">
                    <span>Size</span>
                    <span className="ml-auto">{trade.qty.toFixed(3)} SOL</span>
                  </div>
                  <div className="flex">
                    <span>Notional</span>
                    <span className="ml-auto">${(trade.qty * trade.price).toFixed(2)}</span>
                  </div>
                  <div className="flex">
                    <span>Entry Price</span>
                    <span className="ml-auto">${trade.price.toFixed(2)}</span>
                  </div>
                  <div className="flex">
                    <span>Fee</span>
                    <span className="ml-auto">${((trade.qty * trade.price * 0.1) / 100).toFixed(3)}</span>
                  </div>
                  <div className="flex">
                    <span>Status</span>
                    <span className="filled ml-auto">Filled</span>
                  </div>
                  <div className="flex">
                    <span>Date</span>
                    <span className="ml-auto">{convertUnixTimestampToFormattedDate(trade.time * 1000)}</span>
                  </div>
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
            <InfoLabel>
              <p>No Trades Found</p>
            </InfoLabel>
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

export default MobileTrades
