import React, { ReactElement, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { PopupCustom } from '../Popup/PopupCustom'
/* eslint-disable @typescript-eslint/no-unused-vars */
import useBreakPoint from '../../../hooks/useBreakPoint'
import { useAccounts, useConnectionConfig, useNFTCollections } from '../../../context'
import { NFTCardView } from '../Collection/CollectionSweeper'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { Button } from '../../../components'
import { sellMENFTOrderAMM, sellNFTOrderAMM } from '../../../api/NFTs'
import { USER_CONFIG_CACHE } from '../../../types/app_params'
import { VersionedTransaction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { WRAPPED_SOL_MINT } from '@metaplex-foundation/js'
import { formatSOLDisplay } from '../../../utils'
import { useNFTAMMContext } from '../../../context/nft_amm'
import { confirmTransaction, getParsedAccountByMint } from '../../../web3'
import { pleaseTryAgainAMM } from '../Collection/AggModals/AggNotifications'
import MissionAccomplishedModal from '../Collection/AggModals/MissionAcomplishedModal'
import { HoldTight } from '../Collection/AggModals/HoldTight'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'

const STYLED_POPUP = styled(PopupCustom)<{ $hideClose?: boolean }>`
  ${tw`dark:bg-black-2 bg-white`};
  .ant-modal-body {
    ${tw`p-0 sm:p-0`}
  }
  &.ant-modal {
    ${tw`max-w-full sm:bottom-[-8px] sm:mt-auto sm:absolute sm:h-[600px] !p-2.5`}
    border-radius: 10px;

    @media (max-width: 500px) {
      border-radius: 10px 10px 0 0;
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
    ${tw`absolute top-3 right-2 sm:top-1.5`}
    .ant-modal-close-x {
      ${tw`sm:h-[18px] sm:w-[18px] h-5 w-5 flex`}
      visibility: ${({ $hideClose }) => ($hideClose ? 'hidden' : 'visible')};
    }
  }
`

const InstantSellPopup = (): ReactElement => {
  const breakpoint = useBreakPoint()
  const { instantSellClicked, setInstantSell } = useNFTAMMContext()
  const { myNFTsByCollection } = useNFTCollections()
  const { singleCollection } = useNFTCollections()
  const { activeOrders, currentHighest, selectedNFT, setSelectedNFT, selectedBidFromOrders, collectionRoyalty } =
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
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])

  const displayParams = useMemo(
    () => ({
      price:
        currentHighest.marketPlace === 'Tensor'
          ? (currentHighest.price * (1 - collectionRoyalty)).toFixed(3)
          : currentHighest.price.toFixed(3),
      marketPlace: currentHighest.marketPlace
    }),
    [currentHighest, collectionRoyalty]
  )
  const marketFees = useMemo(() => parseFloat(displayParams.price) * 0.015, [currentHighest, collectionRoyalty])
  const creatorRoyalties = useMemo(
    () => parseFloat(displayParams.price) * collectionRoyalty,
    [currentHighest, collectionRoyalty]
  )
  const youWillReceive = useMemo(() => {
    if (currentHighest.marketPlace === 'Tensor') {
      return currentHighest.price * (1 - collectionRoyalty)
    } else {
      return currentHighest.price
    }
  }, [currentHighest, marketFees, creatorRoyalties])

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

    if (currentHighest.marketPlace === 'Magiceden') {
      const parsedAccount = await getParsedAccountByMint({ mintAddress: selectedNFT?.mint_address, connection })
      const sellOrder = await sellMENFTOrderAMM(
        currentHighest.pool,
        currentHighest.price.toString(),
        publicKey.toString(),
        selectedNFT?.mint_address, // mint
        parsedAccount?.pubkey,
        userCache?.jwtToken
      )
      try {
        const instantSellTxMe = await VersionedTransaction.deserialize(sellOrder.txSigned.data)
        const instantSellSigMe = await walletContext.sendTransaction(instantSellTxMe, connection)
        await handleNotifications(instantSellSigMe)
      } catch (err) {
        setIsLoading(false)
        pleaseTryAgainAMM(err?.message)
      }
    }
    if (currentHighest.marketPlace === 'Tensor') {
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
      }
    }
  }, [activeOrders, selectedNFT, slug, userCache?.jwtToken])

  return (
    <STYLED_POPUP
      height={breakpoint.isMobile ? '545px' : '689px'}
      width={breakpoint.isMobile ? '100%' : '500px'}
      title={null}
      $hideClose={isLoading}
      centered={breakpoint.isDesktop ? true : false}
      visible={instantSellClicked ? true : false}
      onCancel={() => setInstantSell(false)}
      footer={null}
    >
      {missionAccomplished ? (
        <MissionAccomplishedModal
          price={(currentHighest.price * LAMPORTS_PER_SOL_NUMBER).toString()}
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
          <div tw="mt-2 sm:mt-0 dark:text-grey-2 text-grey-1 font-semibold text-average sm:text-regular">
            {myNFTsByCollection.length ? `Select NFT(s) that you will like to sell` : 'No NFTs to sell'}
          </div>
          <div
            className="hideScrollbar"
            tw="w-[104%] sm:mt-[-5px] pl-3 flex overflow-x-auto mt-[-5px] h-[290px] sm:h-[238px]"
          >
            {myNFTsByCollection &&
              myNFTsByCollection.map((nft, index) => (
                <NFTCardView
                  key={index}
                  nft={nft.data[0]}
                  showPrice={displayParams.price}
                  setSelectedNFT={setSelectedNFT}
                  mintAddress={selectedNFT?.mint_address}
                />
              ))}
          </div>
          <div tw="h-[65px]  sm:h-auto flex items-center flex-col mb-1">
            {myNFTsByCollection && myNFTsByCollection.length !== 0 && (
              <div tw="sm:pt-2 sm:flex-row items-center flex flex-col">
                <div
                  tw="text-average sm:text-regular font-semibold  dark:text-grey-2 text-grey-1 mt-4  sm:mr-1.5
                 sm:mt-1"
                >
                  Current Offer:
                </div>
                <div>
                  {breakpoint.isDesktop ? (
                    <PriceWithToken
                      token="SOL"
                      price={displayParams.price}
                      cssStyle={tw`font-semibold dark:text-grey-5 text-black-4 text-average h-5 w-5 sm:text-regular`}
                    />
                  ) : (
                    <div tw="font-semibold dark:text-grey-5 text-black-4 sm:text-regular">
                      {displayParams.price} SOL
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div tw=" w-[calc(100% - 12px)] mt-4 sm:mt-1 font-semibold text-regular">
            {breakpoint.isDesktop && (
              <div tw="flex items-center justify-between dark:text-grey-2 text-grey-1">
                <div>Wallet Balance</div>
                <div>{formatSOLDisplay(solBalance)} SOL</div>
              </div>
            )}
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
                <img tw="h-5 w-5 mr-2" src={`/img/assets/Aggregator/${currentHighest.marketPlace}.svg`} />
                {currentHighest.marketPlace}
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
            cssStyle={tw`h-10 w-[calc(100% - 10px)] text-regular font-semibold mt-5 sm:mt-3`}
          >
            {selectedNFT ? `Accept Offer for ${youWillReceive.toFixed(2)} SOL` : 'Select NFT(s)'}
          </Button>
          <TermsText />
        </div>
      )}
    </STYLED_POPUP>
  )
}

const TermsText = () => {
  const breakpoint = useBreakPoint()
  return (
    <div tw="text-center pt-2 text-grey-1 dark:text-grey-2 ">
      By selecting "Accept Offer" you agree {breakpoint.isMobile && <br />} to{' '}
      <a
        target="_blank"
        tw="dark:text-grey-5 text-blue-1"
        rel="noopener noreferrer"
        href="https://docs.goosefx.io/risks"
      >
        <u tw="text-grey-5 font-semibold"> Terms of Service</u>
      </a>
    </div>
  )
}
export default InstantSellPopup
