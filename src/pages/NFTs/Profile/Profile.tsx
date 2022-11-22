import React, { useState, useEffect, FC } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { IAppParams } from '../../../types/app_params.d'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { HeaderProfile } from './HeaderProfile'
import { ContentProfile } from './ContentProfile'
import { useNFTProfile } from '../../../context'
import tw from 'twin.macro'

//#region styles
const PROFILE_CONTAINER = styled.div<{ background?: string }>`
  ${({ background }) => `
  display: flex;
  flex-direction: column;
  background : url(${background});
  background-repeat: no-repeat;
  background-size: 100%;

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
          ${tw`sm:w-full sm:block sm:pt-2.5 overflow-scroll`}
          position: relative;
          height: 100%;
          width: 55%;
          margin-left: auto;
          padding-right: 21px;

          ::-webkit-scrollbar {
            display: none;
          }

          .ant-tabs-tab {
            margin: 0 30px;
            .ant-tabs-tab-btn {
              ${tw`sm:my-0 sm:mx-8`}
              padding: 16px 0;
              color: ${({ theme }) => theme.text28};
              font-size: 15px;
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
  const { connected, publicKey } = useWallet()
  const [isSessionUser, setIsSessionUser] = useState<boolean>()

  useEffect(() => {
    if (params.userAddress === undefined) history.push(`/NFTs`)

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
      <PROFILE_CONTAINER background={randomBackground}>
        <HeaderProfile isSessionUser={isSessionUser} />
        <ContentProfile isSessionUser={isSessionUser} />
      </PROFILE_CONTAINER>
    )
  )
}
