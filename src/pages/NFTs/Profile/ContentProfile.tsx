/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo, FC } from 'react'
import { useNFTAggregator, useNFTProfile } from '../../../context'
import { ISingleNFT } from '../../../types/nft_details'
import { ParsedAccount } from '../../../web3'
import { fetchNFTById } from '../../../api/NFTs'
import { NFTTab } from '../NFTTab'
import styled from 'styled-components'
import ProfilePageSidebar from './ProfilePageSidebar'
import { checkMobile } from '../../../utils'
import tw from 'twin.macro'
import ActivityNFTSection from '../Collection/ActivityNFTSection'
import { NFT_ACTIVITY_ENDPOINT } from '../../../api/NFTs'
import { useParams } from 'react-router-dom'
import { IAppParams } from '../../../types/app_params'
import NFTDisplayV2 from './NFTDisplayV2'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'

type Props = {
  isSessionUser: boolean
}

const WRAPPER = styled.div<{ background?: string }>`
  ${tw`flex h-[70vh]`}
`

export const ContentProfile: FC<Props> = ({ isSessionUser }: Props): JSX.Element => {
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
  const params = useParams<IAppParams>()
  const { wallet } = useWallet()
  const pubKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [noOfNFTs, setNumberOfNFTs] = useState<number>(0)
  const currentUserProfile = useMemo(() => {
    if (nonSessionProfile !== undefined && !isSessionUser) {
      return nonSessionProfile
    } else if (sessionUser !== null && isSessionUser) {
      return sessionUser
    } else {
      return undefined
    }
  }, [isSessionUser, sessionUser, nonSessionProfile])

  const currentUserParsedAccounts = useMemo(() => {
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
        order: 1,
        name: `Collection (${noOfNFTs})`,
        component: (
          <NFTDisplayV2
            parsedAccounts={currentUserParsedAccounts}
            type={'collected'}
            setNumberOfNFTs={setNumberOfNFTs}
          />
        )
      },
      ...(pubKey
        ? [
            {
              order: 2,
              name: `Bids `,
              component: (
                <NFTDisplayV2
                  parsedAccounts={currentUserParsedAccounts}
                  setNumberOfNFTs={setNumberOfNFTs}
                  type={'bids'}
                />
              )
            }
          ]
        : []),
      {
        order: 3,
        name: 'Activity',
        component: (
          <ActivityNFTSection address={params.userAddress} typeOfAddress={NFT_ACTIVITY_ENDPOINT.WALLET_ADDRESS} />
        )
      }
    ],
    [currentUserParsedAccounts, favoritedItems, noOfNFTs, pubKey]
  )

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

  const fetchFavorites = async (userLikes: string[]) => {
    const favorites: ISingleNFT[] = await Promise.all(userLikes.map((nftUUID: string) => fetchNFTById(nftUUID)))

    setFavoritedItems(favorites.map((f: any) => f.data[0]))
  }

  return !checkMobile() ? (
    <WRAPPER>
      <ProfilePageSidebar isSessionUser={isSessionUser} />
      <NFTTab tabPanes={tabPanes} />
    </WRAPPER>
  ) : (
    <NFTTab tabPanes={tabPanes} />
  )
}
