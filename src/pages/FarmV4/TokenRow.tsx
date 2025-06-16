import { FC, ReactElement } from 'react'
import { useDarkMode } from '@/context'
import { Badge, cn } from 'gfx-component-lib'
import { loadIconImage, truncateAddress, truncateBigNumber } from '@/utils'
import { useWallet } from '@/hooks/useWallet'
import { GAMMAToken } from '@/types/gamma'
import { IconWithFallback } from '@/components/common/IconWithFallback'

export const TokenRow: FC<{
  isMintA: boolean
  token: GAMMAToken
  balance: number
  isDeposit: boolean
}> =
  ({ token,
    balance,
    isDeposit
  }): ReactElement => {
    const { mode } = useDarkMode()
    const { publicKey } = useWallet()

    const getWalletIcon = () =>
      (publicKey && balance > 0) ?
        `/img/assets/wallet-${mode}-enabled.svg` :
        `/img/assets/wallet-${mode}-disabled.svg`

    if (token == undefined) return <></>
    return (
      <div className="flex flex-row justify-between items-center mx-2.5">
        <div className="flex flex-row">
          <IconWithFallback
            src={loadIconImage(token?.logoURI, mode)}
            size="sm"
            className={`mr-2 border border-solid rounded-circle 
                dark:border-border-darkmode-secondary border-border-lightmode-secondary`}
          />
          <span className="text-regular font-semibold font-poppins dark:text-grey-8 text-black-4 mr-2">
            {token?.symbol}
          </span>
          <div className="w-[89px] px-1">
            <a href={`https://solscan.io/account/${token?.address}`} target="_blank" rel="noreferrer">
              <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
                <span className={'font-poppins font-semibold my-0.5 mr-2'}>
                  {truncateAddress(token?.address, 3)}
                </span>
                <IconWithFallback
                  src={`/img/assets/arrowcircle-${mode}.svg`}
                  className={'!h-[18px] !w-[18px] !min-h-[18px] !min-w-[18px]'}
                />
              </Badge>
            </a>
          </div>
        </div>
        {isDeposit && <div className='flex flex-row items-center'>
          <IconWithFallback src={getWalletIcon()} size='sm' />
          <div
            className={cn(
              'ml-1.5 text-regular font-semibold dark:text-grey-8 text-black-4',
              publicKey && balance > 0 ? 'opacity-100' : 'opacity-50'
            )}>
            {truncateBigNumber(balance)}
          </div>
        </div>}
      </div>
    )
  }
