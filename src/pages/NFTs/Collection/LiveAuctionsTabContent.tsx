import { useState, useEffect, FC } from 'react'
// import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { Card } from './Card'
import { useNFTCollections } from '../../../context'
import { ISingleNFT } from '../../../types/nft_details.d'
import { NFT_API_ENDPOINTS, fetchSingleCollectionBySalesType } from '../../../api/NFTs'
import { Loader } from '../../../components'

const WRAPPER = styled.div``

const LIVE_AUCTIONS_TAB = styled.div`
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
// grid-template-columns: repeat(5, 1fr);

const EMPTY_MSG = styled.div`
  ${({ theme }) => theme.flexCenter}
  width: 100%;
`
const WRAPPED_LOADER = styled.div`
  position: relative;
  height: 48px;
`

export const LiveAuctionsTabContent: FC = ({ ...rest }) => {
  const { singleCollection } = useNFTCollections()
  //const history = useHistory()
  //const { sessionUser } = useNFTProfile()

  const [localLiveAuction, setLocalLiveAuction] = useState<Array<ISingleNFT>>()
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetchSingleCollectionBySalesType(NFT_API_ENDPOINTS.LIVE_AUCTIONS, `${singleCollection?.collection_id}`).then(
      (res) => {
        if (res.response && res.response.status !== 200) {
          setErr(true)
        }
        setLocalLiveAuction(res?.data || null)
      }
    )

    return null
  }, [])

  //const goToLiveAuctionDetails = (id: number): void => history.push(`/NFTs/live-auction/${id}`)

  return (
    <WRAPPER>
      {localLiveAuction === undefined ? (
        <EMPTY_MSG>
          <WRAPPED_LOADER>
            <Loader />
          </WRAPPED_LOADER>
        </EMPTY_MSG>
      ) : err ? (
        <EMPTY_MSG>Error loading live auction NFTs</EMPTY_MSG>
      ) : localLiveAuction.length > 0 ? (
        <LIVE_AUCTIONS_TAB {...rest} className="card-list">
          {localLiveAuction.map((item: ISingleNFT) => (
            <Card key={item.non_fungible_id} singleNFT={item} listingType={'auction'} />
          ))}
        </LIVE_AUCTIONS_TAB>
      ) : (
        <EMPTY_MSG>No NFTs</EMPTY_MSG>
      )}
    </WRAPPER>
  )
}
