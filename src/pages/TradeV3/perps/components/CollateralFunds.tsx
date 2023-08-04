import { styled } from 'twin.macro'
import { Dropdown, Menu } from 'antd'
import { MarketType, useAccounts } from '../../../../context'
import { useMemo, FC, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { convertToFractional, displayFractional } from '../utils'
import { useTraderConfig } from '../../../../context/trader_risk_group'
import { PERPS_COLLATERAL } from '../perpsConstants'
import { Fractional } from '../dexterity/types'
import * as anchor from '@project-serum/anchor'

const WRAPPER = styled.div`
  .subheader {
    color: #8a8a8a;
    font-size: 15px;
    .highlight {
      color: darkgray;
    }
  }
  .input-row {
    display: flex;
  }
  .percentage {
    background: #131313;
    width: 280px;
    margin-left: auto;
    border-radius: 50px;
    display: flex;
  }
  .percentage-num {
    width: 25%;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.text20};
    cursor: pointer;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
  .selected {
    color: ${({ theme }) => theme.text1};
    border-radius: 105px;
    background-image: linear-gradient(105deg, #f7931a 6%, #ac1cc7 96%);
  }
  .submit-btn {
    margin: 24px auto 0;
    display: block;
    height: 50px;
    width: 222px;
    border-radius: 50px;
    color: ${({ theme }) => theme.text2};
    font-weight: 600;
    font-size: 15px;
    background: #5855ff;
    outline: none;
    border: none;
  }
`

const DROPDOWN_PAIR_DIV = styled.div`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-left: -5px;
  margin-right: -5px;
  .asset-icon {
    width: 28px;
    height: 28px;
  }
  .available-bal {
    margin-right: 15px;
  }
`

const SELECTED_COIN = styled.div`
  line-height: 40px;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.bg2};
  text-align: center;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 500;
  align-items: center;
  padding-left: 10px;
  color: ${({ theme }) => theme.text21};
  .anticon-down {
    margin-right: 10px;
    width: 14px;
  }
  .asset-icon {
    width: 28px;
    height: 28px;
  }
  .dropdown {
    display: flex;
    align-items: center;
    margin-right: 10px;
    .available-bal {
      margin-right: 15px;
    }
  }
`

const COIN_INFO = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
  > * {
    margin-right: 10px;
  }
  .market-add {
    color: ${({ theme }) => theme.text17};
    font-size: 16px;
  }
  .coin {
    font-size: 16px;
    font-weight: 600;
  }
`

const LABEL = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.text1};
  font-weight: 600;
  margin: 18px 0 10px;
`

const INPUT = styled.div`
  background: #131313;
  width: 280px;
  border-radius: 50px;
  padding: 15px;
  .input-amt {
    width: 80%;
    background: #131313;
    border: none;
    outline: none;
    color: ${({ theme }) => theme.text1};
    font-size: 16px;
    font-weight: 600;
    margin-right: auto;
  }
  .input-amt::placeholder {
    color: ${({ theme }) => theme.text17};
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
  .token {
    color: ${({ theme }) => theme.text1};
    font-size: 16px;
    font-weight: 600;
  }
`

export const CollateralFunds: FC<{ orderType: string }> = ({ orderType }) => {
  const { traderInfo } = useTraderConfig()
  const fractionalDeposit = traderInfo.traderRiskGroup
    ? traderInfo.traderRiskGroup.totalDeposited
    : new Fractional({ m: new anchor.BN(0), exp: new anchor.BN(0) })
  const stringDeposit = displayFractional(fractionalDeposit)
  const { balances } = useAccounts()
  const [depositAmount, setDepositAmount] = useState('0.00')
  const [withdrawAmount, setWithdrawAmount] = useState('0.00')
  const perpTokenList = PERPS_COLLATERAL
  const percentageArr = [25, 50, 75, 100]
  const defualtPerpToken = perpTokenList[0]
  const [percentageIndex, setPercentageindex] = useState(null)
  const [perpToken, setPerpToken] = useState(defualtPerpToken)
  const { depositFunds, withdrawFunds } = useTraderConfig()
  const truncateAddress = (address: string): string => `${address.substr(0, 5)}..${address.substr(-5, 5)}`
  const trunMarketAddress = truncateAddress(perpToken.marketAddress)
  const symbol = perpToken.token
  const tokenAmount = balances[perpToken.marketAddress]
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, perpToken.type])
  const handlePercentageChange = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setPercentageindex(index)
    let result = 0
    const availableAmount = orderType === 'deposit' ? tokenAmount.uiAmountString : stringDeposit
    if (index === 0) result = (+availableAmount * 25) / 100
    else if (index === 1) result = (+availableAmount * 50) / 100
    else if (index === 2) result = (+availableAmount * 75) / 100
    else result = +availableAmount
    orderType === 'deposit' ? setDepositAmount(String(result)) : setWithdrawAmount(String(result))
  }
  const handleInputChange = (e) => {
    let amount = e.target.value
    amount =
      amount.indexOf('.') >= 0
        ? amount.substr(0, amount.indexOf('.')) + amount.substr(amount.indexOf('.'), 5)
        : amount
    if (orderType === 'deposit') setDepositAmount(amount)
    else setWithdrawAmount(amount)
  }
  const handleSubmit = async () => {
    try {
      const amountToTrade = orderType === 'deposit' ? depositAmount : withdrawAmount
      const answer = convertToFractional(amountToTrade)
      orderType === 'deposit' ? depositFunds(answer) : withdrawFunds(answer)
    } catch (e) {
      console.log(e)
    }
  }
  const menus = (
    <Menu>
      {perpTokenList.map((item, index) => (
        <Menu.Item
          key={index}
          onClick={() => {
            setPerpToken(item)
          }}
        >
          <Tokens {...item} />
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <WRAPPER>
      <div className="subheader">
        There is a one-time cost of <span className="highlight">0.035 SOL</span> when you make your first{' '}
        {orderType === 'deposit' ? 'deposit.' : 'withdraw.'}
      </div>
      <LABEL>ASSET</LABEL>
      <Dropdown overlay={menus} trigger={['click']} placement="bottom" align={{ offset: [0, 10] }}>
        <SELECTED_COIN>
          <COIN_INFO>
            <img className="asset-icon" src={assetIcon} alt="coin-icon" />
            <div className="coin">{symbol}</div>
            <div className="market-add">{trunMarketAddress}</div>
          </COIN_INFO>
          <div className="dropdown">
            <div className="available-bal">
              {orderType === 'deposit' ? (tokenAmount ? tokenAmount.uiAmountString : '0.00') : stringDeposit}
            </div>
            <DownOutlined />
          </div>
        </SELECTED_COIN>
      </Dropdown>
      <LABEL>Amount</LABEL>
      <div className="input-row">
        <INPUT>
          <input
            className="input-amt"
            placeholder="0.00"
            type="number"
            value={orderType === 'deposit' ? depositAmount : withdrawAmount}
            onChange={handleInputChange}
          />
          <span className="token">{perpToken.token}</span>
        </INPUT>
        <div className="percentage">
          {percentageArr.map((elem, index) => (
            <div
              className={percentageIndex === index ? 'percentage-num selected' : 'percentage-num'}
              onClick={(e) => {
                handlePercentageChange(e, index)
              }}
              key={index}
            >
              {elem}%
            </div>
          ))}
        </div>
      </div>
      <button className="submit-btn" onClick={handleSubmit}>
        {orderType === 'deposit' ? 'Deposit' : 'Withdraw'}
      </button>
    </WRAPPER>
  )
}

const Tokens: FC<{ token: string; type: MarketType; marketAddress: string }> = ({
  token,
  type,
  marketAddress
}) => {
  const { balances } = useAccounts()
  const symbol = token
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, type])
  const truncateAddress = (address: string): string => `${address.substr(0, 5)}..${address.substr(-5, 5)}`
  const truncMarketAddress = truncateAddress(marketAddress)
  const tokenAmount = balances[marketAddress]
  return (
    <DROPDOWN_PAIR_DIV>
      <COIN_INFO>
        <img className="asset-icon" src={assetIcon} alt="coin-icon" />
        <div className="coin">{symbol}</div>
        <div className="market-add">{truncMarketAddress}</div>
      </COIN_INFO>
      <div className="available-bal">{tokenAmount ? tokenAmount.uiAmountString : '0.00'}</div>
    </DROPDOWN_PAIR_DIV>
  )
}
