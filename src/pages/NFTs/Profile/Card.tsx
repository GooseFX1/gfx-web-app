import React, { useState } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import { StyledCard } from './Card.styled'
import { SellYourNFTView } from '../SellNFT/SellYourNFTView'
import { INFTMetadata, ParsedNFTDetails } from '../../../types/nft_details.d'
import { NFTDetails } from '../NFTDetails'
import { useNFTDetails } from '../../../context'
import { useConnectionConfig } from '../../../context'

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

type ICard = {
  topLevelData: ParsedNFTDetails
  metaData: INFTMetadata
  border?: boolean
  isExplore?: boolean
}

export const Card = ({ topLevelData, metaData, border, isExplore }: ICard) => {
  const history = useHistory()
  // const { connected, publicKey } = useWallet()
  // const { connection } = useConnectionConfig()
  const { setGeneral, setNftMetadata } = useNFTDetails()

  const [visible, setVisible] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)
  const [modalOpen, setModalOpen] = useState(false)

  const goMyCreatedNFT = () => {
    // if (['favorited', 'created'].includes('metaData.type')) history.push('/NFTs/profile/my-created-NFT')
    // if ('metaData.type' === 'collected') history.push('/NFTs/profile/my-own-NFT')
    return
  }

  const handleLocateToDetails = () => {
    setGeneral({
      non_fungible_id: null,
      nft_name: topLevelData.data.name,
      nft_description: metaData.description,
      mint_address: topLevelData.mint,
      metadata_url: topLevelData.data.uri,
      image_url: metaData.properties.files[0].uri,
      animation_url: null,
      collection_id: null
    })
    setNftMetadata(metaData)
    setTimeout(() => history.push(`/NFTs/details/${topLevelData.mint}`), 100)
  }

  return (
    <>
      {modalOpen && (
        <STYLED_MODAL>
          <NFTDetails mode="my-external-NFT" arbData={metaData} />
        </STYLED_MODAL>
      )}
      <StyledCard $border={border} onClick={handleLocateToDetails}>
        <div className="card-image" style={{ backgroundImage: `url(${metaData.image})` }} onClick={goMyCreatedNFT} />
        <div className="info">
          <div className="name">{metaData.name}</div>
          <div className="number">
            {metaData.collection && <img className="check-icon" src={`/img/assets/check-icon.png`} alt="" />}
          </div>

          {metaData.name === 'favorited' ? (
            <div className="like-group favorited-group">
              <img className="heart-red" src={`/img/assets/heart-red.svg`} alt="" />
              <span className="like-count">{metaData.name}</span>
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
            ) : metaData.name === 'favorited' ? (
              <div className="price-group">
                <span className="text">Last</span>
                <img className="price-image" src={`/img/assets/price.svg`} alt="" />
                <span className="price-number">35</span>
              </div>
            ) : [1, 2].includes(metaData.name.length) ? (
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
    </>
  )
}
