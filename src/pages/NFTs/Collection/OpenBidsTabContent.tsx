import { useState, useEffect, FC } from 'react'
import styled, { css } from 'styled-components'
import { Card } from './Card'
import { useNFTCollections, useNFTProfile } from '../../../context'
import { ISingleNFT } from '../../../types/nft_details.d'
import { Loader } from '../../../components'

const WRAPPER = styled.div``

const OPEN_BIDS_TAB = styled.div`
  ${({ theme }) => css`
    overflow-y: auto;
    padding: ${theme.margin(5.5)} ${theme.margin(4)};

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    grid-gap: ${theme.margin(6)};

    &::-webkit-scrollbar {
      display: none;
    }
  `}
`
const NO_CONTENT = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  color: ${({ theme }) => theme.text8};

  .no-data-image {
    max-width: 160px;
    margin-bottom: 20px;
  }
`
const EMPTY_MSG = styled.div`
  ${({ theme }) => theme.flexCenter}
  width: 100%;
`
const WRAPPED_LOADER = styled.div`
  position: relative;
  height: 48px;
`

export const OpenBidsTabContent = ({ filter, ...rest }) => {
  const { openBidWithinCollection } = useNFTCollections()
  const { sessionUser } = useNFTProfile()

  const [localOpenBid, setLocalOpenBid] = useState<Array<ISingleNFT>>()
  const [fileredLocalOpenBid, setFilteredLocalOpenBid] = useState<Array<ISingleNFT>>()

  useEffect(() => {
    if (openBidWithinCollection) {
      setLocalOpenBid(openBidWithinCollection.open_bid)
    }
    return () => {}
  }, [openBidWithinCollection])

  useEffect(() => {
    if (localOpenBid) {
      const filteredData = localOpenBid.filter(
        (i) =>
          i.nft_name.toLowerCase().includes(filter.trim().toLowerCase()) ||
          `${i.non_fungible_id}`.includes(filter.trim())
      )

      setFilteredLocalOpenBid(filteredData.slice(0, 25))
    }
  }, [filter, localOpenBid])

  // TODO: lazy loader for the thousands of nfts
  return (
    <WRAPPER>
      {fileredLocalOpenBid === undefined ? (
        <EMPTY_MSG>
          <WRAPPED_LOADER>
            <Loader />
          </WRAPPED_LOADER>
        </EMPTY_MSG>
      ) : fileredLocalOpenBid.length > 0 ? (
        <OPEN_BIDS_TAB {...rest} className="card-list">
          {fileredLocalOpenBid.map((item: ISingleNFT) => (
            <Card key={item.mint_address} singleNFT={item} listingType="bid" />
          ))}
        </OPEN_BIDS_TAB>
      ) : (
        <NO_CONTENT>
          <div>
            <img className="no-data-image" src={`/img/assets/collected-no-data.png`} alt="" />
            <p>No Open Bid NFTs Listed</p>
          </div>
        </NO_CONTENT>
      )}
    </WRAPPER>
  )
}
