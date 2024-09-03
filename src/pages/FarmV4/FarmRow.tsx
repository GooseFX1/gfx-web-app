import { FC } from 'react'
import { Icon, Badge } from 'gfx-component-lib'
import { useGamma } from '@/context'

const FarmRow: FC<{ token: any, key: string }> = ({ token, key }): JSX.Element => {
  const { setSelectedCard, setOpenDepositWithdrawSlider } = useGamma()
  return(
    <div
    className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 dark:bg-black-2 px-2.5 cursor-pointer
    h-15 border border-solid dark:border-black-4 border-grey-4 bg-white rounded-tiny py-3.75 my-3.75"
    key={key}
    onClick={() => {
      setSelectedCard(token)
      setOpenDepositWithdrawSlider(true)
    }}
  >
    <div className="flex flex-row items-center">
      <Icon
        src={`img/crypto/${token?.sourceToken}.svg`}
        className="border-solid dark:border-black-2 border-white 
          border-[2px] rounded-full h-[25px] w-[25px]"
      />
      <Icon
        src={`img/crypto/${token?.targetToken}.svg`}
        className="relative right-[10px] border-solid dark:border-black-2 
          border-white border-[2px] rounded-full h-[25px] w-[25px]"
      />
      <div className="mr-2.5 font-poppins text-regular font-semibold dark:text-grey-8 text-black-4">
        {token.sourceToken} - {token.targetToken}
      </div>
      <div
        className="border border-solid dark:border-black-4 flex items-center
          font-poppins text-tiny font-semibold dark:text-grey-8 text-black-4
          border-grey-1 bg-grey-5 dark:bg-black-2 rounded-[2.5px] w-10 h-[25px] px-1"
      >
        0.2%
      </div>
      <Icon src={`img/assets/farm_${token?.type}.svg`} size="sm" className="ml-1.5" />
    </div>
    <div className="flex items-center justify-center text-regular font-semibold dark:text-grey-8 text-black-4">
      {token.liquidity}
    </div>
    <div className="flex items-center justify-center text-regular font-semibold dark:text-grey-8 text-black-4">
      {token.volume}
    </div>
    <div className="flex items-center justify-center text-regular font-semibold dark:text-grey-8 text-black-4">
      {token.fees}
    </div>
    <div className="flex items-center justify-center">
      <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
        <span className={'font-poppins font-semibold my-0.5'}>185%</span>
      </Badge>
    </div>
  </div>
  )
}

export default FarmRow
