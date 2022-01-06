import { Row } from 'antd'
import styled, { css } from 'styled-components'
import { moneyFormatter } from '../../../utils'

const CARD = styled.div<{ type: string; status: string }>`
  padding-bottom: ${({ theme }) => theme.margins['1.5x']};
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
      padding: ${({ theme }) => `${theme.margins['0.5x']} ${theme.margins['1x']}`};
      background-color: #000;
      border-radius: 15px;
      font-size: 9px;
    }
  }

  .card-info {
    height: 30px;
    margin-top: ${({ theme }) => theme.margins['2x']};
    margin-bottom: ${({ theme }) => theme.margins['0.5x']};
    text-align: left;

    .card-name {
      font-size: 15px;
      font-weight: 600;
      margin-right: ${({ theme }) => theme.margins['0.5x']};
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
      margin-right: ${({ theme }) => theme.margins['0.5x']};
    }

    .card-favorite-number {
      color: #4b4b4b;
      font-size: 13px;
      font-weight: 600;
    }
  }

  ${({ type, status, theme }) => {
    switch (type) {
      case 'carousel':
        return css`
          padding: ${theme.margins['2.5x']};
          opacity: ${status === 'sold_out' ? 0.6 : 1};
          background-color: #171717;

          .card-image {
            min-width: 185x;
            max-width: 185x;
            height: 190px;
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
      case 'grid':
        return css`
          .card-image {
            width: 100%;
            height: auto;
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
        `
    }
  }}
`

const CARD_BUTTON = styled.button<{ cardType: string; cardStatus: string }>`
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

  ${({ cardType, cardStatus, theme }) => {
    switch (cardType) {
      case 'carousel':
        return css`
          background-color: ${cardStatus === 'auctioning' ? '#3735bb' : '#bb3535'};
          cursor: ${cardStatus === 'sold_out' ? 'not-allowed' : 'pointer'};
          font-size: 9px;
          padding: ${theme.margins['1x']} ${theme.margins['1.5x']};
        `
      case 'grid':
        return css`
          height: 34px;
          background-color: ${theme.primary2};
          font-size: 11px;
          font-weight: 600;
          padding: ${theme.margins['1x']} ${theme.margins['2x']};
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        `
    }
  }}
`

const getButtonText = (type: string, status: string): string => {
  switch (type) {
    case 'carousel':
      if (status === 'sold_out') return 'Sold Out'
      return 'Bid'
    case 'grid':
      return 'Buy Now'
  }
}

interface CardData {
  id: string
  thumbnail: string
  name: string
  price: number
  status: string
  hearts: number
  remaining: string
  isFeatured: boolean
  isFavorite: boolean
}

type Props = {
  type: 'carousel' | 'grid'
  className?: string
  data: CardData
}

export const Card = ({ type, data, className, ...rest }: Props) => {
  return (
    <CARD type={type} status={data.status} {...rest}>
      <div className="card-image-wrapper">
        <img className="card-image" src={`${process.env.PUBLIC_URL}/img/assets/card-1.png`} alt="" />
        <div className="card-remaining">{data.remaining}</div>
      </div>
      <div className="card-info">
        <Row justify="space-between" align="middle">
          <Row align="middle">
            <div className="card-name">{data.name}</div>
            {data.isFeatured && (
              <img
                className="card-featured-heart"
                src={`${process.env.PUBLIC_URL}/img/assets/heart-purple.svg`}
                alt=""
              />
            )}
          </Row>
          <Row align="middle">
            <Row align="middle" className="card-favorite">
              {(data.isFavorite && (
                <img
                  className="card-favorite-heart"
                  src={`${process.env.PUBLIC_URL}/img/assets/heart-red.svg`}
                  alt=""
                />
              )) || (
                <img
                  className="card-favorite-heart"
                  src={`${process.env.PUBLIC_URL}/img/assets/heart-empty.svg`}
                  alt=""
                />
              )}
              <span className={`card-favorite-number ${data.isFavorite ? 'card-favorite-number-highlight' : ''}`}>
                {data.hearts}
              </span>
            </Row>
          </Row>
        </Row>
      </div>
      <Row justify="space-between" align="middle">
        <div className="card-price">{`${moneyFormatter(data.price)} SOL`}</div>
        <CARD_BUTTON cardStatus={data.status} cardType={type}>
          {getButtonText(type, data.status)}
        </CARD_BUTTON>
      </Row>
    </CARD>
  )
}
