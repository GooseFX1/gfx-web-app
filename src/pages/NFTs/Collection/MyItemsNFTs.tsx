import React, { memo, useEffect, useMemo, useState } from 'react'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTCollections, useNFTDetails } from '../../../context'
import { NFT_COLLECTIONS_GRID } from './CollectionV2.styles'
import DetailViewNFT from './DetailViewNFTDrawer'
import { SellNFTModal } from './SellNFTModal'
import { SingleNFTCard } from './SingleNFTCard'

const MyItemsNFTs = () => {
  const { myNFTsByCollection } = useNFTCollections()
  const [displayNFTs, setDisplayNFTs] = useState<any[]>(null)
  const { openJustModal, sellNFTClicked, setSellNFT } = useNFTAggregator()
  const { searchInsideCollection } = useNFTAggregatorFilters()
  const { general, nftMetadata } = useNFTDetails()
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())

  useEffect(() => {
    if (searchInsideCollection && searchInsideCollection.length > 0) {
      const filteredResult = myNFTsByCollection.filter((myNFT) =>
        myNFT.data[0].nft_name.includes(searchInsideCollection)
      )
      setDisplayNFTs(filteredResult)
    } else setDisplayNFTs(myNFTsByCollection)
  }, [searchInsideCollection])

  const detailDrawer = useMemo(() => {
    if (general !== null && nftMetadata !== null && params.address && !openJustModal) return <DetailViewNFT />
  }, [nftMetadata, general, params.address])

  const modal = useMemo(() => {
    if (sellNFTClicked) return <SellNFTModal visible={sellNFTClicked} handleClose={() => setSellNFT(false)} />
  }, [sellNFTClicked])

  const gridType = useMemo(() => (displayNFTs?.length > 7 ? '1fr' : '210px'), [displayNFTs])

  return (
    <NFT_COLLECTIONS_GRID gridType={gridType}>
      {detailDrawer}
      {modal}
      <div className="gridContainer">
        {displayNFTs && displayNFTs.map((myNFT, index) => <SingleNFTCard item={myNFT.data[0]} index={index} />)}
      </div>
    </NFT_COLLECTIONS_GRID>
  )
}

export default memo(MyItemsNFTs)
