/* eslint-disable */
import { Children, FC, ReactNode, useMemo, useState } from 'react'
import { Row, Col } from 'antd'
import tw, { styled } from 'twin.macro'
// import { Tooltip } from '../../../../components'
import { useTraderConfig } from '../../../../context/trader_risk_group'
import { PERPS_FEES } from '../perpsConstants'
import { useWallet } from '@solana/wallet-adapter-react'
import { useCrypto, useDarkMode } from '../../../../context'
import useWindowSize from '../../../../utils/useWindowSize'
import { formatNumberInThousands } from '../utils'
import { TooltipTrigger, TooltipContent, Tooltip, cn } from 'gfx-component-lib'
import { InfoImage, InfoLabel, PerpsLayout } from './PerpsGenericComp'
import { Connect } from '../../../../layouts'
import { useWalletBalance } from '@/context/walletBalanceContext'

export const CollateralPanel: FC = (): JSX.Element => {
  const { connectedWalletPublicKey } = useWalletBalance()

  return (
    <PerpsLayout>
      <div className={cn('p-2.5 sm:h-[300px]')}>
        <div tw="flex items-center mb-4">
          <img src="img/crypto/SOL.svg" tw="h-[25px] w-[25px] mr-2" alt="SOL Logo" />
          <InfoLabel>Sol Account</InfoLabel>
        </div>
        {connectedWalletPublicKey ? <AccountsV5 isSolAccount={true} /> : <ConnectWalletLayout />}
      </div>
    </PerpsLayout>
  )
}

const ConnectWalletLayout: FC = (): JSX.Element => {
  const { mode } = useDarkMode()
  return (
    <div className={cn('h-[90%] flex flex-col items-center justify-center')}>
      <img src={`/img/assets/accountConnect${mode}.svg`} className={cn('w-[127px] h-[84px]')} />
      <h4 className={cn('m-2 dark:text-grey-1 text-grey-1')}>
        Connect your wallet to <br />
        See your Account!
      </h4>
      <div>
        <Connect />
      </div>
    </div>
  )
}

const AccountsV5: FC<{ isSolAccount: boolean }> = (isSolAccount): JSX.Element => {
  const { collateralInfo, traderInfo, activeProduct } = useTraderConfig()
  const accountHealth = useMemo(() => {
    const health = Number(traderInfo.health)
    if (health) return health
    return 100
  }, [traderInfo.health])

  return (
    <div>
      <AccountRowHealth accountHealth={accountHealth} />
      <AccountRow
        keyStr="Balance"
        tooltipData="Balance refers to the total value of your cash balance that you can use as collateral
       for opening new positions or maintaining existing ones. A negative balance indicates a notional position size greater than the amount deposited."
        value={formatNumberInThousands(Number(traderInfo?.collateralAvailable))}
      />
      <AccountRowPnl
        tooltipData="The total profit and loss from your positions in your account"
        keyStr="Unrealized P&L"
      />
      <AccountRow
        tooltipData="Margin Available is the amount of funds available in your account that can be used 
      to open new positions or increase your position size. This is calculated based on your Balance and the margin requirements for the specific assets you are trading"
        keyStr="Margin Available"
        value={formatNumberInThousands(Number(traderInfo.marginAvailable))}
      />
      <AccountRow
        tooltipData="The Liquidation Price is the price at which your position will be automatically
       closed out by the trading platform if your margin falls below a certain threshold. The Liquidation Price is calculated based on the current market price, your position size, and the margin requirements for the specific assets you are trading."
        keyStr="Est. Liq. Price"
        value={formatNumberInThousands(Number(traderInfo.liquidationPrice))}
      />
    </div>
  )
}

