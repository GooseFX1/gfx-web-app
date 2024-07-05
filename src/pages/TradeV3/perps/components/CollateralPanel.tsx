import { FC, useMemo } from 'react'
import { useTraderConfig } from '../../../../context/trader_risk_group'
import { useDarkMode } from '../../../../context'
import { formatNumberInThousands } from '../utils'
import { cn, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { InfoLabel, InfoLabelNunito, PerpsLayout } from './PerpsGenericComp'
import { Connect } from '../../../../layouts'
import { useWalletBalance } from '@/context/walletBalanceContext'
// eslint-disable-next-line

export const CollateralPanel: FC = (): JSX.Element => {
  const { connectedWalletPublicKey } = useWalletBalance()

  return (
    <PerpsLayout>
      <div className={cn('p-2.5 max-sm:h-[300px]')}>
        <div className="flex items-center mb-4">
          <img src="img/crypto/SOL.svg" className="h-[25px] w-[25px] mr-2" alt="SOL Logo" />
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

// eslint-disable-next-line
const AccountsV5: FC<{ isSolAccount: boolean }> = (isSolAccount): JSX.Element => {
  const { traderInfo } = useTraderConfig()
  const accountHealth = useMemo(() => {
    const health = Number(traderInfo.health)
    if (health) return health
    return 100
  }, [traderInfo.health])

  const userVolume = useMemo(() => {
    const vol = traderInfo.traderVolume
    if (Number.isNaN(vol)) return '0.00'
    const rounded = (+vol).toFixed(2)
    return rounded
  }, [traderInfo.traderVolume])

  return (
    <div>
      <AccountRowHealth accountHealth={accountHealth} />
      <AccountRow
        keyStr="Balance"
        tooltipData="Balance refers to the total value of your cash balance that you can use as collateral
       for opening new positions or maintaining existing ones. A negative balance indicates a notional 
       position size greater than the amount deposited."
        value={formatNumberInThousands(Number(traderInfo?.collateralAvailable))}
      />
      <AccountRowPnl
        tooltipData="The total profit and loss from your positions in your account"
        keyStr="Unrealized P&L"
      />
      <AccountRow
        tooltipData="User volume refers to the total volume of trades made by you. The higher your volume, 
        the greater your chances of receiving rewards in the competition"
        keyStr="User Volume"
        value={formatNumberInThousands(Number(userVolume))}
      />
      <AccountRow
        tooltipData="Margin Available is the amount of funds available in your account that can be used 
      to open new positions or increase your position size. This is calculated based on your Balance and 
      the margin requirements for the specific assets you are trading"
        keyStr="Margin Available"
        value={formatNumberInThousands(Number(traderInfo.marginAvailable))}
      />
      <AccountRow
        tooltipData="The Liquidation Price is the price at which your position will be automatically
       closed out by the trading platform if your margin falls below a certain threshold. The Liquidation 
       Price is calculated based on the current market price, your position size, and the margin requirements 
       for the specific assets you are trading."
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
      <InfoLabelNunito
        className={isNegative ? cn(`!text-red-1 font-semibold`) : cn(`!text-green-gradient-1 font-semibold`)}
      >
        $ {(!isNegative ? '+' : '') + formatNumberInThousands(Number(traderInfo.pnl))}
      </InfoLabelNunito>
    )
  }, [traderInfo])
  return (
    <div className="my-2.5 flex items-center justify-between">
      <div className="flex items-center">
        <h5 className={isNegative ? cn(`text-red-1`) : cn(`text-green-gradient-1`)}>{keyStr ?? ''}</h5>
        <Tooltip>
          <TooltipTrigger>
            <div className={cn('ml-1.5')}>
              <img src={`/img/assets/Tooltip${mode}.svg`} alt="tooltip" className="h-4 w-4 " />
            </div>
          </TooltipTrigger>
          <TooltipContent>{tooltipData}</TooltipContent>
        </Tooltip>
      </div>
      <InfoLabelNunito className={isNegative ? cn(`text-red-1`) : cn(`text-green-gradient-1`)}>
        {pnl}
      </InfoLabelNunito>
    </div>
  )
}

export const AccountRowHealth: FC<{ accountHealth }> = ({ accountHealth }) => {
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
        <InfoLabelNunito>{percent}%</InfoLabelNunito>
      </div>
    )
  }, [accountHealth])

  const barsData = useMemo(
    () => (
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
    ),
    [accountHealth]
  )

  return (
    <div className="flex items-center justify-between my-4">
      <div>
        <div className="flex items-center">
          <img src={`/img/assets/healthIcon${mode}.svg`} alt="heart-icon" className="h-5 w-5 mr-1.5" />
          <InfoLabel>Health</InfoLabel>
          <Tooltip>
            <TooltipTrigger className={' ml-1 '}>
              <img src={`/img/assets/Tooltip${mode}.svg`} alt="tooltip" className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>The health bar shows how close you are to being liquidated. </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center ml-2">
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
    <div className=" flex items-center justify-between my-4">
      <div className="flex items-center">
        <InfoLabel>{keyStr}</InfoLabel>
        <Tooltip>
          <TooltipTrigger>
            <div className={cn('ml-1.5')}>
              <img src={`/img/assets/Tooltip${mode}.svg`} alt="tooltip" height="16px" width="16px" />
            </div>
          </TooltipTrigger>
          <TooltipContent>{tooltipData}</TooltipContent>
        </Tooltip>
      </div>

      <InfoLabelNunito>${value}</InfoLabelNunito>
    </div>
  )
}
