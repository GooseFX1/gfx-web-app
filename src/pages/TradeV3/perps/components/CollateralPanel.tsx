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

export const CollateralPanel: FC = (): JSX.Element => {
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey, wallet?.adapter])

  return (
    <PerpsLayout>
      <div className={cn('p-2.5')}>
        <div tw="flex items-center">
          <img src="img/crypto/SOL.svg" tw="h-[25px] w-[25px] mr-2" />
          <InfoLabel>Sol Account</InfoLabel>
        </div>
        {publicKey ? <AccountsV5 isSolAccount={true} /> : <ConnectWalletLayout />}
      </div>
    </PerpsLayout>
  )
}

const ConnectWalletLayout: FC = (): JSX.Element => {
  const { mode } = useDarkMode()
  return (
    <div className={cn('h-[90%] flex flex-col items-center justify-center')}>
      <img src={`/img/assets/accountConnect${mode}.png`} className={cn('w-[127px] h-[84px]')} />
      <h4 className={cn('m-2 dark:text-grey-1 text-grey-2')}>See your Account!</h4>
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
      <AccountRow keyStr="Balance" value={formatNumberInThousands(Number(traderInfo.collateralAvailable))} />
      <AccountRowPnl keyStr="Unrealized P&L" />
      <AccountRow keyStr="Margin Available" value={formatNumberInThousands(Number(traderInfo.marginAvailable))} />
      <AccountRow keyStr="Est. Liq. Price" value={formatNumberInThousands(Number(traderInfo.liquidationPrice))} />
    </div>
  )
}

const AccountRowPnl: FC<{ keyStr: string }> = ({ keyStr }) => {
  const { traderInfo } = useTraderConfig()
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
    <div tw="py-1 flex items-center justify-between">
      <h5 className={isNegative ? cn(`text-red-1`) : cn(`text-green-gradient-1`)}>{keyStr}</h5>
      {pnl}
    </div>
  )
}

const AccountRowHealth: FC<{ accountHealth }> = ({ accountHealth }) => {
  const { mode } = useDarkMode()
  const getHealthData = () => {
    const percent = accountHealth
    let barColour = ''
    if (percent <= 20) barColour = 'red'
    else if (percent > 20 && percent <= 80) barColour = 'yellow'
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
  }
  return (
    <div tw="flex items-center justify-between mt-2">
      <div>
        <div tw="flex items-center">
          <img src={`/img/assets/healthIcon${mode}.png`} alt="heart-icon" tw="h-5 w-5 mr-1.5" />
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
      <InfoLabel>{getHealthData()}</InfoLabel>
    </div>
  )
}
const AccountRow: FC<{ keyStr: string; value: string | number }> = ({ keyStr, value }) => {
  return (
    <div tw="py-1 flex items-center justify-between">
      <InfoLabel>{keyStr}</InfoLabel>
      <InfoLabel>{value}</InfoLabel>
    </div>
  )
}