export const AccountRowPnl: FC<{ keyStr?: string; tooltipData: string }> = ({ keyStr, tooltipData }) => {
  const { traderInfo } = useTraderConfig()
  const { mode } = useDarkMode()
  const isNegative = useMemo(() => traderInfo.pnl[0] === '-', [traderInfo])
  const pnl = useMemo(() => {
    if (traderInfo.pnl === '0' || !Number(traderInfo.pnl)) return <span>0.00</span>
    const isNegative = traderInfo.pnl[0] === '-'
    return (
      <h5 className={isNegative ? cn(`text-red-1 font-semibold`) : cn(`text-green-gradient-1 font-semibold`)}>
        {(!isNegative ? '+' : '') + formatNumberInThousands(Number(traderInfo.pnl))} $
      </h5>
    )
  }, [traderInfo])
  return (
    <div tw="my-2.5 flex items-center justify-between">
      <div className="flex items-center">
        <h5 className={isNegative ? cn(`text-red-1`) : cn(`text-green-gradient-1`)}>{keyStr ?? ''}</h5>
        <Tooltip>
          <TooltipTrigger>
            <div className={cn('ml-1.5')}>
              <InfoImage mode={mode} />
            </div>
          </TooltipTrigger>
          <TooltipContent>{tooltipData}</TooltipContent>
        </Tooltip>
      </div>
      <h5 className={isNegative ? cn(`text-red-1`) : cn(`text-green-gradient-1`)}>{pnl}</h5>
    </div>
  )
}

const AccountRowHealth: FC<{ accountHealth }> = ({ accountHealth }) => {
  const { mode } = useDarkMode()
  const healthData = useMemo(() => {
    const percent = accountHealth
    let barColour = ''
    if (percent <= 20) barColour = 'red'
    else if (percent > 20 && percent <= 80) barColour = 'bg-yellow-1'
    else barColour = 'green'
    return (
      <div className="bar-holder">
        <span>
          {[0, 20, 40, 60, 80].map((item, index) => (
            <div key={index} className={percent <= item ? 'bars gray' : `bars ${barColour}`}></div>
          ))}
        </span>
        <InfoLabel>{percent}%</InfoLabel>
      </div>
    )
  }, [accountHealth])

  const barsData = useMemo(() => {
    return (
      <div className="h-[20px] w-[32px]">
        <div className="flex">
          {[0, 25, 50, 75].map((item, index) => (
            <div
              key={index}
              className={
                item <= accountHealth
                  ? `h-[20px] w-[5px] mr-[2px] rounded-[5px] ${
                      accountHealth > 75 ? `bg-green-2` : accountHealth >= 50 ? `bg-yellow-1` : `bg-red-2`
                    }`
                  : 'h-[20px] w-[5px] mr-[2px] dark:bg-black-1 bg-grey-5 rounded-[5px] px-[2px]'
              }
            ></div>
          ))}
        </div>
      </div>
    )
  }, [accountHealth])

  return (
    <div tw="flex items-center justify-between my-4">
      <div>
        <div tw="flex items-center">
          <img src={`/img/assets/healthIcon${mode}.svg`} alt="heart-icon" tw="h-5 w-5 mr-1.5" />
          <InfoLabel>Health</InfoLabel>
          <Tooltip>
            <TooltipTrigger>
              <div className={cn('ml-1.5')}>
                <InfoImage mode={mode} />
              </div>
            </TooltipTrigger>
            <TooltipContent>The health bar shows how close you are to being liquidated. </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center">
        <div>{barsData}</div>
        <InfoLabel>{healthData}</InfoLabel>
      </div>
    </div>
  )
}
const AccountRow: FC<{ keyStr: string; value: string | number; tooltipData: string }> = ({
  keyStr,
  value,
  tooltipData
}) => {
  const { mode } = useDarkMode()
  return (
    <div tw=" flex items-center justify-between my-4">
      <div className="flex items-center">
        <InfoLabel>{keyStr}</InfoLabel>
        <Tooltip>
          <TooltipTrigger>
            <div className={cn('ml-1.5')}>
              <InfoImage mode={mode} />
            </div>
          </TooltipTrigger>
          <TooltipContent>{tooltipData}</TooltipContent>
        </Tooltip>
      </div>

      <InfoLabel>{value}</InfoLabel>
    </div>
  )
}
