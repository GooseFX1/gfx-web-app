import { Dropdown } from 'antd'
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useState, FC, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Loader, SearchBar, TokenToggleNFT } from '../../../components'
import { Button } from '../../../components/Button'
import { useDarkMode, useNavCollapse, useNFTAggregator, useNFTCollections } from '../../../context'
import { ICON } from '../../../layouts'
import { IAppParams } from '../../../types/app_params'
import { checkMobile } from '../../../utils'
import { GenericNotFound } from '../../InvalidUrl'
import { GradientText } from '../adminPage/components/UpcomingMints'
import MyNFTBag from '../MyNFTBag'
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
import { LAMPORTS_PER_SOL } from '../../../constants'
import { OpenBidNFTs } from './OpenBidNFTs'
import { FixedPriceNFTs } from './FixedPriceNFTs'
import { Image } from 'antd'

const CollectionV2 = (): ReactElement => {
  const params = useParams<IAppParams>()
  const { isCollapsed } = useNavCollapse()
  const {
    singleCollection,
    fetchSingleCollection,
    setSingleCollection,
    setFixedPriceWithinCollection,
    setOpenBidWithinCollection,
    setCollectionOwners,
    nftMenuPopup,
    setNFTMenuPopup
  } = useNFTCollections()
  const [err, setErr] = useState(false)
  const [filter, setFilter] = useState('')
  const [collapse, setCollapse] = useState(true)

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
    const curColNameParam = params.collectionName.replaceAll('_', ' ')

    if (!singleCollection || singleCollection.collection[0].collection_name !== curColNameParam) {
      fetchSingleCollection(curColNameParam).then((res) => setErr(res && res.status === 200 ? false : true))
    }

    return null
  }, [fetchSingleCollection, params.collectionName])
  //had to remove singleCollection useState trigger as it leads to
  // infinite loop as setSingleCollection is called in fecthSingleCollection

  return err ? (
    <GenericNotFound />
  ) : (
    <COLLECTION_VIEW_WRAPPER id="nft-aggerator-container" navCollapsed={isCollapsed}>
      <MyNFTBag />
      <NFTStatsContainer />
      <NFTGridContainer />
    </COLLECTION_VIEW_WRAPPER>
  )
}

