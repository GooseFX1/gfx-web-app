import React, { ReactElement, useEffect, useMemo, FC } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import CollectionV2 from './Collection/CollectionV2'
import NFTLandingPageV2 from './Home/NFTLandingPageV2'
import { Profile } from './Profile'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNFTProfile, useConnectionConfig, usePriceFeedFarm, NFTAggFiltersProvider } from '../../context'
import { logData } from '../../api/analytics'
import styled from 'styled-components'
import { NestQuestSingleListing } from './NestQuest/NestQuestSingleListing'
import { checkMobile } from '../../utils'
import { dailyVisitData } from '../../api/NFTs'

const BODY_NFT = styled.div`
  position: relative;
  width: 100vw;
  height: calc(100vh - 56px);
  overflow-y: hidden;
  overflow-x: hidden;

  * {
    font-family: Montserrat;
  }
`
const NFTAgg: FC = (): ReactElement => {
  const { path } = useRouteMatch()
  const { prices, refreshTokenData } = usePriceFeedFarm()
  const { connection } = useConnectionConfig()
  const { wallet } = useWallet()
  const { sessionUser, setSessionUser, fetchSessionUser, setParsedAccounts } = useNFTProfile()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])

  useEffect(() => {
    refreshTokenData()
  }, [])

  useEffect(() => {
    if (checkMobile()) logData('NFT_agg_mobile')
    else logData('NFT_agg_web')
  }, [])

  useEffect(() => {
    if (publicKey) {
      dailyVisitData(publicKey.toString())
    }
  }, [publicKey])

  useEffect(() => {
    if (publicKey !== null && publicKey !== undefined) {
      if (!sessionUser || sessionUser.pubkey !== publicKey.toBase58()) {
        fetchSessionUser('address', publicKey.toBase58(), connection).then((res) => {
          if (res && res.status === 200) {
            const userProfileStatus = localStorage.getItem(publicKey.toBase58())
            if (res.data.length === 0 && userProfileStatus === null) {
              localStorage.setItem(
                publicKey.toBase58(),
                JSON.stringify({ pubKey: publicKey.toBase58(), isNew: true })
              )
            } else {
              localStorage.setItem(
                publicKey?.toBase58(),
                JSON.stringify({ pubKey: publicKey.toBase58(), isNew: false })
              )
            }
          } else {
            console.error(res)
          }
        })
      }
    } else {
      setSessionUser(null)
      setParsedAccounts([])
    }
    return null
  }, [publicKey])

  return Object.keys(prices) ? (
    <BODY_NFT>
      <NFTAggFiltersProvider>
        <Switch>
          <Route exact path={path}>
            <NFTLandingPageV2 />
          </Route>
          <Route exact path={'/nfts/NestQuest'}>
            <NestQuestSingleListing />
          </Route>
          <Route exact path="/nfts/collection/:collectionName">
            <CollectionV2 />
          </Route>
          <Route exact path={['/nfts/profile', '/nfts/profile/:userAddress']}>
            <Profile />
          </Route>
        </Switch>
      </NFTAggFiltersProvider>
    </BODY_NFT>
  ) : (
    <></>
  )
}

export default NFTAgg
