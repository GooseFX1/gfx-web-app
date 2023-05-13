import { useState, FC, useEffect, useMemo, ReactElement, useCallback } from 'react'
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

import { GradientText } from '../../../components/GradientText'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { BaseNFT, INFTAsk, INFTBid, INFTGeneralData } from '../../../types/nft_details'
import { fetchSingleNFT } from '../../../api/NFTs'
import { getParsedAccountByMint, StringPublicKey, AH_NAME, ParsedAccount } from '../../../web3'
import { LoadingDiv } from './Card'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { Button } from '../../../components/Button'
import tw from 'twin.macro'
import 'styled-components/macro'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { useHistory } from 'react-router-dom'
import { formatSOLDisplay, notify, capitalizeFirstLetter, commafy } from '../../../utils'
import { genericErrMsg } from '../../Farm/FarmClickHandler'
import { GFXApprisalPopup } from '../../../components/NFTAggWelcome'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { useWallet } from '@solana/wallet-adapter-react'
import { GenericTooltip } from '../../../utils/GenericDegsin'

export const SingleNFTCard: FC<{ item: BaseNFT; index: number; addNftToBag: any; lastCardRef: any }> = ({
  item,
  index,
  addNftToBag,
  lastCardRef
}) => {
  const { sessionUser, sessionUserParsedAccounts } = useNFTProfile()
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

  const isOwner: boolean = useMemo(() => {
    const findAccount: undefined | ParsedAccount =
      item && sessionUserParsedAccounts !== undefined
        ? sessionUserParsedAccounts.find((acct) => acct.mint === item.mint_address)
        : undefined
    return findAccount === undefined ? false : true
  }, [sessionUser, sessionUserParsedAccounts])

  const nftId = item
    ? item.nft_name.includes('#')
      ? '#' + item.nft_name.split('#')[1]
      : minimizeTheString(item.nft_name)
    : null

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
  const solPrice = useMemo(() => prices['SOL/USDC']?.current, [prices])
  const nftNativePrice: number = localAsk ? parseFloat(localAsk.buyer_price) / LAMPORTS_PER_SOL_NUMBER : 0
  const displayPrice: number = useMemo(
    () => (currencyView === 'USDC' ? nftNativePrice * solPrice : nftNativePrice),
    [currencyView, nftNativePrice, solPrice]
  )

  const handleAppraisalPopup = useCallback(() => {
    if (apprisalPopup) return <GFXApprisalPopup showTerms={apprisalPopup} setShowTerms={setGFXApprisalPopup} />
  }, [apprisalPopup])

  const handleMarketplaceFormat = useCallback((ask: INFTAsk) => {
    if (ask.marketplace_name === null) return AH_NAME(ask.auction_house_key)
    const name = ask.marketplace_name
    const splitString = name.split('_')
    const capString = splitString.map((c) => capitalizeFirstLetter(c.toLowerCase()))
    return capString.join(' ')
  }, [])

  return (
    <>
      {handleAppraisalPopup()}
      <div className="gridItemCollections" key={index} onClick={() => goToDetails(item)} ref={lastCardRef}>
        <div
          className="gridItemContainer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {isLoadingBeforeRelocate && <div className="loadingNFT" tw="mt-[-8px]" />}

          {hover && (
            <HoverOnNFT
              mintAddress={item.mint_address}
              collectionName={item.collection_name}
              item={item}
              buttonType={isOwner ? (localAsk ? 'Modify' : 'Sell') : null}
              setNFTDetails={setNFTDetails}
              addNftToBag={addNftToBag}
              ask={isOwner ? null : localAsk ? localAsk : null}
            />
          )}
          {item ? (
            <div className="nftImg">
              <img src={item?.image_url} alt="nft" />
            </div>
          ) : (
            <SkeletonCommon width="100%" height="auto" />
          )}
        </div>
        <div className="nftTextContainer">
          <div className="collectionId">
            <div tw="flex items-center">
              {nftId ? nftId : '# Nft'}
              {item.is_verified && <img className="isVerified" src="/img/assets/Aggregator/verifiedNFT.svg" />}
            </div>
            {localAsk !== null && (
              <GenericTooltip text={handleMarketplaceFormat(localAsk)}>
                <div>
                  <img
                    className="ah-name"
                    alt="marketplace icon"
                    src={`/img/assets/Aggregator/${
                      localAsk?.marketplace_name === null
                        ? AH_NAME(localAsk?.auction_house_key)
                        : localAsk?.marketplace_name
                    }.svg`}
                  />
                </div>
              </GenericTooltip>
            )}
          </div>

          {singleCollection ? (
            <GradientText
              text={minimizeTheString(singleCollection[0].collection_name)}
              fontSize={15}
              fontWeight={600}
              lineHeight={18}
            />
          ) : (
            <SkeletonCommon width="100px" height="20px" />
          )}

          <div className="nftPrice">
            {localAsk && (
              <PriceWithToken price={commafy(displayPrice, displayPrice % 1 !== 0 ? 2 : 0)} token={currencyView} />
            )}
            {localAsk === null && <span tw="dark:text-grey-3 text-grey-4 font-semibold">Not Listed</span>}
          </div>
          <div className="apprisalPrice" tw="flex items-center" onClick={(e) => handleInfoIconClicked(e)}>
            {item?.gfx_appraisal_value ? item?.gfx_appraisal_value.substring(0, 4) : 'NA'}
            {<img src={`/img/assets/Aggregator/Tooltip.svg`} alt={'SOL'} />}
          </div>
          {/* {sessionUser &&
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
            ))} */}
        </div>
      </div>
    </>
  )
}

