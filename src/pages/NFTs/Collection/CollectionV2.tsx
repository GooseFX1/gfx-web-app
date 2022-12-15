/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from 'antd'
import React, { ReactElement, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SearchBar } from '../../../components'
import { useDarkMode, useNavCollapse, useNFTAggregator } from '../../../context'
import { ICON } from '../../../layouts/App/More'
import { IAppParams } from '../../../types/app_params'
import { GradientText } from '../adminPage/components/UpcomingMints'
import AdditionalFilters from './AdditionalFilters'
import {
  COLLECTION_VIEW_WRAPPER,
  GRID_CONTAINER,
  NFT_FILTERS_CONTAINER,
  NFT_COLLECTIONS_GRID
} from './CollectionV2.styles'

const CollectionV2 = (): ReactElement => {
  const params = useParams<IAppParams>()
  const { isCollapsed } = useNavCollapse()

  return (
    <COLLECTION_VIEW_WRAPPER navCollapsed={isCollapsed}>
      <NFTStatsContainer />
      <NFTGridContainer />
    </COLLECTION_VIEW_WRAPPER>
  )
}
const NFTStatsContainer = () => {
  const { mode } = useDarkMode()
  const logo =
    'https://beta.api.solanalysis.com/images/filters:' +
    'frames(,0)/https://storage.googleapis.com/feliz-crypto/project_photos/degodslogo.jpg'
  return (
    <div className="nftStatsContainer">
      <div className="backBtn">
        <img src="/img/assets/arrow-leftdark.svg" />
      </div>

      <div className="collectionNameContainer">
        <div className="collectionName">
          <img src={logo} />
          <div className="title">
            De Gods
            <img style={{ height: 25, width: 25, marginLeft: 8 }} src="/img/assets/Aggregator/verifiedNFT.svg" />
          </div>
        </div>

        <div className="generalStats">
          <div className="wrapper">
            <div className="titleText">1.5K SOL</div>
            <div className="subTitleText"> Apprasial Value </div>
          </div>

          <div className="wrapper">
            <div className="titleText"> 180 SOL </div>
            <div className="subTitleText">Floor Price</div>
          </div>
          <div className="wrapper">
            <div className="titleText">112/10K</div>
            <div className="subTitleText"> Listed</div>
          </div>
          <div className="wrapper">
            <div className="titleText"> 1800 SOL </div>
            <div className="subTitleText"> 24h volume </div>
          </div>
        </div>

        <div className="moreOptions">
          <div>
            <img src="/img/assets/refreshButton.png" />
          </div>
          <div className="sweepBtn">
            <img src="/img/assets/Aggregator/sweepButton.svg" alt="" />
          </div>
          <div>
            <ICON $mode={mode === 'dark'}>
              <img src={`/img/assets/more_icon.svg`} alt="more" />
            </ICON>
          </div>
        </div>
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
      <FiltersContainer setOpen={setOpen} displayIndex={displayIndex} setDisplayIndex={setDisplayIndex} />
      <div className="flexContainer">
        <AdditionalFilters open={open} />
        <NFTCollectionsGrid open={open} />
      </div>
    </GRID_CONTAINER>
  )
}

const FiltersContainer = ({ setOpen, displayIndex, setDisplayIndex }: any): ReactElement => {
  const { mode } = useDarkMode()
  const { sortingAsc, setSortAsc } = useNFTAggregator()
  return (
    <NFT_FILTERS_CONTAINER index={displayIndex}>
      <img onClick={() => setOpen((prev) => !prev)} src={`/img/assets/Aggregator/filtersIcon${mode}.svg`} />
      <SearchBar placeholder="Search by nft or owner" />
      <div className="sortingBtn" onClick={() => setSortAsc((prev) => !prev)}>
        Price: {sortingAsc ? 'Ascending' : 'Descending'}
      </div>
    </NFT_FILTERS_CONTAINER>
  )
}

const NFTCollectionsGrid = ({ open }: any): ReactElement => {
  const { nftCollections } = useNFTAggregator()
  return (
    <NFT_COLLECTIONS_GRID>
      <div className="gridContainer">
        {nftCollections &&
          nftCollections.map((item, index) => (
            <div className="gridItem" key={index}>
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

export default CollectionV2