const NFTStatsContainer = () => {
  const { mode } = useDarkMode()
  const { singleCollection, fixedPriceWithinCollection } = useNFTCollections()
  const [sweepCollection, setSweepCollection] = useState<boolean>(false)
  const collection = singleCollection ? singleCollection.collection[0] : undefined
  const collectionFloor = singleCollection
    ? singleCollection.collection_floor / parseInt(LAMPORTS_PER_SOL.toString())
    : 0
  const logo = singleCollection ? singleCollection.collection[0].profile_pic_link : undefined
  const collectionName = singleCollection ? singleCollection.collection[0].collection_name : null
  const history = useHistory()
  return (
    <div className="nftStatsContainer">
      {!checkMobile() && (
        <div className="backBtn" onClick={() => history.push('/nfts')}>
          <img src="/img/assets/arrow-leftdark.svg" />
        </div>
      )}
      <SweepCollectionDrawer sweepCollection={sweepCollection} setSweepCollection={setSweepCollection} />

      <div className="collectionNameContainer">
        <div className="collectionName">
          {collectionName ? (
            <Image
              preview={false}
              fallback={'/img/assets/Aggregator/Unknown.svg'}
              src={`${logo === undefined ? '/img/assets/Aggregator/Unknown.svg' : logo}`}
              alt=""
            />
          ) : (
            <SkeletonCommon style={{ marginLeft: 20 }} width="65px" height="65px" borderRadius="50%" />
          )}
          <div className="title">
            {collectionName ? (
              collectionName
            ) : (
              <SkeletonCommon width="200px" height="30px" style={{ marginTop: '20px', marginLeft: 10 }} />
            )}
            {logo && (
              <img style={{ height: 25, width: 25, marginLeft: 8 }} src="/img/assets/Aggregator/verifiedNFT.svg" />
            )}
          </div>
          {checkMobile() && (
            <div className="title" style={{ display: 'flex', marginLeft: 'auto' }}>
              <div onClick={() => setSweepCollection(true)}>
                <img className="sweepMobile" src="/img/assets/Aggregator/sweepButtonMobile.svg" />
              </div>
              <div>
                <SortDropdown />
              </div>
            </div>
          )}
        </div>

        <div className="generalStats">
          <div className="wrapper">
            <div className="titleText">
              <img src={`/img/assets/Aggregator/gooseLogo.svg`} />
              1.5K SOL
            </div>
            <div className="subTitleText"> Apprasial Value </div>
          </div>

          <div className="wrapper">
            <div className="titleText">{collectionFloor ? collectionFloor : 0} SOL</div>
            <div className="subTitleText">Floor Price</div>
          </div>
          {!checkMobile() && (
            <div className="wrapper">
              <div className="titleText">
                {fixedPriceWithinCollection?.total_count}/{collection?.size ? collection?.size : 0}
              </div>
              <div className="subTitleText">Listed</div>
            </div>
          )}
          <div className="wrapper">
            <div className="titleText"> 1800 SOL </div>
            <div className="subTitleText"> 24h volume </div>
          </div>
        </div>
        {!checkMobile() && (
          <div className="moreOptions">
            <div>
              <img src="/img/assets/refreshButton.png" />
            </div>
            <div className="sweepBtn" onClick={() => setSweepCollection(true)}>
              <img src="/img/assets/Aggregator/sweepButton.svg" alt="" />
            </div>
            <div>
              <ICON $mode={mode === 'dark'}>
                <img src={`/img/assets/more_icon.svg`} alt="more" />
              </ICON>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export const NFTGridContainer = (): ReactElement => {
  const { isCollapsed } = useNavCollapse()
  const [open, setOpen] = useState<boolean>(true)
  const [displayIndex, setDisplayIndex] = useState<number>(0)

  return (
    <GRID_CONTAINER navCollapsed={isCollapsed}>
      <FiltersContainer setOpen={setOpen} displayIndex={displayIndex} setDisplayIndex={setDisplayIndex} />
      <div className="flexContainer">
        {/* <AdditionalFilters open={open} setOpen={setOpen} /> */}
        {displayIndex === 0 && <FixedPriceNFTs />}
        {displayIndex === 1 && <OpenBidNFTs />}
        {displayIndex === 2 && <ActivityNFTSection />}
      </div>
    </GRID_CONTAINER>
  )
}

const FiltersContainer = ({ setOpen, displayIndex, setDisplayIndex }: any): ReactElement => {
  const { mode } = useDarkMode()
  const { openBidWithinCollection, fixedPriceWithinCollection, singleCollection } = useNFTCollections()
  const { setCurrency } = useNFTAggregator()

  return (
    <NFT_FILTERS_CONTAINER index={displayIndex}>
      <div className="flitersFlexContainer">
        {/* <img onClick={() => setOpen((prev) => !prev)} src={`/img/assets/Aggregator/filtersIcon${mode}.svg`} />
        <SearchBar placeholder={checkMobile() ? `Search by nft ` : `Search by nft o owner`} /> 
  {!checkMobile() && <SortDropdown />} */}
        {/* {checkMobile() && <CurrencySwitch />} */}
      </div>

      <div className="flitersViewCategory">
        <div className={displayIndex === 0 ? 'selected' : 'flexItem'} onClick={() => setDisplayIndex(0)}>
          Listed ({fixedPriceWithinCollection ? fixedPriceWithinCollection.total_count : 'loading...'})
          <div className="activeItem" />
        </div>
        <div className={displayIndex === 1 ? 'selected' : 'flexItem'} onClick={() => setDisplayIndex(1)}>
          All items (
          {openBidWithinCollection ? openBidWithinCollection.total_count : singleCollection?.collection[0]?.size})
        </div>
        <div className={displayIndex === 2 ? 'selected' : 'flexItem'} onClick={() => setDisplayIndex(2)}>
          Activity
        </div>
        <div tw="mr-[16px]">
          <TokenToggleNFT toggleToken={setCurrency} />
        </div>
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
          <div className="sortingBtn">Price: {sortingAsc ? 'Ascending' : 'Descending'}</div>
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
