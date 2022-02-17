import React, { useState, useEffect, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNFTProfile } from '../../../context'
import { ParsedAccount } from '../../../web3'

import { NFTTab } from '../NFTTab'
import NFTDisplay from './NFTDisplay'
import Activity from './Activity'

type Props = {
  isExplore?: boolean
}

export const ContentProfile = ({ isExplore }: Props) => {
  const { connected, publicKey } = useWallet()
  const { sessionUser, parsedAccounts, userActivity, setUserActivity, fetchUserActivity } = useNFTProfile()

  const [createdItems, setCreatedItems] = useState<ParsedAccount[]>()

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
        name: 'Favorited',
        component: <NFTDisplay data={[]} type={'favorited'} />
      },
      {
        order: '4',
        name: 'Activity',
        component: <Activity data={userActivity ? userActivity : []} />
      }
    ],
    [parsedAccounts, createdItems, userActivity]
  )

  useEffect(() => {
    console.log('TabData')
    return () => {}
  }, [tabPanes])

  useEffect(() => {
    if (connected && publicKey && parsedAccounts) {
      const userCreated = parsedAccounts.filter((nft: ParsedAccount) =>
        nft.data.creators.find((c) => c.address === publicKey.toBase58())
      )
      setCreatedItems(userCreated)
    } else {
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

  return <NFTTab tabPanes={tabPanes} />
}
