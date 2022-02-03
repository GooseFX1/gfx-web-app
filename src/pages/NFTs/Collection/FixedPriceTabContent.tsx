import { useState, useEffect, FC } from 'react'
import { useHistory } from 'react-router'
import styled, { css } from 'styled-components'
import { Card } from './Card'
import { useNFTCollections } from '../../../context'
import { ISingleNFT } from '../../../types/nft_details.d'
import { NFT_API_ENDPOINTS, fetchSingleCollectionBySalesType } from '../../../api/NFTs'
import { Loader } from '../../../components'

const WRAPPER = styled.div`
  min-height: 410px;
`

const FIXED_PRICE_TAB = styled.div`
  min-height: 410px;
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
  const { fixedPriceWithinCollection } = useNFTCollections()
  const history = useHistory()

  const goToFixedPriceDetails = (id: number): void => history.push(`/NFTs/fixed-price/${id}`)

  return (
    <WRAPPER>
      {fixedPriceWithinCollection === undefined ? (
        <EMPTY_MSG>
          <WRAPPED_LOADER>
            <Loader />
          </WRAPPED_LOADER>{' '}
        </EMPTY_MSG>
      ) : fixedPriceWithinCollection.nft_data.length > 0 ? (
        <FIXED_PRICE_TAB {...rest}>
          {fixedPriceWithinCollection.nft_data.map((item: ISingleNFT) => (
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
