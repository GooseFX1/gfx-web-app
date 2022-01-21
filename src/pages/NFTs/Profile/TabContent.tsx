import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import axios from 'axios'
import { INFTMetadata } from '../../../types/nft_details.d'
import { Card } from './Card'
import { NoContent } from './NoContent'
import { SearchBar } from '../../../components'
import { TableList } from './TableList'
import { StyledTabContent } from './TabContent.styled'
import { getParsedNftAccountsByOwner } from '../../../web3'
import { useConnectionConfig } from '../../../context'

interface Props {
  type: string
}

export const TabContent = ({ type }: Props) => {
  const { connected, publicKey } = useWallet()
  const { connection } = useConnectionConfig()
  const [data, setData] = useState<INFTMetadata[]>()

  useEffect(() => {
    if (type === 'collected' && publicKey) {
      fetchUserNftData().then((topLevelUserNFTData: any) => {
        console.log(topLevelUserNFTData)
        fetchNFTDetails(topLevelUserNFTData).then((nfts) => setData(nfts))
      })
    }

    return () => {}
  }, [])

  useEffect(() => {
    if (type === 'collected' && publicKey) {
      fetchUserNftData().then((topLevelUserNFTData: any) => {
        console.log(topLevelUserNFTData)
        fetchNFTDetails(topLevelUserNFTData).then((nfts) => setData(nfts))
      })
    } else {
      setData([])
    }

    return () => {}
  }, [connected])

  const fetchUserNftData = async () => {
    try {
      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: `${publicKey}`,
        connection: connection
      })
      return nfts
    } catch (error) {
      console.log(error)
    }
  }

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
      {type !== 'activity' && (
        <div className="actions-group">
          <div className="search-group">
            <SearchBar />
            <div className="total-result">{data && data.length > 0 ? `${data.length} Items` : '0 Item'}</div>
          </div>
        </div>
      )}
      {data && data.length > 0 ? (
        type !== 'activity' ? (
          <div className="cards-list">
            {data.map((nftMetaData: INFTMetadata, index: number) => (
              <Card key={index} data={nftMetaData} />
            ))}
          </div>
        ) : (
          <TableList />
        )
      ) : (
        <NoContent type={type} />
      )}
    </StyledTabContent>
  )
}
