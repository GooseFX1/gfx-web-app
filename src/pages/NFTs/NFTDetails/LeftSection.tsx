import { Col, Row } from 'antd'
import { FC } from 'react'
import styled, { css } from 'styled-components'
import { useNFTDetails } from '../../../context'
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
      box-shadow: 4px 4px 12px 4px rgb(0 0 0 / 40%);
    }

    .ls-bottom-panel {
      margin-top: ${theme.margins['2.5x']};

      .ls-end-text {
        font-size: 12px;
        font-weight: 600;
        color: ${theme.text7};
      }

      .ls-favorite {
        margin-bottom: ${theme.margins['2x']};
      }

      .ls-favorite-heart {
        width: 21px;
        height: 21px;
        margin-right: ${theme.margins['0.5x']};
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
  const { general } = useNFTDetails()
  const isFavorite = true
  const hearts = 12
  const remaining = {
    days: '10',
    hours: '2',
    minutes: '43'
  }

  const isShowReamingTime = mode === 'my-created-NFT' || mode === 'live-auction-NFT'

  return (
    <LEFT_SECTION {...rest}>
      <img className="ls-image" src={general.image_url} alt="" />
      <div className="ls-bottom-panel">
        <Row justify={mode !== 'mint-item-view' ? 'space-between' : 'start'} align="middle" className="ls-favorite">
          <Col>{isShowReamingTime && <div className="ls-end-text">Auction ends in:</div>}</Col>
          {mode !== 'mint-item-view' && (
            <Row align="middle">
              {(isFavorite && (
                <img className="ls-favorite-heart" src={`${process.env.PUBLIC_URL}/img/assets/heart-red.svg`} alt="" />
              )) || (
                <img
                  className="ls-favorite-heart"
                  src={`${process.env.PUBLIC_URL}/img/assets/heart-empty.svg`}
                  alt=""
                />
              )}
              <span className={`ls-favorite-number ${isFavorite ? 'ls-favorite-number-highlight' : ''}`}>{hearts}</span>
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
