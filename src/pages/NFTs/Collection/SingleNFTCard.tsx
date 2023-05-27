import {
  useState,
  FC,
  useEffect,
  useMemo,
  ReactElement,
  useCallback,
  Dispatch,
  SetStateAction,
  useRef
} from 'react'
import axios from 'axios'
import {
  useConnectionConfig,
  useNFTCollections,
  useNFTAggregator,
  useNFTDetails,
  useNFTProfile,
  usePriceFeedFarm,
  useWalletModal,
  useDarkMode
} from '../../../context'
/* eslint-disable @typescript-eslint/no-unused-vars */

import { GradientText } from '../../../components/GradientText'
import { RotatingLoader } from '../../../components/RotatingLoader'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { BaseNFT, INFTAsk, INFTBid, INFTGeneralData } from '../../../types/nft_details'
import { fetchSingleNFT } from '../../../api/NFTs'
import { getParsedAccountByMint, StringPublicKey, AH_NAME, ParsedAccount, getMetadata } from '../../../web3'
import { LoadingDiv } from './Card'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { Button } from '../../../components/Button'
import tw from 'twin.macro'
import 'styled-components/macro'
import { getNFTMetadata, minimizeTheString, redirectBasedOnMarketplace } from '../../../web3/nfts/utils'
import { useHistory } from 'react-router-dom'
import { formatSOLDisplay, notify, capitalizeFirstLetter, commafy, formatSOLNumber } from '../../../utils'
import { genericErrMsg } from '../../Farm/FarmClickHandler'
import { GFXApprisalPopup } from '../../../components/NFTAggWelcome'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { useWallet } from '@solana/wallet-adapter-react'
import { GenericTooltip } from '../../../utils/GenericDegsin'
import { Tag } from '../../../components/Tag'
import { Image } from 'antd'

