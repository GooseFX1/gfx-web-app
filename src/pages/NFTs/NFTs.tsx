import React, { useEffect, FC } from 'react'
import { useRouteMatch, Route, Switch, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { logEvent } from 'firebase/analytics'
import analytics from '../../analytics'
import styled from 'styled-components'
import { ILocationState } from '../../types/app_params.d'
import NFTLandingPage from './Home/NFTHome'
import { NFTDetails } from './NFTDetails'
import { Collectible } from './Collectible'
import { UpLoadNFT } from './Collectible/UpLoadNFT'
import { SellNFT } from './Collectible/SellNFT'
import { Profile } from './Profile'
import { Explore } from './Profile/Explore'
import { Collection } from './Collection/Collection'
import { OverlayProvider } from '../../context/overlay'
import {
  useNFTProfile,
  PriceFeedProvider,
  NFTCollectionProvider,
  NFTDetailsProvider,
  useNavCollapse,
  ENDPOINTS,
  useConnectionConfig
} from '../../context'
import { notify } from '../../utils'

const BODY_NFT = styled.div<{ $navCollapsed: boolean }>`
  position: relative;
  width: 100vw;
  min-height: calc(100vh - 80px);
  overflow-y: scroll;
  overflow-x: hidden;
  padding-top: calc(80px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});

  * {
    font-family: Montserrat;
  }

  ${({ theme }) => theme.customScrollBar('6px')};
`

export const NFTs: FC = () => {
  const { isCollapsed } = useNavCollapse()
  const location = useLocation<ILocationState>()
  const { path } = useRouteMatch()
  const { connection, endpoint, setEndpoint } = useConnectionConfig()
  const { connected, publicKey } = useWallet()
  const { sessionUser, setSessionUser, fetchSessionUser } = useNFTProfile()

  useEffect(() => {
    const an = analytics()
    an !== null &&
      logEvent(an, 'screen_view', {
        firebase_screen: 'NFT Exchange',
        firebase_screen_class: 'load'
      })

    if (endpoint === ENDPOINTS[1].endpoint) {
      setEndpoint(ENDPOINTS[0].endpoint)
      notify({ message: `Switched to ${ENDPOINTS[0].network}` })
    }
  }, [location])

  useEffect(() => {
    if (connected && publicKey) {
      if (!sessionUser || sessionUser.pubkey !== publicKey.toBase58()) {
        fetchSessionUser('address', publicKey.toBase58(), connection).then((res) => {
          if (res && res.status === 200) {
            const userProfileStatus = localStorage.getItem(publicKey.toBase58())
            if (res.data.length === 0 && userProfileStatus === null) {
              localStorage.setItem(publicKey.toBase58(), JSON.stringify({ pubKey: publicKey.toBase58(), isNew: true }))
            } else {
              localStorage.setItem(publicKey.toBase58(), JSON.stringify({ pubKey: publicKey.toBase58(), isNew: false }))
            }
          } else {
            console.error(res)
          }
        })
      }
    } else {
      setSessionUser(undefined)
    }
    return () => {}
  }, [publicKey, connected])

  return endpoint !== ENDPOINTS[1].endpoint ? (
    <OverlayProvider>
      <PriceFeedProvider>
        <NFTCollectionProvider>
          <NFTDetailsProvider>
            <BODY_NFT $navCollapsed={isCollapsed}>
              <Switch>
                <Route exact path={path}>
                  <NFTLandingPage />
                </Route>
                <Route exact path={['/NFTs/profile', '/NFTs/profile/:userId']}>
                  <Profile />
                </Route>
                <Route exact path="/NFTs/profile/explore">
                  <Explore />
                </Route>
                <Route exact path="/NFTs/collection/:collectionId">
                  <Collection />
                </Route>
                <Route exact path={'/NFTs/details/:nftId'}>
                  <NFTDetails />
                </Route>
                <Route exact path="/NFTs/create">
                  <Collectible />
                </Route>
                <Route exact path="/NFTs/create-single">
                  <UpLoadNFT />
                </Route>
                <Route exact path="/NFTs/sell/:nftId">
                  <SellNFT />
                </Route>
              </Switch>
            </BODY_NFT>
          </NFTDetailsProvider>
        </NFTCollectionProvider>
      </PriceFeedProvider>
    </OverlayProvider>
  ) : (
    <div>waiting on network</div>
  )
}
