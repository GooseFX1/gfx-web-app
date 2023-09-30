import React, { Dispatch, FC, ReactElement, SetStateAction, useEffect } from 'react'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Button } from '../../../components'
import { useNFTAMMContext } from '../../../context/nft_amm'

const InstantSellCard: FC<{ setDisplayIndex: Dispatch<SetStateAction<number>> }> = ({
  setDisplayIndex
}): ReactElement => {
  const { setInstantSell, currentHighest, setRefreshAPI } = useNFTAMMContext()

  useEffect(() => {
    const interval = setInterval(() => setRefreshAPI((prev) => prev + 1), 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div tw="pt-4 pl-2 pr-2 font-semibold">
      <div className="gridItemRegular gridGradient">
        <div tw="w-[100%] h-[100%] bg-white dark:bg-black-1 rounded-[14px] flex flex-col items-center justify-center">
          <img src={`/img/assets/Aggregator/InstantSell.svg`} tw="w-[60px] h-[66px]" />
          <div tw="text-grey-1 dark:text-grey-2 text-regular mt-3">Sell now for</div>
          <div tw="dark:text-grey-5 text-black-4 text-lg">{currentHighest.toFixed(2)} SOL</div>
          <Button onClick={() => setInstantSell(true)} cssStyle={tw`h-[30px] w-[132px] bg-gradient-1 mt-4`}>
            Sell Now
          </Button>
          <Button
            onClick={() => setDisplayIndex(4)}
            cssStyle={tw`h-[30px] w-[132px] dark:bg-black-2 bg-white border-1 border-solid dark:border-black-4 
            border-grey-5 mt-5`}
          >
            See all offers
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InstantSellCard
