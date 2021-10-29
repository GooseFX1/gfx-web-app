import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

const CARD = styled.div`
  max-width: 285px;
  border-radius: 15px;
  background: #171717;
  padding: 16px 20px;
  cursor: pointer;
  .card-image {
    max-width: 245px;
    width: 100%;
    height: auto;
    border-radius: 15px;
  }
  .info {
    margin-top: 12px;
    position: relative;
    text-align: left;
  }
  .name,
  .number,
  .other {
    color: #fff;
    font-size: 15px;
    font-weight: 600;
  }
  .number {
    margin-bottom: 6px;
  }
  .check-icon {
    margin-left: 5px;
    width: 14px;
    height: auto;
  }
  .like-group {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    top: -5px;
    .heart-purple {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      padding-top: 6px;
    }

    .heart-red,
    .heart-empty {
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }
    .like-count {
      color: #4b4b4b;
      font-size: 13px;
      font-weight: 600;
      line-height: 15px;
    }
  }
  .option {
    position: absolute;
    bottom: 0;
    right: 0;
    .price-group {
      display: flex;
      font-size: 12px;
      .text {
        color: #ababab;
        margin-right: 5px;
        display: inline-block;
      }
    }
    .price-number {
      margin-left: 5px;
      display: inline-block;
      color: #fff;
    }
    .price-image {
      width: 19px;
      height: auto;
    }
    .card-logo {
      width: 50px;
      height: auto;
    }
  }
`

interface CardData {
  order: number
  type?: string
}

type Props = {
  data: CardData
}

export const Card = ({ data }: Props) => {
  const history = useHistory()

  const goMyCreatedNFT = () => {
    if (data?.type !== 'created') return
    history.push('/NFTs/profile/my-created-NFT')
  }
  return (
    <div className="card-item">
      <CARD onClick={goMyCreatedNFT}>
        <img className="card-image" src={`${process.env.PUBLIC_URL}/img/assets/card-1.png`} alt="" />
        <div className="info">
          <div className="name">#0028</div>
          <div className="number">
            144pixels
            <img className="check-icon" src={`${process.env.PUBLIC_URL}/img/assets/check-icon.png`} alt="" />
          </div>
          <div className="other">2,900 SOL</div>
          <div className="like-group">
            {data?.type === 'favorited' ? (
              <img className="heart-red" src={`${process.env.PUBLIC_URL}/img/assets/heart-red.svg`} alt="" />
            ) : (
              <>
                <img className="heart-purple" src={`${process.env.PUBLIC_URL}/img/assets/heart-purple.svg`} alt="" />
                <img className="heart-empty" src={`${process.env.PUBLIC_URL}/img/assets/heart-empty.svg`} alt="" />
              </>
            )}
            <span className="like-count">{data?.order}</span>
          </div>
          <div className="option">
            {data?.type === 'favorited' ? (
              <div className="price-group">
                <span className="text">Last</span>
                <img className="price-image" src={`${process.env.PUBLIC_URL}/img/assets/price.svg`} alt="" />
                <span className="price-number">35</span>
              </div>
            ) : (
              <img className="card-logo" src={`${process.env.PUBLIC_URL}/img/assets/card-logo-1.svg`} alt="" />
            )}
          </div>
        </div>
      </CARD>
    </div>
  )
}
