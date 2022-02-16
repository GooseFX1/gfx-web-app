import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { ParsedNFTDetails, INFTMetadata } from '../../../types/nft_details.d'
import { notify } from '../../../utils'

import { Card } from './Card'
import NoContent from './NoContent'
import { SearchBar, Loader } from '../../../components'
import { StyledTabContent } from './TabContent.styled'
import { useLocation } from 'react-router-dom'
import { ILocationState } from '../../../types/app_params.d'

interface INFTDisplay {
  type: 'collected' | 'created' | 'favorited'
  data: ParsedNFTDetails[]
}

type AllNFTdata = { topLevelData: ParsedNFTDetails; metaData: INFTMetadata }

const NFTDisplay = (props: INFTDisplay): JSX.Element => {
  const location = useLocation<ILocationState>()
  const [collectedItems, setCollectedItems] = useState<AllNFTdata[]>()
  const [filteredCollectedItems, setFilteredCollectedItems] = useState<AllNFTdata[]>()
  const [search, setSearch] = useState('')

  const newlyMintedNFT = useMemo(() => {
    if (location.state && location.state.newlyMintedNFT) {
      if (props.type === 'collected')
        notify({
          type: 'success',
          message: 'NFT Successfully created',
          description: `${location.state.newlyMintedNFT.name}`,
          icon: 'success'
        })

      return location.state.newlyMintedNFT
    } else {
      return undefined
    }
  }, [location])

  useEffect(() => {
    if (props.data && props.data.length > 0) {
      fetchNFTMetadata(props.data).then((nfts) => setCollectedItems(nfts))
    } else {
      setCollectedItems([])
    }
    return () => {
      setCollectedItems(undefined)
    }
  }, [props.data])

  useEffect(() => {
    if (collectedItems) {
      let filteredData = collectedItems.filter(
        ({ metaData }) =>
          metaData.name.toLowerCase().includes(search.trim().toLowerCase()) ||
          metaData.symbol.toLowerCase().includes(search.trim().toLowerCase())
      )
      setFilteredCollectedItems(filteredData)
    }

    return () => {
      setFilteredCollectedItems(undefined)
    }
  }, [search, collectedItems])

  const fetchNFTMetadata = async (nftDetails: ParsedNFTDetails[]): Promise<AllNFTdata[]> => {
    var data = Object.keys(nftDetails).map((key) => nftDetails[key])
    let nfts = []
    for (let i = 0; i < data.length; i++) {
      try {
        let val = await axios.get(data[i].data.uri)
        nfts.push({
          topLevelData: data[i],
          metaData: val.data
        })
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
          <SearchBar className={'profile-search-bar'} filter={search} setFilter={setSearch} />
        </div>
      </div>
      {!filteredCollectedItems ? (
        <div className="profile-content-loading">
          <div>
            <Loader />
          </div>
        </div>
      ) : filteredCollectedItems && filteredCollectedItems.length > 0 ? (
        <div className="cards-list">
          {filteredCollectedItems.map((allData: any, index: number) => {
            return (
              <Card
                key={allData.topLevelData.mint}
                topLevelData={allData.topLevelData}
                metaData={allData.metaData}
                border={allData.metaData.name === newlyMintedNFT?.name}
              />
            )
          })}
        </div>
      ) : (
        <NoContent type={props.type} />
      )}
    </StyledTabContent>
  )
}

export default React.memo(NFTDisplay)
