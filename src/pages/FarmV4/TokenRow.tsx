import { FC, ReactElement, useMemo } from 'react'
import { useDarkMode } from '@/context'
import { Icon, Badge, cn } from 'gfx-component-lib'
import { truncateAddress } from '@/utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { GAMMAToken } from '@/types'

export const TokenRow: FC<{ token: GAMMAToken; balance: number }> = ({ token, balance }): ReactElement => {
  const { mode } = useDarkMode()
  const { wallet } = useWallet()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])

  const getWalletIcon = () => {
    if (userPublicKey && balance > 0) {
      return `img/assets/wallet-${mode}-enabled.svg`
    } else {
      return `img/assets/wallet-${mode}-disabled.svg`
    }
  }

  return (
    <div className="flex flex-row justify-between items-center mx-2.5">
      <div className="flex flex-row">
        <Icon
          src={token.logoURI ?? `/img/crypto/fallback.svg`}
          size="sm"
          className={`mr-2 border border-solid rounded-circle 
                dark:border-border-darkmode-secondary border-border-lightmode-secondary`}
        />
        <span className="text-regular font-semibold font-poppins dark:text-grey-8 text-black-4 mr-2">
          {token.symbol}
        </span>
        <div className="w-[89px] px-1">
          <a href={`https://solscan.io/account/${token.address}`} target="_blank" rel="noreferrer">
            <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
              <span className={'font-poppins font-semibold my-0.5 mr-2'}>{truncateAddress(token.address, 3)}</span>
              <Icon
                src={`/img/assets/arrowcircle-${mode}.svg`}
                className={'!h-[18px] !w-[18px] !min-h-[18px] !min-w-[18px]'}
              />
            </Badge>
          </a>
        </div>
      </div>
      <div className={'flex flex-row items-center'}>
        <Icon src={getWalletIcon()} size="sm" />
        <div
          className={cn(
            'ml-1.5 text-regular font-semibold dark:text-grey-8 text-black-4',
            userPublicKey && balance > 0 ? 'opacity-100' : 'opacity-50'
          )}
        >
          {`${balance} ${token.symbol}`}
        </div>
      </div>
    </div>
  )
}
