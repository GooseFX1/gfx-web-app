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
import { Button } from 'gfx-component-lib'
import { DepositWithdrawDialog } from '@/pages/TradeV3/perps/DepositWithdraw'

const WRAPPER = styled.div`
  ${tw`flex flex-col w-full`}
  padding: 15px;
  h1 {
    font-size: 18px;
    color: ${({ theme }) => theme.text2};
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
  color: ${({ theme }) => theme.text2};
  background: ${({ theme }) => theme.bg2};
  padding: 5px;
  p {
    margin: 0px;
    font-size: 13px;
  }
  p:last-child {
    font-size: 15px;
  }
`

const ACCOUNTHEADER = styled.div`
  /* ${tw`flex justify-between items-center flex-nowrap w-full`} */

  ${tw`grid grid-cols-5  items-center w-full`}
  border: 1px solid #3C3C3C;
  border-bottom: none;
  margin-top: 10px;
  color: ${({ theme }) => theme.text2};
  span {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  span:first-child {
    ${tw`pl-3`}
  }
  span:last-child {
    ${tw`pr-16`}
  }
`

const HISTORY = styled.div`
  ${tw`flex flex-col w-full h-full`}
  border: 1px solid #3c3c3c;
  height: calc(100vh - 222px);

  .history-items-root-container {
    height: 100%;
  }

  .history-items-container {
    height: calc(100% - 40px);
    overflow: auto;
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
    ${tw`grid grid-cols-5  items-center w-full`}
    padding: 10px;
    font-size: 13px;
    border-bottom: 1px solid #3c3c3c;
  }
  .history-item span:first-child {
    ${tw`pl-1`}
  }

  .pagination-container {
    height: 40px;
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
    color: #80ce00;
  }
  .filled {
    color: #80ce00;
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
        <DepositWithdrawDialog
          depositWithdrawModal={depositWithdrawModal}
          setDepositWithdrawModal={setDepositWithdrawModal}
        />
      )}
      <h1>Funding</h1>
      <ACCOUNTVALUESFLEX>
        <ACCOUNTVALUESCONTAINER>
          <ACCOUNTVALUE>
            <p>Cumulative Funding:</p>
            {getCumulativeFunding().toString().indexOf('.') != -1 ? (
              <Tooltip
                color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}
                infoIcon={false}
                title={getCumulativeFunding()}
              >
                <span>{getCumulativeFunding().toFixed(2)}</span>
              </Tooltip>
            ) : (
              <span>{getCumulativeFunding()}</span>
            )}
          </ACCOUNTVALUE>
        </ACCOUNTVALUESCONTAINER>
      </ACCOUNTVALUESFLEX>
      <ACCOUNTHEADER>
        {columns.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </ACCOUNTHEADER>
      <HISTORY>
        {fundingHistory.length ? (
          <div className="history-items-root-container">
            <div className="history-items-container">
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
                  <span>{item.averagePosition.quantity} SOL</span>
                  <span>
                    {Math.abs(item.fundingBalanceDifference / 10 ** (Number(item.fundingBalance.exp) + 5)) < 0.0001
                      ? '< 0.0001'
                      : item.fundingBalanceDifference / 10 ** (Number(item.fundingBalance.exp) + 5)}
                  </span>
                  <span>{convertUnixTimestampToFormattedDate(item.time * 1000)}</span>
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
