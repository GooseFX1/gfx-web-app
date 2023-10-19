import { FC, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useDarkMode } from '../../../context'
import { Connect } from '../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'
import { ModalHeader, SETTING_MODAL } from '../../TradeV3/InfoBanner'

import { DepositWithdraw } from '../../TradeV3/perps/DepositWithdraw'

const WRAPPER = styled.div`
  ${tw`flex flex-col w-full`}
  margin: 15px;
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

const ACCOUNTHEADER = styled.div`
    ${tw`flex justify-between items-center flex-nowrap w-full`}
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
  ${tw`flex items-center justify-center w-full h-full`}
  border:1px solid #3C3C3C;

  .no-balances-found {
    max-width: 155px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .no-balances-found > p {
    margin: 0;
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
`

const columns = ['Asset', 'Balance', 'Liq.Price', 'Action']
const AccountOverview: FC = () => {
  const { mode } = useDarkMode()

  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)

  const [tradeType, setTradeType] = useState<string>('deposit')

  const { connected } = useWallet()
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
      <h1>Account Overview</h1>
      <ACCOUNTVALUESFLEX>
        <ACCOUNTVALUESCONTAINER>
          <ACCOUNTVALUE>
            <p>My Portfolio Value:</p>
            <p>$0.00</p>
          </ACCOUNTVALUE>
        </ACCOUNTVALUESCONTAINER>
        <ACCOUNTVALUESCONTAINER>
          <ACCOUNTVALUE>
            <p>My 24h Trading Volume:</p>
            <p>$0.00</p>
          </ACCOUNTVALUE>
        </ACCOUNTVALUESCONTAINER>
        <ACCOUNTVALUESCONTAINER>
          <ACCOUNTVALUE>
            <p>My Total Trading Volume:</p>
            <p>$0.00</p>
          </ACCOUNTVALUE>
        </ACCOUNTVALUESCONTAINER>
      </ACCOUNTVALUESFLEX>
      <ACCOUNTHEADER>
        {columns.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </ACCOUNTHEADER>
      <HISTORY>
        <div className="no-balances-found">
          <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-balances-found" />
          <p>No Balances Found</p>
          {!connected && <Connect />}
          {connected && (
            <button onClick={() => setDepositWithdrawModal(true)} className="deposit">
              Deposit Now
            </button>
          )}
        </div>
      </HISTORY>
    </WRAPPER>
  )
}

export default AccountOverview
