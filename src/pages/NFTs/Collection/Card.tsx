import { Row, Image } from 'antd'
import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { moneyFormatter } from '../../../utils'
import { ISingleNFT } from '../../../types/nft_details.d'
import { useNFTDetails } from '../../../context'

const CARD = styled.div<{ status: string }>`
  padding-bottom: ${({ theme }) => theme.margin(1.5)};
  border-radius: 15px;
  cursor: pointer;

  .card-image-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    width: fit-content;
    min-width: 190px;
    margin: 0 auto;

    .ant-image-mask {
      display: none;
    }
    .card-image {
      object-fit: contain;
      border-radius: 15px;
      width: 100%;
      height: 190px;
    }

    .card-remaining {
      position: absolute;
      right: 10px;
      bottom: 7px;
      padding: ${({ theme }) => `${theme.margin(0.5)} ${theme.margin(1)}`};
      background-color: #000;
      border-radius: 15px;
      font-size: 9px;
    }
  }

  .card-info {
    height: 30px;
    margin-top: ${({ theme }) => theme.margin(2)};
    margin-bottom: ${({ theme }) => theme.margin(0.5)};
    text-align: left;

    .card-name {
      font-size: 16px;
      font-weight: 600;
      color: ${({ theme }) => theme.text2};
      margin-right: ${({ theme }) => theme.margin(0.5)};
      font-family: Montserrat;
    }

    .card-featured-heart {
      width: 30px;
      height: 30px;
      transform: translateY(4px);
    }

    .card-favorite-heart {
      margin-right: ${({ theme }) => theme.margin(0.5)};
    }

    .card-favorite-number {
      color: #4b4b4b;
      font-size: 13px;
      font-weight: 600;
    }
  }

  .card-price {
    margin-bottom: 6px;
    color: ${({ theme }) => theme.text2} !important;
  }

  ${({ status, theme }) => {
    return css`
      padding: ${theme.margin(2.5)};
      opacity: ${status === 'sold_out' ? 0.6 : 1};
      background-color: ${({ theme }) => theme.bg3};

      .card-remaining {
        display: none;
      }

      .card-info .card-favorite-number-highlight {
        color: ${({ theme }) => theme.text1};
      }

      .card-info .card-favorite-number {
        color: ${({ theme }) => theme.text10};
      }

      .card-info .card-favorite-heart {
        filter: ${({ theme }) => theme.filterHeartIcon};
      }

      .card-favorite {
        display: ${status === 'sold_out' ? 'none' : 'inline-block'};
      }
    `
  }}
`

const CARD_BUTTON = styled.button<{ cardStatus: string }>`
  min-width: 76px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 50px;
  color: ${({ theme }) => theme.white};
  font-family: Montserrat;

  &:hover {
    opacity: 0.8;
  }

  ${({ cardStatus, theme }) => {
    return css`
      height: 34px;
      background-color: ${cardStatus === 'sold_out' ? '#bb3535' : '#3735bb'};
      cursor: ${cardStatus === 'sold_out' ? 'not-allowed' : 'pointer'};
      font-size: 11px;
      font-weight: 600;
      padding: ${theme.margin(1)} ${theme.margin(2)};
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    `
  }}
`

const getButtonText = (status: string, tabType: string): string => {
  switch (tabType) {
    case 'bid':
    case 'auction':
      if (status === 'sold_out') return 'Sold Out'
      return 'Bid'
    case 'fixed':
      if (status === 'sold_out') return 'Sold Out'
      return 'Buy Now'
    default:
      return 'Bid'
  }
}

type Props = {
  className?: string
  singleNFT: ISingleNFT
  tab?: string
  userId?: number
}

export const Card = ({ singleNFT, tab, className, userId, ...rest }: Props) => {
  const localNFT = {
    ...singleNFT,
    price: 1499,
    status: 'auctioning',
    hearts: 0,
    remaining: '02d:20h:10min',
    isFeatured: false,
    isFavorite: false
  }
  const { likeDislike, getLikesNFT } = useNFTDetails()
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const { non_fungible_id, collection_id } = singleNFT

  useEffect(() => {
    getLikesNFT(userId, non_fungible_id).then((res) => {
      let nftLiked = res.filter((k: any) => k.non_fungible_id == non_fungible_id && k.collection_id == collection_id)
      setLikes(nftLiked?.length)
      if (nftLiked.length > 0) {
        setLiked(true)
      } else {
        setLiked(false)
      }
    })
  }, [liked])

  return (
    <CARD status={localNFT.status} {...rest}>
      <div className="card-image-wrapper">
        <Image
          fallback={`${window.origin}/img/assets/nft-preview.svg`}
          className="card-image"
          src={localNFT ? localNFT.image_url : ''}
          alt="nft"
        />
        <div className="card-remaining">{localNFT.remaining}</div>
      </div>
      <div className="card-info">
        <Row justify="space-between" align="middle">
          <Row align="middle">
            <div className="card-name">{localNFT.nft_name}</div>
            {localNFT.isFeatured && <img className="card-featured-heart" src={`/img/assets/heart-purple.svg`} alt="" />}
          </Row>
          <Row align="middle">
            <Row align="middle" className="card-favorite">
              {localNFT.isFavorite ? (
                <img
                  className="card-favorite-heart"
                  src={`/img/assets/heart-red.svg`}
                  alt=""
                  onClick={() => {
                    likeDislike(userId, non_fungible_id)
                    setLiked(false)
                  }}
                />
              ) : (
                <img
                  className="card-favorite-heart"
                  src={`/img/assets/heart-empty.svg`}
                  alt=""
                  onClick={() => {
                    likeDislike(userId, non_fungible_id)
                    setLiked(true)
                  }}
                />
              )}
              <span className={`card-favorite-number ${localNFT.isFavorite ? 'card-favorite-number-highlight' : ''}`}>
                {likes}
              </span>
            </Row>
          </Row>
        </Row>
      </div>
      <Row justify="space-between" align="middle">
        <div className="card-price">{`${moneyFormatter(localNFT.price)} SOL`}</div>
        <CARD_BUTTON cardStatus={localNFT.status}>{getButtonText(localNFT.status, tab)}</CARD_BUTTON>
      </Row>
    </CARD>
  )
}
