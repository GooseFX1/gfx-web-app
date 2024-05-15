/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch, SetStateAction, useEffect } from 'react'
import tw from 'twin.macro'
import { Dropdown, Menu } from 'antd'
import { useAccounts, useCrypto, useDarkMode } from '../../../context'
import { useMemo, FC, useState } from 'react'
import { convertToFractional } from './utils'
import { useTraderConfig } from '../../../context/trader_risk_group'
import { PERPS_COLLATERAL } from './perpsConstants'
import { PERPS_COLLATERAL as PERPS_COLLATERAL_DEVNET } from './perpsConstantsDevnet'
import { checkMobile } from '../../../utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { ContentLabel, InfoLabel, TitleLabel } from './components/PerpsGenericComp'
import { Tokens, CloseTradingAccount, SELECTED_COIN, COIN_INFO, INPUT } from './DepositWithdraw'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  InputElementLeft,
  InputElementRight,
  InputGroup,
  Tabs,
  TabsList,
  TabsTrigger,
  cn
} from 'gfx-component-lib'
import { CircularArrow } from '../../../components/common/Arrow'

export const DepositWithdraw: FC<{
  tradeType: string
  setDepositWithdrawModal: Dispatch<SetStateAction<boolean>>
}> = ({ tradeType, setDepositWithdrawModal }) => {
  const { balances: mainnetBalances, fetchAccounts } = useAccounts()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { isDevnet } = useCrypto()
  const { traderInfo } = useTraderConfig()
  const { mode } = useDarkMode()
  const [amount, setAmount] = useState('')
  const perpTokenList = isDevnet ? PERPS_COLLATERAL_DEVNET : PERPS_COLLATERAL
  const percentageArr = [25, 50, 75, 100]
  const defualtPerpToken = perpTokenList[0]
  const [percentageIndex, setPercentageindex] = useState(0)
  const [perpToken, setPerpToken] = useState(defualtPerpToken)
  const { depositFunds, withdrawFunds } = useTraderConfig()
  const truncateAddress = (address: string, lengthToTruncate): string =>
    `${address.substr(0, lengthToTruncate)}..${address.substr(-5, lengthToTruncate)}`
  const trunMarketAddress = truncateAddress(perpToken.marketAddress, checkMobile() ? 3 : 5)
  const symbol = perpToken.token
  const balances = useMemo(() => mainnetBalances, [isDevnet])
  const tokenAmount = balances[perpToken.marketAddress]
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, perpToken.type])
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey, wallet?.adapter])

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
        setAmount(String(result.toFixed(2)))
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
    if (isDevnet) setAmount('500')
  }, [isDevnet])

  const handleInputChange = (e) => {
    if (isDevnet) {
      setAmount('500')
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
      setIsLoading(true)
      const response = tradeType === 'deposit' ? await depositFunds(answer) : await withdrawFunds(answer)
      if (response === null) {
        setIsLoading(false)
        return
      }

      // this will update balances
      fetchAccounts()

      if (response && response.txid) {
        setIsLoading(false)
        setDepositWithdrawModal(false)
      }
    } catch (e) {
      console.log(e)
      setIsLoading(false)
    }
  }
  const checkDisabled = () => {
    if (!publicKey) return true
    if (isDevnet) {
      if (!traderInfo.traderRiskGroup) return false
      if (traderInfo.traderRiskGroup.totalDeposited.toJSON().m !== '0') return true
      return false
    }
    if (tradeType !== 'deposit') {
      if (!traderInfo.marginAvailable || +traderInfo.marginAvailable < +amount || !amount || !+amount) return true
    } else {
      if (
        !tokenAmount ||
        isLoading ||
        !tokenAmount.uiAmountString ||
        +tokenAmount.uiAmountString < +amount ||
        !amount ||
        !+amount
      )
        return true
    }
  }

  const menus = (
    <div>
      {perpTokenList.map((item, index) => (
        <DropdownMenuItem onClick={() => setPerpToken(item)} key={index}>
          <p className={cn('font-bold w-[450px] sm:w-[90vw] cursor-pointer')}>
            <Tokens {...item} />
          </p>
        </DropdownMenuItem>

        // <Menu.Item
        //   key={index}
        //   onClick={() => {
        //     setPerpToken(item)
        //   }}
        // >
        //   <Tokens {...item} />
        // </Menu.Item>
      ))}
    </div>
  )
  const args = {
    rightItem: (
      <InputElementRight>
        <div className={cn('mt-0.5')}>USDC</div>
      </InputElementRight>
    )
    // leftItem: (<InputElementLeft className={'z-10 gap-2'}>
    //   <Button variant={'ghost'}
    //     onClick={() => handlePercentageChange(null, 0)}
    //     className={cn('p-0 w-2 !min-w-4 border border-solid')}>
    //     Min
    //   </Button>
    //   <Button
    //     onClick={() => handlePercentageChange(null, 3)}
    //     variant={'ghost'} className={cn('p-0 w-2 !min-w-4 border border-solid')}>
    //     Max
    //   </Button>
    // </InputElementLeft>),
  }

  return (
    <div className={cn('w-full p-2.5 sm:px-2.5 sm:pb-2.5')}>
      {tradeType === 'account' ? (
        <CloseTradingAccount setDepositWithdrawModal={setDepositWithdrawModal} />
      ) : (
        <>
          <div tw="flex flex-row items-center sm:mt-[-5px] justify-between">
            <h3>Select Asset</h3>
            {tradeType === 'deposit' && (
              <ContentLabel>
                <p> Deposit Limit: $1,000,000.00 </p>
              </ContentLabel>
            )}
          </div>
          {/* <Dropdown overlay={menus} trigger={['click']} placement="bottom" align={{ offset: [0, 10] }}>
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
                  width="16" />
              </div>
            </SELECTED_COIN>
          </Dropdown> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
              <Button
                variant="outline"
                colorScheme="default"
                className={cn('w-full mt-2 sm:mt-2.5 rounded-[100px]')}
              >
                <div className={cn('flex w-full items-center')}>
                  <img className={cn('h-[25px] w-[25px] left-0')} src={assetIcon} alt="coin-icon" />
                  <InfoLabel>
                    <h4 className={cn('ml-2 mr-1')}>{symbol}</h4>{' '}
                  </InfoLabel>
                  <ContentLabel>
                    {' '}
                    <h4>({trunMarketAddress})</h4>
                  </ContentLabel>
                  <div className={cn('ml-auto flex items-center')}>
                    <div className={cn('mr-2')}>
                      <InfoLabel>
                        <h4>
                          {tradeType === 'deposit'
                            ? tokenAmount && tokenAmount.uiAmountString
                              ? Number(tokenAmount.uiAmountString).toFixed(2)
                              : '0.00'
                            : traderInfo.maxWithdrawable
                            ? Number(traderInfo.maxWithdrawable).toFixed(2)
                            : '0.00'}
                        </h4>
                      </InfoLabel>
                    </div>
                    <CircularArrow cssStyle={tw`h-5 w-5`} />
                  </div>
                </div>

                {/* <SELECTED_COIN>
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
                </SELECTED_COIN>{' '} */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent asChild className={cn('z-[1200]')}>
              <div
                className="flex flex-col gap-1.5 z-[1200] items-start w-[480px]
               sm:w-[96vw] max-w-[500px]"
              >
                {menus}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <InfoLabel>
            <h3 className={cn('mt-3 mb-2 sm:mt-5')}>Amount</h3>
          </InfoLabel>

          <Tabs defaultValue="0" className="sm:mt-2.5 sm:mb-2.5">
            <TabsList>
              {percentageArr.map((elem, index) => (
                <TabsTrigger
                  className={cn('w-[25%]')}
                  size="xl"
                  key={index}
                  value={index.toString()}
                  variant="primary"
                  onClick={(e) => handlePercentageChange(e, index)}
                >
                  <TitleLabel whiteText={percentageIndex == index}>{elem}%</TitleLabel>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className={cn('mt-2')}>
            <InputGroup {...args}>
              <Input
                className={'text-right'}
                value={amount}
                onChange={handleInputChange}
                placeholder={'0.00'}
                type={'number'}
                pattern="\d+(\.\d+)?"
              />
            </InputGroup>
          </div>
          <div>
            {/* <Button
              className={`h-10 bottom-2 absolute ml-auto mr-auto w-[140px]`}
              onClick={handleSubmit}
              loading={isLoading}
              disabled={checkDisabled() || isLoading}
              cssStyle={tw`bg-blue-1 text-grey-5 font-semibold border-0 rounded-circle text-average sm:text-regular`}
            >
              {tradeType === 'deposit' ? 'Deposit' : 'Withdraw'}
            </Button> */}
            <Button
              colorScheme="blue"
              size="default"
              variant="default"
              onClick={handleSubmit}
              loading={isLoading}
              disabled={checkDisabled() || isLoading}
              className="w-[140px] sm:w-[full] mt-[35px] ml-[calc(50% - 70px)] sm:ml-[35`%]"
            >
              {tradeType === 'deposit' ? 'Deposit' : 'Withdraw'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
