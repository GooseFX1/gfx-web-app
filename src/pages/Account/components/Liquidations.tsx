import React, { FC, useState } from 'react'
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

const ACCOUNTHEADER = styled.div`
    ${tw`flex justify-between items-center flex-nowrap w-full`}
    border: 1px solid #3C3C3C;
    border-bottom: none;
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

  .no-liquidations-found {
    max-width: 179px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .no-liquidations-found > p {
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
`

const columns = ['Market', 'Direction', 'Position Size', 'Entry Price', 'Liq. Price']
const Liquidations: FC = () => {
  const { mode } = useDarkMode()

  const { connected } = useWallet()

  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)

  const [tradeType, setTradeType] = useState<string>('deposit')
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
      <h1>Liquidations</h1>
      <ACCOUNTHEADER>
        {columns.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </ACCOUNTHEADER>
      <HISTORY>
        <div className="no-liquidations-found">
          <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-liquidations-found" />
          <p>No Liquidations Found</p>
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

export default Liquidations
