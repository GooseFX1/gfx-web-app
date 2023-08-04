/* eslint-disable */
import React, { useState, useEffect, useRef, FC, useCallback, useMemo, Dispatch, SetStateAction } from 'react'
import axios from 'axios'
import { ParsedAccount } from '../../../web3'
import Card from '../Collection/Card'
import NoContent from './NoContent'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTDetails, useNFTProfile } from '../../../context'
import { ISingleNFT } from '../../../types/nft_details.d'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { CenteredDiv } from '../../../styles'
import { NFT_COLLECTIONS_GRID } from '../Collection/CollectionV2.styles'
import NFTLoading from '../Home/NFTLoading'
import { SellNFTModal } from '../Collection/SellNFTModal'
import { BuyNFTModal } from '../Collection/BuyNFTModal'
import { GFXApprisalPopup } from '../../../components/NFTAggWelcome'
import { fetchSingleNFT, NFT_PROFILE_OPTIONS } from '../../../api/NFTs'
import CancelBidModal from '../Collection/CancelBidModal'
import { BidNFTModal } from '../Collection/AggModals/BidNFTModal'

const Toggle = styled(CenteredDiv)<{ $mode: boolean }>`
  ${tw`h-[25px] w-[50px] rounded-[40px] cursor-pointer`}
  border-radius: 30px;
  background-image: linear-gradient(to right, #f7931a 25%, #ac1cc7 100%);
  position: absolute;
  right: 20px;
  top: 30px;

  > div {
    ${tw`h-[30px] w-[30px]`}
    ${({ theme }) => theme.roundedBorders}
    box-shadow: 0 3.5px 3.5px 0 rgba(0, 0, 0, 0.25);
    background-image: url('/img/assets/solana-logo.png');
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
    transform: translateX(${({ $mode }) => ($mode ? '-12px' : '12px')});
  }
`

const DROPDOWN_WRAPPER = styled.div`
  padding: 12px;
  width: 115px;
  height: 98px;
  border-radius: 5px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  background-color: ${({ theme }) => theme.bg23};

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  input[type='radio'] {
    width: 15px;
    height: 15px;
    appearance: none;
    border-radius: 50%;
    outline: none;
    background: ${({ theme }) => theme.bg24};
    accent-color: yellow;
    cursor: pointer;
  }

  input[type='radio']:checked {
    background-image: linear-gradient(111deg, #f7931a 11%, #ac1cc7 94%);
    border: 3px solid #1c1c1c;
  }
`

interface Props {
  nftFilterArr: string[]
  setNftFilter: (index: number) => void
}

interface INFTDisplay {
  type: 'collected' | 'created' | 'favorited' | 'bids'
  parsedAccounts?: ParsedAccount[]
  singleNFTs?: ISingleNFT[]
  setNumberOfNFTs?: Dispatch<SetStateAction<number>>
}

const NFTDisplay = (props: INFTDisplay): JSX.Element => {
  const { sessionUser, nonSessionProfile } = useNFTProfile()
  const { searchInsideProfile, profileNFTOptions, setProfileNFTOptions } = useNFTAggregatorFilters()
  const { cancelBidClicked } = useNFTAggregator()
  const [nftApiResponses, setNftApiResponses] = useState(null)
  const [collectedItems, setCollectedItems] = useState<ISingleNFT[]>()
  const [filteredCollectedItems, setFilteredCollectedItems] = useState<ISingleNFT[]>([])
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
        const filteredData = collectedItems.filter(({ nft_name }) =>
          nft_name.toLowerCase().includes(searchInsideProfile.trim().toLowerCase())
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
    if (props.singleNFTs) {
      setCollectedItemsPag(props.singleNFTs)
    } else if (!props.parsedAccounts || props.parsedAccounts.length === 0) {
      setCollectedItemsPag([])
    } else {
      fetchNFTData(props.parsedAccounts).then((singleNFTs) => {
        setCollectedItemsPag(singleNFTs)
      })
    }

    return () => setCollectedItemsPag(undefined)
  }, [props.singleNFTs, props.parsedAccounts, refreshClicked])

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

  const fetchNFTData = async (parsedAccounts: ParsedAccount[]) => {
    const nfts: ISingleNFT[] = []
    const metaDataResponse = parsedAccounts.map((account) => axios.get(account.data.uri))
    const responses = await Promise.all(metaDataResponse.map((metaData) => metaData.catch((e) => e)))
    const val = responses.filter((result) => result.status === 200)

    for (let i = 0; i < val.length; i++) {
      try {
        nfts.push({
          uuid: null,
          non_fungible_id: null,
          nft_name: val[i].data.name,
          nft_description: val[i].data.description,
          mint_address: parsedAccounts[i].mint,
          metadata_url: parsedAccounts[i].data.uri,
          image_url: val[i].data.image,
          animation_url: val[i].data.properties?.files > 0 ? val[i].data.properties?.files[0].uri : '',
          collection_id: null,
          collection_name: getCollectionName(val[i]),
          collection_address: null,
          gfx_appraisal_value: null,
          is_verified: false,
          token_account: null,
          owner: nonSessionProfile === undefined ? sessionUser.pubkey : nonSessionProfile.pubkey
        })
      } catch (error) {
        console.error(error)
      }
    }
    return nfts
  }

  useEffect(() => {
    if (filteredCollectedItems?.length) {
      ;(async () => {
        const apiResponses = filteredCollectedItems?.length
          ? filteredCollectedItems.map((item) => fetchSingleNFT(item.mint_address))
          : []
        const nftResponses = await Promise.all(apiResponses.map((api) => api.catch((e) => e)))
        const validResults = nftResponses
          .filter((result) => result.status === 200 && result.data.data.length > 0)
          .map((result) => result.data)
        setNftApiResponses(validResults)
      })()
    }
  }, [filteredCollectedItems])

  useEffect(() => {
    if (nftApiResponses && props.type === 'collected') props.setNumberOfNFTs(nftApiResponses.length)
  }, [nftApiResponses, refreshClicked])

  const gridType = useMemo(() => {
    if (nftApiResponses) {
      if (profileNFTOptions === NFT_PROFILE_OPTIONS.OFFERS) {
        return nftApiResponses.filter((res) => res.bids.length > 0).length > 7 ? '1fr' : '210px'
      }
      if (profileNFTOptions === NFT_PROFILE_OPTIONS.ON_SALE) {
        return nftApiResponses.filter((res) => res.asks.length > 0).length > 7 ? '1fr' : '210px'
      }
    }

    return filteredCollectedItems?.length > 7 ? '1fr' : '210px'
  }, [filteredCollectedItems, profileNFTOptions])

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
          {nftApiResponses?.length &&
            filteredCollectedItems.map((nft: ISingleNFT, index: number) => (
              <Card
                singleNFT={nft}
                key={index}
                nftDetails={nftApiResponses[index]}
                setGfxAppraisal={setGfxAppraisal}
              />
            ))}
        </div>
      )}
    </NFT_COLLECTIONS_GRID>
  )
}

export default React.memo(NFTDisplay)
