/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useState, useEffect, useMemo } from 'react'
import { Dropdown, Tooltip } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import {
  useDarkMode,
  useNFTProfile,
  useNavCollapse,
  useNFTAggregator,
  useNFTCollections,
  useNFTDetails,
  useNFTAggregatorFilters
} from '../../../context'
import { ICON } from '../../../layouts'
import { IAppParams } from '../../../types/app_params'
import { NFTCollection } from '../../../types/nft_collections'
import { checkMobile, formatSOLDisplay } from '../../../utils'
import { GenericNotFound } from '../../InvalidUrl'
import { GradientText } from '../adminPage/components/UpcomingMints'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import ActivityNFTSection from './ActivityNFTSection'
import AdditionalFilters from './AdditionalFilters'
import { BidNFTModal, BuyNFTModal } from './BuyNFTModal'
import {
  COLLECTION_VIEW_WRAPPER,
  GRID_CONTAINER,
  NFT_FILTERS_CONTAINER,
  NFT_COLLECTIONS_GRID,
  DROPDOWN_CONTAINER
} from './CollectionV2.styles'
import { DetailViewNFT } from './DetailViewNFTDrawer'
import SweepCollectionDrawer from './SweepCollectionDrawer'
import tw from 'twin.macro'
import 'styled-components/macro'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { OpenBidNFTs } from './OpenBidNFTs'
import { FixedPriceNFTs } from './FixedPriceNFTs'
import { Image } from 'antd'
import { GFXApprisalPopup } from '../../../components/NFTAggWelcome'
import { RefreshBtnWithAnimationNFT } from '../Home/NFTLandingPageV2'
import { LastRefreshedAnimation } from '../../Farm/FarmFilterHeader'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { ArrowClicker, ArrowDropdown, SearchBar, TokenToggleNFT } from '../../../components'
import { NFT_ACTIVITY_ENDPOINT } from '../../../api/NFTs'
import { truncateBigNumber } from '../../TradeV3/perps/utils'
import { useCallback } from 'react'

const CollectionV2 = (): ReactElement => {
  const params = useParams<IAppParams>()
  const { isCollapsed } = useNavCollapse()

  const {
    singleCollection,
    fetchSingleCollection,
    setSingleCollection,
    setFixedPriceWithinCollection,
    setOpenBidWithinCollection,
    setCollectionOwners
  } = useNFTCollections()
  const [err, setErr] = useState(false)
  const { refreshClicked } = useNFTAggregator()
  useEffect(
    () => () => {
      setSingleCollection(undefined)
      setFixedPriceWithinCollection(undefined)
      setOpenBidWithinCollection(undefined)
      setCollectionOwners(undefined)
    },
    []
  )

  useEffect(() => {
    const curColNameParam = decodeURIComponent(params.collectionName.replaceAll('_', '%20'))
    fetchSingleCollection(curColNameParam).then((res) => setErr(res && res.status === 200 ? false : false))

    return null
  }, [fetchSingleCollection, params.collectionName, refreshClicked])

  //had to remove singleCollection useState trigger as it leads to
  // infinite loop as setSingleCollection is called in fecthSingleCollection
  return err ? (
    <GenericNotFound />
  ) : (
    <COLLECTION_VIEW_WRAPPER id="nft-aggerator-container" navCollapsed={isCollapsed}>
      <NFTStatsContainer />
      <NFTGridContainer />
    </COLLECTION_VIEW_WRAPPER>
  )
}

