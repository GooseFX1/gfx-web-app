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
const PROFILE_CONTAINER = styled.div`
  display: flex;
  flex-direction: column;

  .ant-tabs-top {
    overflow: initial;
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
          display: flex;
          justify-content: space-around;
          transition: transform 0.3s;
          height: 100%;
          width: 55%;
          margin-left: auto;
          padding-right: 21px;

          ::-webkit-scrollbar {
            display: none;
          }

          .ant-tabs-tab {
            ${tw`sm:my-0 sm:mx-8`}
            padding: 16px 0;
          }
          .ant-tabs-tab-active {
            .ant-tabs-tab-btn {
              color: ${({ theme }) => theme.text7};
              font-weight: 600;
              position: relative;

              &:before {
                position: absolute;
                content: '';
                height: 7px;
                width: 100%;
                bottom: -28px;
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
`
//#endregion

export const Profile: FC = (): JSX.Element => {
  const history = useHistory()
  const params = useParams<IAppParams>()
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

  return (
    isSessionUser !== undefined && (
      <PROFILE_CONTAINER>
        <HeaderProfile isSessionUser={isSessionUser} />
        <ContentProfile isSessionUser={isSessionUser} />
      </PROFILE_CONTAINER>
    )
  )
}
