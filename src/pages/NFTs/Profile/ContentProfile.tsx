import React, { useState, useEffect, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNFTProfile, useConnectionConfig } from '../../../context'
// import { ISingleNFT } from '../../../types/nft_details.d'
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
  const [favoritedItems, setFavoritedItems] = useState<ParsedAccount[]>()
  // use ISingleNFT when get nft by address is available
  // const [favoritedItems, setFavoritedItems] = useState<ISingleNFT[]>()
  const { connection } = useConnectionConfig()

  const tabPanes = useMemo(
    () => [
      {
        order: '1',
        name: `My Collection (${parsedAccounts ? parsedAccounts.length : 0})`,
        component: <NFTDisplay data={parsedAccounts} type={'collected'} />
      },
      {
        order: '2',
        name: `Created (${createdItems ? createdItems.length : 0})`,
        component: <NFTDisplay data={createdItems} type={'created'} />
      },
      {
        order: '3',
        name: `Favorited (${favoritedItems ? favoritedItems.length : 0})`,
        component: <NFTDisplay data={favoritedItems} type={'favorited'} />
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
    console.log('TabData')
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
      fetchFavs()
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

  const fetchFavs = async () => {
    const favorites: any = await Promise.all(
      sessionUser.user_likes.map((i: number) => {
        return fetchNFTById(i, connection)
      })
    )

    const favs: ParsedAccount[] = favorites.map((favorite: any) => ({
      data: {
        creators: [],
        name: favorite.nft_name as string,
        symbol: '',
        uri: favorite.metadata_url as string,
        sellerFeeBasisPoints: 0
      },
      key: 4,
      mint: favorite.mint_address as string,
      primarySaleHappened: 0,
      edition: undefined,
      editionNonce: null,
      isMutable: 1,
      masterEdition: undefined,
      updateAuthority: ''
    }))

    setFavoritedItems(favs)
  }

  return <NFTTab tabPanes={tabPanes} />
}
