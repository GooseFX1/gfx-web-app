import { useState, useEffect, FC } from 'react'
import { useHistory } from 'react-router'
import styled, { css } from 'styled-components'
import { Card } from './Card'
import { useNFTCollections, useNFTProfile } from '../../../context'
import { ISingleNFT } from '../../../types/nft_details.d'
import { NFT_API_ENDPOINTS, fetchSingleCollectionBySalesType } from '../../../api/NFTs'
import { Loader } from '../../../components'

const WRAPPER = styled.div`
  height: 100%;
`

const FIXED_PRICE_TAB = styled.div`
  ${({ theme }) => css`
    overflow-y: auto;
    padding: ${theme.margin(5.5)} ${theme.margin(4)};

    display: grid;
    grid-template-columns: repeat(5, 1fr);
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
  height: 100%;
`
const WRAPPED_LOADER = styled.div`
  position: relative;
  height: 48px;
`
export const FixedPriceTabContent: FC = ({ ...rest }) => {
  const { fixedPriceWithinCollection } = useNFTCollections()
  const history = useHistory()
  const { sessionUser } = useNFTProfile()

  const goToFixedPriceDetails = (id: number): void => history.push(`/NFTs/fixed-price/${id}`)

  return (
    <WRAPPER>
      {fixedPriceWithinCollection === undefined ? (
        <FIXED_PRICE_TAB {...rest} className="card-list">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item, index) => (
            <div>
              <Card key={index} singleNFT={null} listingType="fixed" />
            </div>
          ))}
        </FIXED_PRICE_TAB>
      ) : fixedPriceWithinCollection.nft_data.length > 0 ? (
        <FIXED_PRICE_TAB {...rest} className="card-list">
          {fixedPriceWithinCollection.nft_data.map((item: ISingleNFT) => (
            <div onClick={() => goToFixedPriceDetails(item.non_fungible_id)}>
              <Card key={item.non_fungible_id} singleNFT={item} listingType="fixed" />
            </div>
          ))}
        </FIXED_PRICE_TAB>
      ) : (
        <NO_CONTENT>
          <div>
            <img className="no-data-image" src={`/img/assets/collected-no-data.png`} alt="" />
            <p>No Fixed Price NFTs Listed</p>
          </div>
        </NO_CONTENT>
      )}
    </WRAPPER>
  )
}
