import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { StyledCard } from './Card.styled'
import { SellYourNFTView } from '../SellNFT/SellYourNFTView'
import { INFTMetadata, ParsedNFTDetails } from '../../../types/nft_details.d'
import { useNFTDetails, useNFTProfile, useConnectionConfig } from '../../../context'
import { getParsedAccountByMint } from '../../../web3'
import { notify } from '../../../utils'

type ICard = {
  topLevelData: ParsedNFTDetails
  metaData: INFTMetadata
  border?: boolean
  isExplore?: boolean
}

// TODO: associate `non_fungible_id`s for each nft from the api data with
export const Card = ({ topLevelData, metaData, border, isExplore }: ICard) => {
  const history = useHistory()
  const { sessionUser } = useNFTProfile()
  // const { connected, publicKey } = useWallet()
  const { connection } = useConnectionConfig()
  const { setGeneral, setNftMetadata } = useNFTDetails()

  const [visible, setVisible] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)
  // const [likes, setLikes] = useState(0)
  // const [liked, setLiked] = useState(false)

  // useEffect(() => {
  //   getLikesNFT(sessionUser.user_id, null).then((res) => {
  //     let nftLiked = res.filter((k: any) => k.non_fungible_id == null && k.collection_id == null)
  //     setLikes(nftLiked?.length)
  //     if (nftLiked.length > 0) {
  //       setLiked(true)
  //     } else {
  //       setLiked(false)
  //     }
  //   })
  // }, [liked])

  const handleLocateToDetails = (e: any) => {
    getParsedAccountByMint({
      mintAddress: topLevelData.mint,
      connection: connection
    }).then((res) => {
      if (res) {
        const owner = res !== undefined ? res.account?.data?.parsed?.info.owner : ''

        setGeneral({
          non_fungible_id: null,
          nft_name: topLevelData.data.name,
          nft_description: metaData.description,
          mint_address: topLevelData.mint,
          metadata_url: topLevelData.data.uri,
          image_url: metaData.properties.files[0].uri,
          animation_url: null,
          collection_id: null,
          token_account: res.pubkey,
          owner: owner
        })
        setNftMetadata(metaData)
        setTimeout(() => history.push(`/NFTs/details/${topLevelData.mint}`), 100)
      } else {
        notify({
          type: 'error',
          message: 'Could not parse account using mint address'
        })
      }
    })
  }

  return (
    <>
      <StyledCard $border={border}>
        <div
          className="card-image"
          style={{ backgroundImage: `url(${metaData.image})` }}
          onClick={handleLocateToDetails}
        />
        <div className="info">
          <div className="name">{metaData.name}</div>
          {metaData.collection && (
            <div className="name">
              {Array.isArray(metaData.collection) ? metaData.collection[0].name : metaData.collection.name}{' '}
              <span>
                {metaData.collection && <img className="check-icon" src={`/img/assets/check-icon.png`} alt="" />}
              </span>
            </div>
          )}
          {/* <div className="number"></div> */}
          {/* {liked ? (
            <div className="like-group favorited-group">
              <img
                className="heart-red"
                src={`/img/assets/heart-red.svg`}
                alt=""
                onClick={() => {
                  likeDislike(sessionUser.user_id, null)
                  setLiked(false)
                }}
              />
              <span className="like-count">{likes}</span>
            </div>
          ) : (
            <div className="like-group">
              <>
                <img
                  className="heart-empty"
                  src={`/img/assets/heart-empty.svg`}
                  alt=""
                  onClick={() => {
                    likeDislike(sessionUser.user_id, null)
                    setLiked(true)
                  }}
                />
              </>
              <span className="like-count">{likes}</span>
            </div>
          )} */}

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