export const HoverOnNFT: FC<{
  mintAddress?: string
  collectionName?: string
  addNftToBag?: any
  item: BaseNFT
  ask: INFTAsk | null | boolean
  buttonType?: string
  setNFTDetails: any
}> = ({ addNftToBag, item, ask, setNFTDetails, buttonType, mintAddress }): ReactElement => {
  const { setBidNow, setBuyNow, setSellNFT, setOpenJustModal } = useNFTAggregator()
  const [isLoadingBeforeRelocate, setIsLoadingBeforeRelocate] = useState<boolean>(false)
  const { wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const openInNewTab = useCallback((url) => {
    const win = window.open(url, '_blank')
    win.focus()
  }, [])

  const goToDetailsForModal = async (e, type) => {
    e.stopPropagation()
    if (!wallet?.adapter?.connected) {
      setVisible(true)
      return
    }

    if (ask && ask['marketplace_name'] && type === 'buy') {
      switch (ask['marketplace_name']) {
        case 'MAGIC_EDEN':
          openInNewTab(`https://magiceden.io/item-details/${mintAddress}`)
          return
        case 'TENSOR':
          openInNewTab(`https://www.tensor.trade/item/${mintAddress}`)
          return
      }
    }

    setOpenJustModal(true)
    setIsLoadingBeforeRelocate(true)
    await setNFTDetails()
    setIsLoadingBeforeRelocate(false)
    if (type === 'bid') setBidNow(item)
    else if (type === 'sell') setSellNFT(item)
    else setBuyNow(item)
  }

  return (
    <div className="hoverNFT">
      {isLoadingBeforeRelocate && <div className="loadingNFT" tw="ml-[-4px]" />}
      {/* {addNftToBag && ask && (
        <img
          className="hoverAddToBag"
          src={`/img/assets/Aggregator/addToBag.svg`}
          alt=""
          onClick={(e) => addNftToBag(e, item, ask)}
        />
      )} */}
      <span className="hoverButtons">
        {buttonType === 'Sell' && (
          <Button
            cssStyle={tw`bg-red-1 h-[28px] w-[108px] text-[13px] sm:w-[70px] font-semibold mr-2 sm:ml-1 ml-2`}
            onClick={(e) => goToDetailsForModal(e, 'sell')}
          >
            Sell now
          </Button>
        )}
        {buttonType === 'Modify' && (
          <Button
            cssStyle={tw`bg-blue-1 h-[28px] w-[108px] text-[13px] sm:w-[70px] font-semibold mr-2 sm:ml-1 ml-2`}
            onClick={(e) => goToDetailsForModal(e, 'sell')}
          >
            Modify Price
          </Button>
        )}

        {buttonType !== 'Modify' && buttonType !== 'Sell' && (
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
            className="pinkGradient"
            cssStyle={tw`text-[13px] font-semibold w-[75px] sm:w-[70px] ml-2 sm:ml-1 sm:text-[13px] `}
            onClick={(e) => goToDetailsForModal(e, 'buy')}
          >
            Buy now
          </Button>
        )}
      </span>
    </div>
  )
}
