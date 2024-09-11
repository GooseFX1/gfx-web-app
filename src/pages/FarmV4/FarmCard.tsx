import { useGamma } from '@/context'
import { Badge, Button, cn, Icon } from 'gfx-component-lib'
import { FC, ReactElement } from 'react'
import { PoolStats } from './PoolStats'
import { GAMMAPool } from '@/types/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'

const FarmCard: FC<{
  token: GAMMAPool,
  key: string
  className?: string
}> = ({ token, key, className }): ReactElement => {
  const { setOpenDepositWithdrawSlider, setSelectedCard } = useGamma()
  const {publicKey} = useWalletBalance()
  return (
    <div
      className={cn(`h-[207px] w-full border 
        border-solid dark:border-black-4 border-grey-4 bg-white dark:bg-black-2 p-2.5 rounded-[8px]`,
        className)
      }
      key={key}
    >
      <div className="flex flex-row justify-between mb-2.5">
        <div className="flex relative">
          <Icon
            src={`img/crypto/${token?.mintA.logoURI}.svg`}
            size="lg"
            className={'border-solid dark:border-black-2 border-white border-[3px] rounded-full'}
          />
          <Icon
            src={`img/crypto/${token?.mintB.logoURI}.svg`}
            size="lg"
            className={
              'absolute left-[30px] border-solid dark:border-black-2 border-white border-[3px] rounded-full'
            }
          />
        </div>
        <Button
          className="cursor-pointer bg-blue-1 text-white h-[30px]"
          variant={'secondary'}
          onClick={() => {
            setSelectedCard(token)
            setOpenDepositWithdrawSlider(true)
          }}
        >
          Deposit
        </Button>
      </div>
      <div
        className="flex flex-row items-center text-average font-semibold font-poppins 
            dark:text-grey-8 text-black-4 mb-2"
      >
        {`${token.mintA.name} - ${token.mintB.name}`}
        <Icon src={`img/assets/farm_${token.pool_type}.svg`} size="sm" className="ml-1.5" />
        {token.config.fundOwner == publicKey.toBase58() && (
          <Badge size="sm" variant="default">
            Owner
          </Badge>
        )}
      </div>
      <PoolStats token={token} />
    </div>
  )
}

export default FarmCard