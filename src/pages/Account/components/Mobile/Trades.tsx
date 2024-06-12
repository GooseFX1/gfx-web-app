import React, { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto } from '../../../../context'
import { useWallet } from '@solana/wallet-adapter-react'
import { httpClient } from '../../../../api'
import { GET_USER_TRADES_HISTORY } from '../../../TradeV3/perps/perpsConstants'
import { useTraderConfig } from '../../../../context/trader_risk_group'
import { Pagination } from '../Pagination'
import { convertUnixTimestampToFormattedDate } from '../../../TradeV3/perps/utils'
import { ContentLabel, InfoLabel, InfoLabelNunito } from '@/pages/TradeV3/perps/components/PerpsGenericComp'
import { BorderLine, NoPositionFound } from '../AccountOverview'
import { DepositWithdrawDialog } from '@/pages/TradeV3/perps/DepositWithdraw'

const WRAPPER = styled.div`
  ${tw`flex flex-col w-full !pb-0`}
  h1 {
    font-size: 18px;
    color: ${({ theme }) => theme.text2};
  }
`

const HISTORY = styled.div`
  ${tw`flex flex-col w-full h-full mt-[15px] !rounded-[3px] bg-white dark:bg-black-2 ml-2.5 
  w-[calc(100vw - 20px)]
  `}

  .history-items-container {
    ${tw`flex flex-col`}
  }

  .history-items-container div:last-child {
    border-bottom: none;
  }

  .history-item {
    ${tw`flex flex-col w-full justify-between  `}
    padding: 10px;
    color: ${({ theme }) => theme.text2};
    font-size: 13px;
    /* border: 1px solid #3c3c3c; */
    border-top: none;
    /* height: 170px; */
  }
  .history-item:first-child {
    /* border-top: 1px solid #3c3c3c; */
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
    
    width: 100%;
    height: calc(100vh - 210px);
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
    color: #6ead57;
  }
  .filled {
    color: #6ead57;
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
  const { connected, publicKey } = useWallet()
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)
 
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
        <DepositWithdrawDialog
          depositWithdrawModal={depositWithdrawModal}
          setDepositWithdrawModal={setDepositWithdrawModal}
        />
      )}
      <InfoLabel className="ml-2.5 mt-[15px]" >
        <h3>Trades</h3>
      </InfoLabel>

      <HISTORY>
        {filledTrades.length ? (
          <div className="history-items-root-container">
            <div className="history-items-container overflow-y-auto h-[calc(100vh - 275px)]">
              {filledTrades.map((trade) => (
                <>
                  {' '}
                  <div key={trade._id} className="history-item">
                    <div className="flex">
                      <ContentLabel className="text-[15px]">Market</ContentLabel>
                      <div className="pair-container ml-auto">
                        <img src={`${assetIcon}`} alt="SOL icon" />
                        <InfoLabelNunito className="text-[15px]">{selectedCrypto.pair}</InfoLabelNunito>
                      </div>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Direction</ContentLabel>
                      <span className={`${trade.side} ml-auto`}>
                        <InfoLabelNunito className={`${trade.side} text-[15px]`}>
                          {trade.side === 'Bid' ? 'Long' : 'Short'}
                        </InfoLabelNunito>
                      </span>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Size</ContentLabel>
                      <span className="ml-auto">
                        <InfoLabelNunito className="text-[15px]">{trade.qty.toFixed(3)} SOL</InfoLabelNunito>
                      </span>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Notional</ContentLabel>
                      <span className="ml-auto">
                        <InfoLabelNunito className="text-[15px]">
                          ${(trade.qty * trade.price).toFixed(2)}
                        </InfoLabelNunito>
                      </span>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Entry Price</ContentLabel>
                      <span className="ml-auto">
                        <InfoLabelNunito className="text-[15px]">${trade.price.toFixed(2)}</InfoLabelNunito>
                      </span>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Fee</ContentLabel>
                      <span className="ml-auto">
                        <InfoLabelNunito className="text-[15px]">
                          {' '}
                          ${((trade.qty * trade.price * 0.1) / 100).toFixed(3)}
                        </InfoLabelNunito>
                      </span>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Status</ContentLabel>
                      <span className="filled ml-auto">
                        <InfoLabelNunito className="text-[15px] filled">Filled</InfoLabelNunito>
                      </span>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Date</ContentLabel>
                      <span className="ml-auto">
                        <InfoLabelNunito className="text-[15px]">
                          {convertUnixTimestampToFormattedDate(trade.time * 1000)}
                        </InfoLabelNunito>
                      </span>
                    </div>
                  </div>
          
                  <BorderLine className="mx-2.5 " />
                </>
              ))}
            </div>
          </div>
        ) : (
          <div className='history-item h-[calc(100vh - 270px)]'>

            <NoPositionFound
              str='No Trades Found'
              connected={connected}
              setDepositWithdrawModal={setDepositWithdrawModal}
            />
          </div>
        )}
      </HISTORY>
      <div className=" h-[50px]">
        <Pagination
          pagination={pagination}
          setPagination={setPagination}
          totalItemsCount={totalItemsCount}
        />
      </div>

    </WRAPPER>
  )
}

export default MobileTrades
