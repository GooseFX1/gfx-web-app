import React, { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto, useDarkMode } from '../../../../context'
import { Connect } from '../../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'

import { ModalHeader, SETTING_MODAL } from '../../../TradeV3/InfoBanner'

import { DepositWithdraw } from '../../../TradeV3/perps/DepositWithdraw'
import { httpClient } from '../../../../api'
import { GET_USER_FUNDING_HISTORY } from '../../../TradeV3/perps/perpsConstants'
import { useTraderConfig } from '../../../../context/trader_risk_group'
import { Pagination } from '../Pagination'

const WRAPPER = styled.div`
  ${tw`flex flex-col w-full`}
  padding: 5px;
  h1 {
    font-size: 18px;
  }
`

const ACCOUNTVALUESFLEX = styled.div`
  ${tw`flex flex-row gap-x-4`}
`

const ACCOUNTVALUESCONTAINER = styled.div`
  ${tw`w-[190px] rounded-[5px] p-[1px]`}
  background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
`

const ACCOUNTVALUE = styled.div`
  ${tw`h-full w-full rounded-[5px] flex flex-col  text-tiny font-semibold`}
  color: ${({ theme }) => theme.text28};
  background: #131313;
  padding: 5px;
  p {
    margin: 0px;
    font-size: 13px;
  }
  p:last-child {
    color: #636363;
    font-size: 15px;
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
    height: 24px;
    width: 24px;
  }

  .pagination-container {
    height: 40px;
  }
  .history-item:last-child {
    border-bottom: none;
  }
  .no-funding-found {
    display: flex;
    margin: auto;
    margin-top: 5px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #3c3c3c;
    border-radius: 5px;
    width: 100%;
    height: calc(100vh - 205px);
  }
  .no-funding-found > p {
    margin: 0;
    margin-top: 15px;
    margin-bottom: 15px;
    color: #636363;
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
const MobileFundingHistory: FC = () => {
  const { mode } = useDarkMode()

  const { connected, publicKey } = useWallet()

  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)

  const [tradeType, setTradeType] = useState<string>('deposit')

  const { isDevnet } = useCrypto()
  const { traderInfo } = useTraderConfig()
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20 })
  const [totalItemsCount, setTotalItemsCount] = useState(0)
  const [fundingHistory, setFundingHistory] = useState([])

  const { selectedCrypto, getAskSymbolFromPair } = useCrypto()
  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, selectedCrypto.type])
  function convertUnixTimestampToFormattedDate(unixTimestamp: number) {
    // Create a new Date object using the Unix timestamp (in milliseconds)
    const date = new Date(unixTimestamp * 1000)

    // Format the date as "MM/DD/YYYY hh:mmAM/PM"
    const formattedDate = `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-US')}`

    return formattedDate
  }
  const fetchFundingHistory = async () => {
    const res = await httpClient('api-services').get(`${GET_USER_FUNDING_HISTORY}`, {
      params: {
        API_KEY: 'zxMTJr3MHk7GbFUCmcFyFV4WjiDAufDp',
        devnet: isDevnet,
        traderRiskGroup: traderInfo.traderRiskGroupKey.toString(),
        page: pagination.page,
        limit: pagination.limit
      }
    })
    setFundingHistory(res.data.data)
    setTotalItemsCount(res.data.totalCount)
  }

  useEffect(() => {
    if (traderInfo.traderRiskGroupKey !== null) {
      fetchFundingHistory()
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
      <h1>Funding</h1>
      <ACCOUNTVALUESFLEX>
        <ACCOUNTVALUESCONTAINER>
          <ACCOUNTVALUE>
            <p>Cumulative Funding:</p>
            <p>
              $
              {traderInfo.traderRiskGroup !== null
                ? (
                    Number(traderInfo.traderRiskGroup.fundingBalance.m.toString()) /
                    10 ** (Number(traderInfo.traderRiskGroup.fundingBalance.exp.toString()) + 5)
                  ).toFixed(2)
                : 0}
            </p>
          </ACCOUNTVALUE>
        </ACCOUNTVALUESCONTAINER>
      </ACCOUNTVALUESFLEX>
      <HISTORY>
        {fundingHistory.length ? (
          <div className="history-items-root-container">
            <div className="history-items-container">
              {fundingHistory.map((item) => (
                <div key={item._id} className="history-item">
                  <div className="flex">
                    <span>Market</span>
                    <div className="pair-container ml-auto">
                      <img src={`${assetIcon}`} alt="SOL icon" />
                      <span>{selectedCrypto.pair}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <span>Direction</span>
                    <span className={`${item.averagePosition.side} ml-auto`}>
                      {item.averagePosition.side === 'buy' ? 'Long' : 'Short'}
                      {item.averagePosition.side === undefined && ''}
                    </span>
                  </div>
                  <div className="flex">
                    <span>Position Size</span>
                    <span className="ml-auto">{item.averagePosition.quantity} SOL</span>
                  </div>
                  <div className="flex">
                    <span>Payment</span>
                    <span className="ml-auto">
                      {(item.fundingBalanceDifference / 10 ** (Number(item.fundingBalance.exp) + 5)).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex">
                    <span>Date</span>
                    <span className="ml-auto">{convertUnixTimestampToFormattedDate(item.time)}</span>
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
          <div className="no-funding-found">
            <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-funding-found" />
            <p>No Funding Found</p>
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

export default MobileFundingHistory
