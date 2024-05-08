/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch, ReactElement, SetStateAction, useCallback, useEffect } from 'react'
import tw, { styled } from 'twin.macro'
import { Checkbox, Dropdown } from 'antd'
import { MarketType, useAccounts, useConnectionConfig, useDarkMode, useOrderBook } from '../../../context'
import { useMemo, FC, useState } from 'react'
import { useTraderConfig } from '../../../context/trader_risk_group'
import 'styled-components/macro'
import { checkMobile, truncateAddress } from '../../../utils'
import useBoolean from '../../../hooks/useBoolean'
// import { Button } from '../../../components'
import type { MenuProps } from 'antd'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseDefault,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  cn
} from 'gfx-component-lib'
import { ModalHeader } from '../InfoBanner'
import { DepositWithdraw } from './DepositWithdrawNew'
import { ContentLabel, InfoLabel, TitleLabel } from './components/PerpsGenericComp'
import { CircularArrow } from '@/components/common/Arrow'
import useBreakPoint from '@/hooks/useBreakPoint'

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
    ${tw`block h-12.5 w-[222px] flex items-center rounded-circle mx-auto my-3.5 font-semibold 
      text-average border-0 border-none bg-blue-1 sm:h-[45px] sm:w-full`}
    color: ${({ theme }) => theme.white};
    outline: none;
  }
  .disabled {
    background-color: ${({ theme }) => theme.bg22};
    color: ${({ theme }) => theme.text28};
  }
