import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  FC,
  ReactElement,
  SetStateAction,
  Dispatch,
  memo
} from 'react'
import axios from 'axios'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useHistory, useParams } from 'react-router-dom'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { commafy, checkMobile } from '../../../utils'
import { ISingleNFT, INFTBid, INFTAsk, INFTGeneralData } from '../../../types/nft_details'
import {
  useNFTProfile,
  useNFTDetails,
  useConnectionConfig,
  useDarkMode,
  useNFTAggregator,
  usePriceFeedFarm,
  useNFTAggregatorFilters
} from '../../../context'
import { NFT_PROFILE_OPTIONS } from '../../../api/NFTs'
import { getParsedAccountByMint, StringPublicKey, ParsedAccount, getMetadata } from '../../../web3'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { ProfileItemDetails } from '../Profile/ProfileItemDetails'
import { GradientText } from '../../../components/GradientText'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { RotatingLoader } from '../../../components/RotatingLoader'
import { getNFTMetadata, minimizeTheString } from '../../../web3/nfts/utils'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Tag } from '../../../components/Tag'
import { GenericTooltip } from '../../../utils/GenericDegsin'
import { useWallet } from '@solana/wallet-adapter-react'
import { HoverOnNFT } from './HoverOnNFT'
import { InProcessNFT } from '../../../components/InProcessNFT'
import { IAppParams } from '../../../types/app_params'
import gfxImageService, { IMAGE_SIZES } from '../../../api/gfxImageService'

//#region styles
type ICardV2 = {
  singleNFT: ISingleNFT
  nftDetails?: INFTGeneralData
  className?: string
  listingType?: string
  setGfxAppraisal?: Dispatch<SetStateAction<boolean>>
}

