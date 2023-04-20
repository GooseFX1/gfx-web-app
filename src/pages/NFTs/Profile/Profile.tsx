import React, { useState, useEffect, useMemo, FC } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { IAppParams } from '../../../types/app_params.d'
import { useWallet } from '@solana/wallet-adapter-react'
import { HeaderProfile } from './HeaderProfile'
import { ContentProfile } from './ContentProfile'
import { useNFTProfile } from '../../../context'
import { isValidSolanaAddress } from '../../../web3'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

//#region styles
const PROFILE_CONTAINER = styled.div<{ background?: string }>`
  ${tw`-mt-20 pt-20 flex flex-col`}
  ${({ background }) => `
  background : url(${background});
  background-repeat: no-repeat;
  background-size: 100%;
  @media(max-width: 500px){
    background-size: 100% 100%;
  }
  .ant-drawer-content {
    background: #1c1c1c !important;
  }
  .ant-drawer-content-wrapper{
    height: 90% !important;
  }
  .ant-tabs-top {
    overflow: initial;
    position: relative;
    > .ant-tabs-nav {
      margin-bottom: 0;
      border-bottom: 1px solid ${({ theme }) => theme.bg1};
      height: 85px;

      .ant-tabs-nav-wrap {
        overflow: initial;
        display: block;

        .ant-tabs-nav-list {
          position: relative;
          height: 100%;
          width: 55%;         
          margin-left: auto;
          padding-right: 21px;
          overflow: scroll;
          @media(max-width: 500px){
            width: 100%;
            display: block;
            padding-top: 10px;
            height: auto;
          }

          ::-webkit-scrollbar {
            display: none;
          }

          .ant-tabs-tab {
            margin: 0 30px;
            .ant-tabs-tab-btn {
              padding: 16px 0;
              color: ${({ theme }) => theme.text28};
              font-size: 15px;
              @media(max-width: 500px){
                margin: 0 32px;
              }
            }
          }
          .ant-tabs-tab-active {
            .ant-tabs-tab-btn {
              color: ${({ theme }) => theme.text29};
              font-weight: 600;
              position: relative;
              font-size: 15px;

              &:before {
                position: absolute;
                content: '';
                height: 7px;
                width: 100%;
                bottom: -12px;
                left: 50%;
                background: rgba(88, 85, 255, 1);
                z-index: 6;
                display: inline-block;
                border-radius: 8px 8px 0 0;
                transform: translate(-50%, 0);
              }
            }
          }
        }
      }
    }
  }
`}
`
//#endregion

export const Profile: FC = (): JSX.Element => {
  const history = useHistory()
  const params = useParams<IAppParams>()
  const [randomBackground, setRandomBackground] = useState('')

  const {
    sessionUser,
    setUserActivity,
    setParsedAccounts,
    setNonSessionProfile,
    setNonSessionUserParsedAccounts
  } = useNFTProfile()
  const { connected, wallet } = useWallet()
  const [isSessionUser, setIsSessionUser] = useState<boolean | null>(null)

  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet])

  useEffect(() => {
    if (params.userAddress === undefined || !isValidSolanaAddress(params.userAddress)) history.push(`/NFTs`)

    // asserts there is no wallet connection and no session user
    if (sessionUser === undefined || !connected || publicKey === null) {
      setIsSessionUser(false)
      setParsedAccounts([])
    }

    if (publicKey !== null) {
      setIsSessionUser(params.userAddress === publicKey.toBase58())
    }

    return () => {
      setNonSessionProfile(undefined)
      setNonSessionUserParsedAccounts([])
      setUserActivity([])
    }
  }, [sessionUser, publicKey, connected, params.userAddress])

  useEffect(() => {
    const backgroundArray = [
      '/img/assets/redBackground.png',
      '/img/assets/purpleBackground.png',
      '/img/assets/multiBackground.png'
    ]
    const randomImage = backgroundArray[Math.floor(Math.random() * backgroundArray.length)]
    setRandomBackground(randomImage)
  }, [])

  return (
    isSessionUser !== undefined && (
      <PROFILE_CONTAINER id="nft-profile-container" background={randomBackground}>
        <HeaderProfile isSessionUser={isSessionUser} />
        <ContentProfile isSessionUser={isSessionUser} />
      </PROFILE_CONTAINER>
    )
  )
}
