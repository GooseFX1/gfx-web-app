import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto, useDarkMode } from '../../../context'
import { Connect } from '../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'
import { ModalHeader, SETTING_MODAL } from '../../TradeV3/InfoBanner'
import { DepositWithdraw } from '../../TradeV3/perps/DepositWithdraw'
import { GET_USER_FUND_TRANSFERS } from '../../TradeV3/perps/perpsConstants'
import { httpClient } from '../../../api'

const WRAPPER = styled.div`
  ${tw`flex flex-col w-full`}
  margin: 15px;
  h1 {
    font-size: 18px;
  }
`

const ACCOUNTHEADER = styled.div`
    ${tw`grid grid-cols-4 gap-x-40 items-center w-full`}
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
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid #3c3c3c;
  }
  .pagination-container > div {
    margin-right: 10px;
    margin-top: 10px;
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
  }
  useEffect(() => {
    fetchFundTransfers()
    console.log(setPagination)
  }, [connected, publicKey])

  function convertUnixTimestampToFormattedDate(unixTimestamp: number) {
    // Create a new Date object using the Unix timestamp (in milliseconds)
    const date = new Date(unixTimestamp)

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
      <h1>Deposits/Withdrawals</h1>
      <ACCOUNTHEADER>
        {columns.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </ACCOUNTHEADER>
      <HISTORY>
        {fundTransfers.length ? (
          <div>
            <div className="history-items-container">
              {fundTransfers.map((transfer) => (
                <div key={transfer._id} className="history-item">
                  <span>{transfer.amount.toFixed(2)} USDC</span>
                  <span>${transfer.amount.toFixed(2)}</span>
                  <span className={`${transfer.type}-type`}>
                    {transfer.type.charAt(0).toUpperCase() + transfer.type.slice(1)}
                  </span>
                  <span>{convertUnixTimestampToFormattedDate(transfer.time)}</span>
                </div>
              ))}
            </div>
            {/* <div className="pagination-container"> */}
            {/*   <div> */}
            {/*     <p>1 of 20 Transactions</p> */}
            {/*   </div> */}
            {/* </div> */}
          </div>
        ) : (
          <div className="no-deposits-found">
            <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-deposits-found" />
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

export default DepositWithdrawHistory
