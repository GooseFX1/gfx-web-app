import { useState, FC, useEffect, useMemo, ReactElement } from 'react'
import axios from 'axios'
import {
  useConnectionConfig,
  useNFTCollections,
  useNFTAggregator,
  useNFTDetails,
  useNFTProfile,
  usePriceFeedFarm,
  useWalletModal
} from '../../../context'
/* eslint-disable @typescript-eslint/no-unused-vars */

import { GradientText } from '../adminPage/components/UpcomingMints'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { BaseNFT, INFTAsk, INFTBid, INFTGeneralData } from '../../../types/nft_details'
import { fetchSingleNFT } from '../../../api/NFTs'
import { getParsedAccountByMint, StringPublicKey, AH_NAME } from '../../../web3'
import { LoadingDiv } from './Card'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { Button } from '../../../components/Button'
import tw from 'twin.macro'
import 'styled-components/macro'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { useHistory } from 'react-router-dom'
import { notify } from '../../../utils'
import { genericErrMsg } from '../../Farm/FarmClickHandler'
import { GFXApprisalPopup } from '../../../components/NFTAggWelcome'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { useWallet } from '@solana/wallet-adapter-react'

export const SingleNFTCard: FC<{ item: BaseNFT; index: number; addNftToBag: any; lastCardRef: any }> = ({
  item,
  index,
  addNftToBag,
  lastCardRef
}) => {
  const { sessionUser } = useNFTProfile()
  const { connection } = useConnectionConfig()
  const { singleCollection } = useNFTCollections()
  const { setBids, setAsk, setTotalLikes, setNftMetadata, setGeneral } = useNFTDetails()
  const [apprisalPopup, setGFXApprisalPopup] = useState<boolean>(false)

  const [hover, setHover] = useState<boolean>(false)
  const [localBids, setLocalBids] = useState<INFTBid[]>([])
  const [localAsk, setLocalAsk] = useState<INFTAsk | null>(null)
  const [localTotalLikes, setLocalTotalLikes] = useState<number>()
  const [localSingleNFT, setlocalSingleNFT] = useState(undefined)
  const [isLoadingBeforeRelocate, setIsLoadingBeforeRelocate] = useState<boolean>(false)
  const history = useHistory()
  const nftId = item ? (item.nft_name.includes('#') ? item.nft_name.split('#')[1] : item.nft_name) : null
  const isFavorite = useMemo(() => (sessionUser ? sessionUser.user_likes.includes(item.uuid) : false), [item])
  const { currencyView } = useNFTAggregator()

  const setNFTDetails = async (): Promise<boolean> => {
    try {
      const res = await axios.get(localSingleNFT.metadata_url)
      await setBids(localBids)
      await setAsk(localAsk)
      await setTotalLikes(localTotalLikes)
      const metaData = await res.data
      await setNftMetadata(metaData)
      const parsedAccounts = await getParsedAccountByMint({
        mintAddress: localSingleNFT.mint_address as StringPublicKey,
        connection: connection
      })

      const accountInfo = {
        token_account: parsedAccounts !== undefined ? parsedAccounts.pubkey : null,
        owner: parsedAccounts !== undefined ? parsedAccounts.owner : null
      }

      await setGeneral({ ...localSingleNFT, ...accountInfo })
      setIsLoadingBeforeRelocate(false)
      return true
    } catch (err) {
      setIsLoadingBeforeRelocate(false)
      notify(genericErrMsg('Error fetching NFT Metadata'))
      return false
    }
  }

  const goToDetails = async (item): Promise<void> => {
    history.push(`${history.location.pathname}?address=${item.mint_address}`)
    setIsLoadingBeforeRelocate(true)
    setHover(false)
    await setNFTDetails()
  }

  useEffect(() => {
    if (item.mint_address) {
      fetchSingleNFT(item.mint_address).then((res) => {
        if (res && res.status === 200) {
          res.data.data.length > 0 ? setlocalSingleNFT(res.data.data[0]) : setlocalSingleNFT(item)
          const nft: INFTGeneralData = res.data
          console.log(nft)

          setLocalBids(nft.bids)
          setLocalAsk(nft.asks.length > 0 ? nft.asks[0] : null)
          setLocalTotalLikes(nft.total_likes)
        }
      })
    }

    return () => {
      setIsLoadingBeforeRelocate(false)
    }
  }, [item])

  const handleInfoIconClicked = (e) => {
    setGFXApprisalPopup(true)
    e.stopPropagation()
    e.preventDefault()
  }
  const { prices } = usePriceFeedFarm()
  const solPrice = prices['SOL/USDC']?.current
  const nftNativePrice = localAsk ? parseFloat(localAsk.buyer_price) / LAMPORTS_PER_SOL_NUMBER : 0
  let displayPrice = currencyView === 'USDC' ? nftNativePrice * solPrice : nftNativePrice
  displayPrice = parseFloat(displayPrice.toFixed(2))

  return (
    <>
      <GFXApprisalPopup showTerms={apprisalPopup} setShowTerms={setGFXApprisalPopup} />
      <div className="gridItem" key={index} onClick={() => goToDetails(item)} ref={lastCardRef}>
        <div
          className="gridItemContainer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {hover && (
            <HoverOnNFT
              item={item}
              setNFTDetails={setNFTDetails}
              addNftToBag={addNftToBag}
              ask={localAsk ? localAsk : null}
            />
          )}
          {isLoadingBeforeRelocate && <LoadingDiv />}
          {item ? (
            <img className="nftImg" src={item.image_url} alt="nft" />
          ) : (
            <SkeletonCommon width="100%" height="auto" />
          )}
        </div>
        <div className="nftTextContainer">
          <div className="collectionId">
            <div>
              {nftId && nftId}
              {item.is_verified && <img className="isVerified" src="/img/assets/Aggregator/verifiedNFT.svg" />}
            </div>
            {localAsk !== null && (
              <img
                className="ah-name"
                src={`/img/assets/Aggregator/${AH_NAME(localAsk?.auction_house_key)}.svg`}
              />
            )}
          </div>

          {singleCollection ? (
            <GradientText
              text={minimizeTheString(singleCollection[0].collection_name)}
              fontSize={15}
              fontWeight={600}
            />
          ) : (
            <SkeletonCommon width="100px" height="20px" />
          )}

          <div className="nftPrice">
            {localAsk ? <PriceWithToken price={displayPrice} token={currencyView} /> : 'No Ask'}
          </div>
          <div className="apprisalPrice" onClick={(e) => handleInfoIconClicked(e)}>
            {'NA'}
            {localAsk && <img src={`/img/assets/Aggregator/Tooltip.svg`} alt={'SOL'} />}
          </div>
          {sessionUser &&
            (isFavorite ? (
              <img
                tw="absolute right-[10px] bottom-[10px] w-[20px] h-[20px]"
                src={`/img/assets/heart-red.svg`}
                alt="heart-red"
                onClick={() => console.log('unlike')}
              />
            ) : (
              <img
                tw="absolute right-[10px] bottom-[10px] w-[20px] h-[20px]"
                src={`/img/assets/heart-empty.svg`}
                alt="heart-empty"
                onClick={() => console.log('like')}
              />
            ))}
        </div>
      </div>
    </>
  )
}

