import React, { useMemo, FC } from 'react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Col, Row } from 'antd'
import styled, { css } from 'styled-components'
import { moneyFormatter } from '../../../utils'
import { RightSectionTabs } from './RightSectionTabs'
import { useNFTDetails, usePriceFeedFarm } from '../../../context'
import { MintItemViewStatus } from '../../../types/nft_details'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import tw from 'twin.macro'

//#region styles
const RIGHT_SECTION = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    margin-top: 15px;

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 8px 0;
    }

    color: ${theme.text1};
    text-align: left;

    .rs-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: ${theme.margin(1)};
      color: ${theme.text7};
    }

    .rs-type {
      font-size: 14px;
      font-weight: 600;
    }

    .rs-prices {
      margin-bottom: ${theme.margin(1)};

      .rs-solana-logo {
        width: 36px;
        height: 36px;
      }

      .rs-price {
        font-size: 25px;
        font-weight: bold;
        color: ${theme.text4};
      }

      .rs-fiat {
        font-size: 14px;
        font-weight: 500;
        color: ${theme.text4};
      }

      .rs-percent {
        font-size: 11px;
        font-weight: 600;
        margin-left: ${theme.margin(0.5)};
        color: ${theme.text4};
      }
    }

    .name-icon-row {
      ${tw`sm:flex sm:flex-row sm:justify-between sm:items-center`}

      .ls-favorite-number {
        ${tw`sm:text-regular sm:ml-2`}
      }
    }

    .rs-name {
      ${tw`sm:mr-auto`}
      font-size: 22px;
      font-weight: 600;
      margin-bottom: ${theme.margin(0.5)};
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .rs-intro {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: ${theme.margin(1.5)};
      color: ${theme.text4};
      overflow-y: scroll;
      overflow-x: hidden;
      ${({ theme }) => theme.customScrollBar('4px')};
    }

    .rs-charity-text {
      font-size: 12px;
      font-weight: 600;
      max-width: 64px;
      margin-left: ${theme.margin(1.5)};
      color: ${theme.text4};
    }
  `}
`
//#endregion

export const RightSection: FC<{
  status: MintItemViewStatus
}> = ({ status, ...rest }) => {
  const { general, nftMetadata, curHighestBid, ask } = useNFTDetails()
  const { prices } = usePriceFeedFarm()

  const price: number | null = useMemo(() => {
    if (ask) {
      return parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL
    } else {
      return curHighestBid ? parseFloat(curHighestBid.buyer_price) / LAMPORTS_PER_SOL : null
    }
  }, [curHighestBid, ask])

  const marketData = useMemo(() => prices['SOL/USDC'], [prices])

  const fiat = `${marketData && price ? (marketData.current * price).toFixed(3) : ''} USD`
  const isForCharity = false

  if (nftMetadata === null) {
    return <div>Error loading metadata</div>
  }

  const isLoading = nftMetadata === undefined || general === undefined

  return (
    <RIGHT_SECTION {...rest}>
      {isLoading ? (
        <>
          <SkeletonCommon width="100%" height="75px" borderRadius="10px" />
          <br />
        </>
      ) : (
        <div className="price-row">
          <Row justify="space-between">
            <Col className="rs-title">
              {price ? `Current ${ask ? 'Asking Price' : 'Bid'}` : 'No Current Bids'}{' '}
            </Col>
          </Row>
          {price && (
            <Row align="middle" gutter={8} className="rs-prices">
              <Col>
                <img className="rs-solana-logo" src={`/img/assets/solana-logo.png`} alt="" />
              </Col>
              <Col className="rs-price">{`${moneyFormatter(price)} SOL`}</Col>
              <Col>
                <span className="rs-fiat">{`${fiat}`}</span>
              </Col>
            </Row>
          )}
        </div>
      )}

      {isLoading ? (
        <>
          <SkeletonCommon width="100%" height="75px" borderRadius="10px" />
          <br />
        </>
      ) : (
        <Row justify="space-between" align="middle">
          <Col span={24}>
            <div className="name-icon-row">
              <div className="rs-name">{general?.nft_name || nftMetadata?.name}</div>
              {/* {checkMobile() && general.uuid ? (
                <>
                  {sessionUser && isFavorited ? (
                    <img
                      className="ls-favorite-heart"
                      src={`/img/assets/heart-red.svg`}
                      alt="heart-red"
                      onClick={handleToggleLike}
                      height="23px"
                      width="25px"
                    />
                  ) : (
                    <img
                      className="ls-favorite-heart"
                      src={`/img/assets/heart-empty.svg`}
                      alt="heart-empty"
                      onClick={handleToggleLike}
                      height="23px"
                      width="25px"
                    />
                  )}
                  <span className={`ls-favorite-number ${isFavorited ? 'ls-favorite-number-highlight' : ''}`}>
                    {likes}
                  </span>
                </>
              ) : (
                <></>
              )} */}
            </div>
            <div className="rs-intro">{nftMetadata.description}</div>
          </Col>
          <Col span={24}>
            {isForCharity && (
              <Row align="middle" wrap={false}>
                <img src={`/img/assets/heart-charity.svg`} alt="charity-icon" style={{ marginRight: '12px' }} />
                <div className="rs-charity-text">Auction for charity</div>
              </Row>
            )}
          </Col>
        </Row>
      )}
      {/* {isLoading ? (
        <SkeletonCommon width="100%" height="300px" borderRadius="10px" />
      ) : !checkMobile() ? (
        <GRID_INFO justify="space-between">
          <Col className="gi-item">
            <div className="gi-item-category-title">Creator</div>
            <Row align="middle">
              <div className="gi-item-thumbnail-wrapper">
                <img className="gi-item-thumbnail" src="https://placeimg.com/30/30" alt="" />
                <img className="gi-item-check-icon" src={`/img/assets/check-icon.svg`} alt="" />
              </div>
              <div className="gi-item-title">{creator}</div>
            </Row>
          </Col>
          {nftMetadata.collection && (
            <Col className="gi-item">
              <div className="gi-item-category-title">Collection</div>
              <Row align="middle">
                <img className="gi-item-thumbnail" src="https://placeimg.com/30/30" alt="" />
                <div className="gi-item-title">
                  {Array.isArray(nftMetadata.collection)
                    ? nftMetadata.collection[0].name
                    : nftMetadata.collection.name}
                </div>
              </Row>
            </Col>
          )}
          <Col className="gi-item">
            <div className="gi-item-category-title">Category</div>
            <Row align="middle">
              <div className="gi-item-icon">
                <img
                  src={`/img/assets/${
                    nftMetadata.properties.category === 'image' ? 'art' : nftMetadata.properties.category
                  }.svg`}
                  alt=""
                />
              </div>
              <div className="gi-item-title">{nftMetadata.properties.category}</div>
            </Row>
          </Col>
        </GRID_INFO>
      ) : (
        <ROW_CONTAINER>
          <div className="gi-item">
            <div className="gi-item-category-title">Created by:</div>
            <div className="gi-item-thumbnail-wrapper">
              <img className="gi-item-thumbnail" src="https://placeimg.com/30/30" alt="" />
              <img className="gi-item-check-icon" src={`/img/assets/check-icon.svg`} alt="" />
              <div className="gi-item-title">{creator}</div>
            </div>
          </div>
          {nftMetadata.collection && (
            <div className="gi-item">
              <div className="gi-item-category-title">Collection</div>
              <div className="gi-item-thumbnail-wrapper">
                <img className="gi-item-thumbnail" src="https://placeimg.com/30/30" alt="" />
                <div className="gi-item-title">
                  {Array.isArray(nftMetadata.collection)
                    ? nftMetadata.collection[0].name
                    : nftMetadata.collection.name}
                </div>
              </div>
            </div>
          )}
          <div className="gi-item">
            <div className="gi-item-category-title">Category</div>
            <div className="gi-item-thumbnail-wrapper">
              <div className="gi-item-icon">
                <img
                  src={`/img/assets/${
                    nftMetadata.properties.category === 'image' ? 'art' : nftMetadata.properties.category
                  }.svg`}
                  alt=""
                />
              </div>
              <div className="gi-item-title">{nftMetadata.properties.category}</div>
            </div>
          </div>
        </ROW_CONTAINER>
      )} */}

      <RightSectionTabs status={status} />
    </RIGHT_SECTION>
  )
}
