import React, { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { notify } from '../../../utils'
import { ParsedAccount } from '../../../web3'
import { Card } from '../Collection/Card'
import NoContent from './NoContent'
import { SearchBar, Loader } from '../../../components'
import { useNFTProfile } from '../../../context'
import { StyledTabContent } from './TabContent.styled'
import { ISingleNFT } from '../../../types/nft_details.d'
import { ILocationState } from '../../../types/app_params.d'

interface INFTDisplay {
  type: 'collected' | 'created' | 'favorited'
  parsedAccounts?: ParsedAccount[]
  singleNFT?: ISingleNFT[]
}

const NFTDisplay = (props: INFTDisplay): JSX.Element => {
  const location = useLocation<ILocationState>()
  const { sessionUser } = useNFTProfile()
  const [collectedItems, setCollectedItems] = useState<ISingleNFT[]>()
  const [filteredCollectedItems, setFilteredCollectedItems] = useState<ISingleNFT[]>()
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
    if (props.singleNFT) {
      setCollectedItems(props.singleNFT)
    } else if (!props.parsedAccounts || props.parsedAccounts.length === 0) {
      setCollectedItems([])
    } else {
      fetchNFTData(props.parsedAccounts).then((singleNFTs) => setCollectedItems(singleNFTs))
    }

    return () => setCollectedItems(undefined)
  }, [props.singleNFT, props.parsedAccounts])

  useEffect(() => {
    if (collectedItems) {
      const filteredData = collectedItems.filter(({ nft_name }) =>
        nft_name.toLowerCase().includes(search.trim().toLowerCase())
      )
      setFilteredCollectedItems(filteredData)
    }

    return () => setFilteredCollectedItems(undefined)
  }, [search, collectedItems])

  const fetchNFTData = async (parsedAccounts: ParsedAccount[]) => {
    let nfts = []
    for (let i = 0; i < parsedAccounts.length; i++) {
      try {
        const val = await axios.get(parsedAccounts[i].data.uri)
        nfts.push({
          non_fungible_id: null,
          nft_name: val.data.name,
          nft_description: val.data.description,
          mint_address: parsedAccounts[i].mint,
          metadata_url: parsedAccounts[i].data.uri,
          image_url: val.data.image,
          animation_url: '',
          collection_id: null,
          token_account: null,
          owner: sessionUser.pubkey
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
        <SearchBar className={'profile-search-bar'} filter={search} setFilter={setSearch} />
      </div>
      {filteredCollectedItems === undefined ? (
        <div className="profile-content-loading">
          <div>
            <Loader />
          </div>
        </div>
      ) : filteredCollectedItems && filteredCollectedItems.length > 0 ? (
        <div className="cards-list">
          {filteredCollectedItems.map((nft: ISingleNFT) => {
            return <Card key={nft.mint_address} singleNFT={nft} />
          })}
        </div>
      ) : (
        <NoContent type={props.type} />
      )}
    </StyledTabContent>
  )
}

export default React.memo(NFTDisplay)
