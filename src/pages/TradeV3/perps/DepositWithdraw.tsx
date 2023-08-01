import { Dispatch, SetStateAction, useEffect } from 'react'
import tw, { styled } from 'twin.macro'
import { Dropdown, Menu } from 'antd'
import { MarketType, useAccounts, useCrypto, useDarkMode } from '../../../context'
import { useMemo, FC, useState } from 'react'
import { convertToFractional } from './utils'
import { useTraderConfig } from '../../../context/trader_risk_group'
import { PERPS_COLLATERAL } from './perpsConstants'
import { PERPS_COLLATERAL as PERPS_COLLATERAL_DEVNET } from './perpsConstantsDevnet'
import 'styled-components/macro'
import { checkMobile } from '../../../utils'

const WRAPPER = styled.div`
  .input-row {
    ${tw`flex flex-row h-12.5 sm:block sm:w-full sm:h-auto`}
  }
  .deposit {
    ${tw`text-regular font-semibold mt-3.75 sm:text-tiny`}
    color: ${({ theme }) => theme.text37};
  }
  .percentage {
    ${tw`w-[280px] ml-auto rounded-circle flex flex-row sm:w-full sm:mb-[25px] sm:h-[45px]`}
    background: ${({ theme }) => theme.bg22};
  }

  .percentage-num {
    ${tw`w-1/4 font-semibold cursor-pointer flex flex-row items-center 
    justify-center h-full text-[16px] sm:text-regular text-grey-1`}
  }

  .selected {
    ${tw`rounded-half text-grey-5`}
    background-image: linear-gradient(105deg, #f7931a 6%, #ac1cc7 96%);
  }

  .submit-btn {
    ${tw`block h-12.5 w-[222px] rounded-circle mx-auto my-3.5 font-semibold 
      text-average border-0 border-none bg-blue-1 sm:h-[45px] sm:w-full`}
    color: ${({ theme }) => theme.white};
    outline: none;
  }
  .disabled {
    background-color: ${({ theme }) => theme.bg22};
    color: ${({ theme }) => theme.text28};
  }
`

const DROPDOWN_PAIR_DIV = styled.div`
  ${tw`h-10 flex justify-between items-center text-sm -mx-1`}
  .asset-icon {
    ${tw`h-7 w-7`}
  }
  .available-bal {
    ${tw`mr-3.75 text-[16px] font-semibold sm:text-regular`}
  }
`

const SELECTED_COIN = styled.div`
  ${tw`h-[45px] rounded-[36px] flex items-center text-center cursor-pointer pl-3 font-medium text-[16px]`}
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
      ${tw`mr-3.75 text-[16px] font-semibold sm:text-regular`}
      color: ${({ theme }) => theme.text32};
    }
  }
`

const COIN_INFO = styled.div`
  ${tw`flex items-center mr-auto h-12.5`}

  > * {
    ${tw`mr-2.5`}
  }

  .market-add {
    ${tw`text-[16px] font-semibold sm:text-tiny`}
    color: ${({ theme }) => theme.text36};
  }

  .coin {
    ${tw`text-[16px] font-semibold sm:text-regular`}
    color: ${({ theme }) => theme.text11};
  }
`

const LABEL = styled.div`
  ${tw`text-lg font-semibold mx-0 mb-2.5 mt-4.5 sm:text-regular sm:mb-2 sm:mt-3.75`}
  color: ${({ theme }) => theme.text11};
`

const INPUT = styled.div`
  ${tw`w-[280px] rounded-circle py-2.5 px-5 sm:w-full sm:mb-[25px] sm:h-[45px]`}
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
    ${tw`text-[16px] font-semibold sm:text-regular`}
    color: ${({ theme }) => theme.text11}
  }
`

export const DepositWithdraw: FC<{
  tradeType: string
  setDepositWithdrawModal: Dispatch<SetStateAction<boolean>>
}> = ({ tradeType, setDepositWithdrawModal }) => {
  const { devnetBalances: devnetbalances, balances: mainnetBalances } = useAccounts()
  const { isDevnet } = useCrypto()
  const { traderInfo } = useTraderConfig()
  const { mode } = useDarkMode()
  const [amount, setAmount] = useState('')
  const perpTokenList = isDevnet ? PERPS_COLLATERAL_DEVNET : PERPS_COLLATERAL
  const percentageArr = [25, 50, 75, 100]
  const defualtPerpToken = perpTokenList[0]
  const [percentageIndex, setPercentageindex] = useState(null)
  const [perpToken, setPerpToken] = useState(defualtPerpToken)
  const { depositFunds, withdrawFunds } = useTraderConfig()
  const truncateAddress = (address: string, lengthToTruncate): string =>
    `${address.substr(0, lengthToTruncate)}..${address.substr(-5, lengthToTruncate)}`
  const trunMarketAddress = truncateAddress(perpToken.marketAddress, checkMobile() ? 3 : 5)
  const symbol = perpToken.token
  const balances = useMemo(() => (isDevnet ? devnetbalances : mainnetBalances), [isDevnet])
  const tokenAmount = balances[perpToken.marketAddress]
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, perpToken.type])

  const handlePercentageChange = (e: React.MouseEvent<HTMLElement>, index: number) => {
    if (!isDevnet) {
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
        const avail = traderInfo.maxWithdrawable
        if (!avail || Number.isNaN(+avail)) {
          setAmount('0.00')
          return
        }
        let result = 0
        if (index === 0) result = (+avail * 25) / 100
        else if (index === 1) result = (+avail * 50) / 100
        else if (index === 2) result = (+avail * 75) / 100
        else result = +avail
        setAmount((Math.floor(result * 1000) / 1000).toString())
      }
    }
  }

  useEffect(() => {
    if (isDevnet) setAmount('400')
  }, [isDevnet])

  const handleInputChange = (e) => {
    if (isDevnet) {
      setAmount('400')
    } else {
      const t = e.target.value
      if (!isNaN(+t)) {
        e.target.value = t.indexOf('.') >= 0 ? t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 5) : t
        setAmount(e.target.value)
      }
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
  const checkDisabled = () => {
    if (isDevnet) {
      if (!traderInfo.traderRiskGroup) return true
      if (traderInfo.traderRiskGroup.totalDeposited.toJSON().m !== '0') return true
      return false
    }
    if (tradeType !== 'deposit') {
      if (!traderInfo.marginAvailable || +traderInfo.marginAvailable < +amount || !amount || !+amount) return true
    } else {
      if (
        !tokenAmount ||
        !tokenAmount.uiAmountString ||
        +tokenAmount.uiAmountString < +amount ||
        !amount ||
        !+amount
      )
        return true
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
        {tradeType === 'deposit' && <span className="deposit"> Deposit Limit: $1,000,000.00 </span>}
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
                  ? Number(tokenAmount.uiAmountString).toFixed(2)
                  : '0.00'
                : traderInfo.maxWithdrawable
                ? Number(traderInfo.maxWithdrawable).toFixed(2)
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
      {/* todo: add loading animation here */}
      <button
        className={`submit-btn ${checkDisabled() ? 'disabled' : ''}`}
        onClick={handleSubmit}
        // disabled={checkDisabled()}
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
