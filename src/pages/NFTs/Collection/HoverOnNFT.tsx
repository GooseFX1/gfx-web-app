import { Dispatch, FC, ReactElement, SetStateAction, useCallback, useMemo } from 'react'
import { Button } from '../../../components/Button'
/* eslint-disable @typescript-eslint/no-unused-vars */

import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { useNFTAggregator, useNFTProfile, useWalletModal } from '../../../context'
import { BaseNFT, INFTAsk, INFTBid } from '../../../types/nft_details'
import { formatSOLDisplay } from '../../../utils'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { removeNFTFromBag } from '../../../web3/nfts/utils'
import { NFT_MARKETS } from '../../../api/NFTs'
const DIV = styled.div``

export const HoverOnNFT: FC<{
  mintAddress?: string
  collectionName?: string
  addNftToBag?: any
  item: BaseNFT
  myBidToNFT: INFTBid[]
  ask: INFTAsk
  showBid?: boolean
  buttonType: string
  setNFTDetails: () => void
  setHover?: Dispatch<SetStateAction<boolean>>
  setIsLoadingBeforeRelocate: Dispatch<SetStateAction<boolean>>
}> = ({
  item,
  ask,
  setNFTDetails,
  buttonType,
  myBidToNFT,
  showBid,
  setHover,
  addNftToBag,
  setIsLoadingBeforeRelocate
}): ReactElement => {
  const { sessionUser } = useNFTProfile()
  const {
    setBidNow,
    setBuyNow,
    setSellNFT,
    setOpenJustModal,
    setCancelBidClicked,
    setDelistNFT,
    operatingNFT,
    nftInBag,
    setNftInBag
  } = useNFTAggregator()
  const { setVisible } = useWalletModal()

  const showBidBtn = useMemo(
    () =>
      buttonType !== 'Modify' &&
      buttonType !== 'Sell' &&
      myBidToNFT.length === 0 &&
      (showBid || (ask && !ask.marketplace_name)),
    [ask, buttonType, myBidToNFT, showBid]
  )

  const isLoading: boolean = useMemo(() => operatingNFT.has(item?.mint_address), [operatingNFT])

  const goToDetailsForModal = useCallback(
    async (e, type) => {
      e.stopPropagation()
      if (sessionUser === null) {
        setVisible(true)
        return
      }

      setOpenJustModal(true)
      setIsLoadingBeforeRelocate(true)
      await setNFTDetails()
      setIsLoadingBeforeRelocate(false)
      setHover(false)

      switch (type) {
        case 'delist':
          setDelistNFT(true)
          break
        case 'bid':
          setBidNow(true)
          break
        case 'sell':
          setSellNFT(true)
          break
        case 'buy':
          setBuyNow(true)
          break
        case 'cancel':
          setCancelBidClicked(true)
          break
      }
    },
    [sessionUser, ask, setNFTDetails, setHover, item]
  )
  const shouldShowImage = false //
  //useMemo(
  //   () =>
  //     addNftToBag &&
  //     ask &&
  //     !nftInBag[item?.mint_address] &&
  //     (ask?.marketplace_name === NFT_MARKETS.MAGIC_EDEN ||
  //       ask.marketplace_name === NFT_MARKETS.TENSOR ||
  //       !ask.marketplace_name),
  //   [ask, nftInBag, item, addNftToBag]
  // )

  const addedToBagImg = useMemo(
    () => addNftToBag && ask && nftInBag[item?.mint_address] !== undefined,
    [ask, nftInBag, item, addNftToBag]
  )

  return (
    <div className="hoverNFT">
      {shouldShowImage && (
        <img
          className="hoverAddToBag"
          src={`/img/assets/Aggregator/addToBag.svg`}
          alt=""
          onClick={(e) => addNftToBag(e, item, ask)}
        />
      )}
      {addedToBagImg && (
        <img
          className="hoverAddToBag"
          src={`/img/assets/Aggregator/addedToBag.svg`}
          alt=""
          onClick={(e) => removeNFTFromBag(item?.mint_address, setNftInBag, e)}
        />
      )}
      {myBidToNFT.length > 0 && (
        <div
          tw="flex absolute dark:text-grey-5 bottom-[50px] text-black-4 left-[30px] font-semibold
           !text-[15px] items-center"
        >
          {`My Bid: `}
          <PriceWithToken
            price={formatSOLDisplay(myBidToNFT[0].buyer_price)}
            token="SOL"
            cssStyle={tw`h-5 w-5 !text-black-4 dark:!text-grey-5 ml-1`}
          />
        </div>
      )}
      <span className="hoverButtons">
        {buttonType === 'Sell' && (
          <Button
            loading={isLoading}
            disabled={isLoading}
            cssStyle={tw`bg-red-2 h-[35px] w-[80px] text-[13px] sm:w-[70px] font-semibold  sm:ml-1 `}
            onClick={(e) => goToDetailsForModal(e, 'sell')}
          >
            List Item
          </Button>
        )}
        {buttonType === 'Modify' && (
          <>
            <Button
              loading={isLoading}
              disabled={isLoading}
              cssStyle={tw`bg-red-2 h-[35px] w-[75px] text-[13px] sm:w-[70px] font-semibold mr-2 sm:ml-1 `}
              onClick={(e) => goToDetailsForModal(e, 'delist')}
            >
              Delist
            </Button>
            <Button
              loading={isLoading}
              disabled={isLoading}
              cssStyle={tw`bg-blue-1 h-[35px] w-[75px] text-[13px] sm:w-[70px] font-semibold  sm:ml-1 `}
              onClick={(e) => goToDetailsForModal(e, 'sell')}
            >
              Modify
            </Button>
          </>
        )}
        {buttonType !== 'Modify' && buttonType !== 'Sell' && myBidToNFT.length > 0 && (
          <Button
            loading={isLoading}
            disabled={isLoading}
            cssStyle={tw`bg-red-2  h-[35px] w-[75px] mr-[5px] text-[13px] font-semibold `}
            onClick={(e) => goToDetailsForModal(e, 'cancel')}
          >
            Cancel
          </Button>
        )}

        {showBidBtn && (
          <Button
            loading={isLoading}
            disabled={isLoading}
            cssStyle={tw`bg-[#5855ff]   h-[35px] w-[75px] mr-[5px] text-[13px] font-semibold `}
            onClick={(e) => goToDetailsForModal(e, 'bid')}
          >
            Bid
          </Button>
        )}

        {ask && (
          <Button
            className="pinkGradient"
            loading={isLoading}
            disabled={isLoading}
            cssStyle={tw`text-[13px] font-semibold h-[35px] sm:h-[30px] w-[80px] sm:w-[75px]  sm:ml-1 sm:text-[13px] `}
            onClick={(e) => goToDetailsForModal(e, 'buy')}
          >
            Buy now
          </Button>
        )}
      </span>
    </div>
  )
}
