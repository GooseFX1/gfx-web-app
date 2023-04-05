import React, { ReactElement, useEffect, FC } from 'react'
import { Route, Switch, useRouteMatch, useLocation } from 'react-router-dom'
import CollectionV2 from './Collection/CollectionV2'
import NFTLandingPageV2 from './Home/NFTLandingPageV2'
import { Profile } from './Profile'
import { useWallet } from '@solana/wallet-adapter-react'
import { ILocationState } from '../../types/app_params.d'
import {
  useNFTProfile,
  useNavCollapse,
  useConnectionConfig,
  NFTAggregatorProvider,
  NFTDetailsProvider,
  usePriceFeedFarm
} from '../../context'
import { logData } from '../../api/analytics'
import styled from 'styled-components'

const BODY_NFT = styled.div<{ $navCollapsed: boolean }>`
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow-y: hidden;
  overflow-x: hidden;
  padding-top: calc(80px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
  * {
    font-family: Montserrat;
  }
`
const NFTAgg: FC = (): ReactElement => {
  const { isCollapsed } = useNavCollapse()
  const { path } = useRouteMatch()
  const { prices, refreshTokenData } = usePriceFeedFarm()
  const location = useLocation<ILocationState>()
  const { connection } = useConnectionConfig()
  const { wallet } = useWallet()
  const { sessionUser, setSessionUser, fetchSessionUser } = useNFTProfile()

  useEffect(() => {
    refreshTokenData()
  }, [])

  useEffect(() => {
    logData('NFT_agg')
  }, [location])

  useEffect(() => {
    if (wallet?.adapter?.connected) {
      if (!sessionUser || sessionUser.pubkey !== wallet?.adapter?.publicKey.toBase58()) {
        fetchSessionUser('address', wallet?.adapter?.publicKey.toBase58(), connection).then((res) => {
          if (res && res.status === 200) {
            const userProfileStatus = localStorage.getItem(wallet?.adapter?.publicKey.toBase58())
            if (res.data.length === 0 && userProfileStatus === null) {
              localStorage.setItem(
                wallet?.adapter?.publicKey.toBase58(),
                JSON.stringify({ pubKey: wallet?.adapter?.publicKey.toBase58(), isNew: true })
              )
            } else {
              localStorage.setItem(
                wallet?.adapter?.publicKey.toBase58(),
                JSON.stringify({ pubKey: wallet?.adapter?.publicKey.toBase58(), isNew: false })
              )
            }
          } else {
            console.error(res)
          }
        })
      }
    } else {
      setSessionUser(undefined)
    }
    return null
  }, [wallet])

  return Object.keys(prices) ? (
    <BODY_NFT $navCollapsed={isCollapsed}>
      <NFTDetailsProvider>
        <NFTAggregatorProvider>
          <Switch>
            <Route exact path={path}>
              <NFTLandingPageV2 />
            </Route>
            <Route exact path="/nfts/collection/:collectionName">
              <CollectionV2 />
            </Route>
            <Route exact path={['/nfts/profile', '/nfts/profile/:userAddress']}>
              <Profile />
            </Route>
          </Switch>
        </NFTAggregatorProvider>
      </NFTDetailsProvider>
    </BODY_NFT>
  ) : (
    <></>
  )
}

export default NFTAgg