const NFTStatsContainer = () => {
  const history = useHistory()
  const { mode } = useDarkMode()
  const {
    singleCollection,
    fixedPriceWithinCollection,
    setOpenBidWithinCollection,
    setFixedPriceWithinCollection
  } = useNFTCollections()
  const { lastRefreshedClass, refreshClass, setLastRefreshedClass } = useNFTAggregator()
  const [sweepCollection, setSweepCollection] = useState<boolean>(false)
  const [appraisalPopup, setGFXAppraisalPopup] = useState<boolean>(false)
  const [firstLoad, setFirstPageLoad] = useState<boolean>(true)

  const collection: NFTCollection | undefined = useMemo(
    () => (singleCollection ? singleCollection[0] : undefined),
    [singleCollection]
  )
  const collectionFloor: number = useMemo(
    () => (singleCollection ? singleCollection[0].floor_price / LAMPORTS_PER_SOL_NUMBER : 0),
    [collection]
  )

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

  const handleAppraisalPopup = useCallback(() => {
    if (appraisalPopup) return <GFXApprisalPopup showTerms={appraisalPopup} setShowTerms={setGFXAppraisalPopup} />
  }, [appraisalPopup])

  return (
    <div tw="flex flex-col">
      <div tw="flex justify-center">
        <LastRefreshedAnimation lastRefreshedClass={lastRefreshedClass} />
      </div>
      {handleAppraisalPopup()}
      <div className="nftStatsContainer">
        {!checkMobile() && (
          <button className="backBtn" onClick={(e) => history.push('/nfts')} tw="border-0">
            <img src="/img/assets/arrow-leftdark.svg" />
          </button>
        )}
        <SweepCollectionDrawer sweepCollection={sweepCollection} setSweepCollection={setSweepCollection} />

        <div className="collectionNameContainer">
          <div className="collectionName">
            {collection ? (
              <Image
                preview={false}
                fallback={'/img/assets/Aggregator/Unknown.svg'}
                src={`${
                  collection.profile_pic_link === undefined
                    ? '/img/assets/Aggregator/Unknown.svg'
                    : collection.profile_pic_link
                }`}
                alt="collection-image"
              />
            ) : (
              <SkeletonCommon style={{ marginLeft: 20 }} width="65px" height="65px" borderRadius="50%" />
            )}
            <div
              tw="sm:text-[22px] ml-2 font-bold flex items-center"
              style={{ fontSize: collection?.collection_name?.length > 20 ? '25px' : '35px' }}
            >
              {collection ? (
                <Tooltip title={collection.collection_name}>
                  <div tw="sm:text-[22px] ml-3 font-bold">
                    {minimizeTheString(collection.collection_name, checkMobile() ? 10 : 15)}
                  </div>
                </Tooltip>
              ) : (
                <SkeletonCommon width="200px" height="30px" style={{ marginTop: '20px', marginLeft: 10 }} />
              )}
              {collection && collection.is_verified && (
                <img
                  style={{ height: 25, width: 25, marginLeft: 8 }}
                  src="/img/assets/Aggregator/verifiedNFT.svg"
                />
              )}
            </div>
            {checkMobile() && (
              <div className="title" style={{ display: 'flex', marginLeft: 'auto' }}>
                {/*   <div onClick={() => setSweepCollection(true)}>
                  <img className="sweepMobile" src="/img/assets/Aggregator/sweepButtonMobile.svg" />
                </div>
                <div>
                  <SortDropdown />
                </div> */}
              </div>
            )}
          </div>

          <div className="generalStats">
            <div tw="flex items-center">
              <img
                onClick={() => setGFXAppraisalPopup(true)}
                tw="h-[20px] w-[20px] cursor-pointer"
                src="/img/assets/Aggregator/Tooltip.svg"
                alt="appraisal-icon"
              />
              <div className="wrapper" style={{ marginLeft: 8 }}>
                <div className={collection?.gfx_appraisal_supported ? 'titleText' : 'titleTextNoSupport'}>
                  Appraisal
                </div>
                <div className={collection?.gfx_appraisal_supported ? 'subTitleText' : 'subTitleTextNoSupport'}>
                  {collection && collection.gfx_appraisal_supported ? 'Supported' : 'Not Supported'}
                </div>
              </div>
            </div>

            <div className="wrapper">
              <div className="titleText" tw="leading-none">
                {collectionFloor.toFixed(2)} SOL
              </div>
              <div className="subTitleText">Floor Price</div>
            </div>
            {!checkMobile() && (
              <div className="wrapper">
                <div className="titleText" tw="leading-none">
                  {fixedPriceWithinCollection?.total_count +
                    '/' +
                    (singleCollection ? singleCollection[0]?.nfts_count : 0)}
                </div>
                <div className="subTitleText">Listed</div>
              </div>
            )}
            <div className="wrapper">
              <div className="titleText" tw="leading-none">
                {singleCollection
                  ? truncateBigNumber(parseFloat(formatSOLDisplay(singleCollection[0].daily_volume)))
                  : 0}{' '}
                SOL
              </div>
              <div className="subTitleText"> 24h volume </div>
            </div>
          </div>
          {!checkMobile() && (
            <div tw="ml-auto" className="moreOptions">
              <div>
                <RefreshBtnWithAnimationNFT />
              </div>
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
  const { isCollapsed } = useNavCollapse()
  const [open, setOpen] = useState<boolean>(true)
  const { singleCollection } = useNFTCollections()
  const [displayIndex, setDisplayIndex] = useState<number>(0)
  const activityAddress = singleCollection
    ? singleCollection[0]?.verified_collection_address
      ? singleCollection[0]?.verified_collection_address
      : singleCollection[0].first_verified_creator_address
    : null
  return (
    <GRID_CONTAINER navCollapsed={isCollapsed}>
      <FiltersContainer setOpen={setOpen} displayIndex={displayIndex} setDisplayIndex={setDisplayIndex} />
      <div className="flexContainer">
        {/* <AdditionalFilters open={open} setOpen={setOpen} /> */}
        {displayIndex === 0 && <FixedPriceNFTs />}
        {displayIndex === 1 && <OpenBidNFTs />}
        {displayIndex === 2 && (
          <ActivityNFTSection address={activityAddress} typeOfAddress={NFT_ACTIVITY_ENDPOINT.COLLECTION_ADDRESS} />
        )}
      </div>
    </GRID_CONTAINER>
  )
}

const FiltersContainer = ({ setOpen, displayIndex, setDisplayIndex }: any): ReactElement => {
  const { fixedPriceWithinCollection, singleCollection } = useNFTCollections()
  const { setSearchInsideCollection } = useNFTAggregatorFilters()
  const { mode } = useDarkMode()
  const { setCurrency } = useNFTAggregator()

  return (
    <NFT_FILTERS_CONTAINER index={displayIndex}>
      <div className="flitersFlexContainer">
        {/* <img onClick={() => setOpen((prev) => !prev)} src={`/img/assets/Aggregator/filtersIcon${mode}.svg`} /> */}
        <SearchBar
          setSearchFilter={setSearchInsideCollection}
          style={{ width: 332 }}
          placeholder={checkMobile() ? `Search by nft ` : `Search by nft name`}
        />
        {checkMobile() && displayIndex === 0 && (
          <div tw="ml-3">
            <TokenToggleNFT toggleToken={setCurrency} />
          </div>
        )}
        {!checkMobile() && displayIndex === 0 && <SortDropdown />}
      </div>

      <div className="filtersViewCategory">
        {checkMobile() && <div className="activeItem" />}
        <div className={displayIndex === 0 ? 'selected' : 'flexItem'} onClick={() => setDisplayIndex(0)}>
          Listed ({fixedPriceWithinCollection && fixedPriceWithinCollection.total_count})
          {!checkMobile() && <div className="activeItem" />}
        </div>
        <div className={displayIndex === 1 ? 'selected' : 'flexItem'} onClick={() => setDisplayIndex(1)}>
          All items ({singleCollection ? singleCollection[0].nfts_count : 0})
        </div>
        <div className={displayIndex === 2 ? 'selected' : 'flexItem'} onClick={() => setDisplayIndex(2)}>
          Activity
        </div>
        {!checkMobile() && <TokenToggleNFT toggleToken={setCurrency} />}
      </div>
    </NFT_FILTERS_CONTAINER>
  )
}

const SortDropdown = () => {
  const { sortingAsc } = useNFTAggregator()

  return (
    <div>
      <Dropdown
        align={{ offset: [0, 16] }}
        destroyPopupOnHide
        overlay={<OverlayOptions />}
        placement="bottomRight"
        trigger={checkMobile() ? ['click'] : ['hover']}
      >
        {checkMobile() ? (
          <div>
            <img className="shareBtn" src="/img/assets/Aggregator/shareBtn.svg" />
          </div>
        ) : (
          <div className="sortingBtn">
            Price:
            <>{sortingAsc ? ' Ascending' : ' Descending'}</>
            <ArrowClicker arrowRotation={!sortingAsc} cssStyle={tw`!h-4 !w-4 !ml-1`} />
          </div>
        )}
      </Dropdown>
    </div>
  )
}

const OverlayOptions = () => {
  const { sortingAsc, setSortAsc } = useNFTAggregator()

  return (
    <DROPDOWN_CONTAINER>
      <div className="option" onClick={() => setSortAsc(true)}>
        Price: Ascending <input type={'radio'} checked={sortingAsc} name="sort" value="asc" />
      </div>
      <div className="option" onClick={() => setSortAsc(false)}>
        Price: Descending <input type={'radio'} checked={!sortingAsc} name="sort" value="desc" />
      </div>
      {checkMobile() && <div className="option">Share</div>}
    </DROPDOWN_CONTAINER>
  )
}
export default CollectionV2
