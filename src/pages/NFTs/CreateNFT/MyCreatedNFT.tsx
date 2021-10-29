import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { PopupEditMyCreatedNFT } from './PopupEditMyCreatedNFT'

const MY_CREATED_NFT = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 71px 89px;
  text-align: left;
  max-width: 1250px;
  background-color: #2a2a2a;
  position: relative;
  border-radius: 20px;
  .back-icon {
    position: absolute;
    top: 35px;
    left: 35px;
    transform: rotate(90deg);
    width: 18px;
    filter: invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%);
    cursor: pointer;
  }
  .width-50 {
    width: 50%;
  }
  .block-left {
    padding-right: 89px;
    .my-created-NFT-image {
      width: 100%;
      height: auto;
    }
    .heading {
      margin: 15px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 12px;
        font-weight: 600;
        color: #fff;
      }
      .liked {
        display: flex;
        align-items: center;
        .heart-empty {
          width: 24px;
          height: auto;
        }
        .liked-count {
          font-size: 18px;
          font-weight: 600;
          color: #636363;
          margin-left: 5px;
          display: inline-block;
        }
      }
    }
    .countdown {
      height: 75px;
      background: #131313;
      padding: 0 36px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      .unit {
        & + .unit {
          margin-left: 60px;
        }
      }
      .number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: inline-block;
        font-size: 18px;
        font-weight: 500;
        color: #fff;
        background: #000;
        line-height: 40px;
        text-align: center;
        margin-right: 5px;
      }
      .text {
        font-size: 12px;
        font-weight: 600;
        color: #fff;
      }
    }
  }
  .block-right {
    padding-left: 89px;
    .heading {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      .text-1 {
        font-size: 18px;
        font-weight: 600;
        color: #fff;
      }
      .text-2 {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }
    }
    .price-group {
      display: flex;
      align-items: center;
      margin-bottom: 14px;
      .price-sol-image {
        width: 32px;
        height: 32px;
        margin-right: 11px;
      }
      .price {
        font-size: 25px;
        font-weight: bold;
        color: #fff;
        margin-right: 11px;
      }
      .price-usd {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        margin-right: 11px;
      }
      .progress-image {
        width: 14px;
        height: auto;
        margin-right: 8px;
      }
      .percent {
        font-size: 11px;
        font-weight: 600;
        color: #fff;
      }
    }
    .title {
      margin-bottom: 6px;
      font-size: 22px;
      font-weight: 600;
      color: #fff;
    }
    .description {
      font-size: 12px;
      font-weight: 500;
      color: #fff;
      margin-bottom: 14px;
    }
    .collection-group {
      display: flex;
      align-items: center;
      margin-bottom: 18px;
      .item {
        margin-right: 40px;
        .image {
          display: flex;
          align-items: center;
          .name {
            font-size: 14px;
            font-weight: 500;
            color: #fff;
          }
        }
        .collect-image {
          border-radius: 50%;
          width: 30px;
          height: 30px;
          margin-right: 7px;
        }
      }
      .title {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
      }
    }
    .table-info {
      background: #131313;
      border-radius: 20px;
      .list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        background: #000;
        border-radius: 20px 20px 25px 25px;
        padding: 22px 23px 34px 23px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        .info-item {
          & + .info-item {
            margin-left: 57px;
          }
        }
      }
      .content {
        padding: 10px 23px;
        .content-row {
          display: flex;
          justify-content: space-around;
          width: 100%;
          & + .content-row {
            margin-top: 10px;
          }
          .text-1 {
            font-size: 14px;
            font-weight: 500;
            color: #fff;
            text-align: left;
            width: 50%;
          }
          .text-2 {
            font-size: 14px;
            font-weight: 500;
            color: #949494;
            width: 50%;
            text-align: right;
          }
        }
      }
      .actions {
        background: rgba(64, 64, 64, 0.22);
        border-radius: 0 0 20px 20px;
        padding: 16px 23px 12px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .btn-edit {
          border: none;
          width: calc(100% - 70px);
          height: 60px;
          line-height: 60px;
          border-radius: 29px;
          background-color: #3735bb;
          font-size: 17px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
        }
        .share-link {
          display: inline-block;
          margin-left: 10px;
          .share-image {
            width: 60px;
            height: 60px;
          }
        }
      }
    }
  }
