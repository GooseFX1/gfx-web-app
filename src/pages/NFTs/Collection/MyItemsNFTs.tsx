import { useWallet } from '@solana/wallet-adapter-react'
import React, { Dispatch, FC, memo, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTCollections, useNFTDetails } from '../../../context'
/* eslint-disable @typescript-eslint/no-unused-vars */
import NFTLoading from '../Home/NFTLoading'
import { NFT_COLLECTIONS_GRID } from './CollectionV2.styles'
import DetailViewNFT from './DetailViewNFTDrawer'
import { SellNFTModal } from './SellNFTModal'
import { SingleNFTCard } from './SingleNFTCard'
import tw from 'twin.macro'
import 'styled-components/macro'
import NoContent from '../Profile/NoContent'

const MyItemsNFTs: FC<{ setDisplayIndex: Dispatch<SetStateAction<number>> }> = ({ setDisplayIndex }) => {
  const { myNFTsByCollection } = useNFTCollections()
  const [displayNFTs, setDisplayNFTs] = useState<any[]>(null)
  const { openJustModal, sellNFTClicked, setSellNFT, setDelistNFT, delistNFT } = useNFTAggregator()
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
  }, [searchInsideCollection, myNFTsByCollection])

  const detailDrawer = useMemo(() => {
    if (general !== null && nftMetadata !== null && params.address) return <DetailViewNFT />
  }, [nftMetadata, general, params.address])

  const modal = useMemo(() => {
    if (delistNFT)
      return <SellNFTModal visible={delistNFT} handleClose={() => setDelistNFT(false)} delistNFT={delistNFT} />

    if (sellNFTClicked) return <SellNFTModal visible={sellNFTClicked} handleClose={() => setSellNFT(false)} />
  }, [sellNFTClicked, delistNFT])

  const gridType = useMemo(() => (displayNFTs?.length > 7 ? '1fr' : '210px'), [displayNFTs])
  return (
    <NFT_COLLECTIONS_GRID gridType={gridType}>
      {detailDrawer}
      {modal}
      {displayNFTs === null && <NFTLoading />}
      {displayNFTs?.length === 0 && !searchInsideCollection && (
        <NoContent setDisplayIndex={setDisplayIndex} type="collected" cssStyle={tw`bg-grey-5`} />
      )}
      {!publicKey && <NoContent setDisplayIndex={setDisplayIndex} type="collected" />}

      {displayNFTs && displayNFTs.length > 0 && (
        <div className="gridContainer">
          {displayNFTs.map((myNFT, index) => (
            <SingleNFTCard key={index} item={myNFT.data[0]} myItems={true} index={index} />
          ))}
        </div>
      )}
    </NFT_COLLECTIONS_GRID>
  )
}

export default memo(MyItemsNFTs)
