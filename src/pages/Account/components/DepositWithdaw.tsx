import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto, useDarkMode } from '../../../context'
import { Connect } from '../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'
import { ModalHeader, SETTING_MODAL } from '../../TradeV3/InfoBanner'
import { DepositWithdraw } from '@/pages/TradeV3/perps/DepositWithdrawNew'
import { GET_USER_FUND_TRANSFERS } from '../../TradeV3/perps/perpsConstants'
import { httpClient } from '../../../api'
import { Pagination } from './Pagination'
import { convertUnixTimestampToFormattedDate } from '../../TradeV3/perps/utils'
import { ContentLabel, InfoLabel } from '@/pages/TradeV3/perps/components/PerpsGenericComp'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WRAPPER = styled.div`
  ${tw`flex flex-col w-full overflow-hidden`}
  padding: 15px;
  h1 {
    font-size: 18px;
    color: ${({ theme }) => theme.text2};
  }
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const HISTORY = styled.div`
  ${tw`flex flex-col w-full h-full`}
  /* border-top: 1px solid #3c3c3c; */
  border-top: none;
  height: calc(100vh - 180px);

  .history-items-root-container {
    height: 100%;
  }
  .history-items-container {
    height: calc(100% - 40px);
    overflow: auto;
    color: ${({ theme }) => theme.text2};
  }

  .history-items-container div:last-child {
    border-bottom: none;
  }

  .history-item {
    ${tw`grid grid-cols-4 gap-x-40 items-center w-full`}
    padding: 10px;
    font-size: 13px;
    border-bottom: 1px solid #3c3c3c;
  }
  .history-item span:first-child {
    ${tw`pl-1`}
  }
  .no-deposits-found {
    max-width: 155px;
    display: flex;
    margin: auto;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .no-deposits-found > p {
    margin: 0;
    margin-top: 15px;
    margin-bottom: 15px;
    color: #636363;
    font-size: 15px;
    font-weight: 600;
  }

  .pagination-container {
    height: 40px;
  }
  .deposit {
    background: linear-gradient(97deg, #f7931a 4.25%, #ac1cc7 97.61%);
    border-radius: 70px;
    padding: 3px 18px;
    font-size: 15px;
    font-weight: 600;
  }
  .deposit-type {
    color: #80ce00;
  }
  .withdraw-type {
    color: #f35355;
  }
`

const columns = ['Amount', 'Notional', 'Type', 'Date']
type Pagination = {
  page: number
  limit: number
}
const DepositWithdrawHistory: FC = () => {
  const { mode } = useDarkMode()

  const { connected, publicKey } = useWallet()
  const { isDevnet } = useCrypto()

  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)

  const [tradeType, setTradeType] = useState<string>('deposit')
  const [fundTransfers, setFundTransfers] = useState([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20 })
  const [totalItemsCount, setTotalItemsCount] = useState(0)

  const fetchFundTransfers = async () => {
    const res = await httpClient('api-services').get(`${GET_USER_FUND_TRANSFERS}`, {
      params: {
        API_KEY: 'zxMTJr3MHk7GbFUCmcFyFV4WjiDAufDp',
        devnet: isDevnet,
        walletAddress: publicKey.toString(),
        page: pagination.page,
        limit: pagination.limit
      }
    })
    setFundTransfers(res.data.data)
    setTotalItemsCount(res.data.totalCount)
  }
  useEffect(() => {
    fetchFundTransfers()
  }, [connected, publicKey, pagination])

  return (
    <div className="flex flex-col w-full p-[15px] !pb-0">
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
      <InfoLabel>
        <h3 className="mb-4">Deposits/Withdrawals</h3>
      </InfoLabel>
      <div
        className="grid grid-cols-4 gap-x-40 items-center rounded-t-[3px] px-2.5 bg-white
      dark:bg-black-2 w-full py-2 dark:border-b-black-4 border-grey-4 border border-l-0 border-r-0 border-t-0"
      >
        {columns.map((item, index) => (
          <ContentLabel className="h-5" key={index}>
            {item}
          </ContentLabel>
        ))}
      </div>

      <HISTORY>
        {fundTransfers.length ? (
          <div className="history-items-root-container">
            <div className="history-items-container">
              {fundTransfers.map((transfer) => (
                <div
                  key={transfer._id}
                  className="grid grid-cols-4 gap-x-40 items-center w-full p-2.5 
                border dark:border-b-black-4 border-b-grey-4 border-l-0 border-r-0 border-t-0
                dark:bg-black-2 bg-white"
                >
                  <InfoLabel>
                    {' '}
                    <p className="text-[13px]">{transfer.amount.toFixed(2)} USDC</p>{' '}
                  </InfoLabel>
                  <InfoLabel>
                    <p className="text-[13px]"> ${transfer.amount.toFixed(2)}</p>{' '}
                  </InfoLabel>
                  <InfoLabel className={transfer.type === 'deposit' ? '!text-green-4' : '!text-red-2'}>
                    <p className="text-[13px]">{transfer.type.charAt(0).toUpperCase() + transfer.type.slice(1)}</p>
                  </InfoLabel>
                  <InfoLabel>
                    <p className="text-[13px]">{convertUnixTimestampToFormattedDate(transfer.time)}</p>
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
          <div className="no-deposits-found">
            <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-deposits-found" />
            <p>No Deposits Found</p>
            {!connected && <Connect />}
            {connected && (
              <button onClick={() => setDepositWithdrawModal(true)} className="deposit">
                Deposit Now
              </button>
            )}
          </div>
        )}
      </HISTORY>
    </div>
  )
}

export default DepositWithdrawHistory
