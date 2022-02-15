import React, { useState, useEffect, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { ParsedNFTDetails } from '../../../types/nft_details.d'
import { useNFTProfile } from '../../../context'
import { getParsedNftAccountsByOwner } from '../../../web3'
import { useConnectionConfig } from '../../../context'

import { NFTTab } from '../NFTTab'
import NFTDisplay from './NFTDisplay'
import Activity from './Activity'

type Props = {
  isExplore?: boolean
}

export const ContentProfile = ({ isExplore }: Props) => {
  const { connected, publicKey } = useWallet()
  const { sessionUser, userActivity, setUserActivity, fetchUserActivity } = useNFTProfile()
  const { connection } = useConnectionConfig()

  const [collectedItems, setCollectedItems] = useState<ParsedNFTDetails[]>()
  const [createdItems, setCreatedItems] = useState<ParsedNFTDetails[]>()

  const tabPanes = useMemo(
    () => [
      {
        order: '1',
        name: `My Collection (${collectedItems ? collectedItems.length : 0})`,
        component: <NFTDisplay data={collectedItems} type={'collected'} />
      },
      {
        order: '2',
        name: `Created (${createdItems ? createdItems.length : 0})`,
        component: <NFTDisplay data={createdItems} type={'created'} />
      },
      {
        order: '3',
        name: 'Favorited',
        component: <NFTDisplay data={[]} type={'favorited'} />
      },
      {
        order: '4',
        name: 'Activity',
        component: <Activity data={userActivity ? userActivity : []} />
      }
    ],
    [collectedItems, createdItems, userActivity]
  )

  useEffect(() => {
    console.log('TabData')
    return () => {}
  }, [tabPanes])

  useEffect(() => {
    if (connected && publicKey) {
      fetchUserCollectedNFTs().then((topLevelUserNFTData: any) => {
        console.log(topLevelUserNFTData)

        setCollectedItems(topLevelUserNFTData)
        const userCreated = topLevelUserNFTData.filter((nft) =>
          nft.data.creators.find((c) => c.address === publicKey.toBase58())
        )
        setCreatedItems(userCreated)
      })
    } else {
      setCollectedItems([])
      setCreatedItems([])
    }

    return () => {}
  }, [publicKey, connected])

  useEffect(() => {
    if (sessionUser.user_id) {
      fetchUserActivity(sessionUser.user_id)
    } else {
      setUserActivity([])
    }

    return () => {}
  }, [sessionUser.user_id, fetchUserActivity, setUserActivity])

  const fetchUserCollectedNFTs = async () => {
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

  return <NFTTab tabPanes={tabPanes} />
}
