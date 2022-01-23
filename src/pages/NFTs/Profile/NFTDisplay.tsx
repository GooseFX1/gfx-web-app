import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { INFTMetadata } from '../../../types/nft_details.d'

import { Card } from './Card'
import NoContent from './NoContent'
import { SearchBar } from '../../../components'
import { StyledTabContent } from './TabContent.styled'

interface INFTDisplay {
  type: 'collected' | 'created' | 'favorited'
  data: any
}

const NFTDisplay = (props: INFTDisplay): JSX.Element => {
  const [collectedItems, setCollectedItems] = useState<INFTMetadata[]>()

  useEffect(() => {
    if (props.data && props.data.length > 0) {
      fetchNFTDetails(props.data).then((nfts) => setCollectedItems(nfts))
    } else {
      setCollectedItems([])
    }
    return () => {
      setCollectedItems(undefined)
    }
  }, [props.data])

  const fetchNFTDetails = async (nftData: any) => {
    var data = Object.keys(nftData).map((key) => nftData[key])
    let nfts = []
    for (let i = 0; i < data.length; i++) {
      try {
        let val = await axios.get(data[i].data.uri)
        nfts.push(val.data)
      } catch (error) {
        console.error(error)
      }
    }
    return nfts
  }

  return (
    <StyledTabContent>
      <div className="actions-group">
        <div className="search-group">
          <SearchBar />
          <div className="total-result">
            {collectedItems && collectedItems.length > 0 ? `${collectedItems.length}` : '0'} Items
          </div>
        </div>
      </div>
      {!collectedItems ? (
        <div>...Loading</div>
      ) : collectedItems && collectedItems.length > 0 ? (
        <div className="cards-list">
          {collectedItems.map((nftMetaData: INFTMetadata, index: number) => (
            <Card key={index} data={nftMetaData} />
          ))}
        </div>
      ) : (
        <NoContent type={props.type} />
      )}
    </StyledTabContent>
  )
}

export default React.memo(NFTDisplay)
