import { Dispatch, SetStateAction } from 'react'
import tw, { styled } from 'twin.macro'
import { Dropdown, Menu } from 'antd'
import { MarketType, useAccounts, useDarkMode } from '../../../context'
import { useMemo, FC, useState } from 'react'
import { convertToFractional } from './utils'
import { useTraderConfig } from '../../../context/trader_risk_group'
import { PERPS_COLLATERAL } from './perpsConstants'
import 'styled-components/macro'

const WRAPPER = styled.div`
  .input-row {
    ${tw`flex flex-row h-12.5`}
  }

  .percentage {
    ${tw`w-[280px] ml-auto rounded-circle flex flex-row`}
    background: ${({ theme }) => theme.bg22};
  }

  .percentage-num {
    ${tw`w-1/4 font-semibold cursor-pointer flex flex-row items-center justify-center h-full text-[16px]`}
    color: ${({ theme }) => theme.text35};
  }

  .selected {
    ${tw`rounded-half text-white`}
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
  ${tw`h-10 flex justify-between items-center text-sm -mx-1`}
  .asset-icon {
    ${tw`h-7 w-7`}
  }
  .available-bal {
    ${tw`mr-3.75 text-[16px] font-semibold`}
  }
`

const SELECTED_COIN = styled.div`
  ${tw`leading-[40px] rounded-[36px] flex items-center text-center cursor-pointer pl-3 font-medium text-[16px]`}
  background-color: ${({ theme }) => theme.bg22};
  .anticon-down {
    ${tw`mr-1.5 w-3.5`}
  }
  .asset-icon {
    ${tw`h-7 w-7`}
  }

  .dropdown {
    ${tw`flex items-center mr-2.5`}

    .available-bal {
      ${tw`mr-3.75 text-[16px] font-semibold`}
      color: ${({ theme }) => theme.text28};
    }
  }
`

const COIN_INFO = styled.div`
  ${tw`flex items-center mr-auto`}

  > * {
    ${tw`mr-2.5`}
  }

  .market-add {
    ${tw`text-[16px] font-semibold`}
    color: ${({ theme }) => theme.text36};
  }

  .coin {
    ${tw`text-[16px] font-semibold`}
    color: ${({ theme }) => theme.text11};
  }
`

const LABEL = styled.div`
  ${tw`text-[20px] font-semibold mx-0 mb-2.5 mt-4.5`}
  color: ${({ theme }) => theme.text1};
`

const INPUT = styled.div`
  ${tw`w-[280px] rounded-circle py-2.5 px-5`}
  background: ${({ theme }) => theme.bg22};

  .input-amt {
    ${tw`w-4/5 border-0 border-none text-[16px] font-semibold mr-auto`}
    outline: none;
    background: ${({ theme }) => theme.bg22};
    color: ${({ theme }) => theme.text28};
  }

  .input-amt::placeholder {
    color: ${({ theme }) => theme.text35};
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    ${tw`m-0`}
    -webkit-appearance: none;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
  .token {
    ${tw`text-[16px] font-semibold`}
    color: ${({ theme }) => theme.text11}
  }
`

export const DepositWithdraw: FC<{
  tradeType: string
  setDepositWithdrawModal: Dispatch<SetStateAction<boolean>>
}> = ({ tradeType, setDepositWithdrawModal }) => {
  const { balances } = useAccounts()
  const { traderInfo } = useTraderConfig()
  const { mode } = useDarkMode()
  const [amount, setAmount] = useState('')
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
  const assetIcon = useMemo(
    () => `/img/crypto/${perpToken.type === 'synth' ? `g${symbol}` : symbol}.svg`,
    [symbol, perpToken.type]
  )
  const handlePercentageChange = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setPercentageindex(index)
    if (tradeType === 'deposit') {
      if (!tokenAmount || !tokenAmount.uiAmountString) {
        setAmount('0.00')
        return
      }
      let result = 0
      if (index === 0) result = (+tokenAmount.uiAmountString * 25) / 100
      else if (index === 1) result = (+tokenAmount.uiAmountString * 50) / 100
      else if (index === 2) result = (+tokenAmount.uiAmountString * 75) / 100
      else result = +tokenAmount.uiAmountString
      setAmount(String(result))
    } else {
      const avail = traderInfo.marginAvailable
      if (!avail) {
        setAmount('0.00')
        return
      }
      let result = 0
      if (index === 0) result = (+avail * 25) / 100
      else if (index === 1) result = (+avail * 50) / 100
      else if (index === 2) result = (+avail * 75) / 100
      else result = +avail
      setAmount(result.toFixed(2))
    }
  }
  const handleInputChange = (e) => {
    const t = e.target.value
    if (!isNaN(+t)) {
      e.target.value = t.indexOf('.') >= 0 ? t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 5) : t
      setAmount(e.target.value)
    }
  }
  const handleSubmit = async () => {
    try {
      const answer = convertToFractional(amount)
      const response = tradeType === 'deposit' ? await depositFunds(answer) : await withdrawFunds(answer)
      if (response && response.txid) setDepositWithdrawModal(false)
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
      <div tw="flex flex-row items-center justify-between">
        <LABEL>Asset</LABEL>
        {tradeType === 'deposit' && (
          <span tw="text-regular font-semibold dark:text-grey-2 text-grey-1 mt-3.75">
            {' '}
            Deposit Limit: $1,000,000.00{' '}
          </span>
        )}
      </div>
      <Dropdown overlay={menus} trigger={['click']} placement="bottom" align={{ offset: [0, 10] }}>
        <SELECTED_COIN>
          <COIN_INFO>
            <img className="asset-icon" src={assetIcon} alt="coin-icon" />
            <div className="coin">{symbol}</div>
            <div className="market-add">{trunMarketAddress}</div>
          </COIN_INFO>
          <div className="dropdown">
            <div className="available-bal">
              {tradeType === 'deposit'
                ? tokenAmount && tokenAmount.uiAmountString
                  ? tokenAmount.uiAmountString
                  : '0.00'
                : traderInfo.marginAvailable
                ? traderInfo.marginAvailable
                : '0.00'}
            </div>
            <img
              src={mode === 'lite' ? '/img/assets/arrow.svg' : '/img/assets/arrow-down.svg'}
              alt="arrow-icon"
              height="8"
              width="16"
            />
          </div>
        </SELECTED_COIN>
      </Dropdown>
      <LABEL>Amount</LABEL>
      <div className="input-row">
        <INPUT>
          <input
            className="input-amt"
            placeholder="0.00"
            type="text"
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
      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={
          tradeType !== 'deposit'
            ? !traderInfo.marginAvailable || +traderInfo.marginAvailable < +amount || !amount
            : !tokenAmount || !tokenAmount.uiAmountString || +tokenAmount.uiAmountString < +amount || !amount
        }
      >
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
