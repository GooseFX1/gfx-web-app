import { useWallet } from '@solana/wallet-adapter-react'
import React, { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { useNFTAdmin } from '../../../../context'
import AdminDashboard from './AdminDashboard'
import { Connect } from '../../../../layouts'
import { GradientText } from './UpcomingMints'

const CONNECT_WALLET_WRAPPER = styled.div`
  ${tw`w-full flex-col flex items-center justify-center`}
  height: 90vh;
  .gooseLogo {
    ${tw`w-28 h-28`}
  }
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

export const AdminWrapper: FC = () => {
  const wallet = useWallet()
  const { adminAllowed } = useNFTAdmin()

  return !wallet.connected ? (
    <CONNECT_WALLET_WRAPPER>
      <img className="gooseLogo" src="/img/assets/GOFX-icon.svg" alt="Goose" />
      <div className="first-line">Welcome to NFT Admin page!</div>
      <div className="connectWallet">
        <Connect />
      </div>
    </CONNECT_WALLET_WRAPPER>
  ) : !adminAllowed ? (
    <WRAPPER>
      <img className="gfxLogo" src="/img/assets/GOFX-icon.svg" alt="Launchpad Logo" />
      <div className="first-line">Ups, wallet not supported!</div>
      <div className="second-line">
        Please contact <GradientText text={'contact@goosefx.io'} fontSize={18} fontWeight={500} /> or try again.
      </div>
    </WRAPPER>
  ) : (
    <AdminDashboard />
  )
}
