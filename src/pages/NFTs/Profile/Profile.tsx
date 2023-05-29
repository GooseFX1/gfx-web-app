/* eslint-disable @typescript-eslint/no-unused-vars */
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
  .ant-drawer-content {
    ${tw`sm:rounded-[20px]`}
  }
  .ant-drawer-body {
    ${tw`dark:bg-black-1 bg-grey-5 border-solid border-l-grey-4 border-[1px]
    dark:border-l-black-4 border-t-0 border-r-0 border-b-0`}
    ${({ theme }) => theme.customScrollBar(0)}
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .no-dp-avatar {
    ${tw`dark:border-black-1 text-grey-1  bg-grey-6 text-[30px] sm:text-[24px] font-semibold justify-center
           h-[116px] dark:bg-black-2 flex items-center w-[116px] rounded-[50%] sm:pt-[1px]
         sm:h-[70px] sm:w-[70px] sm:ml-[-5px] sm:ml-2.5 sm:mt-[-25px]`}
    border: 8px solid ${({ theme }) => theme.bgForNFTCollection};
    @media (max-width: 500px) {
      border: 1.5px solid ${({ theme }) => theme.bgForNFTCollection};
    }
  }

  ${({ background }) => `
  background : url(${background});
  background-repeat: no-repeat;
  background-size: 100% 500px;
  
  @media(max-width: 500px){
    background-size: 100% 100%;
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
  const { wallet } = useWallet()
  const [prevWallet, setPrevWallet] = useState<string>(null)

  const publicKey = useMemo(
    () => (wallet?.adapter ? wallet?.adapter?.publicKey : null),
    [wallet?.adapter?.publicKey, wallet?.adapter]
  )
  const isSessionUser = useMemo(
    () => (publicKey !== null ? params.userAddress === publicKey?.toBase58() : false),
    [publicKey]
  )

  useEffect(() => {
    if (prevWallet !== publicKey?.toString()) {
      if (sessionUser && publicKey) {
        history.push(`/nfts/profile/${publicKey.toString()}`)
      }
      setPrevWallet(publicKey ? publicKey?.toString() : null)
    }
  }, [prevWallet, publicKey, sessionUser])

  useEffect(() => {
    if (params.userAddress === undefined || !isValidSolanaAddress(params.userAddress)) history.push(`/nfts`)

    // asserts there is no wallet connection and no session user
    if (sessionUser === null || publicKey === null) {
      setParsedAccounts([])
    }

    return () => {
      setNonSessionProfile(undefined)
      setNonSessionUserParsedAccounts([])
      setUserActivity([])
    }
  }, [sessionUser, publicKey, wallet?.adapter?.publicKey, wallet?.adapter, params.userAddress])

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
