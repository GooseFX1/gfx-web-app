import React, { useState } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import { StyledCard } from './Card.styled'
import { SellYourNFTView } from '../SellNFT/SellYourNFTView'
import { INFTMetadata } from '../../../types/nft_details.d'
import { NFTDetails } from '../NFTDetails'
import { useNFTDetails } from '../../../context'
import { useConnectionConfig } from '../../../context'

type Props = {
  data: INFTMetadata
  border?: boolean
  isExplore?: boolean
}

const STYLED_MODAL = styled.div`
  ${({ theme }) => `
background-color: ${theme.bg3};
${theme.largeBorderRadius}
height: 85%;
width: 90%;
top: 5rem;
left: 5rem;
position: fixed !important;
z-index: 1000;

.ant-modal-header {
  ${theme.largeBorderRadius};
  background-color: ${theme.bg3};
  padding: ${theme.margin(3.5)} ${theme.margin(5.5)} 0 ${theme.margin(5.5)};
  border: none;
  .ant-modal-title {
    font-size: 25px;
    color: ${theme.text1};
    font-weight: 600;
  }
}
`}
`

export const Card = ({ data, border, isExplore }: Props) => {
  const history = useHistory()

  const [visible, setVisible] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { fetchExternalNFTs } = useNFTDetails()
  const { connected, publicKey } = useWallet()
  const { connection } = useConnectionConfig()

  const goMyCreatedNFT = () => {
    // if (['favorited', 'created'].includes('data.type')) history.push('/NFTs/profile/my-created-NFT')
    // if ('data.type' === 'collected') history.push('/NFTs/profile/my-own-NFT')
    return
  }

  const handleClickPrimaryButton = () => {
    history.push('/NFTs/sell')
  }

  const openModal = async () => {
    if (connected) {
      await fetchExternalNFTs(publicKey, connection, data)
      setModalOpen(true)
    }
  }

  return (
    <>
      {modalOpen && (
        <STYLED_MODAL>
          <NFTDetails mode="my-external-NFT" arbData={data} handleClickPrimaryButton={handleClickPrimaryButton} />
        </STYLED_MODAL>
      )}
      <div className="card-item" onClick={() => openModal()}>
        <StyledCard $border={border}>
          <img className="card-image" src={data.image} alt="" onClick={goMyCreatedNFT} />
          <div className="info">
            <div className="name">{data.name}</div>
            <div className="number">
              {data.collection && <img className="check-icon" src={`/img/assets/check-icon.png`} alt="" />}
            </div>

            {data.name === 'favorited' ? (
              <div className="like-group favorited-group">
                <img className="heart-red" src={`/img/assets/heart-red.svg`} alt="" />
                <span className="like-count">{data.name}</span>
              </div>
            ) : (
              <div className="like-group">
                <>
                  {/* <img className="heart-purple" src={`/img/assets/heart-purple.svg`} alt="" /> */}
                  <img className="heart-empty" src={`/img/assets/heart-empty.svg`} alt="" />
                </>
                <span className="like-count">0</span>
              </div>
            )}
            <div className="option">
              {isExplore ? (
                <button className="buy-now-btn">Buy now</button>
              ) : data.name === 'favorited' ? (
                <div className="price-group">
                  <span className="text">Last</span>
                  <img className="price-image" src={`/img/assets/price.svg`} alt="" />
                  <span className="price-number">35</span>
                </div>
              ) : [1, 2].includes(data.name.length) ? (
                <button className="sell-now-btn" onClick={() => setVisible(true)}>
                  Sell now
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </StyledCard>
        <SellYourNFTView visible={visible} handleOk={handleOk} handleCancel={handleCancel} />
      </div>
    </>
  )
}
