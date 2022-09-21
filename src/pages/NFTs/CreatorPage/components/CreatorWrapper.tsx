import { useWallet } from '@solana/wallet-adapter-react'
import React, { FC } from 'react'
import styled from 'styled-components'
import { useNFTCreator } from '../../../../context/nft_creator'
import { StepsWrapper } from './StepsWrapper'

const WRAPPER = styled.div`
  margin-top: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
  flex-direction: column;
  .first-line {
    font-size: 30px;
    margin-top: 35px;
    font-weight: 600;
    color: ${({ theme }) => theme.text7};
  }
  .second-line {
    font-size: 18px;
    margin-top: 25px;
    width: 350px;
    text-align: center;
    font-weight: 500;
    color: ${({ theme }) => theme.text8};
    .email-style {
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
`

export const CreatorWrapper: FC = () => {
  const wallet = useWallet()
  const { isAllowed } = useNFTCreator()

  return !wallet.connected ? (
    <WRAPPER>
      <img src="/img/assets/launchpad-logo.svg" alt="Launchpad Logo" />
      <div className="first-line">Welcome to GFX Launchpad!</div>
      <div className="second-line">Please connect your wallet to finish your collection and list it!</div>
    </WRAPPER>
  ) : !isAllowed ? (
    <WRAPPER>
      <img src="/img/assets/launchpad-logo.svg" alt="Launchpad Logo" />
      <div className="first-line">Ups, wallet not supported!</div>
      <div className="second-line">
        Please contact <span className="email-style">hello@goosefx.io</span> or try again.
      </div>
    </WRAPPER>
  ) : (
    <StepsWrapper />
  )
}
