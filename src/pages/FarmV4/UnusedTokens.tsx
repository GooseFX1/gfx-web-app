import { useDarkMode, useGamma } from '@/context'
import { Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { FC } from 'react'
import { POOL_TYPE } from './constants'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { commafy, loadIconImage, numberFormatter } from '@/utils'
import { fetchTokensByPublicKey } from '@/api/gamma'
import { GAMMAListTokenResponse } from '@/types/gamma'
import { IconWithFallback } from '@/components/common/IconWithFallback'

const ExplorePools: FC<{ tokenMint: string }> = ({ tokenMint }) => {
  const { setCurrentPoolType, addSelectedToken, clearAllSelectedTokens, setIsPortfolio } = useGamma()
  const chooseToken = async () => {
    clearAllSelectedTokens()

    const response = (await fetchTokensByPublicKey(
      tokenMint
    )) as GAMMAListTokenResponse | null
    if (!response || !response.success || response.data?.tokens?.length == 0) {
      return
    }
    for (const token of response.data.tokens) {
      if (token.address === tokenMint) {
        addSelectedToken(token)
      }
    }
  }
  return (
    <div
      onClick={async () => {
        await chooseToken()
        setIsPortfolio.off()
        setCurrentPoolType(POOL_TYPE?.primary)
      }}
      className="text-regular font-bold text-blue-1 dark:text-grey-8 underline cursor-pointer"
    >
      Explore Pools
    </div>
  )
}

const UnusedTokens: FC = () => {
  const { topBalances, walletValue } = useWalletBalance()
  const { mode } = useDarkMode()

  return (
    <div
      className="h-[250px] border border-solid dark:border-black-4 border-grey-4
        px-2.5 pt-2.5 dark:bg-black-2 bg-white rounded-[10px] flex flex-col"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <h4
            className="font-poppins text-regular font-semibold
            text-black-4 dark:text-grey-8 underline decoration-dotted mb-2.5"
          >
            Unused Tokens
          </h4>
        </TooltipTrigger>
        <TooltipContent align={'start'}>
          Unused Tokens are assets in your wallet not earning returns. Deposit them into our pools to start
          generating returns.
        </TooltipContent>
      </Tooltip>
      <div className="font-poppins text-[28px] font-semibold text-black-4 dark:text-grey-8 mb-3.75">
        ${commafy(parseFloat(walletValue), 2)}
      </div>
      <div className={`overflow-auto`}>
        {topBalances.slice(0, 5).map((balance) => (
          <div className="flex flex-row justify-between items-center mb-3" key={balance.symbol}>
            <div className="flex flex-row items-center">
              <IconWithFallback
                src={loadIconImage(balance.logoURI, mode)}
                alt="token"
                size="sm"
                className="mr-1.5 rounded-circle border border-solid dark:border-black-4 border-grey-4"
              />
              <span className="text-[13px] font-semibold text-black-4 dark:text-grey-8 mr-2.5">{balance.symbol}</span>
              <span className="text-[13px] font-semibold text-black-4 dark:text-grey-8 mr-1">
                {numberFormatter(balance.tokenAmount.uiAmount)}
              </span>
              <span className="text-[13px] font-semibold text-grey-9 dark:text-grey-1">
                (~${numberFormatter(balance.value.toNumber())})
              </span>
            </div>
            <ExplorePools tokenMint={balance.mint} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default UnusedTokens
