import { FC, ReactElement, useMemo } from 'react'
import { useDarkMode } from '@/context'
import { Icon, Badge, cn } from 'gfx-component-lib'
import { truncateAddress } from '@/utils'
import { useWallet } from '@solana/wallet-adapter-react'
import BigNumber from 'bignumber.js'

export const TokenRow: FC<{ token: any; balance: any }> = ({ token, balance }): ReactElement => {
  const { mode } = useDarkMode()
  const { wallet } = useWallet()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const tokenAccount = "FdUm8MtCFGMC2UvxEV2bywKBQaP6es7osMwqZ9i2Gbvi"

  return (
    <div className="flex flex-row justify-between mx-2.5">
      <div className="flex flex-row items-center items-center">
        <Icon src={`img/crypto/${token}.svg`} size="sm" className="mr-2" />
        <span className="text-regular font-semibold font-poppins dark:text-grey-8 text-black-4 mr-2">{token}</span>
        <div className="w-[89px] px-1">
          <a href={`https://solscan.io/account/${tokenAccount}`} target="_blank" rel="noreferrer">
            <Badge variant="default" size={'lg'} >
              <span className={'font-poppins font-semibold my-0.5 mr-2'}>{truncateAddress(tokenAccount, 3)}</span>
              <Icon
                src={`/img/assets/arrowcircle-${mode}.svg`}
                className={'!h-[18px] !w-[18px] !min-h-[18px] !min-w-[18px]'}
              />
            </Badge>
          </a>
        </div>
      </div>
      <div
        className={cn(
          'flex flex-row items-center',
          userPublicKey && balance.gt(new BigNumber(0)) ? 'opacity-100' : 'opacity-50'
        )}
      >
        <Icon src={`/img/mainnav/changeWallet-${mode}.svg`} size="sm" />
        <div className={'ml-1.5 text-regular font-semibold dark:text-grey-8 text-black-4'}>
          {`${balance} ${token}`}
        </div>
      </div>
    </div>
  )
}
