import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto } from '../../../../context'
import { useWallet } from '@solana/wallet-adapter-react'
import { GET_USER_FUND_TRANSFERS } from '../../../TradeV3/perps/perpsConstants'
import { httpClient } from '../../../../api'
import { Pagination } from '../Pagination'
import { convertUnixTimestampToFormattedDate } from '../../../TradeV3/perps/utils'
import { ContentLabel, InfoLabelNunito } from '@/pages/TradeV3/perps/components/PerpsGenericComp'
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
  ${tw`flex w-full h-full mt-[15px] bg-white dark:bg-black-2 w-[calc(100vw - 20px)] ml-2.5 
  rounded-[3px]`}

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
    ${tw`flex flex-col w-full justify-between  p-2.5 `}
    /* padding: 10px; */
    color: ${({ theme }) => theme.text2};
    font-size: 13px;
    border-top: none;
    /* height: 107px; */
  }
  .history-item:first-child {
    /* border-top: 1px solid #3c3c3c; */
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
    color: #6ead57;
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
  const { connected, publicKey } = useWallet()
  const { isDevnet } = useCrypto()

  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)

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
        <DepositWithdrawDialog
          depositWithdrawModal={depositWithdrawModal}
          setDepositWithdrawModal={setDepositWithdrawModal}
        />
      )}
      <InfoLabelNunito className="ml-2.5 mt-[15px]">
        <h3>Deposits/Withdrawals</h3>
      </InfoLabelNunito>
      <HISTORY>
        {fundTransfers.length ? (
          <div className="history-items-root-container">
            <div className="history-items-container overflow-y-auto h-[calc(100vh - 275px)]">
              {fundTransfers.map((transfer) => (
                <>
                  {' '}
                  <div key={transfer._id} className="history-item">
                    <div className="flex ">
                      <ContentLabel className="text-[15px]">Amount</ContentLabel>
                      <span className="ml-auto">
                        <InfoLabelNunito className="text-[15px]">
                          {' '}
                          {transfer.amount.toFixed(2)} USDC
                        </InfoLabelNunito>
                      </span>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Notional</ContentLabel>
                      <span className="ml-auto">
                        <InfoLabelNunito className="text-[15px]">${transfer.amount.toFixed(2)}</InfoLabelNunito>
                      </span>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Type</ContentLabel>
                      <span className={` ml-auto`}>
                        <InfoLabelNunito className={`text-[15px] ${transfer.type}-type`}>
                          {transfer.type.charAt(0).toUpperCase() + transfer.type.slice(1)}
                        </InfoLabelNunito>
                      </span>
                    </div>
                    <div className="flex mt-[5px]">
                      <ContentLabel className="text-[15px]">Date</ContentLabel>
                      <span className="ml-auto">
                        <InfoLabelNunito className="text-[15px]">
                          {convertUnixTimestampToFormattedDate(transfer.time)}
                        </InfoLabelNunito>
                      </span>
                    </div>
                  </div>
                  <BorderLine className="mt-0  ml-2.5 mr-2.5 " />
                </>
              ))}
            </div>

          </div>
        ) : (

          <div className='history-item h-[calc(100vh - 270px)]'>
            <NoPositionFound
              str='No Deposits Found'
              connected={connected}
              setDepositWithdrawModal={setDepositWithdrawModal}
            />
          </div>


        )}
      </HISTORY>
      <div className="h-[50px]">
        <Pagination
          pagination={pagination}
          setPagination={setPagination}
          totalItemsCount={totalItemsCount}
        />
      </div>
    </WRAPPER>
  )
}

export default MobileDepositWithdrawHistory
