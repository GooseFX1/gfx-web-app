import { Dropdown } from 'antd'
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SearchBar } from '../../../components'
import { useDarkMode, useNavCollapse, useNFTAggregator } from '../../../context'
import { ICON } from '../../../layouts'
import { IAppParams } from '../../../types/app_params'
import { checkMobile } from '../../../utils'
import { GradientText } from '../adminPage/components/UpcomingMints'
import { CurrencySwitch } from '../Home/NFTLandingPageV2'
import ActivityNFTSection from './ActivityNFTSection'
import AdditionalFilters from './AdditionalFilters'
import { BuyNFTModal } from './BuyNFTModal'
import {
  COLLECTION_VIEW_WRAPPER,
  GRID_CONTAINER,
  NFT_FILTERS_CONTAINER,
  NFT_COLLECTIONS_GRID,
  DROPDOWN_CONTAINER
} from './CollectionV2.styles'
import SingleViewNFT from './SingleViewNFT'
import SweepCollectionDrawer from './SweepCollectionDrawer'

const CollectionV2 = (): ReactElement => {
  const params = useParams<IAppParams>()
  const { isCollapsed } = useNavCollapse()

  return (
    <COLLECTION_VIEW_WRAPPER id="nft-aggerator-container" navCollapsed={isCollapsed}>
      <NFTStatsContainer />
      <NFTGridContainer />
    </COLLECTION_VIEW_WRAPPER>
  )
}
const NFTStatsContainer = () => {
  const { mode } = useDarkMode()
  const [sweepCollection, setSweepCollection] = useState<boolean>(true)
  const logo =
    'https://beta.api.solanalysis.com/images/filters:' +
    'frames(,0)/https://storage.googleapis.com/feliz-crypto/project_photos/degodslogo.jpg'
  return (
    <div className="nftStatsContainer">
      {!checkMobile() && (
        <div className="backBtn">
          <img src="/img/assets/arrow-leftdark.svg" />
        </div>
      )}
      <SweepCollectionDrawer sweepCollection={sweepCollection} setSweepCollection={setSweepCollection} />

      <div className="collectionNameContainer">
        <div className="collectionName">
          <img src={logo} />
          <div className="title">
            De Gods
            <img style={{ height: 25, width: 25, marginLeft: 8 }} src="/img/assets/Aggregator/verifiedNFT.svg" />
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
            <div className="titleText"> 180 SOL </div>
            <div className="subTitleText">Floor Price</div>
          </div>
          {!checkMobile() && (
            <div className="wrapper">
              <div className="titleText">112/10K</div>
              <div className="subTitleText"> Listed</div>
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
const NFTGridContainer = (): ReactElement => {
  const { isCollapsed } = useNavCollapse()
  const [open, setOpen] = useState<boolean>(true)
  const [displayIndex, setDisplayIndex] = useState<number>(0)

  return (
    <GRID_CONTAINER navCollapsed={isCollapsed}>
      <FiltersContainer
        open={open}
        setOpen={setOpen}
        displayIndex={displayIndex}
        setDisplayIndex={setDisplayIndex}
      />
      <div className="flexContainer">
        <AdditionalFilters open={open} setOpen={setOpen} />
        {displayIndex !== 2 && <NFTCollectionsGrid />}
        {displayIndex === 2 && <ActivityNFTSection />}
      </div>
    </GRID_CONTAINER>
  )
}

const FiltersContainer = ({ setOpen, displayIndex, setDisplayIndex }: any): ReactElement => {
  const { mode } = useDarkMode()

  return (
    <NFT_FILTERS_CONTAINER index={displayIndex}>
      <div className="flitersFlexContainer">
        <img onClick={() => setOpen((prev) => !prev)} src={`/img/assets/Aggregator/filtersIcon${mode}.svg`} />
        <SearchBar placeholder={checkMobile() ? `Search by nft ` : `Search by nft o owner`} />
        {!checkMobile() && <SortDropdown />}
        {checkMobile() && <CurrencySwitch />}
      </div>

      <div className="flitersViewCategory">
        <div className={displayIndex === 0 ? 'selected' : 'flexItem'} onClick={() => setDisplayIndex(0)}>
          Listed (243)
          <div className="activeItem" />
        </div>
        <div className={displayIndex === 1 ? 'selected' : 'flexItem'} onClick={() => setDisplayIndex(1)}>
          All items (10K)
        </div>
        <div className={displayIndex === 2 ? 'selected' : 'flexItem'} onClick={() => setDisplayIndex(2)}>
          Activity
        </div>
      </div>
    </NFT_FILTERS_CONTAINER>
  )
}

const NFTCollectionsGrid = (): ReactElement => {
  const { nftCollections, selectedNFT, setSelectedNFT } = useNFTAggregator()
  return (
    <NFT_COLLECTIONS_GRID>
      {<SingleViewNFT selectedNFT={selectedNFT} setSelectedNFT={setSelectedNFT} />}

      <div className="gridContainer">
        {nftCollections &&
          nftCollections.map((item, index) => (
            <div className="gridItem" key={index} onClick={() => setSelectedNFT(item)}>
              <div className="gridItemContainer">
                <img src={item.nft_url} alt="nft" />
              </div>
              <div className="nftTextContainer">
                <div className="collectionId">
                  {item.collectionId}#
                  <img src="/img/assets/Aggregator/verifiedNFT.svg" />
                </div>
                <GradientText text={item.collectionName} fontSize={15} fontWeight={600} />
                <div className="nftPrice">
                  {item.nftPrice}
                  <img src={`/img/crypto/${item.currency}.svg`} alt={item.currency} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </NFT_COLLECTIONS_GRID>
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
