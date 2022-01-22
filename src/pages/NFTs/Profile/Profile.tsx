import React, { useState, useEffect, FC } from 'react'
// import { useParams } from 'react-router-dom'
// import { IAppParams } from '../../../types/app_params.d'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { HeaderProfile } from './HeaderProfile'
import { TabProfile } from './TabProfile'
import { Loader } from '../../../components'
import { useNFTProfile } from '../../../context'
import { unnamedUser } from './unnamedUser'

const WRAPPED_LOADER = styled.div`
  position: relative;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  ) : err ? (
    <h2>Something went wrong fetching user profile</h2>
  ) : (
    <>
      <HeaderProfile />
      <TabProfile />
    </>
  )
}
