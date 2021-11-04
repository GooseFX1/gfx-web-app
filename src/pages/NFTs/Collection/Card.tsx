import { Row } from 'antd'
import styled from 'styled-components'
import { moneyFormatter } from '../../../utils'

const CARD = styled.div<{ status: string }>`
  padding: ${({ theme }) => theme.margins['2.5x']};
  padding-bottom: ${({ theme }) => theme.margins['1.5x']};
  border-radius: 15px;
  background-color: #171717;
  cursor: pointer;
  opacity: ${({ status }) => (status === 'sold_out' ? 0.6 : 1)};

  .card-image-wrapper {
    position: relative;
    width: fit-content;
    margin: 0 auto;

    .card-image {
      min-width: 185x;
      max-width: 185x;
      height: 190px;
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
  }
`

const CARD_BUTTON = styled.button<{ status: string }>`
  padding: ${({ theme }) => `${theme.margins['1x']} ${theme.margins['1.5x']}`};
  background-color: ${({ status }) => {
    switch (status) {
      case 'auctioning':
        return '#3735bb'
      case 'sold_out':
        return '#bb3535'
    }
  }};
  min-width: 76px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 50px;
  font-size: 9px;
  cursor: ${({ status }) => (status === 'sold_out' ? 'not-allowed' : 'pointer')};

  &:hover {
    opacity: 0.8;
  }
`

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

export const Card = ({ data, className, ...rest }: Props) => {
  return (
    <CARD status={data.status} {...rest}>
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
            {data.status !== 'sold_out' && (
              <Row align="middle">
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
                <span className="like-count">{data.hearts}</span>
              </Row>
            )}
          </Row>
        </Row>
      </div>
      <Row justify="space-between" align="middle">
        <div className="card-price">{`${moneyFormatter(data.price)} SOL`}</div>
        <CARD_BUTTON status={data.status}>{`${data.status === 'sold_out' ? 'Sold Out' : 'Bid'}`}</CARD_BUTTON>
      </Row>
    </CARD>
  )
}
