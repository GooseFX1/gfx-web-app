import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto, useDarkMode } from '../../../../context'
import { Connect } from '../../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'
import { ModalHeader, SETTING_MODAL } from '../../../TradeV3/InfoBanner'
import { DepositWithdraw } from '../../../TradeV3/perps/DepositWithdraw'
import { GET_USER_FUND_TRANSFERS } from '../../../TradeV3/perps/perpsConstants'
import { httpClient } from '../../../../api'
import { Pagination } from '../Pagination'
import { convertUnixTimestampToFormattedDate } from '../../../TradeV3/perps/utils'

const WRAPPER = styled.div`
  ${tw`flex flex-col w-full`}
  padding: 5px;
  h1 {
    font-size: 18px;
    color: ${({ theme }) => theme.text2};
  }
`

const HISTORY = styled.div`
  ${tw`flex w-full h-full mt-[15px]`}

  .history-items-root-container {
    ${tw`w-full h-full overflow-auto`}
  }
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
    height: 130px;
  }
  .history-item:first-child {
    border-top: 1px solid #3c3c3c;
    border-radius: 5px 5px 0px 0px;
  }

  .history-item:last-child {
    border-radius: 0px 0px 5px 5px;
  }
  .no-deposits-found {
    display: flex;
    margin: auto;
    border-radius: 5px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #3c3c3c;
    width: 100%;
    height: calc(100vh - 160px);
  }
  .no-deposits-found > p {
    margin: 0;
    margin-top: 15px;
    margin-bottom: 15px;
    color: ${({ theme }) => theme.text2};
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

type Pagination = {
  page: number
  limit: number
}
const MobileDepositWithdrawHistory: FC = () => {
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
      <h1>Deposits/Withdrawals</h1>
      <HISTORY>
        {fundTransfers.length ? (
          <div className="history-items-root-container">
            <div className="history-items-container">
              {fundTransfers.map((transfer) => (
                <div key={transfer._id} className="history-item">
                  <div className="flex">
                    <span>Amount</span>
                    <span className="ml-auto">{transfer.amount.toFixed(2)} USDC</span>
                  </div>
                  <div className="flex">
                    <span>Notional</span>
                    <span className="ml-auto">${transfer.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex">
                    <span>Type</span>
                    <span className={`${transfer.type}-type ml-auto`}>
                      {transfer.type.charAt(0).toUpperCase() + transfer.type.slice(1)}
                    </span>
                  </div>
                  <div className="flex">
                    <span>Date</span>
                    <span className="ml-auto">{convertUnixTimestampToFormattedDate(transfer.time)}</span>
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
    </WRAPPER>
  )
}

export default MobileDepositWithdrawHistory
