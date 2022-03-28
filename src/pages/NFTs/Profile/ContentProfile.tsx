import React, { useState, useEffect, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNFTProfile, useConnectionConfig } from '../../../context'
import { ISingleNFT } from '../../../types/nft_details.d'
import { ParsedAccount } from '../../../web3'
import { fetchNFTById } from '../../../api/NFTs/actions'
import { NFTTab } from '../NFTTab'
import NFTDisplay from './NFTDisplay'
import Activity from './Activity'

type Props = {
  isExplore?: boolean
}

export const ContentProfile = ({ isExplore }: Props) => {
  const { publicKey } = useWallet()
  const { sessionUser, parsedAccounts, userActivity, setUserActivity, fetchUserActivity } = useNFTProfile()
  const [createdItems, setCreatedItems] = useState<ParsedAccount[]>()
  const [favoritedItems, setFavoritedItems] = useState<ISingleNFT[]>()
  const { connection } = useConnectionConfig()

  const tabPanes = useMemo(
    () => [
      {
        order: '1',
        name: `My Collection (${parsedAccounts ? parsedAccounts.length : 0})`,
        component: <NFTDisplay parsedAccounts={parsedAccounts} type={'collected'} />
      },
      {
        order: '2',
        name: `Created (${createdItems ? createdItems.length : 0})`,
        component: <NFTDisplay parsedAccounts={createdItems} type={'created'} />
      },
      {
        order: '3',
        name: `Favorited (${favoritedItems ? favoritedItems.length : 0})`,
        component: <NFTDisplay singleNFT={favoritedItems} type={'favorited'} />
      },
      {
        order: '4',
        name: 'Activity',
        component: <Activity data={userActivity ? userActivity : []} />
      }
    ],
    [parsedAccounts, createdItems, userActivity, favoritedItems]
  )

  useEffect(() => {
    return () => {}
  }, [tabPanes])

  useEffect(() => {
    if (sessionUser && parsedAccounts && parsedAccounts.length > 0) {
      const userCreated = parsedAccounts.filter(
        (nft: ParsedAccount) =>
          nft.data.creators !== undefined && nft.data.creators.find((c) => c.address === publicKey.toBase58())
      )
      setCreatedItems(userCreated)
    } else {
      setCreatedItems([])
    }
  }, [parsedAccounts])

  useEffect(() => {
    if (sessionUser?.user_likes?.length > 0) {
      fetchFavorites()
    } else {
      setFavoritedItems([])
    }

    return () => {}
  }, [sessionUser])

  useEffect(() => {
    if (sessionUser && sessionUser.user_id) {
      fetchUserActivity(sessionUser.user_id)
    } else {
      setUserActivity([])
    }

    return () => {}
  }, [sessionUser, fetchUserActivity, setUserActivity])

  const fetchFavorites = async () => {
    const favorites: ISingleNFT[] = await Promise.all(
      sessionUser.user_likes.map((i: number) => fetchNFTById(i, connection))
    )

    setFavoritedItems(favorites.map((f: any) => f.data[0]))
  }

  return <NFTTab tabPanes={tabPanes} />
}
