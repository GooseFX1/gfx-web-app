import React, { useState, useEffect, FC } from 'react'
// import { useParams } from 'react-router-dom'
// import { IAppParams } from '../../../types/app_params.d'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { HeaderProfile } from './HeaderProfile'
import { ContentProfile } from './ContentProfile'
import { Loader } from '../../../components'
import { useNFTProfile, unnamedUser } from '../../../context'

const WRAPPED_LOADER = styled.div`
  position: relative;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const PROFILE_CONTAINER = styled.div`
  height: 100%;
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
          position: relative;
          display: flex;
          justify-content: space-around;
          transition: transform 0.3s;
          height: 100%;
          width: 55%;
          margin-left: auto;
          padding-right: 21px;

          .ant-tabs-tab {
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
                width: 130%;
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

export const Profile: FC = (): JSX.Element => {
  // const params = useParams<IAppParams>()
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(true)
  const { sessionUser, setSessionUser, fetchSessionUser } = useNFTProfile()
  const { connected, publicKey } = useWallet()

  useEffect(() => {
    if (connected && publicKey) {
      if (!sessionUser || sessionUser.pubkey !== `${publicKey}`) {
        fetchUser(`${publicKey}`)
      }
      setLoading(false)
    } else {
      setUnnamedUser()
      setLoading(false)
    }

    return () => {}
  }, [publicKey, connected])

  const fetchUser = (param: string) => {
    fetchSessionUser('address', `${publicKey}`).then((res) => {
      if (!res || (res.response && res.response.status !== 200) || res.isAxiosError) {
        console.error(res)
        setErr(true)
      }
    })
  }

  const setUnnamedUser = () => {
    setSessionUser(unnamedUser)
    setLoading(false)
  }

  return loading ? (
    <WRAPPED_LOADER>
      <Loader />
    </WRAPPED_LOADER>
  ) : err || !sessionUser ? (
    <h2>Something went wrong fetching user profile</h2>
  ) : (
    <PROFILE_CONTAINER>
      <HeaderProfile />
      <ContentProfile />
    </PROFILE_CONTAINER>
  )
}
