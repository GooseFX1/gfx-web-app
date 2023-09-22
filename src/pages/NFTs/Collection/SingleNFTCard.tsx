import { useState, FC, useEffect, useMemo, useCallback, useRef } from 'react'
import axios from 'axios'
import {
  useConnectionConfig,
  useNFTCollections,
  useNFTAggregator,
  useNFTDetails,
  useNFTProfile,
  useDarkMode,
  usePriceFeedFarm
} from '../../../context'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GradientText } from '../../../components'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { BaseNFT, INFTAsk, INFTBid, INFTGeneralData } from '../../../types/nft_details'
import { NFT_MARKETS, fetchSingleNFT } from '../../../api/NFTs'
import { getParsedAccountByMint, StringPublicKey, AH_NAME, getMetadata } from '../../../web3'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import tw from 'twin.macro'
import 'styled-components/macro'
import { getNFTMetadata, minimizeTheString, removeNFTFromBag } from '../../../web3/nfts/utils'
import { useHistory } from 'react-router-dom'
import { notify, capitalizeFirstLetter, commafy, checkMobile } from '../../../utils'
import { genericErrMsg } from '../../Farm/FarmClickHandler'
import { GFXApprisalPopup } from '../../../components/NFTAggWelcome'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { useWallet } from '@solana/wallet-adapter-react'
import { GenericTooltip } from '../../../utils/GenericDegsin'
import { Tag } from '../../../components/Tag'
import { Image } from 'antd'
import { HoverOnNFT } from './HoverOnNFT'
import { InProcessNFT } from '../../../components/InProcessNFT'
import gfxImageService, { IMAGE_SIZES } from '../../../api/gfxImageService'
import useBreakPoint from '../../../hooks/useBreakPoint'

