import { useState, useEffect, FC } from 'react'
import { useHistory } from 'react-router'
import styled, { css } from 'styled-components'
import { Card } from './Card'
import { useNFTCollections } from '../../../context'
import { ISingleNFT } from '../../../types/nft_details.d'
import { NFT_API_ENDPOINTS, fetchSingleCollectionTabContent } from '../../../api/NFTs'
import { Loader } from '../../../components'

const WRAPPER = styled.div`
  min-height: 410px;
`

const OPEN_BIDS_TAB = styled.div`
  ${({ theme }) => css`
    overflow-y: auto;
    padding: ${theme.margins['5.5x']} ${theme.margins['4x']};

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    grid-gap: ${theme.margins['6x']};

    &::-webkit-scrollbar {
      display: none;
    }
  `}
`
const EMPTY_MSG = styled.div`
  ${({ theme }) => theme.flexCenter}
  width: 100%;
  height: 410px;
`
const WRAPPED_LOADER = styled.div`
  position: relative;
  height: 48px;
`

export const OpenBidsTabContent = ({ filter, ...rest }) => {
  const { singleCollection } = useNFTCollections()
  const history = useHistory()
  const [localOpenBid, setLocalOpenBid] = useState<Array<ISingleNFT>>([])
  const [fileredLocalOpenBid, setFilteredLocalOpenBid] = useState<Array<ISingleNFT>>()
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetchSingleCollectionTabContent(NFT_API_ENDPOINTS.OPEN_BID, `${singleCollection.collection_id}`).then((res) => {
      if (res.response && res.response.status !== 200) {
        setErr(true)
      }

      setLocalOpenBid(res.data)
    })

    return () => {}
  }, [])

  useEffect(() => {
    let filteredData = localOpenBid.filter(
      (i) => i.nft_name.toLowerCase().includes(filter.toLowerCase()) || `${i.non_fungible_id}`.includes(filter)
    )

    setFilteredLocalOpenBid(filteredData.slice(0, 25))
  }, [filter, localOpenBid])

  const goToOpenBidDetails = (id: number): void => history.push(`/NFTs/open-bid/${id}`)

  // TODO: lazy loader for the thousands of nfts
  return (
    <WRAPPER>
      {localOpenBid === undefined ? (
        <EMPTY_MSG>
          <WRAPPED_LOADER>
            <Loader />
          </WRAPPED_LOADER>
        </EMPTY_MSG>
      ) : err ? (
        <EMPTY_MSG>Error loading open bid NFTs</EMPTY_MSG>
      ) : localOpenBid.length > 0 ? (
        <OPEN_BIDS_TAB {...rest}>
          {fileredLocalOpenBid.map((item: ISingleNFT) => (
            <div onClick={() => goToOpenBidDetails(item.non_fungible_id)}>
              <Card key={item.non_fungible_id} singleNFT={item} tab="bid" />
            </div>
          ))}
        </OPEN_BIDS_TAB>
      ) : (
        <EMPTY_MSG>No NFTs</EMPTY_MSG>
      )}
    </WRAPPER>
  )
}