const CardV2: FC<ICardV2> = ({ singleNFT, nftDetails, setGfxAppraisal }) => {
  const { mode } = useDarkMode()
  const history = useHistory()
  const { connection } = useConnectionConfig()
  const { sessionUser, sessionUserParsedAccounts, likeDislike, nonSessionProfile } = useNFTProfile()
  const [localSingleNFT, setlocalSingleNFT] = useState(undefined)
  /** setters are only for populating context before location change to details page */
  const {
    setGeneral,
    setNftMetadata,
    setBids,
    setAsk,
    setTotalLikes,
    setMyBidToNFT,
    setOnChainMetadata,
    fetchGeneral
  } = useNFTDetails()
  const [localBids, setLocalBids] = useState<INFTBid[]>([])
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [localAsk, setLocalAsk] = useState<INFTAsk | null>(null)
  const [localBidToNFT, setLocalBidToNFT] = useState<INFTBid[] | null>([])
  const [localTotalLikes, setLocalTotalLikes] = useState<number>()
  const [isFavorited, setIsFavorited] = useState<boolean>(false)
  const [showDrawerSingleNFT, setDrawerSingleNFT] = useState<boolean>(false)
  const [isLoadingBeforeRelocate, setIsLoadingBeforeRelocate] = useState<boolean>(false)
  const [hover, setHover] = useState<boolean>(false)
  const { currencyView, setDelistNFT, setSellNFT, appraisalIsEnabled } = useNFTAggregator()
  const { profileNFTOptions } = useNFTAggregatorFilters()
  const { prices } = usePriceFeedFarm()
  const solPrice = useMemo(() => prices['SOL/USDC']?.current, [prices])
  const params = useParams<IAppParams>()

  const isSessionUser = useMemo(
    () => (publicKey !== null ? params.userAddress === publicKey?.toBase58() : false),
    [publicKey]
  )
  const currentUserProfile = useMemo(() => {
    if (nonSessionProfile !== undefined && !isSessionUser) {
      return nonSessionProfile
    } else if (sessionUser !== null && isSessionUser) {
      return sessionUser
    } else {
      return undefined
    }
  }, [isSessionUser, sessionUser, nonSessionProfile])

  enum MODAL_TARGET {
    DRAWER = 'drawer',
    SELL = 'sell',
    BID = 'bid'
  }

  const displayPrice: string | null = useMemo(
    () => (localAsk !== null ? localAsk.buyer_price : null),
    [localAsk, localBids, sessionUser]
  )

  const isOwner: boolean = useMemo(() => {
    if (!sessionUser || sessionUserParsedAccounts.length === 0 || !singleNFT) return false

    const userAccountMints = new Set(sessionUserParsedAccounts.map((acct) => acct.mint))
    const userHasAccount = userAccountMints.has(singleNFT.mint_address)

    // this states while the nft is in operating state we shall not consider it as owner for loading reason
    return userHasAccount
  }, [sessionUser, sessionUserParsedAccounts, publicKey, localBids])

  useEffect(() => {
    if (nftDetails) {
      setlocalSingleNFT(nftDetails.data[0])
      setLocalBids(nftDetails.bids)
      if (publicKey) {
        const myBid = nftDetails.bids.filter((bid) => bid.wallet_key === publicKey.toString())
        setLocalBidToNFT(myBid)
      }
      setLocalAsk(nftDetails.asks.length > 0 ? nftDetails.asks[0] : null)
      setLocalTotalLikes(nftDetails.total_likes)
    }

    return () => {
      setIsLoadingBeforeRelocate(false)
    }
  }, [singleNFT, isOwner, nftDetails])

  useEffect(() => {
    if (localSingleNFT && sessionUser && sessionUser.user_likes) {
      setIsFavorited(sessionUser.user_likes.includes(localSingleNFT?.uuid))
    }
  }, [sessionUser, localSingleNFT])

  const handleToggleLike = async () => {
    if (sessionUser && sessionUser.uuid) {
      try {
        const res = await likeDislike(sessionUser.uuid, localSingleNFT.uuid)
        console.log(res)
        setLocalTotalLikes((prev) => (isFavorited ? prev - 1 : prev + 1))
        setIsFavorited(res.data.action === 'liked')
      } catch (err) {
        console.log(err)
      }
    }
  }

  const filterAndShow = useMemo(() => {
    if (profileNFTOptions === NFT_PROFILE_OPTIONS.ALL) return true
    if (profileNFTOptions === NFT_PROFILE_OPTIONS.BID_PLACED) {
      return localBids?.length ? (localBids[0].wallet_key === currentUserProfile.pubkey ? true : false) : false
    }
    if (profileNFTOptions === NFT_PROFILE_OPTIONS.BID_RECEIVED) {
      return localBids?.length ? (localBids[0].wallet_key !== currentUserProfile.pubkey ? true : false) : false
    }
    if (profileNFTOptions === NFT_PROFILE_OPTIONS.OFFERS) {
      return localBids?.length ? true : false
    }
    if (profileNFTOptions === NFT_PROFILE_OPTIONS.ON_SALE) {
      return localAsk ? true : false
    }
  }, [localAsk, localBids, profileNFTOptions])

  const gradientBg = useMemo(() => localAsk?.buyer_price || localBids?.length, [localAsk, localBids])
  const nftImage: string | null = useMemo(() => {
    if (localSingleNFT && localSingleNFT.image_url) {
      return localSingleNFT.image_url
    } else {
      return null
    }
  }, [localSingleNFT, localSingleNFT?.image_url])

  const openDetails = async (target: string): Promise<void> => {
    setIsLoadingBeforeRelocate(true)
    setHover(false)
    await setNFTDetails()
    // if (target === MODAL_TARGET.SELL) setSellNFT(true)
    if (target === MODAL_TARGET.DRAWER) setDrawerSingleNFT(true)
    // if (target === MODAL_TARGET.BID) setShowBidNFTModal(true)
  }

  const setNFTDetails = async () => {
    // micro optimizations
    await Promise.all([
      setBids(localBids),
      setAsk(localAsk),
      setTotalLikes(localTotalLikes),
      setMyBidToNFT(localBidToNFT)
    ])

    const onChainData = await getNFTMetadata(await getMetadata(localSingleNFT.mint_address), connection)
    setOnChainMetadata(onChainData)
    const res = await axios.get(localSingleNFT.metadata_url)
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
  }

  useEffect(() => {
    if (showDrawerSingleNFT) setNFTDetails()
  }, [localAsk, localBids])

  //const val = currency === 'USD' ? value * priceFeed['SOL/USDC']?.current : value
  const dynamicPriceValue = useCallback(
    (value: number) => {
      const price = currencyView === 'USDC' ? value * solPrice : value
      return commafy(price, price % 1 !== 0 ? 2 : 0)
    },
    [currencyView, solPrice]
  )

  const handelDrawer = useCallback(() => {
    if (showDrawerSingleNFT) {
      return (
        <ProfileItemDetails
          visible={showDrawerSingleNFT}
          setShowDelistModal={setDelistNFT}
          setDrawerSingleNFT={setDrawerSingleNFT}
          setSellModal={setSellNFT}
          singleNFT={singleNFT}
        />
      )
    }
  }, [showDrawerSingleNFT])

  const handleLoading = useMemo(() => isLoadingBeforeRelocate && <InProcessNFT />, [isLoadingBeforeRelocate])

  const handleHover = useMemo(() => {
    if (hover)
      return (
        <HoverOnNFT
          buttonType={isOwner ? (localAsk?.buyer_price ? 'Modify' : 'Sell') : 'bid'}
          item={localSingleNFT}
          setHover={setHover}
          myBidToNFT={localBidToNFT}
          showBid={true}
          ask={!isOwner && localAsk ? localAsk : null}
          setNFTDetails={() => (isOwner ? openDetails(MODAL_TARGET.SELL) : openDetails(MODAL_TARGET.BID))}
          setIsLoadingBeforeRelocate={setIsLoadingBeforeRelocate}
        />
      )
  }, [hover])

  if (!nftDetails) return null
  return (
    filterAndShow && (
      <div tw="sm:pt-1 pt-3 px-[6px]">
        {handelDrawer()}
        <div className={`gridItemRegular ${gradientBg ? 'gridGradient' : ''}`}>
          <div className={'gridItem'}>
            {handleLoading}
            <div
              className="gridItemContainer"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={() => (localSingleNFT !== undefined ? openDetails(MODAL_TARGET.DRAWER) : null)}
            >
              {handleHover}
              <div className="nftImg">
                <img
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
                  onError={(e) =>
                    (e.currentTarget.src = nftImage
                      ? nftImage
                      : `${window.origin}/img/assets/nft-preview-${mode}.svg`)
                  }
                  alt="nft"
                />
              </div>
              {(localBids?.length > 0 || localAsk !== null) && (
                <div tw="absolute left-[16px] top-[14px]">
                  <Tag loading={false}>
                    <span tw="font-semibold">
                      {localAsk?.buyer_price && 'Listed'}
                      {localAsk?.buyer_price && localBids.length > 0 && ' / '}
                      {localBids?.length > 0 && `${localBids.length} Bid${localBids.length === 1 ? '' : 's'}`}
                    </span>
                  </Tag>
                </div>
              )}
            </div>
            <div className={'nftTextContainer'}>
              <div>
                <GenericTooltip text={localSingleNFT?.nft_name}>
                  <div className="collectionId">
                    <div tw="flex items-center">
                      {localSingleNFT && minimizeTheString(localSingleNFT.nft_name, 14)}
                      {localSingleNFT && localSingleNFT.is_verified && (
                        <img className="isVerified" src="/img/assets/Aggregator/verifiedNFT.svg" />
                      )}
                    </div>
                  </div>
                </GenericTooltip>
              </div>
              {localSingleNFT && (
                <GradientText
                  text={minimizeTheString(
                    localSingleNFT?.collection_name !== null
                      ? localSingleNFT?.collection_name
                      : 'No Collection Name',
                    checkMobile() ? 12 : 18
                  )}
                  fontSize={15}
                  fontWeight={600}
                  onClick={(e) =>
                    localSingleNFT?.collection_name !== null
                      ? history.push(`/nfts/collection/${localSingleNFT?.collection_name}`)
                      : null
                  }
                />
              )}
              <div>
                {localSingleNFT ? (
                  <div className="nftPrice">
                    {displayPrice !== null ? (
                      <PriceWithToken
                        cssStyle={tw``}
                        price={dynamicPriceValue(parseFloat(displayPrice) / LAMPORTS_PER_SOL_NUMBER)}
                        token={currencyView}
                      />
                    ) : (
                      ''
                    )}
                    {/* <img src={`/img/crypto/SOL.svg`} alt={'SOL'} /> */}
                  </div>
                ) : (
                  <SkeletonCommon width="64px" height="24px" />
                )}

                {appraisalIsEnabled && (
                  <div className="apprisalPriceProfile">
                    NA
                    <img
                      src={`/img/assets/Aggregator/Tooltip.svg`}
                      alt={'tooltip'}
                      onClick={() => setGfxAppraisal(true)}
                    />
                  </div>
                )}

                {/* {sessionUser && (
                    <img
                      className="card-like"
                      src={`/img/assets/heart-${isFavorited ? 'red' : 'empty'}.svg`}
                      alt="heart-red"
                      onClick={() => handleToggleLike()}
                    />
                  )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default memo(CardV2)
export const LoadingDiv = (): ReactElement => (
  <div
    tw="h-full absolute opacity-100 z-[1000] dark:bg-black-1 bg-white
                    duration-300 w-full rounded-[15px] opacity-50"
  >
    <div tw="h-[50%] w-[87%]">
      <RotatingLoader textSize={50} iconSize={50} iconColor={'#5855FF'} />
    </div>
  </div>
)
