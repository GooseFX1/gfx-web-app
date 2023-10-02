import React, { Dispatch, FC, ReactElement, SetStateAction, useCallback, useEffect, useMemo } from 'react'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Button } from '../../../components'
import { useNFTAMMContext } from '../../../context/nft_amm'
import { signAndUpdateDetails } from '../../../web3/nfts/utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '../../../context'

const InstantSellCard: FC<{ setDisplayIndex: Dispatch<SetStateAction<number>> }> = ({
  setDisplayIndex
}): ReactElement => {
  const { setInstantSell, currentHighest, setRefreshAPI } = useNFTAMMContext()
  const wallet = useWallet()
  const { setVisible: setWalletModalVisible } = useWalletModal()
  useEffect(() => {
    const interval = setInterval(() => setRefreshAPI((prev) => prev + 1), 15000)
    return () => clearInterval(interval)
  }, [])
  const publicKey = useMemo(() => wallet?.wallet?.adapter?.publicKey?.toBase58(), [wallet?.publicKey])

  const handleInstantSellClicked = useCallback(async () => {
    if (publicKey) await signAndUpdateDetails(wallet?.wallet, true, setInstantSell)
    else setWalletModalVisible(true)
  }, [wallet?.wallet?.adapter, wallet?.wallet?.adapter?.publicKey, setInstantSell])

  return (
    <div tw="pt-4 sm:mt-[-8px] pl-2 pr-2 font-semibold">
      <div className="gridItemRegular gridGradient">
        <div tw="w-[100%] h-[100%] bg-white dark:bg-black-1 rounded-[14px] flex flex-col items-center justify-center">
          <img src={`/img/assets/Aggregator/InstantSell.svg`} tw="w-[60px] h-[66px]" />
          <div tw="text-grey-1 dark:text-grey-2 text-regular mt-3">Sell now for</div>
          <div tw="dark:text-grey-5 text-black-4 text-lg">{currentHighest.toFixed(2)} SOL</div>
          <Button
            onClick={() => handleInstantSellClicked()}
            cssStyle={tw`h-[30px] w-[132px] bg-gradient-1 mt-4 text-white`}
          >
            Sell Now
          </Button>
          <Button
            onClick={() => setDisplayIndex(4)}
            cssStyle={tw`h-[30px] w-[132px] dark:bg-black-2 bg-grey-5 border-1 border-solid dark:border-black-4 
            border-grey-1 mt-5 text-black-4 dark:text-white`}
          >
            See all offers
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InstantSellCard
