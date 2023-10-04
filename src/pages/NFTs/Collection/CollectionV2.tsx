/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  ReactElement,
  useState,
  useEffect,
  useMemo,
  FC,
  useRef,
  Dispatch,
  SetStateAction,
  MutableRefObject
} from 'react'
import { Dropdown } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import {
  useDarkMode,
  useNFTAggregator,
  useNFTCollections,
  useNFTAggregatorFilters,
  initialFilters,
  usePriceFeed,
  usePriceFeedFarm
} from '../../../context'
import { IAppParams } from '../../../types/app_params'
import { NFTCollection } from '../../../types/nft_collections'
import { checkMobile, formatSOLDisplay } from '../../../utils'
const GenericNotFound = React.lazy(() => import('../../InvalidUrl'))
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import ActivityNFTSection from './ActivityNFTSection'

import {
  COLLECTION_VIEW_WRAPPER,
  GRID_CONTAINER,
  NFT_FILTERS_CONTAINER,
  DROPDOWN_CONTAINER
} from './CollectionV2.styles'
import tw from 'twin.macro'
import 'styled-components/macro'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { OpenBidNFTs } from './OpenBidNFTs'
import { FixedPriceNFTs } from './FixedPriceNFTs'
import { Image } from 'antd'
import { GFXApprisalPopup } from '../../../components/NFTAggWelcome'
import { CurrentUserProfilePic, RefreshBtnWithAnimationNFT } from '../Home/NFTLandingPageV2'
import { LastRefreshedAnimation, useAnimateButtonSlide } from '../../../components/Farm/generic'
import { copyToClipboard, minimizeTheString } from '../../../web3/nfts/utils'
import { SearchBar, TokenToggleNFT } from '../../../components'
import { NFT_ACTIVITY_ENDPOINT } from '../../../api/NFTs'
import { truncateBigNumber } from '../../TradeV3/perps/utils'
import { useCallback } from 'react'
import { Arrow, CircularArrow } from '../../../components/common/Arrow'
import { GenericTooltip, TableHeaderTitle } from '../../../utils/GenericDegsin'
import { useWallet } from '@solana/wallet-adapter-react'
import { Share } from '../Share'
import MyItemsNFTs from './MyItemsNFTs'
import { logData } from '../../../api/analytics'
import gfxImageService, { IMAGE_SIZES } from '../../../api/gfxImageService'
import AdditionalFilters from './AdditionalFilters'
import useBreakPoint from '../../../hooks/useBreakPoint'