`

const CLOSE_ACCOUNT_CONDITIONS = styled.div`
  ${tw`!text-regular !font-semibold `}
  div {
    ${tw`mt-1 flex items-center`}
  }
  .approved {
    ${tw`text-green-4 font-semibold h-6`}
  }
  .failed {
    ${tw`text-red-2 font-semibold h-6`}
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

export const SELECTED_COIN = styled.div`
  ${tw`h-[45px] rounded-[36px] flex items-center text-center cursor-pointer pl-3 font-medium text-[16px]`}
  background-color: ${({ theme }) => theme.bg22};

  .ant-dropdown-menu {
    ${tw`bg-grey-1 dark:bg-grey-2`};
  }
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

export const COIN_INFO = styled.div`
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

export const LABEL = styled.div`
  ${tw`text-lg font-semibold mx-0 mb-2.5 mt-4.5 sm:text-regular sm:mb-2 sm:mt-3.75`}
  color: ${({ theme }) => theme.text11};
`

export const INPUT = styled.div`
  ${tw`w-[280px] rounded-circle flex items-center px-5 sm:w-full sm:mb-[25px] sm:h-[45px]`}
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

export const DepositWithdrawDialog: FC<{
  depositWithdrawModal: boolean
  setDepositWithdrawModal: Dispatch<SetStateAction<boolean>>
}> = ({ depositWithdrawModal, setDepositWithdrawModal }) => {
  const [tradeType, setTradeType] = useState<string>('deposit')
  const { isMobile } = useBreakPoint()

  return (
    <Dialog open={depositWithdrawModal} onOpenChange={setDepositWithdrawModal}>
      <DialogOverlay />
      {/* <DialogClose onClick={() => setDepositWithdrawModal(false)} /> */}
      <DialogContent
        size="md"
        placement={isMobile ? 'bottom' : 'default'}
        className={'w-[500px] h-[356px] sm:w-[100vw]'}
      >
        <ModalHeader setTradeType={setTradeType} tradeType={tradeType} />

        <DialogCloseDefault onClick={() => setDepositWithdrawModal(false)} />

        <DialogBody>
          <DepositWithdraw tradeType={tradeType} setDepositWithdrawModal={setDepositWithdrawModal} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

export const Tokens: FC<{ token: string; type: MarketType; marketAddress: string }> = ({
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
  const uiAmount = useMemo(
    () => (tokenAmount?.uiAmount ? tokenAmount?.uiAmount?.toFixed(2) : '0.00'),
    [tokenAmount]
  )
  return (
    <DROPDOWN_PAIR_DIV>
      <COIN_INFO>
        <img className="asset-icon" src={assetIcon} alt="coin-icon" />
        <div className="coin">{symbol}</div>
        <div className="market-add">{truncMarketAddress}</div>
      </COIN_INFO>
      <div className="available-bal">{tokenAmount ? uiAmount : '0.00'}</div>
    </DROPDOWN_PAIR_DIV>
  )
}

export const CloseTradingAccount: FC<{ setDepositWithdrawModal: Dispatch<SetStateAction<boolean>> }> = ({
  setDepositWithdrawModal
}): ReactElement => {
  const { mode } = useDarkMode()
  const { traderInfo, traderInstanceSdk, closeTraderAccount } = useTraderConfig()
  const { perpsOpenOrders } = useOrderBook()
  const [traderAddresses, setTraderAddresses] = useState<PublicKey[]>(null)
  const [isLoading, setIsLoading] = useBoolean(false)
  const { connection } = useConnectionConfig()

  const clearedAllOpenPositions = useMemo(
    () => Number(traderInfo.averagePosition.price) === 0 && traderInfo.averagePosition.side == null,
    [traderInfo]
  )
  const openOrdersCleared = useMemo(() => perpsOpenOrders.length === 0, [perpsOpenOrders])
  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(false)
  const fundsWithdrawn = useMemo(() => Number(traderInfo.collateralAvailable) === 0, [traderInfo])
  const wal = useWallet()

  const closeTraderAccountFn = useCallback(async () => {
    setIsLoading.on()
    const response = await closeTraderAccount()
    if (response && response.txid) {
      setDepositWithdrawModal(false)
      setIsLoading.off()
    }
    if (response === null) {
      setIsLoading.off()
    }
  }, [traderAddresses, traderInstanceSdk, connection, wal])

  useEffect(() => {
    const fetchTraderAddresses = async () => {
      if (!traderInstanceSdk) return
      try {
        const addresses = await traderInstanceSdk?.getAllTraderAddresses()
        setTraderAddresses(addresses)
      } catch (e) {
        console.error('Error fetching trader addresses:', e)
      }
    }

    if (traderInstanceSdk) {
      fetchTraderAddresses()
    }
  }, [traderInstanceSdk])

  const items: MenuProps['items'] = useMemo(() => {
    if (!traderAddresses) return []
    return traderAddresses.map((address, index) => ({
      key: `address-${index}`,
      label: <div>{address.toString()}</div>
    }))
  }, [traderAddresses])

  return (
    <div>
      <div tw="flex flex-row items-center justify-between mt-[-10px] sm:mt-[-5px]">
        <InfoLabel>
          <h3>Choose account to close</h3>
        </InfoLabel>
      </div>

      {/* <Dropdown menu={{ items }} trigger={['click']} placement="bottom" align={{ offset: [0, 10] }}>
        <SELECTED_COIN>
          <COIN_INFO>
            {
              <div className="coin">
                {traderInstanceSdk === null
                  ? 'No Accounts'
                  : traderAddresses === null
                  ? 'Loading...'
                  : traderAddresses[0]
                  ? 'Trader Account #1'
                  : 'No Accounts'}
              </div>
            }
            <div className="market-add">
              {traderAddresses !== null && traderAddresses[0] && truncateAddress(traderAddresses[0]?.toString())}
            </div>
          </COIN_INFO>
          {traderAddresses !== null && (
            <div className="dropdown">
              <img
                src={mode === 'lite' ? '/img/assets/arrow.svg' : '/img/assets/arrow-down.svg'}
                alt="arrow-icon"
                height="8"
                width="16"
              />
            </div>
          )}
        </SELECTED_COIN>
      </Dropdown> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <Button variant="outline" colorScheme="default" className={cn('w-full mt-2 sm:mt-2.5 rounded-[100px]')}>
            <div className={cn('flex w-full items-center')}>
              {/* <img className={cn('h-[25px] w-[25px] left-0')} src={assetIcon} alt="coin-icon" /> */}
              <InfoLabel>
                {/* <h4 className={cn('ml-2 mr-1')}>{'symbol'}</h4>{' '} */}
                {
                  <h4 className="coin">
                    {traderInstanceSdk === null
                      ? 'No Accounts'
                      : traderAddresses === null
                      ? 'Loading...'
                      : traderAddresses[0]
                      ? ' Trader Account #1 '
                      : 'No Accounts'}
                  </h4>
                }
              </InfoLabel>

              <ContentLabel>
                <h4 className="ml-1">
                  (
                  {traderAddresses !== null &&
                    traderAddresses[0] &&
                    truncateAddress(traderAddresses[0]?.toString())}
                  )
                </h4>
              </ContentLabel>
              <div className={cn('ml-auto flex items-center')}>
                <div className={cn('mr-2')}>
                  {/* <InfoLabel>
                    <h4>
                      {tradeType === 'deposit'
                        ? tokenAmount && tokenAmount.uiAmountString
                          ? Number(tokenAmount.uiAmountString).toFixed(2)
                          : '0.00'
                        : traderInfo.maxWithdrawable
                          ? Number(traderInfo.maxWithdrawable).toFixed(2)
                          : '0.00'}
                    </h4>
                  </InfoLabel> */}
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
        {/* <DropdownMenuContent asChild className={cn('z-[1200]')}>
          <div className={'flex flex-col gap-1.5 z-[1200] items-start w-[480px] max-w-[500px]'}>{}</div>
        </DropdownMenuContent> */}
      </DropdownMenu>

      <div tw="flex flex-row items-center justify-between mt-2 sm:mt-4">
        <InfoLabel>In order to close your account: </InfoLabel>
      </div>
      <CLOSE_ACCOUNT_CONDITIONS>
        <Condition condition={fundsWithdrawn} text="All funds withdrawn" />
        <Condition condition={clearedAllOpenPositions} text="No open positions" />
        <Condition condition={openOrdersCleared} text="No open orders" />
      </CLOSE_ACCOUNT_CONDITIONS>

      <div tw="flex mt-2 items-center">
        <div>
          {traderAddresses && traderAddresses[0] && (
            <Checkbox onChange={() => setCheckboxChecked((prev) => !prev)} />
          )}
        </div>
        <ContentLabel>
          <p className={cn('text-tiny p-2.5')}>
            I agree that my account closure is permanent and erases all the data. In addition you will reclaim the
            SOL rent fee paid when creating the account.
          </p>
        </ContentLabel>
      </div>

      <div tw="flex items-center justify-center">
        {/* <Button
          loading={isLoading}
          onClick={closeTraderAccountFn}
          cssStyle={tw`bg-red-1 text-grey-5 
           font-semibold border-0 rounded-circle text-average sm:text-regular`}
          disabled={
            !checkboxChecked ||
            isLoading ||
            !fundsWithdrawn ||
            !clearedAllOpenPositions ||
            !openOrdersCleared ||
            !traderAddresses[0]
          }
          tw="w-[240px] h-8.75 mt-2 sm:mt-3"
        >
          Close Account
        </Button> */}
        {/* className={cn('min-w-[170px] w-full h-[30px]')}
                  variant="default"
                  colorScheme="blue"
                  size="lg"
                  onClick={() => handlePlaceOrder()}
                  disabled={buttonState !== ButtonState.CanPlaceOrder} */}
        <Button
          loading={isLoading}
          disabled={
            !checkboxChecked ||
            isLoading ||
            !fundsWithdrawn ||
            !clearedAllOpenPositions ||
            !openOrdersCleared ||
            !traderAddresses[0]
          }
          className={cn('min-w-[140px] w-[140px] mt-2 sm:mt-[-8px]')}
          variant="default"
          colorScheme="red"
          size="lg"
          onClick={closeTraderAccountFn}
        >
          Close Account
        </Button>
      </div>
    </div>
  )
}

const Condition: FC<{ condition: boolean; text: string }> = ({ condition, text }) => (
  <div className={condition ? 'approved' : 'failed'}>
    <StatusIcon approved={condition} />
    <div>{text}</div>
  </div>
)
const StatusIcon: FC<{ approved: boolean }> = ({ approved }) => (
  <div tw="mr-1.5">
    <img src={`/img/assets/${approved ? 'approved' : 'reject'}.svg`} height="20" width="20" />
  </div>
)
