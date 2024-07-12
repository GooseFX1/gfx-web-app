import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { isAdminAllowed } from '../../api/NFTLaunchpad'
import { Connect } from '../../layouts'
import { GradientText } from '../../components'
import AnalyticsDashboard from './AnalyticsDashboard'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { useWallet } from '@solana/wallet-adapter-react'

const CONNECT_WALLET_WRAPPER = styled.div`
  ${tw`w-full flex-col flex items-center justify-center`}
  height: 90vh;
  .first-line {
    ${tw`mt-8 font-semibold text-3xl	`}
    color: ${({ theme }) => theme.text7};
  }
  .connectWallet {
    margin-top: 25px;
    transform: scale(1.3);
  }
`
const WRAPPER = styled.div`
  ${tw`flex justify-center mt-4 items-center flex-col h-screen`}
  .first-line {
    ${tw`mt-8 font-semibold text-3xl	`}
    color: ${({ theme }) => theme.text7};
  }
  .gfxLogo {
    ${tw`w-28 h-28`}
  }
  .second-line {
    ${tw`text-lg mt-6 font-medium	w-96 text-center`}
    color: ${({ theme }) => theme.text4};
  }
`

const AnalyticsWrapper: FC = () => {
  const [adminAllowed, setAdminAllowed] = useState<boolean>(false)
  const {connected} = useWallet()
  const {publicKey} = useWalletBalance()
  useEffect(() => {
    ;(async () => {
      if (publicKey) {
        const data = await isAdminAllowed(publicKey.toString())
        setAdminAllowed(data.allowed)
      }
    })()
  }, [publicKey])

  return !connected ? (
    <CONNECT_WALLET_WRAPPER>
      <img height="112px" width="112px" src="/img/crypto/GOFX.svg" alt="Goose" />
      <div className="first-line">Welcome to NFT Analytics page!</div>
      <div className="connectWallet">
        <Connect />
      </div>
    </CONNECT_WALLET_WRAPPER>
  ) : !adminAllowed ? (
    <WRAPPER>
      <img height="112px" width="112px" src="/img/crypto/GOFX.svg" alt="Launchpad Logo" />
      <div className="first-line">Ups, wallet not supported!</div>
      <div className="second-line">
        Please contact <GradientText text={'contact@goosefx.io'} fontSize={18} fontWeight={500} /> or try again.
      </div>
    </WRAPPER>
  ) : (
    <AnalyticsDashboard />
  )
}
export default AnalyticsWrapper