export const SingleNFTCard: FC<{
  item: BaseNFT
  index: number
  myItems?: boolean
  addNftToBag?: any
  lastCardRef?: any
}> = ({ item, index, myItems = false, addNftToBag, lastCardRef }) => {
  const { sessionUser, sessionUserParsedAccounts, likeDislike } = useNFTProfile()
  const { connection } = useConnectionConfig()
  const { singleCollection } = useNFTCollections()
  const { setBids, setAsk, setTotalLikes, setNftMetadata, setGeneral, setOnChainMetadata } = useNFTDetails()
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
  const { currencyView } = useNFTAggregator()
  const refreshCard = useRef(null)

  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())

  const isOwner: boolean = useMemo(() => {
    if (sessionUser === null) return false
    const findAccount: undefined | ParsedAccount =
      item && sessionUser !== null && sessionUserParsedAccounts.length > 0
        ? sessionUserParsedAccounts.find((acct) => acct.mint === item?.mint_address)
        : undefined
    return findAccount === undefined ? false : true
  }, [sessionUser, sessionUserParsedAccounts])

  const hideThisNFT: boolean = useMemo(() => {
    if (myNFTsByCollection === null) return false
    const currentNFT = myNFTsByCollection.filter((myNFT) => myNFT.data[0]?.mint_address === item.mint_address)
    return currentNFT.length && currentNFT[0].asks.length === 0 && !myItems
  }, [myNFTsByCollection])

  const { prices } = usePriceFeedFarm()
  const solPrice = useMemo(() => prices['SOL/USDC']?.current, [prices])

  const nftNativePrice: number = localAsk ? parseFloat(localAsk.buyer_price) / LAMPORTS_PER_SOL_NUMBER : 0
  const appraisalPriceNative: number = useMemo(
    () =>
      item?.gfx_appraisal_value && parseInt(item?.gfx_appraisal_value) > 0
        ? parseInt(item?.gfx_appraisal_value)
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
  const { mode } = useDarkMode()
  useEffect(() => {
    if (item && sessionUser && sessionUser.user_likes) {
      setIsFavorited(sessionUser.user_likes.includes(item.uuid))
    }
  }, [sessionUser])

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
      refreshCard.current = setInterval(() => updateLocalStates(item), 3000)
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
      : minimizeTheString(item?.nft_name)
    : null

  const isFavorite = useMemo(() => (sessionUser ? sessionUser.user_likes.includes(item?.uuid) : false), [item])

  const updateLocalStates = useCallback(
    async (item: BaseNFT) =>
      fetchSingleNFT(item?.mint_address).then(async (res) => {
        if (res && res.status === 200) {
          res.data.data.length > 0 ? setlocalSingleNFT(res.data.data[0]) : setlocalSingleNFT(item)
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
      setIsLoadingBeforeRelocate(false)
      notify(genericErrMsg('Error fetching NFT Metadata'))
      return false
    }
  }

  const handleToggleLike = async (e) => {
    if (sessionUser && sessionUser.uuid) {
      const res = await likeDislike(sessionUser.uuid, localSingleNFT.uuid)
      setLocalTotalLikes((prev) => (isFavorited ? prev - 1 : prev + 1))
      setIsFavorited(res.data.action === 'liked')
      e.stopPropagation()
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

  const gradientBg: boolean = useMemo(() => isOwner && localAsk !== null, [localAsk, isOwner])

  const handleMarketplaceFormat = useCallback((ask: INFTAsk) => {
    if (ask.marketplace_name === null) return AH_NAME(ask.auction_house_key)
    const name = ask.marketplace_name
    const splitString = name.split('_')
    const capString = splitString.map((c) => capitalizeFirstLetter(c.toLowerCase()))
    return capString.join(' ')
  }, [])

  if (hideThisNFT) return null

  return (
    <div tw="pt-4 px-[8px]">
      {handleAppraisalPopup()}
      <div
        className={`gridItemRegular ${gradientBg ? 'gridGradient' : ''}`}
        key={index}
        onClick={() => goToDetails(item)}
        ref={lastCardRef}
      >
        <div className={'gridItem'}>
          {isLoadingBeforeRelocate && (
            <div
              tw="h-full absolute opacity-100 z-[1000] dark:bg-black-1 bg-white
                  duration-300 w-full rounded-[15px] opacity-50"
            >
              <div tw="h-[50%] w-full">
                <RotatingLoader textSize={50} iconSize={50} iconColor={'#5855FF'} />
              </div>
            </div>
          )}
          <div
            className="gridItemContainer"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {hover && (
              <HoverOnNFT
                setHover={setHover}
                mintAddress={item?.mint_address}
                collectionName={item?.collection_name}
                item={item}
                myBidToNFT={localUserBidToNFT}
                buttonType={isOwner ? (localAsk ? 'Modify' : 'Sell') : null}
                setNFTDetails={setNFTDetails}
                addNftToBag={addNftToBag}
                ask={isOwner ? null : localAsk ? localAsk : null}
                setIsLoadingBeforeRelocate={setIsLoadingBeforeRelocate}
              />
            )}
            {item ? (
              <div className="nftImg">
                <Image
                  src={item?.image_url}
                  width={'100%'}
                  preview={false}
                  fallback={`/img/assets/nft-preview-${mode}.svg`}
                  alt="NFT Preview"
                />
                {isOwner && localAsk !== null && (
                  <div tw="absolute left-[16px] top-[14px]">
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
            <div className="collectionId">
              <div tw="flex items-center">
                {nftId ? nftId : '# Nft'}
                {item?.is_verified && <img className="isVerified" src="/img/assets/Aggregator/verifiedNFT.svg" />}
              </div>
              {localAsk !== null && (
                <GenericTooltip text={handleMarketplaceFormat(localAsk)}>
                  <div>
                    <img
                      className="ah-name"
                      alt="marketplace"
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
                <PriceWithToken
                  price={commafy(displayPrice, displayPrice % 1 !== 0 ? 2 : 0)}
                  token={currencyView}
                  cssStyle={tw`!ml-0 dark:text-grey-2 text-black-4`}
                />
              )}
              {localAsk === null && <span tw="dark:text-grey-3 h-7 text-grey-4 font-semibold">Not Listed</span>}
            </div>
            <div className="apprisalPrice" tw="flex items-center" onClick={(e) => handleInfoIconClicked(e)}>
              {displayAppraisalPrice ? displayAppraisalPrice.toFixed(2) : 'NA'}
              {<img src={`/img/assets/Aggregator/Tooltip.svg`} alt={'SOL'} />}
            </div>
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

export const HoverOnNFT: FC<{
  mintAddress?: string
  collectionName?: string
  addNftToBag?: any
  item: BaseNFT
  myBidToNFT: INFTBid[]
  ask: INFTAsk
  showBid?: boolean
  buttonType: string
  setNFTDetails: any
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
  setIsLoadingBeforeRelocate
}): ReactElement => {
  const { sessionUser } = useNFTProfile()
  const { setBidNow, setBuyNow, setSellNFT, setOpenJustModal, setCancelBidClicked, setDelistNFT } =
    useNFTAggregator()
  const { setVisible } = useWalletModal()

  const showBidBtn = useMemo(
    () =>
      buttonType !== 'Modify' &&
      buttonType !== 'Sell' &&
      myBidToNFT.length === 0 &&
      (showBid || (ask && !ask.marketplace_name)),
    [ask, buttonType, myBidToNFT, showBid]
  )

  const goToDetailsForModal = useCallback(
    async (e, type) => {
      e.stopPropagation()
      if (sessionUser === null) {
        setVisible(true)
        return
      }

      if (redirectBasedOnMarketplace(ask as INFTAsk, type, item?.mint_address)) return
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
          setBidNow(item)
          break
        case 'sell':
          setSellNFT(item)
          break
        case 'buy':
          setBuyNow(item)
          break
        case 'cancel':
          setCancelBidClicked(item)
          break
      }
    },
    [sessionUser, ask, setNFTDetails, setHover, item]
  )

  return (
    <div className="hoverNFT">
      {/* {addNftToBag && ask && (
        <img
          className="hoverAddToBag"
          src={`/img/assets/Aggregator/addToBag.svg`}
          alt=""
          onClick={(e) => addNftToBag(e, item, ask)}
        />
      )} */}
      {myBidToNFT.length > 0 && (
        <div
          tw="flex absolute dark:text-grey-5 bottom-10  text-black-4 left-[30px] font-semibold
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
            cssStyle={tw`bg-red-2 h-[35px] w-[80px] text-[13px] sm:w-[70px] font-semibold  sm:ml-1 `}
            onClick={(e) => goToDetailsForModal(e, 'sell')}
          >
            List Item
          </Button>
        )}
        {buttonType === 'Modify' && (
          <>
            <Button
              cssStyle={tw`bg-red-2 h-[35px] w-[75px] text-[13px] sm:w-[70px] font-semibold mr-2 sm:ml-1 `}
              onClick={(e) => goToDetailsForModal(e, 'delist')}
            >
              Delist
            </Button>
            <Button
              cssStyle={tw`bg-blue-1 h-[35px] w-[75px] text-[13px] sm:w-[70px] font-semibold  sm:ml-1 `}
              onClick={(e) => goToDetailsForModal(e, 'sell')}
            >
              Modify
            </Button>
          </>
        )}
        {buttonType !== 'Modify' && buttonType !== 'Sell' && myBidToNFT.length > 0 && (
          <Button
            cssStyle={tw`bg-red-2  h-[35px] w-[75px] mr-[5px] text-[13px] font-semibold `}
            onClick={(e) => goToDetailsForModal(e, 'cancel')}
          >
            Cancel
          </Button>
        )}

        {showBidBtn && (
          <Button
            cssStyle={tw`bg-[#5855ff]   h-[35px] w-[75px] mr-[5px] text-[13px] font-semibold `}
            onClick={(e) => goToDetailsForModal(e, 'bid')}
          >
            Bid
          </Button>
        )}

        {ask && (
          <Button
            className="pinkGradient"
            cssStyle={tw`text-[13px] font-semibold h-[35px] w-[80px] sm:w-[70px]  sm:ml-1 sm:text-[13px] `}
            onClick={(e) => goToDetailsForModal(e, 'buy')}
          >
            Buy now
          </Button>
        )}
      </span>
    </div>
  )
}
