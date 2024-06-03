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
import { GET_USER_FUNDING_HISTORY } from '../../../TradeV3/perps/perpsConstants'
import { useTraderConfig } from '../../../../context/trader_risk_group'
import { Pagination } from '../Pagination'
import { convertUnixTimestampToFormattedDate } from '../../../TradeV3/perps/utils'
import { Tooltip } from '../../../../components'
import { ContentLabel, InfoLabel, InfoLabelNunito } from '@/pages/TradeV3/perps/components/PerpsGenericComp'
import { BorderLine } from '../AccountOverview'
import { Container, ContainerTitle } from 'gfx-component-lib'

const WRAPPER = styled.div`
  ${tw`flex flex-col w-full`}
  padding: 5px;
  h1 {
    font-size: 18px;
    color: ${({ theme }) => theme.text2};
  }
`

const HISTORY = styled.div`
  ${tw`flex flex-col w-full h-full mt-[15px] px-2.5 overflow-y-auto `}
  height: calc(100vh - 305px);
  .history-items-container {
    ${tw`flex flex-col`}
  }

  .history-items-container div:last-child {
    border-bottom: none;
  }

  .history-item {
    ${tw`flex flex-col w-full justify-between dark:bg-black-5  bg-white`}
    padding: 10px;
    font-size: 13px;
    color: ${({ theme }) => theme.text2};
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
    /* border: 1px solid #3c3c3c; */
    border-radius: 5px;
    width: 100%;
    height: calc(100vh - 205px);
  }
  .no-funding-found > p {
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

  const getCumulativeFunding = (): number =>
    traderInfo.traderRiskGroup !== null
      ? Number(traderInfo.traderRiskGroup.fundingBalance.m.toString()) /
        10 ** (Number(traderInfo.traderRiskGroup.fundingBalance.exp.toString()) + 5)
      : 0

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

      <div className="flex justify-between items-center ml-2.5 mt-[-20px]">
        <div className="my-[15px] flex items-center">
          <Container
            variant="outline"
            colorScheme="primaryGradient"
            size="md"
            className="w-[174px] min-h-[55px] p-1.5 flex justify-between"
          >
            <ContainerTitle>
              <h5>Cumulative Funding:&nbsp;</h5>
              {/* <IconTooltip tooltipType={'outline'}>
              <p>The current price at which a good or service can be purchased or sold.</p>
            </IconTooltip> */}
            </ContainerTitle>
            <InfoLabel>
              <h2 className="leading-4">
                $
                {getCumulativeFunding().toString().indexOf('.') != -1 ? (
                  <Tooltip
                    color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}
                    infoIcon={false}
                    title={getCumulativeFunding()}
                  >
                    <>{getCumulativeFunding().toFixed(2)}</>
                  </Tooltip>
                ) : (
                  <>{getCumulativeFunding()}</>
                )}
              </h2>
            </InfoLabel>
          </Container>
        </div>
      </div>
      <InfoLabel className="ml-2.5 ">
        <h3>Funding</h3>
      </InfoLabel>
      <HISTORY>
        {fundingHistory.length ? (
          <div className="history-items-root-container">
            <div className="history-items-container  overflow-y-auto h-[calc(100vh - 350px)]">
              {fundingHistory.map((item) => (
                <>
                  <div key={item._id} className="history-item">
                    <div className="flex">
                      <ContentLabel className="text-[15px]">Market</ContentLabel>
                      <div className="pair-container ml-auto">
                        <img src={`${assetIcon}`} alt="SOL icon" />
                        <InfoLabelNunito className="text-[15px]">{selectedCrypto.pair}</InfoLabelNunito>
                      </div>
                    </div>
                    <div className="flex ">
                      <ContentLabel className="text-[15px]">Direction</ContentLabel>
                      <span className={`${item.averagePosition.side} ml-auto`}>
                        <InfoLabelNunito className={`${item.averagePosition.side} text-[15px]`}>
                          {item.averagePosition.side === 'buy' ? 'Long' : 'Short'}
                          {item.averagePosition.side === undefined && ''}
                        </InfoLabelNunito>
                      </span>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Position Size</ContentLabel>
                      <span className="ml-auto">
                        <InfoLabelNunito className="text-[15px]">
                          {item.averagePosition.quantity} SOL
                        </InfoLabelNunito>
                      </span>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Payment</ContentLabel>
                      <span className="ml-auto">
                        <InfoLabelNunito className="text-[15px]">
                          {Math.abs(item.fundingBalanceDifference / 10 ** (Number(item.fundingBalance.exp) + 5)) <
                          0.0001
                            ? '< 0.0001'
                            : item.fundingBalanceDifference / 10 ** (Number(item.fundingBalance.exp) + 5)}
                        </InfoLabelNunito>
                      </span>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Date</ContentLabel>
                      <span className="ml-auto">
                        <InfoLabelNunito className="text-[15px]">
                          {convertUnixTimestampToFormattedDate(item.time * 1000)}
                        </InfoLabelNunito>
                      </span>
                    </div>
                  </div>
                  <BorderLine className="mx-2.5" />
                </>
              ))}
            </div>
            <div className="h-[50px]">
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
