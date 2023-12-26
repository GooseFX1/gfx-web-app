import { Dispatch, FC, ReactElement, SetStateAction, useCallback, useMemo } from 'react'
import { Button } from '../../../components'
import { useNFTAggregator, useNFTProfile, useWalletModal } from '../../../context'
import { BaseNFT, INFTAsk, INFTBid } from '../../../types/nft_details'
import tw from 'twin.macro'
import 'styled-components/macro'

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
}> = ({ item, ask, setNFTDetails, buttonType, setHover, setIsLoadingBeforeRelocate }): ReactElement => {
  const { sessionUser } = useNFTProfile()
  const { setBidNow, setBuyNow, setSellNFT, setOpenJustModal, setCancelBidClicked, setDelistNFT, operatingNFT } =
    useNFTAggregator()
  const { setVisible } = useWalletModal()
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

  return (
    <div className="hoverNFT">
      {/* {shouldShowImage && (
        <img
          className="hoverAddToBag"
          src={`/img/assets/Aggregator/addToBag.svg`}
          alt=""
          onClick={(e) => addNftToBag(e, item, ask)}
        />
      )} */}
      {/* {addedToBagImg && (
        <img
          className="hoverAddToBag"
          src={`/img/assets/Aggregator/addedToBag.svg`}
          alt=""
          onClick={(e) => removeNFTFromBag(item?.mint_address, setNftInBag, e)}
        />
      )} */}
      {/* {myBidToNFT.length > 0 && (
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
      )} */}

      {buttonType === 'Modify' && (
        <span className="hoverButtons">
          <Button
            loading={isLoading}
            disabled={isLoading}
            cssStyle={tw`bg-red-2 h-[35px] w-[90%] text-[13px] sm:w-[70px] font-semibold sm:ml-1 `}
            onClick={(e) => goToDetailsForModal(e, 'delist')}
          >
            Delist
          </Button>
          {/* <Button
              loading={isLoading}
              disabled={isLoading}
              cssStyle={tw`bg-blue-1 h-[35px] w-[75px] text-[13px] sm:w-[70px] font-semibold  sm:ml-1 `}
              onClick={(e) => goToDetailsForModal(e, 'sell')}
            >
              Modify
            </Button> */}
        </span>
      )}
      {/* {buttonType !== 'Modify' && myBidToNFT.length > 0 && (
        <Button
          loading={isLoading}
          disabled={isLoading}
          cssStyle={tw`bg-red-2  h-[35px] w-[75px] mr-[5px] text-[13px] font-semibold `}
          onClick={(e) => goToDetailsForModal(e, 'cancel')}
        >
          Cancel
        </Button>
      )} */}
    </div>
  )
}
