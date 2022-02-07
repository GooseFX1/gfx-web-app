import { Col, Row } from 'antd'
import { FC, useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { useNFTDetails, useNFTProfile } from '../../../context'
import { TimePanel } from './RemainingPanel'
import { ProgressPanel } from './ProgressPanel'
import { NFTDetailsProviderMode } from '../../../types/nft_details'
import { ReactComponent as FixedPriceIcon } from '../../../assets/fixed-price.svg'
import { ReactComponent as OpenBidIcon } from '../../../assets/open-bid.svg'

const LEFT_SECTION = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${theme.text1};

    .ls-image {
      border-radius: 20px;
      box-shadow: 3px 3px 14px 0px rgb(0 0 0 / 43%);
    }

    .ls-bottom-panel {
      margin-top: ${theme.margin(2.5)};

      .ls-end-text {
        font-size: 12px;
        font-weight: 600;
        color: ${theme.text7};
      }

      .ls-favorite {
        margin-bottom: ${theme.margin(2)};
      }

      .ls-favorite-heart {
        width: 21px;
        height: 21px;
        margin-right: ${theme.margin(0.5)};
      }

      .ls-favorite-number {
        font-size: 18px;
        font-weight: 600;
        color: #4b4b4b;
      }

      .ls-favorite-number-highlight {
        color: ${theme.text1};
      }

      .ls-action-button {
        color: ${theme.text1};
        cursor: pointer;
      }
    }
  `}
`

export const LeftSection: FC<{ mode: NFTDetailsProviderMode }> = ({ mode, ...rest }) => {
  const { general, nftMetadata, likeDislike, getLikesNFT } = useNFTDetails()
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const { sessionUser } = useNFTProfile()
  const { non_fungible_id, collection_id } = general
  const isFavorite = true
  //const hearts = 12
  const remaining = {
    days: '10',
    hours: '2',
    minutes: '43'
  }

  useEffect(() => {
    getLikesNFT(sessionUser.user_id, non_fungible_id).then((res) => {
      let nftLiked = res?.filter((k: any) => k.non_fungible_id == non_fungible_id && k.collection_id == collection_id)
      setLikes(nftLiked?.length)
      if (nftLiked.length > 0) {
        setLiked(true)
      } else {
        setLiked(false)
      }
    })
  }, [liked])

  const isShowReamingTime = mode === 'my-created-NFT' || mode === 'live-auction-NFT'

  return (
    <LEFT_SECTION {...rest}>
      <img className="ls-image" src={general?.image_url || nftMetadata?.image} alt="" />
      <div className="ls-bottom-panel">
        <Row justify={mode !== 'mint-item-view' ? 'space-between' : 'start'} align="middle" className="ls-favorite">
          <Col>{isShowReamingTime && <div className="ls-end-text">Auction ends in:</div>}</Col>
          {mode !== 'mint-item-view' && (
            <Row align="middle">
              {(liked && (
                <img
                  className="ls-favorite-heart"
                  src={`/img/assets/heart-red.svg`}
                  alt=""
                  onClick={() => {
                    likeDislike(sessionUser?.user_id, non_fungible_id)
                    setLiked(false)
                  }}
                />
              )) || (
                <img
                  className="ls-favorite-heart"
                  src={`/img/assets/heart-empty.svg`}
                  alt=""
                  onClick={() => {
                    likeDislike(sessionUser?.user_id, non_fungible_id)
                    setLiked(true)
                  }}
                />
              )}
              <span className={`ls-favorite-number ${isFavorite ? 'ls-favorite-number-highlight' : ''}`}>{likes}</span>
            </Row>
          )}
        </Row>
        {mode === 'mint-item-view' && <ProgressPanel />}
        {isShowReamingTime && <TimePanel time={remaining} />}
        {mode === 'fixed-price-NFT' && <FixedPriceIcon className="ls-action-button" />}
        {mode === 'open-bid-NFT' && <OpenBidIcon className="ls-action-button" />}
      </div>
    </LEFT_SECTION>
  )
}
