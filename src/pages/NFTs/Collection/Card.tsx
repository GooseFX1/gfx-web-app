import { Row } from 'antd'
import styled, { css } from 'styled-components'
import { moneyFormatter } from '../../../utils'
import { ISingleNFT } from '../../../types/nft_details.d'

const CARD = styled.div<{ status: string }>`
  padding-bottom: ${({ theme }) => theme.margin(1.5)};
  border-radius: 15px;
  cursor: pointer;

  .card-image-wrapper {
    position: relative;
    width: fit-content;
    margin: 0 auto;

    .card-image {
      object-fit: contain;
      border-radius: 15px;
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
      font-size: 15px;
      font-weight: 600;
      margin-right: ${({ theme }) => theme.margin(0.5)};
      font-family: Montserrat;
    }

    .card-price {
      margin-bottom: 6px;
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

  ${({ status, theme }) => {
    return css`
      padding: ${theme.margin(2.5)};
      opacity: ${status === 'sold_out' ? 0.6 : 1};
      background-color: #171717;

      .card-image {
        width: 100%;
        height: 190px;
      }

      .card-remaining {
        display: none;
      }

      .card-name {
        color: ${({ theme }) => theme.text7};
      }

      .card-price {
        color: ${({ theme }) => theme.text8};
      }

      .card-name {
        font-size: 16px;
      }

      .card-price {
        font-size: 15px;
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

      .card-name,
      .card-price,
      .card-remaining {
        color: ${theme.white};
      }

      .card-info .card-favorite-number-highlight {
        color: ${({ theme }) => theme.white};
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
}

export const Card = ({ singleNFT, tab, className, ...rest }: Props) => {
  const localNFT = {
    ...singleNFT,
    price: 1499,
    status: 'auctioning',
    hearts: 0,
    remaining: '02d:20h:10min',
    isFeatured: false,
    isFavorite: false
  }

  return (
    <CARD status={localNFT.status} {...rest}>
      <div className="card-image-wrapper">
        <img className="card-image" src={localNFT.image_url} alt="" />
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
              {(localNFT.isFavorite && (
                <img className="card-favorite-heart" src={`/img/assets/heart-red.svg`} alt="" />
              )) || <img className="card-favorite-heart" src={`/img/assets/heart-empty.svg`} alt="" />}
              <span className={`card-favorite-number ${localNFT.isFavorite ? 'card-favorite-number-highlight' : ''}`}>
                {localNFT.hearts}
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
