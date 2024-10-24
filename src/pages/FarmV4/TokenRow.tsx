import { FC, ReactElement, useMemo } from 'react'
import { useDarkMode, useGamma } from '@/context'
import { Badge, cn, Icon } from 'gfx-component-lib'
import { loadIconImage, truncateAddress, truncateBigNumber, truncateBigString } from '@/utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { GAMMAToken } from '@/types/gamma'

export const TokenRow: FC<{
  isMintA: boolean
  token: GAMMAToken
  balance: number
  isDeposit: boolean
}> =
  ({ isMintA,
    token,
    balance,
    isDeposit
  }): ReactElement => {
    const { mode } = useDarkMode()
    const { wallet } = useWallet()
    const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
    const { withdrawableBalanceA, withdrawableBalanceB, selectedCardPool } = useGamma()

    const getWalletIcon = () =>
      (userPublicKey && balance > 0) ?
        `img/assets/wallet-${mode}-enabled.svg` :
        `img/assets/wallet-${mode}-disabled.svg`

    if (token == undefined) return <></>
    return (
      <div className="flex flex-row justify-between items-center mx-2.5">
        <div className="flex flex-row">
          <Icon
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
                <Icon
                  src={`/img/assets/arrowcircle-${mode}.svg`}
                  className={'!h-[18px] !w-[18px] !min-h-[18px] !min-w-[18px]'}
                />
              </Badge>
            </a>
          </div>
        </div>
        <div className={'flex flex-row items-center'}>
          {isDeposit && (<Icon src={getWalletIcon()} size="sm" />)}
          <div
            className={cn(
              'ml-1.5 text-regular font-semibold dark:text-grey-8 text-black-4',
              userPublicKey && balance > 0 ? 'opacity-100' : 'opacity-50'
            )}
          >
            {isDeposit ?
              truncateBigNumber(balance) : isMintA ? truncateBigString(withdrawableBalanceA?.toString(),
              selectedCardPool?.mint0Decimals) : truncateBigString(withdrawableBalanceB?.toString(),
              selectedCardPool?.mint1Decimals)}
            {!isDeposit && ' in pool'}
          </div>
        </div>
      </div>
    )
  }