const NFTStatsContainer = () => {
  const history = useHistory()
  const { singleCollection, fixedPriceWithinCollection } = useNFTCollections()
  const { lastRefreshedClass, refreshClass, setLastRefreshedClass, currencyView, appraisalIsEnabled } =
    useNFTAggregator()
  const [appraisalPopup, setGFXAppraisalPopup] = useState<boolean>(false)
  const [firstLoad, setFirstPageLoad] = useState<boolean>(true)
  const { solPrice } = usePriceFeedFarm()
  const [shareModal, setShareModal] = useState<boolean>(false)
  const volume24h = useMemo(
    () =>
      singleCollection
        ? truncateBigNumber(
            parseFloat(
              formatSOLDisplay(singleCollection[0].daily_volume * (currencyView === 'USDC' ? solPrice : 1))
            )
          )
        : undefined,
    [singleCollection, currencyView]
  )

  const collection: NFTCollection | undefined = useMemo(
    () => (singleCollection ? singleCollection[0] : undefined),
    [singleCollection]
  )
  const collectionFloor: number = useMemo(
    () =>
      singleCollection
        ? (singleCollection[0].floor_price / LAMPORTS_PER_SOL_NUMBER) * (currencyView === 'USDC' ? solPrice : 1)
        : 0,
    [collection, currencyView]
  )

  const { wallet } = useWallet()
  const pubKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey])

  useEffect(() => {
    setFirstPageLoad(false)
  }, [])

  useEffect(() => {
    if (refreshClass === '' && !firstLoad) {
      setLastRefreshedClass('lastRefreshed')
    }
  }, [refreshClass])

  useEffect(() => {
    if (lastRefreshedClass !== ' ' && !firstLoad) {
      setTimeout(() => setLastRefreshedClass(' '), 3000)
    }
  }, [lastRefreshedClass])

  const onShare = async (social: string) => {
    if (social === 'copy link') {
      copyToClipboard()
      return
    }
  }
  const handlePopup = useCallback(() => {
    if (appraisalPopup) return <GFXApprisalPopup showTerms={appraisalPopup} setShowTerms={setGFXAppraisalPopup} />
    if (shareModal)
      return (
        <Share
          visible={shareModal}
          handleCancel={() => setShareModal(false)}
          socials={['twitter', 'telegram', 'facebook', 'copy link']}
          handleShare={onShare}
        />
      )
  }, [appraisalPopup, shareModal])

  return (
    <div tw="flex flex-col">
      <div tw="flex justify-center">
        {/* <LastRefreshedAnimation lastRefreshedClass={lastRefreshedClass} /> */}
      </div>
      {handlePopup()}
      <div className="nftStatsContainer">
        {!checkMobile() && (
          <button className="backBtn" onClick={() => history.push('/nfts')} tw="border-0">
            <img src="/img/assets/arrow-leftdark.svg" />
          </button>
        )}
        {/* <SweepCollectionDrawer sweepCollection={sweepCollection} setSweepCollection={setSweepCollection} /> */}

        <div className="collectionNameContainer">
          <div className="collectionName">
            {collection ? (
              <Image
                preview={false}
                className="collectionNameImage"
                fallback={'/img/assets/Aggregator/Unknown.svg'}
                src={gfxImageService(IMAGE_SIZES.SM_SQUARE, collection.uuid, collection.profile_pic_link)}
                alt="collection-image"
              />
            ) : (
              <SkeletonCommon style={{ marginLeft: 20 }} width="35px" height="35px" borderRadius="50%" />
            )}
            <div tw="sm:text-[13px] font-bold flex items-center text-[15px]">
              {collection ? (
                <GenericTooltip text={collection.collection_name}>
                  <div tw="text-[18px] ml-3 font-bold flex items-center max-w-[325px]">
                    {minimizeTheString(collection.collection_name, checkMobile() ? 10 : 40)}
                    {collection && collection.is_verified ? (
                      <img
                        tw="sm:h-[15px] sm:w-[15px] h-[18px] w-[18px] ml-2"
                        src="/img/assets/Aggregator/verifiedNFT.svg"
                      />
                    ) : (
                      <div tw="mt-1.5">
                        {TableHeaderTitle(
                          '',
                          'This is an unverified Collection Please do your own Research about this Collection ',
                          false
                        )}
                      </div>
                    )}
                  </div>
                </GenericTooltip>
              ) : (
                <SkeletonCommon width="200px" height="22px" style={{ marginLeft: 10 }} />
              )}
            </div>
            {checkMobile() && (
              <div className="title" tw="flex ml-auto items-center">
                <CurrentUserProfilePic />
                <SortDropdown />
              </div>
            )}
          </div>

          <div className="generalStats">
            {appraisalIsEnabled && (
              <div tw="flex items-center">
                <img
                  onClick={() => setGFXAppraisalPopup(true)}
                  tw="h-[20px] w-[20px] cursor-pointer"
                  src="/img/assets/Aggregator/Tooltip.svg"
                  alt="appraisal-icon"
                />
                <div className="wrapper" tw="ml-2">
                  <div className={collection?.gfx_appraisal_supported ? 'titleText' : 'titleTextNoSupport'}>
                    Appraisal
                  </div>
                  <div className={collection?.gfx_appraisal_supported ? 'subTitleText' : 'subTitleTextNoSupport'}>
                    {collection && collection.gfx_appraisal_supported ? 'Supported' : 'Not Supported'}
                  </div>
                </div>
              </div>
            )}

            <div className="wrapper">
              <div className="titleText" tw="leading-none">
                {collectionFloor.toFixed(2)} {currencyView}
              </div>
              <div className="subTitleText">Floor Price</div>
            </div>
            {!checkMobile() && (
              <div className="wrapper">
                <div className="titleText" tw="leading-none">
                  {fixedPriceWithinCollection ? fixedPriceWithinCollection.total_count : '00'} /{' '}
                  {singleCollection ? singleCollection[0]?.nfts_count : '000'}
                </div>
                <div className="subTitleText">Listed</div>
              </div>
            )}
            <div className="wrapper">
              <div className="titleText" tw="leading-none">
                {singleCollection ? volume24h : 0} {currencyView}
              </div>
              <div className="subTitleText"> 24H Volume </div>
            </div>
          </div>
          {!checkMobile() && (
            <div tw="ml-auto flex">
              <div tw="ml-2.5">
                <RefreshBtnWithAnimationNFT />
              </div>
              <div tw="ml-2.5">
                <img
                  tw="h-8.75 w-8.75 !mr-0"
                  src="/img/assets/shareBlue.svg"
                  alt=""
                  onClick={() => copyToClipboard()}
                />
              </div>
              {pubKey && <div tw="!w-10 ml-2.5">{<CurrentUserProfilePic />}</div>}
              {/* <div className="sweepBtn" onClick={() => setSweepCollection(true)}>
                <img src="/img/assets/Aggregator/sweepButton.svg" alt="" />
              </div>   
              <div>
                 <ICON $mode={mode === 'dark'}>
                  <img src={`/img/assets/more_icon.svg`} alt="more" />
                </ICON> 
              </div>  */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const NFTGridContainer = (): ReactElement => {
  const breakpoint = useBreakPoint()
  const [open, setOpen] = useState<boolean>(!breakpoint.isMobile)
  const { singleCollection } = useNFTCollections()
  const [displayIndex, setDisplayIndex] = useState<number>(0)
  const firstCardRef = useRef<HTMLElement | HTMLDivElement | null>()
  const { mode } = useDarkMode()
  const AdditionalFiltersComponent = useMemo(
    () =>
      displayIndex === 0 || displayIndex === 2 ? (
        <AdditionalFilters displayIndex={displayIndex} open={open} setOpen={setOpen} />
      ) : null,

    [displayIndex, open]
  )
  const handleTopScroll = useCallback(() => {
    firstCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }, [firstCardRef])

  const activityAddress = singleCollection
    ? singleCollection[0]?.verified_collection_address
      ? singleCollection[0]?.verified_collection_address
      : singleCollection[0].first_verified_creator_address
    : null

  const NFTDisplayComponent = useMemo(() => {
    if (displayIndex === 0) return <FixedPriceNFTs firstCardRef={firstCardRef} />
    if (displayIndex === 1) return <MyItemsNFTs setDisplayIndex={setDisplayIndex} firstCardRef={firstCardRef} />
    if (displayIndex === 2) return <OpenBidNFTs firstCardRef={firstCardRef} />
    if (displayIndex === 3)
      return (
        <ActivityNFTSection
          firstCardRef={firstCardRef}
          cssStyle={tw`bg-grey-5`}
          address={activityAddress}
          typeOfAddress={NFT_ACTIVITY_ENDPOINT.COLLECTION_ADDRESS}
        />
      )
  }, [displayIndex, activityAddress])
  return (
    <GRID_CONTAINER>
      <img
        src={`/img/assets/Aggregator/go-to-top-${mode}.svg`}
        tw="fixed right-4 bottom-4 sm:right-2.5 sm:bottom-2.5 z-[100] cursor-pointer"
        onClick={handleTopScroll}
      />
      <FiltersContainer
        setOpen={setOpen}
        open={open}
        displayIndex={displayIndex}
        setDisplayIndex={setDisplayIndex}
        showPriceAndMarket={displayIndex === 0}
      />
      <div className="flexContainer">
        {AdditionalFiltersComponent}
        {NFTDisplayComponent}
      </div>
    </GRID_CONTAINER>
  )
}

const FilterCategory: FC<{
  setRef: (ref: HTMLDivElement) => void
  displayIndex: number
  currentIndex: number
  onClick: () => void
}> = ({ setRef, displayIndex, currentIndex, onClick, children }) => {
  const isSelected = displayIndex === currentIndex
  const className = isSelected ? 'selected' : 'flexItem'

  return (
    <div className={className} onClick={onClick} tw="z-[15]">
      <div tw="px-4 sm:px-2 mt-[5px] sm:mt-[1px]" ref={setRef}>
        {children}
      </div>
    </div>
  )
}

const FiltersContainer: FC<{
  setOpen: (open: boolean) => void
  displayIndex: number
  open: boolean
  showPriceAndMarket: boolean
  setDisplayIndex: (index: number) => void
}> = ({ setOpen, open, displayIndex, setDisplayIndex, showPriceAndMarket }) => {
  const { fixedPriceWithinCollection, singleCollection } = useNFTCollections()
  const { setSearchInsideCollection, searchInsideCollection } = useNFTAggregatorFilters()
  const { myNFTsByCollection } = useNFTCollections()
  const { mode } = useDarkMode()
  const { setCurrency } = useNFTAggregator()
  const { availableAttributes } = useNFTCollections()
  const breakpoint = useBreakPoint()
  const sliderRef = useRef(null)
  const buttonRefs = useRef<HTMLDivElement[]>([])
  const { handleSlide, setButtonRef } = useAnimateButtonSlide(sliderRef, buttonRefs, displayIndex)

  // TODO add this inside use memo
  const filterCategories = [
    {
      label: `Listed (${fixedPriceWithinCollection?.total_count ?? `000`})`,
      index: 0
    },
    {
      label: `My Items (${myNFTsByCollection?.length ?? 0})`,
      index: 1
    },
    {
      label: `All items (${singleCollection ? truncateBigNumber(singleCollection[0].nfts_count) : 0})`,
      index: 2
    },
    {
      label: 'Activity',
      index: 3
    }
  ]

  const DisplayFilterIcon = useMemo(() => {
    const displayFilterIcon = displayIndex === 0 || displayIndex === 2
    return <>{displayFilterIcon && <FiltersIcon open={open} setOpen={setOpen} />}</>
  }, [displayIndex, showPriceAndMarket, availableAttributes, open])

  return (
    <NFT_FILTERS_CONTAINER index={displayIndex}>
      <div className="flitersFlexContainer">
        <div tw="sm:mr-2">{DisplayFilterIcon}</div>

        <SearchBar
          width="70%"
          setSearchFilter={setSearchInsideCollection}
          cssStyle={tw`w-[332px] h-8.75`}
          filter={searchInsideCollection}
          bgColor={mode === 'dark' ? '#1C1C1C' : '#fff'}
          placeholder={checkMobile() ? `Search by nft ` : `Search by nft name`}
        />
        {checkMobile() && (
          <div tw="ml-3">
            <TokenToggleNFT toggleToken={setCurrency} />
          </div>
        )}
        {!checkMobile() && displayIndex === 0 && <SortDropdown />}
      </div>

      <div
        tw="sm:!w-[100vw]"
        className="filtersViewCategory"
        css={[breakpoint.isMobile ? tw`relative ml-0 sm:pt-1.5 sm:h-[45px]` : tw`absolute pt-4 !ml-[560px]`]}
      >
        <div tw="flex z-[100] pl-2.5">
          <div
            ref={sliderRef}
            className="pinkGradient"
            tw="h-8.75 w-[148px] absolute z-[10] sm:mt-[0px] rounded-[30px]"
            style={{
              transition: 'all 0.5s'
            }}
          ></div>
          <div tw="flex">
            {filterCategories.map((category, index) => (
              <FilterCategory
                setRef={setButtonRef}
                key={category.index}
                displayIndex={displayIndex}
                currentIndex={category.index}
                onClick={() => {
                  setDisplayIndex(category.index)
                  handleSlide(index)
                }}
              >
                {category.label}
              </FilterCategory>
            ))}
          </div>
        </div>
      </div>
      <div tw="ml-auto">{breakpoint.isDesktop && <TokenToggleNFT toggleToken={setCurrency} />}</div>
    </NFT_FILTERS_CONTAINER>
  )
}

const FiltersIcon: FC<{ open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }> = ({ open, setOpen }) => {
  const { mode } = useDarkMode()
  const handleButtonClick = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])
  return (
    <div
      tw="duration-1000 cursor-pointer z-[100] sm:ml-0 sm:mr-0 ml-[8px] mr-[-10px] !w-8.75 !h-8.75"
      onClick={handleButtonClick}
    >
      <img tw="!h-8.75 !w-8.75" src={`/img/assets/Aggregator/filters${open ? 'Closed' : 'Button'}${mode}.svg`} />
    </div>
  )
}
const SortDropdown = () => {
  const { collectionSort } = useNFTCollections()
  const [arrow, setArrow] = useState<boolean>(false)
  const { mode } = useDarkMode()

  return (
    <div>
      <Dropdown
        align={{ offset: [0, 16] }}
        destroyPopupOnHide
        overlay={<OverlayOptions setArrow={setArrow} />}
        placement="bottomRight"
        trigger={checkMobile() ? ['click'] : ['hover']}
      >
        {checkMobile() ? (
          <div>
            <img className="shareBtn" src={`/img/assets/Aggregator/setting${arrow ? `Active` : ``}${mode}.svg`} />
          </div>
        ) : (
          <div className={`sortingBtn ${arrow ? `addBorder` : ''}`}>
            Price:
            <>{collectionSort === 'ASC' ? ' Ascending' : ' Descending'}</>
            <div tw="ml-2">
              <CircularArrow cssStyle={tw`h-5 w-5`} invert={arrow} />
            </div>
          </div>
        )}
      </Dropdown>
    </div>
  )
}

const OverlayOptions: FC<{ setArrow: any }> = ({ setArrow }): ReactElement => {
  const { collectionSort, setCollectionSort } = useNFTCollections()
  useEffect(() => {
    setArrow(true)
    return () => setArrow(false)
  }, [])
  return (
    <DROPDOWN_CONTAINER>
      <div className="option" onClick={() => setCollectionSort('ASC')}>
        Price: Ascending <input type={'radio'} checked={collectionSort === 'ASC'} name="sort" value="asc" />
      </div>
      <div className="option" onClick={() => setCollectionSort('DESC')}>
        Price: Descending <input type={'radio'} checked={collectionSort === 'DESC'} name="sort" value="desc" />
      </div>
      {checkMobile() && (
        <div className="option" onClick={copyToClipboard}>
          Share
        </div>
      )}
    </DROPDOWN_CONTAINER>
  )
}
const CollectionV2 = (): ReactElement => {
  const params = useParams<IAppParams>()

  const {
    fetchSingleCollection,
    setSingleCollection,
    setFixedPriceWithinCollection,
    setOpenBidWithinCollection,
    singleCollection
  } = useNFTCollections()
  const [err, setErr] = useState(false)
  const { refreshClicked } = useNFTAggregator()
  const { setAdditionalFilters } = useNFTAggregatorFilters()
  const { setNftInSweeper } = useNFTAggregator()

  useEffect(() => {
    if (singleCollection) logData('collection_page_' + singleCollection[0].collection_name.replace(' ', '_'))
  }, [singleCollection])

  useEffect(() => {
    setNftInSweeper(undefined)
  }, [])

  useEffect(
    () => () => {
      setAdditionalFilters(initialFilters)
      setSingleCollection(undefined)
      setFixedPriceWithinCollection(undefined)
      setOpenBidWithinCollection(undefined)
    },
    []
  )

  useEffect(() => {
    const curColNameParam = decodeURIComponent(params.collectionName.replaceAll('_', '%20'))
    fetchSingleCollection(curColNameParam).then((res) => {
      setErr(res && res.status === 400 ? true : false)
    })

    return null
  }, [fetchSingleCollection, params.collectionName, refreshClicked])

  //had to remove singleCollection useState trigger as it leads to
  // infinite loop as setSingleCollection is called in fetch SingleCollection
  return err ? (
    <GenericNotFound redirectLink="/nfts" redirectString="Go to NFT Aggerator " />
  ) : (
    <COLLECTION_VIEW_WRAPPER id="nft-aggerator-container">
      <NFTStatsContainer />
      <NFTGridContainer />
    </COLLECTION_VIEW_WRAPPER>
  )
}
export default CollectionV2
