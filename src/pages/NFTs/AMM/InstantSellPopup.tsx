import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { PopupCustom } from '../Popup/PopupCustom'
import useBreakPoint from '../../../hooks/useBreakPoint'
import { useAccounts, useConnectionConfig, useNFTCollections } from '../../../context'
import { NFTCardView } from '../Collection/CollectionSweeper'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { Button } from '../../../components'
import { sellNFTOrderAMM } from '../../../api/NFTs'
import { USER_CONFIG_CACHE } from '../../../types/app_params'
import { VersionedTransaction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { WRAPPED_SOL_MINT } from '@metaplex-foundation/js'
import { formatSOLDisplay } from '../../../utils'
import { useNFTAMMContext } from '../../../context/nft_amm'
import { confirmTransaction } from '../../../web3'
import { pleaseTryAgainAMM } from '../Collection/AggModals/AggNotifications'
import MissionAccomplishedModal from '../Collection/AggModals/MissionAcomplishedModal'
import { HoldTight } from '../Collection/AggModals/HoldTight'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'

const STYLED_POPUP = styled(PopupCustom)`
  ${tw`dark:bg-black-2 bg-white`};
  .ant-modal-body {
    ${tw`p-4 sm:p-2`}
  }
  &.ant-modal {
    ${tw`max-w-full sm:bottom-[-8px] sm:mt-auto sm:absolute sm:h-[600px] !p-4`}
    border-radius: 20px;

    @media (max-width: 500px) {
      border-radius: 20px 20px 0 0;
    }
  }
  .ant-modal-content .ant-modal-body {
    height: 100% !important;
  }
  .hideScrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .pinkGradient {
    background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
  }
  .ant-modal-close {
    ${tw`absolute top-5 right-5`}

    .ant-modal-close-x {
      ${tw`sm:h-[18px] sm:w-[18px] h-5 w-5 flex`}
    }
  }
`

const InstantSellPopup = (): ReactElement => {
  const breakpoint = useBreakPoint()
  const { instantSellClicked, setInstantSell } = useNFTAMMContext()
  const { myNFTsByCollection } = useNFTCollections()
  const { singleCollection } = useNFTCollections()
  const { activeOrders, currentHighest, selectedNFT, setSelectedNFT, selectedBidFromOrders, setCurrentHighest } =
    useNFTAMMContext()
  const slug = useMemo(() => singleCollection && singleCollection[0].slug_tensor, [singleCollection])
  const walletContext = useWallet()

  const { wallet } = useWallet()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { connection } = useConnectionConfig()
  const userCache: USER_CONFIG_CACHE | null = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
  const { getUIAmount } = useAccounts()
  const [missionAccomplished, setMissionAccomplished] = useState<boolean>(false)
  const solBalance = useMemo(
    () => getUIAmount(WRAPPED_SOL_MINT.toString()),
    [wallet?.adapter, wallet?.adapter?.publicKey]
  )

  useEffect(() => {
    if (selectedBidFromOrders)
      setCurrentHighest(parseFloat(selectedBidFromOrders?.sellNowPrice) / LAMPORTS_PER_SOL_NUMBER)
  }, [selectedBidFromOrders])

  const marketFees = useMemo(() => currentHighest * 0.04, [currentHighest])
  const creatorRoyalties = useMemo(() => currentHighest * 0.05, [currentHighest])
  const youWillReceive = useMemo(
    () => currentHighest - marketFees - creatorRoyalties,
    [currentHighest, marketFees, creatorRoyalties]
  )

  const handleNotifications = async (signature: any): Promise<void> => {
    try {
      const confirm = await confirmTransaction(connection, signature, 'processed')
      if (confirm.value.err === null) {
        setIsLoading(false)
        setMissionAccomplished(true)
        setTimeout(() => setInstantSell(false), 3000)
      }
    } catch (error) {
      pleaseTryAgainAMM(error?.message)
    }
  }

  const handleInstantSellClick = useCallback(async () => {
    setIsLoading(true)
    const sellOrder = await sellNFTOrderAMM(
      selectedNFT?.mint_address, // mint
      slug,
      selectedBidFromOrders?.address ?? activeOrders[0].address, //pool
      selectedBidFromOrders?.sellNowPrice ?? activeOrders[0].sellNowPrice, // price
      userCache?.jwtToken
    )

    try {
      const instantSellTx = await VersionedTransaction.deserialize(sellOrder.txs[0].txV0.data)
      const instantSellSig = await walletContext.sendTransaction(instantSellTx, connection)
      await handleNotifications(instantSellSig)
    } catch (err) {
      pleaseTryAgainAMM(err?.message)
      setIsLoading(false)
      console.log(err)
    }
  }, [activeOrders, selectedNFT, slug, activeOrders, userCache?.jwtToken])

  return (
    <STYLED_POPUP
      height={breakpoint.isMobile ? '568px' : '689px'}
      width={breakpoint.isMobile ? '100%' : '500px'}
      title={null}
      centered={breakpoint.isDesktop ? true : false}
      visible={instantSellClicked ? true : false}
      onCancel={() => setInstantSell(false)}
      footer={null}
    >
      {missionAccomplished ? (
        <MissionAccomplishedModal
          price={(currentHighest * LAMPORTS_PER_SOL_NUMBER).toString()}
          displayStr="You Successfully sold:"
        />
      ) : isLoading ? (
        <HoldTight />
      ) : (
        <div tw="flex flex-col items-center justify-center">
          <div tw="flex  items-center justify-center">
            {breakpoint.isDesktop && <img src="/img/assets/Aggregator/InstantSell.svg" tw="w-[58px] h-[50px]" />}
            <div tw="text-lg ml-1 dark:text-grey-5 font-semibold text-black-4">Sell Now</div>
          </div>
          <div tw="mt-4 sm:mt-2 dark:text-grey-2 text-grey-1 font-semibold text-average">
            {myNFTsByCollection.length ? `Select NFT(s) that you will like to sell` : 'No NFTs to sell'}
          </div>
          <div className="hideScrollbar" tw="w-[110%] pl-5 flex overflow-x-auto mt-[-5px] h-[290px] sm:h-[240px]">
            {myNFTsByCollection.map((nft, index) => (
              <NFTCardView
                key={index}
                nft={nft.data[0]}
                showPrice={currentHighest.toFixed(3)}
                setSelectedNFT={setSelectedNFT}
                mintAddress={selectedNFT?.mint_address}
              />
            ))}
          </div>
          <div tw="h-[65px]  sm:h-[50px] flex items-center flex-col">
            {myNFTsByCollection.length !== 0 && (
              <>
                <div tw="text-average font-semibold dark:text-grey-2 text-grey-1 mt-4 sm:mt-0">Current Offer</div>
                <div>
                  <PriceWithToken
                    token="SOL"
                    price={currentHighest.toFixed(3)}
                    cssStyle={tw`font-semibold text-lg h-5 w-5 text-lg`}
                  />{' '}
                </div>
              </>
            )}
          </div>

          <div tw=" w-[calc(100% - 12px)] mt-4 sm: mt-1 font-semibold text-regular">
            <div tw="flex items-center justify-between dark:text-grey-2 text-grey-1">
              <div>Wallet Balance</div>
              <div>{formatSOLDisplay(solBalance)} SOL</div>
            </div>
            <div tw="flex items-center justify-between dark:text-grey-2 text-black-1">
              <div>Marketplace Fees</div>
              <div>{marketFees.toFixed(3)} SOL</div>
            </div>
            <div tw="flex items-center justify-between dark:text-grey-2 text-black-1">
              <div>Creator royalties</div>
              <div>{creatorRoyalties.toFixed(3)} SOL</div>
            </div>
            <div tw="flex items-center justify-between dark:text-grey-2 text-black-1">
              <div>Marketplace</div>
              <div tw="flex">
                <img tw="h-5 w-5 mr-2" src={`/img/assets/Aggregator/Tensor.svg`} />
                Tensor
              </div>
            </div>
            <div tw="flex items-center justify-between dark:text-grey-5 text-black-4">
              <div>You will receive</div>
              <div>{youWillReceive.toFixed(2)} SOL</div>
            </div>
          </div>
          <Button
            loading={isLoading}
            className={selectedNFT ? 'pinkGradient' : ''}
            disabled={selectedNFT ? false : true}
            onClick={handleInstantSellClick}
            disabledColor={tw`dark:bg-black-1 bg-grey-4`}
            cssStyle={tw`h-10 w-[100%] text-regular font-semibold mt-4`}
          >
            {selectedNFT ? `Accept Offer for ${youWillReceive.toFixed(2)} SOL` : 'Select NFT'}
          </Button>
        </div>
      )}
    </STYLED_POPUP>
  )
}

export default InstantSellPopup
