import React, { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto, useDarkMode } from '../../../context'
import { Connect } from '../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'
import { httpClient } from '../../../api'
import { GET_USER_FUNDING_HISTORY } from '../../TradeV3/perps/perpsConstants'
import { useTraderConfig } from '../../../context/trader_risk_group'
import { Pagination } from './Pagination'
import { convertUnixTimestampToFormattedDate } from '../../TradeV3/perps/utils'
import { Tooltip } from '../../../components'
import { Button, Container, ContainerTitle } from 'gfx-component-lib'
import { DepositWithdrawDialog } from '@/pages/TradeV3/perps/DepositWithdraw'
import {
  AccountsLabel,
  ContentLabel,
  InfoLabel,
  InfoLabelNunito
} from '@/pages/TradeV3/perps/components/PerpsGenericComp'

const WRAPPER = styled.div`
  ${tw`flex flex-col w-full !pb-0 overflow-hidden ml-36`}
  padding: 15px;
  h1 {
    font-size: 18px;
    color: ${({ theme }) => theme.text2};
  }
`

const HISTORY = styled.div`
  ${tw`flex flex-col w-full h-full dark:bg-black-2 bg-white rounded-b-[5px]`}
  height: calc(100vh - 265px);

  .history-items-root-container {
    height: 100%;
  }

  .history-items-container {
    height: calc(100%);
    overflow: auto;

    ${tw`dark:bg-black-2 bg-white rounded-b-[5px]`}

    color: ${({ theme }) => theme.text2};
  }
  .pair-container {
    ${tw`flex gap-x-1 items-center`}
  }
  .pair-container img {
    height: 24px;
    width: 24px;
  }

  .history-item {
    ${tw`grid grid-cols-5  items-center w-full !border-t-0 !border-l-0 !border-r-0
    w-full dark:border-b-black-4 border border-b-grey-4`}
   
    padding: 10px;
    font-size: 13px;
  }
  .history-item span:first-child {
    ${tw`pl-1`}
  }

  .pagination-container {
    height: 40px;
    border-radius: 5px;
  }
  .history-item:last-child {
    border-bottom: none;
  }
  .no-funding-found {
    max-width: 155px;
    display: flex;
    margin: auto;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
  .buy {
    color: #6ead57;
  }
  .filled {
    color: #6EAD57;
  }
  .sell {
    color: #f35355;
  }
`

const columns = ['Market', 'Direction', 'Position Size', 'Payment', 'Date']
type Pagination = {
  page: number
  limit: number
}
const FundingHistory: FC = () => {
  const { mode } = useDarkMode()

  const { connected, publicKey } = useWallet()

  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)

  const { isDevnet } = useCrypto()
  const { traderInfo } = useTraderConfig()
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20 })
  const [fundingHistory, setFundingHistory] = useState([])
  const [totalItemsCount, setTotalItemsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const { selectedCrypto, getAskSymbolFromPair } = useCrypto()
  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, selectedCrypto.type])

  const fetchFundingHistory = async () => {
    try {
      setIsLoading(true)
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
      setIsLoading(false)
    }
    catch(err){
      setIsLoading(false)
    }
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
        <DepositWithdrawDialog
          depositWithdrawModal={depositWithdrawModal}
          setDepositWithdrawModal={setDepositWithdrawModal}
        />
      )}
      <div className="flex justify-between items-center">
        <div>
          <InfoLabel>
            <h1>Funding</h1>
          </InfoLabel>
        </div>
        <div className="pagination-container">
          <Pagination pagination={pagination} setPagination={setPagination} totalItemsCount={totalItemsCount} />
        </div>
      </div>

      <div className="flex justify-between items-center">
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
      <div
        className="grid grid-cols-5 items-center rounded-t-[3px] px-2.5 bg-white
      dark:bg-black-2 w-full py-2 dark:border-b-black-4 border-b-grey-4 border border-l-0 border-r-0 border-t-0"
      >
        {columns.map((item, index) => (
          <ContentLabel className={index === columns.length - 1 ? 'text-right' : ''} key={index}>
            {item}
          </ContentLabel>
        ))}
      </div>

      <HISTORY>
        {fundingHistory.length > 0 && (
          <div className="history-items-root-container">
            <div className="history-items-container ">
              {fundingHistory.map((item) => (
                <div key={item._id} className="history-item">
                  <div className="pair-container">
                    <img src={`${assetIcon}`} alt="SOL icon" />
                    <span>{selectedCrypto.pair}</span>
                  </div>
                  <span className={item.averagePosition.side}>
                    {item.averagePosition.side === 'buy' ? 'Long' : 'Short'}
                    {item.averagePosition.side === undefined && ''}
                  </span>
                  <InfoLabelNunito className="text-[13px]">{item.averagePosition.quantity} SOL</InfoLabelNunito>
                  <InfoLabelNunito className="text-[13px]">
                    {Math.abs(item.fundingBalanceDifference / 10 ** (Number(item.fundingBalance.exp) + 5)) < 0.0001
                      ? '< 0.0001'
                      : item.fundingBalanceDifference / 10 ** (Number(item.fundingBalance.exp) + 5)}
                  </InfoLabelNunito>
                  <InfoLabelNunito className="text-[13px] text-right">
                    {convertUnixTimestampToFormattedDate(item.time * 1000)}
                  </InfoLabelNunito>
                </div>
              ))}
            </div>
          </div>
        )}
        {!isLoading && fundingHistory?.length === 0 && (
          <div className="no-funding-found">
            {/* <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-funding-found" /> */}
            <AccountsLabel className="text-[18px]  whitespace-nowrap mb-5">No Funding Found</AccountsLabel>
            {!connected && <Connect />}
            {connected && (
              <Button
                variant="primary"
                colorScheme={'secondaryGradient'}
                onClick={() => setDepositWithdrawModal(true)}
              >
                Deposit Now
              </Button>
            )}
          </div>
        )}
      </HISTORY>
    </WRAPPER>
  )
}
export default FundingHistory
