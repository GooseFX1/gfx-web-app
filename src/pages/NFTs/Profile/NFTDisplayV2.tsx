import React, { useState, useEffect, useRef, useCallback, useMemo, Dispatch, SetStateAction } from 'react'
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ParsedAccount } from '../../../web3'
import NoContent from './NoContent'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTDetails, useNFTProfile } from '../../../context'
import { INFTGeneralData, ISingleNFT } from '../../../types/nft_details.d'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { NFT_COLLECTIONS_GRID } from '../Collection/CollectionV2.styles'
import NFTLoading from '../Home/NFTLoading'
import { SellNFTModal } from '../Collection/SellNFTModal'
import { BuyNFTModal } from '../Collection/BuyNFTModal'
import { GFXApprisalPopup } from '../../../components/NFTAggWelcome'
import { fetchUserNftsFromDb, NFT_PROFILE_OPTIONS } from '../../../api/NFTs'
import CancelBidModal from '../Collection/CancelBidModal'
import { BidNFTModal } from '../Collection/AggModals/BidNFTModal'
import CardV2 from '../Collection/CardV2'

const DROPDOWN_WRAPPER = styled.div``

interface INFTDisplayV2 {
  type: 'collected' | 'created' | 'favorited' | 'bids'
  parsedAccounts?: ParsedAccount[]
  singleNFTs?: ISingleNFT[]
  setNumberOfNFTs?: Dispatch<SetStateAction<number>>
}

const NFTDisplayV2 = (props: INFTDisplayV2): JSX.Element => {
  const { sessionUser, nonSessionProfile } = useNFTProfile()
  const { searchInsideProfile, profileNFTOptions, setProfileNFTOptions } = useNFTAggregatorFilters()
  const { cancelBidClicked } = useNFTAggregator()
  const [collectedItems, setCollectedItems] = useState<INFTGeneralData[]>()
  const [filteredCollectedItems, setFilteredCollectedItems] = useState<INFTGeneralData[]>([])
  const [loading, _setLoading] = useState<boolean>(false)
  const [gfxAppraisalPopup, setGfxAppraisal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { general, nftMetadata } = useNFTDetails()
  const {
    buyNowClicked,
    bidNowClicked,
    setDelistNFT,
    refreshClicked,
    sellNFTClicked,
    delistNFT,
    showAcceptBid,
    setShowAcceptBidModal,
    setSellNFT
  } = useNFTAggregator()

  const activePointRef = useRef(collectedItems)
  const activePointLoader = useRef(loading)

  useEffect(() => {
    if (collectedItems) {
      if (searchInsideProfile && searchInsideProfile.length > 0) {
        const filteredData = collectedItems.filter(({ data }) =>
          data[0].nft_name.toLowerCase().includes(searchInsideProfile.trim().toLowerCase())
        )
        setFilteredCollectedItems(filteredData)
        if (filteredCollectedItems.length !== 0) setIsLoading(false)
      } else {
        setFilteredCollectedItems(collectedItems)
        if (filteredCollectedItems.length !== 0) setIsLoading(false)
      }
    }
  }, [searchInsideProfile, collectedItems])
  // in place of original `setActivePoint`
  const setCollectedItemsPag = (x) => {
    activePointRef.current = x // keep updated
    setCollectedItems(x)
  }

  useEffect(() => {
    setProfileNFTOptions(NFT_PROFILE_OPTIONS.ALL)
    if (filteredCollectedItems.length === 0)
      setTimeout(() => {
        setIsLoading(false)
      }, 7000)
  }, [])

  useEffect(() => {
    const fetchNfts = async () => {
      const mintAddresses = props.parsedAccounts.map((account) => account.mint)
      const userNfts = await fetchUserNftsFromDb(mintAddresses)
      setCollectedItemsPag(userNfts?.data)
    }
    if (props.parsedAccounts.length) fetchNfts()

    return () => setCollectedItemsPag(undefined)
  }, [props.parsedAccounts, refreshClicked])

  const getCollectionName = useCallback((value) => {
    if (value?.data?.collection?.name) {
      return value.data.collection.name
    }
    if (value?.data?.name) {
      if (value?.data?.name.includes('#')) {
        return value.data.name.split('#')[0]
      }
      return value.data.name
    }
    return null
  }, [])

  // useEffect(() => {
  //   if (nftApiResponses && props.type === 'collected') props.setNumberOfNFTs(nftApiResponses.length)
  // }, [nftApiResponses, refreshClicked])

  const gridType = useMemo(
    () =>
      // if (nftApiResponses) {
      //   if (profileNFTOptions === NFT_PROFILE_OPTIONS.OFFERS) {
      //     return nftApiResponses.filter((res) => res.bids.length > 0).length > 7 ? '1fr' : '210px'
      //   }
      //   if (profileNFTOptions === NFT_PROFILE_OPTIONS.ON_SALE) {
      //     return nftApiResponses.filter((res) => res.asks.length > 0).length > 7 ? '1fr' : '210px'
      //   }
      // }

      filteredCollectedItems?.length > 7 ? '1fr' : '210px',
    [filteredCollectedItems, profileNFTOptions]
  )

  const handleModalClick = useCallback(() => {
    if (showAcceptBid)
      return (
        <SellNFTModal visible={showAcceptBid} handleClose={() => setShowAcceptBidModal(false)} acceptBid={true} />
      )

    if (delistNFT)
      return <SellNFTModal visible={delistNFT} handleClose={() => setDelistNFT(false)} delistNFT={delistNFT} />

    if (sellNFTClicked) {
      return <SellNFTModal visible={sellNFTClicked} handleClose={() => setSellNFT(false)} delistNFT={delistNFT} />
    }
    if (buyNowClicked) return <BuyNFTModal />
    if (bidNowClicked) return <BidNFTModal />
    if (cancelBidClicked) return <CancelBidModal />
    if (gfxAppraisalPopup) return <GFXApprisalPopup setShowTerms={setGfxAppraisal} showTerms={gfxAppraisalPopup} />
  }, [
    buyNowClicked,
    bidNowClicked,
    general,
    nftMetadata,
    gfxAppraisalPopup,
    cancelBidClicked,
    sellNFTClicked,
    delistNFT,
    showAcceptBid
  ])

  return (
    <NFT_COLLECTIONS_GRID gridType={gridType}>
      {handleModalClick()}
      {filteredCollectedItems?.length === 0 && isLoading ? (
        <NFTLoading />
      ) : filteredCollectedItems?.length === 0 && !isLoading ? (
        <NoContent type={props.type} />
      ) : (
        <div className="gridContainerProfile" tw="h-[75vh]">
          {filteredCollectedItems.map((nft: INFTGeneralData, index: number) => (
            <CardV2 singleNFT={nft.data[0]} key={index} nftDetails={nft} setGfxAppraisal={setGfxAppraisal} />
          ))}
        </div>
      )}
    </NFT_COLLECTIONS_GRID>
  )
}

export default React.memo(NFTDisplayV2)
