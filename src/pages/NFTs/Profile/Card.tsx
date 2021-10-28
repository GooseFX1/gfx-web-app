import React from 'react'
import styled from 'styled-components'

const CARD = styled.div`
  max-width: 285px;
  border-radius: 15px;
  background: #171717;
  padding: 16px 20px;
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
    .heart-empty {
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }
    .like-count {
      color: #4b4b4b;
      font-size: 13px;
      font-weight: 600;
    }
  }
  .logo {
    position: absolute;
    bottom: 0;
    right: 0;
    .card-logo {
      width: 50px;
      height: auto;
    }
  }
`

const Card = ({ order }: { order: number }) => (
  <div className="card-item">
    <CARD>
      <img className="card-image" src={`${process.env.PUBLIC_URL}/img/assets/card-1.png`} alt="" />
      <div className="info">
        <div className="name">#0028</div>
        <div className="number">
          144pixels
          <img className="check-icon" src={`${process.env.PUBLIC_URL}/img/assets/check-icon.png`} alt="" />
        </div>
        <div className="other">2,900 SOL</div>
        <div className="like-group">
          <img className="heart-purple" src={`${process.env.PUBLIC_URL}/img/assets/heart-purple.svg`} alt="" />
          <img className="heart-empty" src={`${process.env.PUBLIC_URL}/img/assets/heart-empty.svg`} alt="" />
          <span className="like-count">{order}</span>
        </div>
        <div className="logo">
          <img className="card-logo" src={`${process.env.PUBLIC_URL}/img/assets/card-logo-1.svg`} alt="" />
        </div>
      </div>
    </CARD>
  </div>
)
export default Card
