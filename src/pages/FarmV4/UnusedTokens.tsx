import { useDarkMode, useGamma, useRewardToggle } from '@/context'
import { Icon, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { FC, useMemo } from 'react'
import { POOL_TYPE } from './constants'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { loadIconImage } from '@/utils'
import { numberFormatter } from '@/utils'

const ExplorePools: FC = () => {
  const { setIsPortfolio } = useRewardToggle()
  const { setCurrentPoolType } = useGamma()

  return (
    <div onClick={() => {
      setIsPortfolio.off()
      setCurrentPoolType(POOL_TYPE?.primary)
    }}
      className="text-regular font-bold text-blue-1 dark:text-grey-8 underline cursor-pointer">
      Explore Pools
    </div>
  )
}

const UnusedTokens: FC = () => {
  const { balance, walletValue } = useWalletBalance()
  const { mode } = useDarkMode()
  const topBalances = useMemo(() => {
    const values = Object.values(balance)
    return values.sort((a, b) => a.value.gte(b.value) ? -1 : 1).slice(0, 4)
  }, [balance])

  return (
    <div
      className="h-[250px] border border-solid dark:border-black-4 border-grey-4
        p-2.5 dark:bg-black-2 bg-white rounded-[10px]"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <h4 className="font-poppins text-regular font-semibold
            text-black-4 dark:text-grey-8 underline decoration-dotted mb-2.5">
            Unused Tokens
          </h4>
        </TooltipTrigger>
        <TooltipContent align={'start'}>
          Unused Tokens are assets in your wallet not earning returns.
          Deposit them into our pools to start generating returns.
        </TooltipContent>
      </Tooltip>
      <div className="font-poppins text-[28px] font-semibold
            text-black-4 dark:text-grey-8 mb-3.75">${walletValue}
      </div>
      {
        topBalances.map((balance) => <div className="flex flex-row justify-between items-center mb-3"
          key={balance.symbol}>
          <div className="flex flex-row items-center">
            <Icon
              src={loadIconImage(balance.logoURI , mode)}
              alt="token"
              size="sm"
              className="mr-1.5" />
            <span className="text-[13px] font-semibold text-black-4 dark:text-grey-8 mr-2.5">
              {balance.symbol}
            </span>
            <span className="text-[13px] font-semibold text-black-4 dark:text-grey-8 mr-1">
              {numberFormatter(balance.tokenAmount.uiAmount)}
            </span>
            <span
              className="text-[13px] font-semibold text-grey-9 dark:text-grey-1">
              (~${numberFormatter(balance.value.toNumber())})
            </span>
          </div>
          <ExplorePools />
        </div>)
      }
    </div>
  )
}


export default UnusedTokens