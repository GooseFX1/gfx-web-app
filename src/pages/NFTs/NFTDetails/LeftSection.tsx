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
  const { general, nftMetadata, totalLikes } = useNFTDetails()
  const [isFavorited, setIsFavorited] = useState(false)
  const { sessionUser, likeDislike } = useNFTProfile()
  const [likes, setLikes] = useState(totalLikes)

  //const hearts = 12
  const remaining = {
    days: '10',
    hours: '2',
    minutes: '43'
  }

  useEffect(() => {
    if (general && sessionUser) {
      setIsFavorited(sessionUser.user_likes.includes(general.non_fungible_id))
    }
  }, [sessionUser])

  const handleToggleLike = (e: any) => {
    likeDislike(sessionUser.user_id, general.non_fungible_id).then((res) => {
      setLikes((prev) => (isFavorited ? prev - 1 : prev + 1))
    })
    setIsFavorited((prev) => !prev)
  }

  const isShowReamingTime = mode === 'my-created-NFT' || mode === 'live-auction-NFT'

  return (
    <LEFT_SECTION {...rest}>
      <img className="ls-image" src={general?.image_url || nftMetadata?.image} alt="" />
      <div className="ls-bottom-panel">
        <Row justify={mode !== 'mint-item-view' ? 'space-between' : 'start'} align="middle" className="ls-favorite">
          <Col>{isShowReamingTime && <div className="ls-end-text">Auction ends in:</div>}</Col>
          {mode !== 'mint-item-view' && (
            <Row align="middle">
              {sessionUser && sessionUser.user_id && isFavorited ? (
                <img
                  className="ls-favorite-heart"
                  src={`/img/assets/heart-red.svg`}
                  alt="heart-red"
                  onClick={handleToggleLike}
                />
              ) : (
                <img
                  className="ls-favorite-heart"
                  src={`/img/assets/heart-empty.svg`}
                  alt="heart-empty"
                  onClick={handleToggleLike}
                />
              )}
              <span className={`ls-favorite-number ${isFavorited ? 'ls-favorite-number-highlight' : ''}`}>{likes}</span>
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
