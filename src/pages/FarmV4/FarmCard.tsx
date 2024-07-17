import { useSSLContext } from '@/context'
import { Button, Icon } from 'gfx-component-lib'
import { ReactElement, FC } from 'react'
import { PoolStats } from './PoolStats'

export const FarmCard: FC<{ token: any }> = ({ token }): ReactElement => {
  const { setOperationPending, setSelectedCard } = useSSLContext()
  return (
    <div
      className="h-[207px] w-full bg-red-100 border 
        border-solid dark:border-black-4 border-grey-4 bg-white dark:bg-black-2 p-2.5 rounded-[8px]"
    >
      <div className="flex flex-row justify-between mb-2.5">
        <div className="flex relative">
          <Icon
            src={`img/crypto/${token?.sourceToken}.svg`}
            size="lg"
            className={'border-solid dark:border-black-2 border-white border-[3px] rounded-full'}
          />
          <Icon
            src={`img/crypto/${token?.targetToken}.svg`}
            size="lg"
            className={'absolute left-[30px] border-solid dark:border-black-2 border-white border-[3px] rounded-full'}
          />
        </div>
        <Button
          className="cursor-pointer bg-blue-1 text-white"
          variant={'secondary'}
          onClick={() => {
            setSelectedCard(token)
            setOperationPending(true)
          }}
        >
          Deposit
        </Button>
      </div>
      <div
        className="flex flex-row items-center text-average font-semibold font-poppins 
            dark:text-grey-8 text-black-4 mb-2"
      >
        {`${token?.sourceToken} - ${token?.targetToken}`}
        <Icon src={`img/assets/farm_${token?.type}.png`} size="sm" className="ml-1.5" />
      </div>
      <PoolStats token={token} />
    </div>
  )
}
