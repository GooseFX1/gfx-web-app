/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useState, useEffect, useMemo, FC } from 'react'
import { Dropdown } from 'antd'
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
import { GradientText } from '../../../components/GradientText'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import ActivityNFTSection from './ActivityNFTSection'
import AdditionalFilters from './AdditionalFilters'

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
import { CurrentUserProfilePic, RefreshBtnWithAnimationNFT } from '../Home/NFTLandingPageV2'
import { LastRefreshedAnimation } from '../../Farm/FarmFilterHeader'
import { copyToClipboard, minimizeTheString } from '../../../web3/nfts/utils'
import { ArrowClicker, ArrowDropdown, SearchBar, TokenToggleNFT } from '../../../components'
import { NFT_ACTIVITY_ENDPOINT } from '../../../api/NFTs'
import { truncateBigNumber } from '../../TradeV3/perps/utils'
import { useCallback } from 'react'
import { Arrow } from '../../../components/common/Arrow'
import { GenericTooltip, TableHeaderTitle } from '../../../utils/GenericDegsin'
import { useWallet } from '@solana/wallet-adapter-react'
import { Share } from '../Share'
import MyItemsNFTs from './MyItemsNFTs'

const CollectionV2 = (): ReactElement => {
  const params = useParams<IAppParams>()
  const { isCollapsed } = useNavCollapse()

  const { fetchSingleCollection, setSingleCollection, setFixedPriceWithinCollection, setOpenBidWithinCollection } =
    useNFTCollections()
  const [err, setErr] = useState(false)
  const { refreshClicked } = useNFTAggregator()
  useEffect(
    () => () => {
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
  // infinite loop as setSingleCollection is called in fecthSingleCollection
  return err ? (
    <GenericNotFound redirectLink="/nfts" redirectString="Go to NFT Aggerator " />
  ) : (
    <COLLECTION_VIEW_WRAPPER id="nft-aggerator-container" navCollapsed={isCollapsed}>
      <NFTStatsContainer />
      <NFTGridContainer />
    </COLLECTION_VIEW_WRAPPER>
  )
}

const NFTStatsContainer = () => {
  const history = useHistory()
  const { singleCollection, fixedPriceWithinCollection } = useNFTCollections()
  const { lastRefreshedClass, refreshClass, setLastRefreshedClass } = useNFTAggregator()
  const [appraisalPopup, setGFXAppraisalPopup] = useState<boolean>(false)
  const [firstLoad, setFirstPageLoad] = useState<boolean>(true)
  const [shareModal, setShareModal] = useState<boolean>(false)
  const { sessionUser } = useNFTProfile()
  const { mode } = useDarkMode()

  const collection: NFTCollection | undefined = useMemo(
    () => (singleCollection ? singleCollection[0] : undefined),
    [singleCollection]
  )
  const collectionFloor: number = useMemo(
    () => (singleCollection ? singleCollection[0].floor_price / LAMPORTS_PER_SOL_NUMBER : 0),
    [collection]
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
        <LastRefreshedAnimation lastRefreshedClass={lastRefreshedClass} />
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
            <div tw="sm:text-[22px] font-bold flex items-center text-[25px]">
              {collection ? (
                <GenericTooltip text={collection.collection_name}>
                  <div tw="sm:text-[22px] ml-3 font-bold max-w-[250px]">
                    {minimizeTheString(collection.collection_name, checkMobile() ? 10 : 40)}
                    {collection && collection.is_verified ? (
                      <img
                        style={{ height: 25, width: 25, margin: '0 8px' }}
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
                <SkeletonCommon width="200px" height="30px" style={{ marginTop: '20px', marginLeft: 10 }} />
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
              <div className="subTitleText"> 24H Volume </div>
            </div>
          </div>
          {!checkMobile() && (
            <div tw="ml-auto mr-1" className="moreOptions">
              <div>
                <RefreshBtnWithAnimationNFT />
              </div>
              <div>
                <img
                  tw="h-11 w-11 !mr-0"
                  src="/img/assets/shareBlue.svg"
                  alt=""
                  onClick={() => copyToClipboard()}
                />
              </div>
              {pubKey && <div tw="!w-10">{<CurrentUserProfilePic />}</div>}
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

  const NFTDisplayComponent = useMemo(() => {
    if (displayIndex === 0) return <FixedPriceNFTs />
    if (displayIndex === 1) return <MyItemsNFTs setDisplayIndex={setDisplayIndex} />
    if (displayIndex === 2) return <OpenBidNFTs />
    if (displayIndex === 3)
      return (
        <ActivityNFTSection
          cssStyle={tw`bg-grey-5`}
          address={activityAddress}
          typeOfAddress={NFT_ACTIVITY_ENDPOINT.COLLECTION_ADDRESS}
        />
      )
  }, [displayIndex, activityAddress])
  return (
    <GRID_CONTAINER navCollapsed={isCollapsed}>
      <FiltersContainer setOpen={setOpen} displayIndex={displayIndex} setDisplayIndex={setDisplayIndex} />
      <div className="flexContainer">
        {/* <AdditionalFilters open={open} setOpen={setOpen} /> */}
        {NFTDisplayComponent}
      </div>
    </GRID_CONTAINER>
  )
}

const FilterCategory: FC<{ displayIndex: number; currentIndex: number; onClick: () => void }> = ({
  displayIndex,
  currentIndex,
  onClick,
  children
}) => {
  const isSelected = displayIndex === currentIndex
  const className = isSelected ? 'selected' : 'flexItem'

  return (
    <div className={className} onClick={onClick}>
      <div>{children}</div>
      {!checkMobile() && currentIndex === 0 && <div className="activeItem" />}
      {checkMobile() && isSelected && <div className="activeItemMobile"></div>}
    </div>
  )
}

const FiltersContainer: FC<{
  setOpen: (open: boolean) => void
  displayIndex: number
  setDisplayIndex: (index: number) => void
}> = ({ setOpen, displayIndex, setDisplayIndex }) => {
  const { fixedPriceWithinCollection, singleCollection } = useNFTCollections()
  const { setSearchInsideCollection, searchInsideCollection } = useNFTAggregatorFilters()
  const { myNFTsByCollection } = useNFTCollections()
  const { mode } = useDarkMode()
  const { setCurrency } = useNFTAggregator()

  // TODO add this inside use memo
  const filterCategories = [
    {
      label: `Listed (${fixedPriceWithinCollection?.total_count ?? 0})`,
      index: 0
    },
    {
      label: `My Items (${myNFTsByCollection?.length})`,
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

  return (
    <NFT_FILTERS_CONTAINER index={displayIndex}>
      <div className="flitersFlexContainer">
        <SearchBar
          setSearchFilter={setSearchInsideCollection}
          style={{ width: 332 }}
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

      <div className="filtersViewCategory">
        {filterCategories.map((category) => (
          <FilterCategory
            key={category.index}
            displayIndex={displayIndex}
            currentIndex={category.index}
            onClick={() => setDisplayIndex(category.index)}
          >
            {category.label}
          </FilterCategory>
        ))}
        <div tw="mr-4">{!checkMobile() && <TokenToggleNFT toggleToken={setCurrency} />}</div>
      </div>
    </NFT_FILTERS_CONTAINER>
  )
}

const SortDropdown = () => {
  const { collectionSort } = useNFTCollections()
  const [arrow, setArrow] = useState<boolean>(false)

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
            <img className="shareBtn" src="/img/assets/Aggregator/shareBtn.svg" />
          </div>
        ) : (
          <div className={`sortingBtn ${arrow ? `addBorder` : ''}`}>
            Price:
            <>{collectionSort === 'ASC' ? ' Ascending' : ' Descending'}</>
            <Arrow height="9px" width="18px" cssStyle={tw`ml-2`} invert={arrow} />
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
export default CollectionV2