export const HoverOnNFT: FC<{
  addNftToBag?: any
  item: BaseNFT
  ask: INFTAsk | null | boolean
  buttonType?: string
  setNFTDetails: any
}> = ({ addNftToBag, item, ask, setNFTDetails, buttonType }): ReactElement => {
  const { setBidNow, setBuyNow, setSellNFT } = useNFTAggregator()
  const [isLoadingBeforeRelocate, setIsLoadingBeforeRelocate] = useState<boolean>(false)
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const goToDetailsForModal = async (e, type) => {
    e.stopPropagation()
    if (!connected) {
      setVisible(true)
      return
    }
    setIsLoadingBeforeRelocate(true)
    await setNFTDetails()
    setIsLoadingBeforeRelocate(false)
    if (type === 'bid') setBidNow(item)
    else if (type === 'sell') setSellNFT(item)
    else setBuyNow(item)
  }

  return (
    <div className="hoverNFT">
      {isLoadingBeforeRelocate && <LoadingDiv />}
      {addNftToBag && (
        <img
          className="hoverAddToBag"
          src={`/img/assets/Aggregator/addToBag.svg`}
          alt=""
          onClick={(e) => addNftToBag(e, item)}
        />
      )}
      <span className="hoverButtons">
        {buttonType === 'sell' ? (
          <Button
            cssStyle={tw`bg-[#f06565] h-[28px] w-[75px] text-[13px] font-semibold mr-2 ml-2`}
            onClick={(e) => goToDetailsForModal(e, 'sell')}
          >
            Sell
          </Button>
        ) : (
          <Button
            cssStyle={tw`bg-[#5855ff]   h-[28px] w-[75px] text-[13px] font-semibold mr-2 ml-2`}
            onClick={(e) => goToDetailsForModal(e, 'bid')}
          >
            Bid
          </Button>
        )}

        {ask && (
          <Button
            height="28px"
            width="75px"
            className="pinkGradient"
            cssStyle={tw`text-[13px] font-semibold ml-2 `}
            onClick={(e) => goToDetailsForModal(e, 'buy')}
          >
            Buy now
          </Button>
        )}
      </span>
    </div>
  )
}
