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

const FIXED_PRICE_TAB = styled.div`
  min-height: 410px;
  ${({ theme }) => css`
    overflow-y: auto;
    padding: ${theme.margins['5.5x']} ${theme.margins['4x']};

    display: grid;
    grid-template-columns: repeat(5, 1fr);
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
export const FixedPriceTabContent: FC = ({ ...rest }) => {
  const { singleCollection } = useNFTCollections()
  const history = useHistory()
  const [localFixedPrice, setLocalFixedPrice] = useState<Array<ISingleNFT>>()
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetchSingleCollectionTabContent(NFT_API_ENDPOINTS.FIXED_PRICE, `${singleCollection.collection_id}`).then((res) => {
      if (res.response && res.response.status !== 200) {
        setErr(true)
      }
      setLocalFixedPrice(res?.data?.nft_data?.slice(0, 25))
    })

    return () => {}
  }, [])

  const goToFixedPriceDetails = (id: number): void => history.push(`/NFTs/fixed-price/${id}`)

  return (
    <WRAPPER>
      {localFixedPrice === undefined ? (
        <EMPTY_MSG>
          <WRAPPED_LOADER>
            <Loader />
          </WRAPPED_LOADER>{' '}
        </EMPTY_MSG>
      ) : err ? (
        <EMPTY_MSG>Error loading fixed price NFTs</EMPTY_MSG>
      ) : localFixedPrice.length > 0 ? (
        <FIXED_PRICE_TAB {...rest}>
          {localFixedPrice.map((item: ISingleNFT) => (
            <div onClick={() => goToFixedPriceDetails(item.non_fungible_id)}>
              <Card key={item.non_fungible_id} singleNFT={item} tab="fixed" />
            </div>
          ))}
        </FIXED_PRICE_TAB>
      ) : (
        <EMPTY_MSG>No NFTs</EMPTY_MSG>
      )}
    </WRAPPER>
  )
}
