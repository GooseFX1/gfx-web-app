import { useWallet } from '@solana/wallet-adapter-react'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTCollections, useNFTDetails } from '../../../context'
import { Connect } from '../../../layouts'
/* eslint-disable @typescript-eslint/no-unused-vars */
import NFTLoading from '../Home/NFTLoading'
import { NFT_COLLECTIONS_GRID } from './CollectionV2.styles'
import DetailViewNFT from './DetailViewNFTDrawer'
import { SellNFTModal } from './SellNFTModal'
import { SingleNFTCard } from './SingleNFTCard'
import tw from 'twin.macro'
import 'styled-components/macro'

const MyItemsNFTs = () => {
  const { myNFTsByCollection } = useNFTCollections()
  const [displayNFTs, setDisplayNFTs] = useState<any[]>(null)
  const { openJustModal, sellNFTClicked, setSellNFT } = useNFTAggregator()
  const { searchInsideCollection } = useNFTAggregatorFilters()
  const { general, nftMetadata } = useNFTDetails()
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey])

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

  return publicKey ? (
    <NFT_COLLECTIONS_GRID gridType={gridType}>
      {detailDrawer}
      {modal}
      {displayNFTs === null && <NFTLoading />}

      <div className="gridContainer">
        {displayNFTs && displayNFTs.map((myNFT, index) => <SingleNFTCard item={myNFT.data[0]} index={index} />)}
      </div>
    </NFT_COLLECTIONS_GRID>
  ) : (
    <div tw="flex items-center w-[100vw] justify-center h-[100%]">
      <Connect />
    </div>
  )
}

export default memo(MyItemsNFTs)
