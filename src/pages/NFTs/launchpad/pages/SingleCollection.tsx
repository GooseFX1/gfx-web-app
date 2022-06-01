import React, { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { IProjectParams } from '../../../../types/nft_launchpad'
import { fetchSelectedNFTLPData } from '../../../../api/NFTLaunchpad'
import { useNFTLPSelected } from '../../../../context/nft_launchpad'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'

const WRAPPER = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  .left {
    height: 250px;
  }
  .button {
    border: none;
    background: pink;
    width: 80px;
  }
  .right {
    height: 250px;
  }
`

export const SingleCollection: FC = () => {
  const params = useParams<IProjectParams>()
  const wallet = useWallet()
  const { selectedProject, setSelectedProject } = useNFTLPSelected()

  return (
    <div>
      {wallet.publicKey ? 'Wallet connected' : 'Not connected'}
      <WRAPPER>
        <div className="left">
          NFT Project info
          <button className="button">Mint Button</button>
        </div>
        <div className="right">NFT Project Image</div>
      </WRAPPER>
    </div>
  )
}