`

export const MyCreatedNFT = () => {
  const history = useHistory()
  const [visible, setVisible] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)
  return (
    <MY_CREATED_NFT>
      <img
        className="back-icon"
        src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`}
        alt=""
        onClick={() => history.push('/NFTs/profile')}
      />
      <div className="block-left width-50">
        <img className="my-created-NFT-image" src={`${process.env.PUBLIC_URL}/img/assets/my-created-NFT.png`} alt="" />
        <div className="heading">
          <div className="title">Auction ends in:</div>
          <div className="liked">
            <img className="heart-empty" src={`${process.env.PUBLIC_URL}/img/assets/heart-empty.svg`} alt="" />
            <span className="liked-count">7</span>
          </div>
        </div>
        <div className="countdown">
          <div className="unit days">
            <span className="number">03</span>
            <span className="text">Days</span>
          </div>
          <div className="unit hours">
            <span className="number">11</span>
            <span className="text">Hours</span>
          </div>
          <div className="unit minutes">
            <span className="number">11</span>
            <span className="text">Minutes</span>
          </div>
        </div>
      </div>
      <div className="block-right width-50">
        <div className="heading">
          <span className="text-1">Current Bid:</span>
          <span className="text-2">Created By You</span>
        </div>
        <div className="price-group">
          <img className="price-sol-image" src={`${process.env.PUBLIC_URL}/img/assets/price.svg`} alt="" />
          <span className="price">35 SOL</span>
          <span className="price-usd">35 SOL</span>
          <img className="progress-image" src={`${process.env.PUBLIC_URL}/img/assets/progress.svg`} alt="" />
          <span className="percent">+1.15%</span>
        </div>
        <div className="title">Ethernal #03</div>
        <div className="description">
          Etheranl is a collection of 1/1 beautifull abstract pieces taken from the mind Jackson Pollock.
        </div>
        <div className="collection-group">
          <div className="item">
            <div className="title">Creator</div>
            <div className="image">
              <img className="collect-image" src="https://placeimg.com/30/30" alt="" />
              <span className="name">yeoohr</span>
            </div>
          </div>
          <div className="item">
            <div className="title">Collection</div>
            <div className="image">
              <img className="collect-image" src="https://placeimg.com/30/30" alt="" />
              <span className="name">Ethernal</span>
            </div>
          </div>
          <div className="item">
            <div className="title">Category</div>
            <div className="image">
              <img className="collect-image" src="https://placeimg.com/30/30" alt="" />
              <span className="name">Art</span>
            </div>
          </div>
        </div>
        <div className="table-info">
          <div className="list">
            <div className="info-item">Details</div>
            <div className="info-item">Trading History</div>
            <div className="info-item">Attributes</div>
          </div>
          <div className="content">
            <div className="content-row">
              <span className="text-1">Mint address</span>
              <span className="text-2">uHT2....4s6</span>
            </div>
            <div className="content-row">
              <span className="text-1">Token address</span>
              <span className="text-2">QWRA2a...JK5</span>
            </div>
            <div className="content-row">
              <span className="text-1">Owner</span>
              <span className="text-2">CY5ui...WE4</span>
            </div>
            <div className="content-row">
              <span className="text-1">Artist Royalties</span>
              <span className="text-2">5.5%</span>
            </div>
            <div className="content-row">
              <span className="text-1">Transaction Fee</span>
              <span className="text-2">2%</span>
            </div>
          </div>
          <div className="actions">
            <button className="btn-edit" onClick={() => setVisible(true)}>
              Edit NFT
            </button>
            <a className="share-link" href="/share">
              <img className="share-image" src={`${process.env.PUBLIC_URL}/img/assets/share.svg`} alt="" />
            </a>
          </div>
        </div>
      </div>
      <PopupEditMyCreatedNFT visible={visible} handleOk={handleOk} handleCancel={handleCancel} />
    </MY_CREATED_NFT>
  )
}
