import React, { Dispatch, FC, ReactElement, SetStateAction, useCallback, useEffect, useMemo } from 'react'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Button } from '../../../components'
import { useNFTAMMContext } from '../../../context/nft_amm'
import { signAndUpdateDetails } from '../../../web3/nfts/utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { useDarkMode, useNFTCollections, useWalletModal } from '../../../context'
import { Connect } from '../../../layouts'

const InstantSellCard: FC<{ setDisplayIndex: Dispatch<SetStateAction<number>> }> = ({
  setDisplayIndex
}): ReactElement => {
  const { setInstantSell, currentHighest, setRefreshAPI } = useNFTAMMContext()
  const wallet = useWallet()
  const { mode } = useDarkMode()
  const { myNFTsByCollection } = useNFTCollections()
  const disableAcceptBtn = useMemo(
    () => myNFTsByCollection && myNFTsByCollection?.length === 0,
    [myNFTsByCollection]
  )
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
      <div className={`gridItemRegular ${!disableAcceptBtn && `gridGradient`}`}>
        <div tw="w-[100%] h-[100%] bg-white dark:bg-black-1 rounded-[9.7px] flex flex-col items-center justify-center">
          {disableAcceptBtn ? (
            <img src={`/img/assets/Aggregator/noNFTsToSell${mode}.svg`} tw="w-[60px] h-[66px]" />
          ) : (
            <img src={`/img/assets/Aggregator/InstantSell.svg`} tw="w-[60px] h-[66px]" />
          )}
          <div tw="text-grey-1 dark:text-grey-2 text-regular mt-3">Sell now for</div>
          <div tw="dark:text-grey-5 text-black-4 text-lg">{currentHighest.price.toFixed(2)} SOL</div>
          {publicKey ? (
            <Button
              className={!disableAcceptBtn && 'pinkGradient'}
              disabled={disableAcceptBtn}
              disabledColor={tw`dark:bg-black-2 bg-grey-4 text-grey-5 !opacity-100`}
              onClick={() => handleInstantSellClicked()}
              cssStyle={tw`h-[30px] w-[132px] mt-4 text-white`}
            >
              {disableAcceptBtn ? `No NFTs to Sell` : `Sell Now`}
            </Button>
          ) : (
            <div tw="mt-4">
              <Connect customButtonStyle={[tw`!w-[132px] !min-w-[132px] h-8.75`]} />
            </div>
          )}
          <Button
            onClick={() => setDisplayIndex(4)}
            cssStyle={tw`h-[30px] w-[132px] dark:bg-black-2 bg-grey-5 border-1 border-solid dark:border-black-4 
            border-grey-1 mt-4 text-black-4 dark:text-white`}
          >
            See all offers
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InstantSellCard
