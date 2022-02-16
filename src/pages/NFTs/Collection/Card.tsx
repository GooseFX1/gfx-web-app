import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { Row, Image } from 'antd'
import styled, { css } from 'styled-components'
import { moneyFormatter } from '../../../utils'
import { ISingleNFT } from '../../../types/nft_details.d'
import { useNFTProfile, useNFTCollections, useNFTDetails } from '../../../context'

//#region styles
const CARD = styled.div<{ status: string }>`
  padding-bottom: ${({ theme }) => theme.margin(1.5)};
  border-radius: 15px;
  cursor: pointer;
  width: 226px;

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
    position: relative;
    height: 30px;
    margin-top: ${({ theme }) => theme.margin(2)};
    margin-bottom: ${({ theme }) => theme.margin(0.5)};
    text-align: left;

    .card-name {
      font-size: 16px;
      font-weight: 600;
      color: ${({ theme }) => theme.text2};
      font-family: Montserrat;
      width: calc(100% - 20px);
      ${({ theme }) => theme.ellipse}
    }

    .card-favorite-heart-container {
      position: absolute;
      top: 0;
      right: 0;
    }

    .card-featured-heart {
      width: 30px;
      height: 30px;
      transform: translateY(4px);
    }

    .card-favorite-number {
      color: #4b4b4b;
      font-size: 13px;
      font-weight: 600;
    }
  }

  .card-price {
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
//#endregion

type Props = {
  className?: string
  singleNFT: ISingleNFT
  listingType?: string
  userId?: number
}

export const Card = ({ singleNFT, listingType, className, userId, ...rest }: Props) => {
  const history = useHistory()
  const localNFT = {
    ...singleNFT,
    price: 1499,
    status: 'auctioning',
    hearts: 0,
    remaining: '02d:20h:10min',
    isFeatured: false,
    isFavorite: false
  }
  const { sessionUser, likeDislike } = useNFTProfile()
  const [isFavorite, setIsFavorited] = useState(false)
  const { non_fungible_id } = singleNFT

  useEffect(() => {
    if (singleNFT && sessionUser) {
      setIsFavorited(sessionUser.user_likes.includes(non_fungible_id))
    }
  }, [sessionUser])

  const handleToggleLike = (e: any) => {
    likeDislike(sessionUser.user_id, non_fungible_id).then((res) => {
      console.log(res)
    })
    setIsFavorited((prev) => !prev)
  }

  const goToDetails = (id: number): void => {
    switch (listingType) {
      case 'bid':
        history.push(`/NFTs/open-bid/${id}`)
        break
      case 'fixed':
        history.push(`/NFTs/fixed-price/${id}`)
        break
      default:
        break
    }
  }

  const getButtonText = (status: string, listingType: string): string => {
    switch (listingType) {
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

  return (
    <CARD status={localNFT.status} {...rest} className="card">
      <div className="card-image-wrapper" onClick={(e) => goToDetails(non_fungible_id)}>
        <Image
          fallback={`${window.origin}/img/assets/nft-preview.svg`}
          className="card-image"
          src={localNFT ? localNFT.image_url : ''}
          alt="nft"
        />
        <div className="card-remaining">{localNFT.remaining}</div>
      </div>
      <div className="card-info">
        <div className="card-name">{localNFT.nft_name}</div>
        {sessionUser && sessionUser.user_id && (
          <span className="card-favorite-heart-container">
            {isFavorite ? (
              <img
                className="card-favorite-heart"
                src={`/img/assets/heart-red.svg`}
                alt="heart-selected"
                onClick={handleToggleLike}
              />
            ) : (
              <img
                className="card-favorite-heart"
                src={`/img/assets/heart-empty.svg`}
                alt="heart-empty"
                onClick={handleToggleLike}
              />
            )}
            {/* <span className={`card-favorite-number ${isFavorite ? 'card-favorite-number-highlight' : ''}`}>
                  {likes}
                </span> */}
          </span>
        )}
      </div>
      <Row justify="space-between" align="middle">
        <div className="card-price">{`${moneyFormatter(localNFT.price)} SOL`}</div>
        <CARD_BUTTON cardStatus={localNFT.status} onClick={(e) => goToDetails(non_fungible_id)}>
          {getButtonText(localNFT.status, listingType)}
        </CARD_BUTTON>
      </Row>
    </CARD>
  )
}
