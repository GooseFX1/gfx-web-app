import React, { useState, useEffect, useMemo, FC } from 'react'
import { useNFTProfile, useConnectionConfig } from '../../../context'
import { ISingleNFT } from '../../../types/nft_details.d'
import { ParsedAccount } from '../../../web3'
import { fetchNFTById } from '../../../api/NFTs/actions'
import { NFTTab } from '../NFTTab'
import NFTDisplay from './NFTDisplay'
import Activity from './Activity'

type Props = {
  isSessionUser: boolean
}

export const ContentProfile: FC<Props> = ({ isSessionUser }: Props): JSX.Element => {
  const { connection } = useConnectionConfig()
  const {
    sessionUser,
    sessionUserParsedAccounts,
    nonSessionProfile,
    nonSessionUserParsedAccounts,
    userActivity,
    setUserActivity,
    fetchUserActivity
  } = useNFTProfile()
  const [createdItems, setCreatedItems] = useState<ParsedAccount[]>()
  const [favoritedItems, setFavoritedItems] = useState<ISingleNFT[]>()

  const currentUserProfile = useMemo(() => {
    if (nonSessionProfile !== undefined && !isSessionUser) {
      return nonSessionProfile
    } else if (sessionUser !== undefined && isSessionUser) {
      return sessionUser
    } else {
      return undefined
    }
  }, [isSessionUser, sessionUser, nonSessionProfile])

  const currentUserParsedAccounts = useMemo(() => {
    console.log(sessionUserParsedAccounts, nonSessionUserParsedAccounts)

    if (nonSessionUserParsedAccounts !== undefined && !isSessionUser) {
      return nonSessionUserParsedAccounts
    } else if (sessionUserParsedAccounts !== undefined && isSessionUser) {
      return sessionUserParsedAccounts
    } else {
      return undefined
    }
  }, [isSessionUser, sessionUserParsedAccounts, nonSessionUserParsedAccounts])

  const tabPanes = useMemo(
    () => [
      {
        order: '1',
        name: `Collection (${currentUserParsedAccounts ? currentUserParsedAccounts.length : 0})`,
        component: <NFTDisplay parsedAccounts={currentUserParsedAccounts} type={'collected'} />
      },
      {
        order: '2',
        name: `Created (${createdItems ? createdItems.length : 0})`,
        component: <NFTDisplay parsedAccounts={createdItems} type={'created'} />
      },
      {
        order: '3',
        name: `Favorited (${favoritedItems ? favoritedItems.length : 0})`,
        component: <NFTDisplay singleNFTs={favoritedItems ? favoritedItems : []} type={'favorited'} />
      },
      {
        order: '4',
        name: 'Activity',
        component: <Activity data={userActivity ? userActivity : []} />
      }
    ],
    [currentUserParsedAccounts, createdItems, userActivity, favoritedItems]
  )

  //useEffect(() => () => {}, [tabPanes])

  useEffect(() => {
    if (currentUserProfile && currentUserParsedAccounts && currentUserParsedAccounts.length > 0) {
      const userCreated = currentUserParsedAccounts.filter(
        (nft: ParsedAccount) =>
          nft.data.creators !== undefined && nft.data.creators.find((c) => c.address === currentUserProfile.pubkey)
      )
      setCreatedItems(userCreated)
    } else {
      setCreatedItems([])
    }
  }, [currentUserParsedAccounts])

  useEffect(() => {
    if (currentUserProfile?.user_likes?.length > 0) {
      fetchFavorites(currentUserProfile.user_likes)
    } else {
      setFavoritedItems([])
    }

    return null
  }, [currentUserProfile])

  useEffect(() => {
    if (currentUserProfile && currentUserProfile.user_id) {
      fetchUserActivity(currentUserProfile.user_id)
    } else {
      setUserActivity([])
    }

    return null
  }, [currentUserProfile, fetchUserActivity, setUserActivity])

  const fetchFavorites = async (userLikes: number[]) => {
    const favorites: ISingleNFT[] = await Promise.all(userLikes.map((i: number) => fetchNFTById(i, connection)))

    setFavoritedItems(favorites.map((f: any) => f.data[0]))
  }

  return <NFTTab tabPanes={tabPanes} />
}
