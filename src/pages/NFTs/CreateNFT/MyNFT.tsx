import React from 'react'
import { useHistory } from 'react-router-dom'
import { PopupEditMyCreatedNFT } from './PopupEditMyCreatedNFT'
import { StyledMyNFT } from './MyNFT.styled'

type TableItem = {
  title: string
  content: string
}
type DataMyNFT = {
  src: string
  title: string
  likedCount: string
  days: string
  hours: string
  minutes: string
  type: string
  price: string
  priceUSD: string
  percent: string
  subTitle: string
  description: string
  creator: {
    image: string
    name: string
  }
  collection: {
    image: string
    name: string
  }
  category: {
    image: string
    name: string
  }
  table: Array<TableItem>
}
interface Props {
  visible: boolean
  setVisible: (value: boolean) => void
  handleOk: () => void
  handleCancel: () => void
  backUrl: string
  data: DataMyNFT
}

export const MyNFT = ({ visible, setVisible, handleCancel, handleOk, backUrl, data }: Props) => {
  const history = useHistory()
  return (
    <StyledMyNFT>
      <img
        className="back-icon"
        src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`}
        alt=""
        onClick={() => history.push(backUrl)}
      />
      <div className="block-left width-50">
        <img className="my-created-NFT-image" src="https://placeimg.com/465/465" alt="" />
        <div className="heading">
          <div className="title">{data?.title}</div>
          <div className="liked">
            <img className="heart-empty" src={`${process.env.PUBLIC_URL}/img/assets/heart-empty.svg`} alt="" />
            <span className="liked-count">{data.likedCount}</span>
          </div>
        </div>
        <div className="countdown">
          <div className="unit days">
            <span className="number">{data.days}</span>
            <span className="text">Days</span>
          </div>
          <div className="unit hours">
            <span className="number">{data.hours}</span>
            <span className="text">Hours</span>
          </div>
          <div className="unit minutes">
            <span className="number">{data.minutes}</span>
            <span className="text">Minutes</span>
          </div>
        </div>
      </div>
      <div className="block-right width-50">
        <div className="heading">
          <span className="text-1">Current Bid:</span>
          <span className="text-2">{data.type}</span>
        </div>
        <div className="price-group">
          <img className="price-sol-image" src={`${process.env.PUBLIC_URL}/img/assets/price.svg`} alt="" />
          <span className="price">{data.price}</span>
          <span className="price-usd">{data.priceUSD}</span>
          <img className="progress-image" src={`${process.env.PUBLIC_URL}/img/assets/progress.svg`} alt="" />
          <span className="percent">{data.percent}</span>
        </div>
        <div className="title">{data.subTitle}</div>
        <div className="description">{data.description}</div>
        <div className="collection-group">
          <div className="item">
            <div className="title">Creator</div>
            <div className="image">
              <img className="collect-image" src={data?.creator?.image} alt="" />
              <span className="name">{data?.creator?.name}</span>
            </div>
          </div>
          <div className="item">
            <div className="title">Collection</div>
            <div className="image">
              <img className="collect-image" src={data?.collection?.image} alt="" />
              <span className="name">{data?.collection?.name}</span>
            </div>
          </div>
          <div className="item">
            <div className="title">Category</div>
            <div className="image">
              <img className="collect-image" src={data?.category?.image} alt="" />
              <span className="name">{data?.category?.name}</span>
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
            {data?.table?.length > 0 &&
              data.table.map((item) => (
                <div className="content-row">
                  <span className="text-1">{item.title}</span>
                  <span className="text-2">{item.content}</span>
                </div>
              ))}
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
    </StyledMyNFT>
  )
}
