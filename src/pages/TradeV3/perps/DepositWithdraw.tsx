import tw, { styled } from 'twin.macro'
import { Dropdown, Menu } from 'antd'
import { MarketType, useAccounts } from '../../../context'
import { useMemo, FC, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { convertToFractional } from './utils'
import { useTraderConfig } from '../../../context/trader_risk_group'
import { PERPS_COLLATERAL } from './perpsConstants'

const WRAPPER = styled.div`
  .input-row {
    ${tw`flex flex-row h-[50px]`}
  }

  .percentage {
    ${tw`w-[280px] ml-auto rounded-circle flex flex-row`}
    background: ${({ theme }) => theme.bg12};
  }

  .percentage-num {
    ${tw`w-1/4 font-semibold cursor-pointer flex flex-row items-center justify-center h-full`}
    font-size: 16px;
    color: ${({ theme }) => theme.text20};
  }

  .selected {
    ${tw`rounded-half`}
    color: ${({ theme }) => theme.text1};
    background-image: linear-gradient(105deg, #f7931a 6%, #ac1cc7 96%);
  }

  .submit-btn {
    ${tw`block h-[50px] w-[222px] rounded-circle mx-auto mt-6 mb-0 font-semibold 
      text-tiny border-0 border-none bg-[#5855ff]`}
    color: ${({ theme }) => theme.text2};
    outline: none;
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
  padding: 10px 20px;

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

export const DepositWithdraw: FC<{ tradeType: string }> = ({ tradeType }) => {
  const { balances } = useAccounts()
  const [amount, setAmount] = useState('0.00')
  const perpTokenList = PERPS_COLLATERAL
  const percentageArr = [25, 50, 75, 100]
  const defualtPerpToken = perpTokenList[0]
  const [percentageIndex, setPercentageindex] = useState(null)
  const [perpToken, setPerpToken] = useState(defualtPerpToken)
  const { depositFunds } = useTraderConfig()
  const truncateAddress = (address: string): string => `${address.substr(0, 5)}..${address.substr(-5, 5)}`
  const trunMarketAddress = truncateAddress(perpToken.marketAddress)
  const symbol = perpToken.token
  const tokenAmount = balances[perpToken.marketAddress]
  const assetIcon = useMemo(
    () => `/img/crypto/${perpToken.type === 'synth' ? `g${symbol}` : symbol}.svg`,
    [symbol, perpToken.type]
  )
  const handlePercentageChange = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setPercentageindex(index)
    if (!tokenAmount) {
      setAmount('0.00')
      return
    }
    let result = 0
    if (index === 0) result = (+tokenAmount.uiAmountString * 25) / 100
    else if (index === 1) result = (+tokenAmount.uiAmountString * 50) / 100
    else if (index === 2) result = (+tokenAmount.uiAmountString * 75) / 100
    else result = +tokenAmount.uiAmountString
    setAmount(String(result))
  }
  const handleInputChange = (e) => {
    const t = e.target.value
    e.target.value = t.indexOf('.') >= 0 ? t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 5) : t
    setAmount(e.target.value)
  }
  const handleSubmit = async () => {
    try {
      const answer = convertToFractional(amount)
      const response = await depositFunds(answer)
      console.log(response)
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
      <LABEL>Asset</LABEL>
      <Dropdown overlay={menus} trigger={['click']} placement="bottom" align={{ offset: [0, 10] }}>
        <SELECTED_COIN>
          <COIN_INFO>
            <img className="asset-icon" src={assetIcon} alt="coin-icon" />
            <div className="coin">{symbol}</div>
            <div className="market-add">{trunMarketAddress}</div>
          </COIN_INFO>
          <div className="dropdown">
            <div className="available-bal">{tokenAmount ? tokenAmount.uiAmountString : '0.00'}</div>
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
            value={amount}
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
        {tradeType === 'deposit' ? 'Deposit' : 'Withdraw'}
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
  const assetIcon = useMemo(() => `/img/crypto/${type === 'synth' ? `g${symbol}` : symbol}.svg`, [symbol, type])
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
