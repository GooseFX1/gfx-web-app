import React, { useEffect, FC } from 'react'
import { useRouteMatch, Route, Switch, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { ILocationState } from '../../types/app_params.d'
import NFTLandingPage from './Home/NFTHome'
import { NFTDetails } from './NFTDetails'
import { Collectible } from './Collectible'
import { NestQuestSingleListing } from './NestQuest/NestQuestSingleListing'
import { UpLoadNFT } from './Collectible/UpLoadNFT'
import { NftDrafts } from './Collectible/Drafts'
import { SellNFT } from './Collectible/SellNFT'
import { Profile } from './Profile'
import { Collection } from './Collection/Collection'
import { OverlayProvider } from '../../context/overlay'
import {
  useNFTProfile,
  PriceFeedProvider,
  NFTCollectionProvider,
  NFTDetailsProvider,
  useNavCollapse,
  useConnectionConfig
} from '../../context'
import { GenericNotFound } from '../InvalidUrl'
import { logData } from '../../api/analytics'

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

export const NFTs: FC = () => {
  const { isCollapsed } = useNavCollapse()
  const location = useLocation<ILocationState>()
  const { path } = useRouteMatch()
  const { connection } = useConnectionConfig()
  const { connected, wallet } = useWallet()
  const { sessionUser, setSessionUser, fetchSessionUser } = useNFTProfile()

  useEffect(() => {
    logData('NFT_page')
  }, [location])

  useEffect(() => {
    if (connected && wallet?.adapter?.publicKey) {
      if (!sessionUser || sessionUser.pubkey !== wallet?.adapter?.publicKey.toBase58()) {
        fetchSessionUser('address', wallet.adapter.publicKey.toBase58(), connection).then((res) => {
          if (res && res.status === 200) {
            const userProfileStatus = localStorage.getItem(wallet.adapter.publicKey.toBase58())
            if (res.data.length === 0 && userProfileStatus === null) {
              localStorage.setItem(
                wallet?.adapter?.publicKey.toBase58(),
                JSON.stringify({ pubKey: wallet.adapter.publicKey.toBase58(), isNew: true })
              )
            } else {
              localStorage.setItem(
                wallet?.adapter?.publicKey.toBase58(),
                JSON.stringify({ pubKey: wallet.adapter.publicKey.toBase58(), isNew: false })
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
  }, [wallet?.adapter?.publicKey, connected])

  return (
    <OverlayProvider>
      <PriceFeedProvider>
        <NFTCollectionProvider>
          <NFTDetailsProvider>
            <BODY_NFT $navCollapsed={isCollapsed}>
              <Switch>
                <Route exact path={path}>
                  <NFTLandingPage />
                </Route>
                <Route exact path={['/NFTs/profile', '/NFTs/profile/:userAddress']}>
                  <Profile />
                </Route>
                <Route exact path="/NFTs/collection/:collectionName">
                  <Collection />
                </Route>
                <Route exact path={'/NFTs/details/:nftMintAddress'}>
                  <NFTDetails />
                </Route>
                <Route exact path={'/NFTs/NestQuest'}>
                  <NestQuestSingleListing />
                </Route>
                <Route exact path="/NFTs/create">
                  <Collectible />
                </Route>
                <Route exact path="/NFTs/drafts">
                  <NftDrafts />
                </Route>
                <Route exact path="/NFTs/create-single/:draftId?">
                  <UpLoadNFT />
                </Route>
                <Route exact path="/NFTs/sell/:nftId">
                  <SellNFT />
                </Route>
                <Route>
                  <GenericNotFound />
                </Route>
              </Switch>
            </BODY_NFT>
          </NFTDetailsProvider>
        </NFTCollectionProvider>
      </PriceFeedProvider>
    </OverlayProvider>
  )
}