export const SingleNFTCard: FC<{
  item: BaseNFT
  index: number
  myItems?: boolean
  addNftToBag?: any
  addNftToSweeper?: (item: any, ask: INFTAsk, index: number) => void
  lastCardRef?: any
  firstCardRef?: React.RefObject<HTMLElement | null> | null
}> = ({ item, index, myItems = false, addNftToBag, addNftToSweeper, lastCardRef, firstCardRef }) => {
  const { mode } = useDarkMode()
  const { sessionUser, sessionUserParsedAccounts } = useNFTProfile()
  const { connection } = useConnectionConfig()
  const { singleCollection } = useNFTCollections()
  const {
    setBids,
    setAsk,
    setTotalLikes,
    setNftMetadata,
    setGeneral,
    setOnChainMetadata,
    general,
    onChainMetadata
  } = useNFTDetails()
  const [apprisalPopup, setGFXApprisalPopup] = useState<boolean>(false)
  const [hover, setHover] = useState<boolean>(false)
  const [localBids, setLocalBids] = useState<INFTBid[]>([])
  const [localUserBidToNFT, setLocalUserBidToNFT] = useState<INFTBid[] | null>([])
  const [localAsk, setLocalAsk] = useState<INFTAsk | null>(null)
  const [localTotalLikes, setLocalTotalLikes] = useState<number>()
  const [isFavorited, setIsFavorited] = useState<boolean>(false)
  const [localSingleNFT, setlocalSingleNFT] = useState(undefined)
  const [isLoadingBeforeRelocate, setIsLoadingBeforeRelocate] = useState<boolean>(false)
  const [activeCard, setActiveCard] = useState<boolean>(false)
  const { myNFTsByCollection } = useNFTCollections()
  const history = useHistory()
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey])
  const {
    currencyView,
    operatingNFT,
    setOperatingNFT,
    nftInBag,
    nftInSweeper,
    sweeperCount,
    setNftInBag,
    appraisalIsEnabled
  } = useNFTAggregator()
  const refreshCard = useRef(null)

  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())

  const isOwner: boolean = useMemo(() => {
    if (sessionUser === null || sessionUserParsedAccounts.length === 0) return false

    const userAccountMints = new Set(sessionUserParsedAccounts.map((acct) => acct.mint))
    const userHasAccount = userAccountMints.has(item?.mint_address)

    // this states while the nft is in operating state we shall not consider it as owner for loading reason
    return userHasAccount && !operatingNFT.has(item?.mint_address)
  }, [sessionUser, sessionUserParsedAccounts, item, operatingNFT])

  const hideThisNFT: boolean = useMemo(() => {
    if (myNFTsByCollection === null || myNFTsByCollection === undefined || !item) return false
    const currentNFT = myNFTsByCollection.filter((myNFT) => myNFT.data[0]?.mint_address === item?.mint_address)
    return currentNFT.length > 0 && currentNFT[0].asks.length === 0 && !myItems
  }, [myNFTsByCollection, operatingNFT, item])
  const breakpoint = useBreakPoint()

  const { prices } = usePriceFeedFarm()
  const solPrice = useMemo(() => prices['SOL/USDC']?.current, [prices])

  const nftNativePrice: number = localAsk ? parseFloat(localAsk.buyer_price) / LAMPORTS_PER_SOL_NUMBER : 0
  // operation is going on
  const isActive: boolean = useMemo(() => operatingNFT.has(item?.mint_address), [operatingNFT])

  const appraisalPriceNative: number = useMemo(
    () =>
      item?.gfx_appraisal_value && parseFloat(item?.gfx_appraisal_value) > 0
        ? parseFloat(item?.gfx_appraisal_value)
        : 0,
    [item?.gfx_appraisal_value]
  )

  const displayPrice: number = useMemo(
    () => (currencyView === 'USDC' ? nftNativePrice * solPrice : nftNativePrice),
    [currencyView, nftNativePrice, solPrice]
  )
  const displayAppraisalPrice: number = useMemo(
    () => (currencyView === 'USDC' ? solPrice * appraisalPriceNative : appraisalPriceNative),
    [item?.gfx_appraisal_value, currencyView, appraisalPriceNative]
  )

  const nftImage: string | null = useMemo(() => {
    if (localSingleNFT && localSingleNFT.image_url) {
      return localSingleNFT.image_url
    } else {
      return null
    }
  }, [localSingleNFT, localSingleNFT?.image_url])
  useEffect(() => {
    if (item && sessionUser && sessionUser.user_likes) {
      setIsFavorited(sessionUser.user_likes.includes(item.uuid))
    }
  }, [sessionUser])

  useEffect(() => {
    if (hideThisNFT && operatingNFT.size > 0) {
      if (operatingNFT.has(item?.mint_address)) {
        setOperatingNFT((prevSet) => {
          const newSet = new Set(prevSet)
          newSet.delete(item?.mint_address)
          return newSet
        })
        // this needs to be looked more
        if (general) setNFTDetails()
      }
    }
  }, [hideThisNFT, operatingNFT])

  useEffect(() => {
    if (index === sweeperCount && addNftToSweeper) {
      addNftToSweeper(item, localAsk, index)
    }
  }, [sweeperCount])

  useEffect(() => {
    if (item?.mint_address) {
      updateLocalStates(item)
    }
    return () => {
      setIsLoadingBeforeRelocate(false)
    }
  }, [item])

  useEffect(() => {
    if (activeCard) {
      refreshCard.current = setInterval(() => updateLocalStates(item), 5000)
    } else {
      if (refreshCard.current) clearInterval(refreshCard.current)
    }
  }, [activeCard])

  useEffect(() => {
    if (!activeCard) clearInterval(refreshCard.current)
  }, [activeCard])

  useEffect(() => {
    if (!params.address) {
      setActiveCard(false)
    }
  }, [params])

  useEffect(() => {
    if (publicKey) {
      const myBid = localBids.filter((bid) => bid.wallet_key === publicKey.toString())
      setLocalUserBidToNFT(myBid)
    }
  }, [publicKey, localBids])

  const nftId = item?.nft_name
    ? item?.nft_name.includes('#')
      ? '#' + item?.nft_name.split('#')[1]
      : minimizeTheString(item?.nft_name, checkMobile() ? 10 : 12)
    : null

  // const isFavorite = useMemo(() => (sessionUser ? sessionUser.user_likes.includes(item?.uuid) : false), [item])

  const updateLocalStates = useCallback(
    async (item: BaseNFT) =>
      fetchSingleNFT(item?.mint_address).then(async (res) => {
        if (res && res.status === 200) {
          if (res.data.data.length > 0) {
            setlocalSingleNFT(res.data.data[0])
          } else {
            setlocalSingleNFT(item)
          }
          const nft: INFTGeneralData = res.data
          await setLocalBids(nft.bids)
          await setLocalAsk(nft.asks.length > 0 ? nft.asks[0] : null)
          await setLocalTotalLikes(nft.total_likes)
          if (activeCard) setNFTDetails()
        }
      }),
    [item]
  )

  const setNFTDetails = async (): Promise<boolean> => {
    await setActiveCard(true)
    try {
      const res = await axios.get(localSingleNFT.metadata_url)
      // micro optimizations
      await Promise.all([setBids(localBids), setAsk(localAsk), setTotalLikes(localTotalLikes)])
      const metaData = await res.data
      await setNftMetadata(metaData)
      const onChainData = await getNFTMetadata(await getMetadata(localSingleNFT.mint_address), connection)
      setOnChainMetadata(onChainData)
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
      console.log(err)
      setIsLoadingBeforeRelocate(false)
      notify(genericErrMsg('Error fetching NFT Metadata'))
      return false
    }
  }

  const goToDetails = async (item): Promise<void> => {
    history.push(`${history.location.pathname}?address=${item?.mint_address}`)
    setIsLoadingBeforeRelocate(true)
    setHover(false)
    await setNFTDetails()
  }

  const handleInfoIconClicked = useCallback((e) => {
    setGFXApprisalPopup(true)
    e.stopPropagation()
    e.preventDefault()
  }, [])

  const handleAppraisalPopup = useCallback(() => {
    if (apprisalPopup) return <GFXApprisalPopup showTerms={apprisalPopup} setShowTerms={setGFXApprisalPopup} />
  }, [apprisalPopup])

  // either owner or in bag or in sweeper
  const gradientBg: boolean = useMemo(
    () =>
      (isOwner && localAsk !== null) ||
      nftInBag[item?.mint_address] !== undefined ||
      (nftInSweeper && nftInSweeper[item?.mint_address] !== undefined),
    [localAsk, isOwner, nftInBag, nftInSweeper]
  )

  const handleMarketplaceFormat = useCallback((ask: INFTAsk) => {
    if (ask?.marketplace_name === null) return AH_NAME(ask?.auction_house_key)
    const name = ask?.marketplace_name
    const splitString = name.split('_')
    const capString = splitString.map((c) => capitalizeFirstLetter(c.toLowerCase()))
    return capString.join(' ')
  }, [])

  const handleLoading = useMemo(() => {
    if (isLoadingBeforeRelocate || isActive) return <InProcessNFT text={isActive ? 'In Process' : ''} />
  }, [isActive, isLoadingBeforeRelocate])

  const shouldShowImage = useMemo(
    () =>
      breakpoint.isMobile &&
      addNftToBag &&
      localAsk &&
      !nftInBag[item?.mint_address] &&
      (localAsk?.marketplace_name === NFT_MARKETS.MAGIC_EDEN ||
        localAsk.marketplace_name === NFT_MARKETS.TENSOR ||
        localAsk.marketplace_name === NFT_MARKETS.GOOSE ||
        !localAsk.marketplace_name),
    [localAsk, nftInBag, item, addNftToBag]
  )

  const addedToBagImg = useMemo(
    () => breakpoint.isMobile && addNftToBag && localAsk && nftInBag[item?.mint_address] !== undefined,
    [localAsk, nftInBag, item, addNftToBag]
  )

  const handleHover = useMemo(() => {
    if (hover)
      return (
        <HoverOnNFT
          setHover={setHover}
          collectionName={item?.collection_name}
          item={item}
          myBidToNFT={localUserBidToNFT}
          buttonType={isOwner ? (localAsk ? 'Modify' : 'Sell') : null}
          setNFTDetails={setNFTDetails}
          addNftToBag={!isOwner ? addNftToBag : null}
          ask={isOwner ? null : localAsk ? localAsk : null}
          setIsLoadingBeforeRelocate={setIsLoadingBeforeRelocate}
        />
      )
  }, [hover, isLoadingBeforeRelocate])

  if (hideThisNFT) return null

  return (
    <div tw="pt-4 px-[8px] sm:px-1 sm:pt-2 " id={item?.mint_address}>
      {handleAppraisalPopup()}
      <div
        className={`gridItemRegular ${gradientBg ? 'gridGradient' : ''}`}
        key={index}
        onClick={() => goToDetails(item)}
        ref={firstCardRef ? firstCardRef : lastCardRef}
      >
        <div className={'gridItem'}>
          <div
            className="gridItemContainer"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {handleLoading}
            {handleHover}

            {localSingleNFT ? (
              <div className="nftImg">
                {shouldShowImage && (
                  <img
                    className="hoverAddToBag"
                    tw="!h-8.75 !w-8.75 z-[1000]"
                    src={`/img/assets/Aggregator/addToBag.svg`}
                    alt=""
                    onClick={(e) => addNftToBag(e, item, localAsk)}
                  />
                )}
                {addedToBagImg && (
                  <img
                    className="hoverAddToBag"
                    tw="!h-8.75 !w-8.75 z-[1000]"
                    src={`/img/assets/Aggregator/addedToBag.svg`}
                    alt=""
                    onClick={(e) => removeNFTFromBag(item?.mint_address, setNftInBag, e)}
                  />
                )}
                <Image
                  src={
                    nftImage
                      ? gfxImageService(
                          IMAGE_SIZES.SM_WIDTH,
                          localSingleNFT.verified_collection_address
                            ? localSingleNFT.verified_collection_address
                            : localSingleNFT.first_verified_creator_address,
                          nftImage
                        )
                      : `${window.origin}/img/assets/nft-preview-${mode}.svg`
                  }
                  width={'100%'}
                  preview={false}
                  onError={(e) => console.error(e)}
                  alt="NFT Preview"
                />

                {isOwner && localAsk !== null && (
                  <div tw="absolute left-[16px] top-[14px] sm:left-3 sm:top-2.5">
                    <Tag loading={false}>
                      <span tw="font-semibold">{localAsk?.buyer_price && 'Listed'}</span>
                    </Tag>
                  </div>
                )}
              </div>
            ) : (
              <SkeletonCommon width="100%" height="auto" />
            )}
            {localUserBidToNFT.length > 0 && (
              <div tw="absolute left-[16px] top-[14px]">
                <Tag loading={false}>
                  <span tw="font-semibold">{'Bid Placed'}</span>
                </Tag>
              </div>
            )}
          </div>
          <div className="nftTextContainer">
            <div>
              <div className="collectionId">
                <div tw="flex items-center">
                  {nftId ? nftId : '# Nft'}
                  {item?.is_verified && (
                    <img
                      className="isVerified"
                      src="/img/assets/Aggregator/verifiedNFT.svg"
                      alt={'verified nft'}
                    />
                  )}
                </div>
                {localAsk !== null && (
                  <GenericTooltip text={handleMarketplaceFormat(localAsk)}>
                    <div>
                      <img
                        className="ah-name"
                        alt="marketplace"
                        src={`/img/assets/Aggregator/${handleMarketplaceFormat(localAsk)}.svg`}
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
            </div>

            <div className="nftPrice">
              {localAsk && (
                <PriceWithToken
                  price={commafy(displayPrice, displayPrice % 1 !== 0 ? 2 : 0)}
                  token={currencyView}
                  cssStyle={tw`!ml-0 dark:text-grey-2 text-black-4`}
                />
              )}
              {localAsk === null && <span tw="dark:text-grey-3 h-7 text-grey-4 font-semibold">Not Listed</span>}
            </div>
            {appraisalIsEnabled && (
              <div className="apprisalPrice" tw="flex items-center" onClick={(e) => handleInfoIconClicked(e)}>
                {displayAppraisalPrice ? displayAppraisalPrice.toFixed(2) : 'NA'}
                {<img src={`/img/assets/Aggregator/Tooltip.svg`} alt={'SOL'} />}
              </div>
            )}
            {/* {sessionUser && !isOwner && (
            <img
              className="card-like"
              src={`/img/assets/heart-${isFavorited ? 'red' : 'empty'}.svg`}
              alt="heart-red"
              onClick={(e) => handleToggleLike(e)}
            />
          )} */}
          </div>
        </div>
      </div>
    </div>
  )
}
