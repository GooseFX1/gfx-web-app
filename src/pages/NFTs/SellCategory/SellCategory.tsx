import React from 'react'
import { Row, Col } from 'antd'
import styled from 'styled-components'

export const STYLED_SELL_CATEGORY = styled(Row)`
  margin-bottom: ${({ theme }) => theme.margins['3x']};

  .item-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    .item-image {
      width: 114px;
      height: 114px;
      padding: ${({ theme }) => theme.margins['3.5x']};
      background: ${({ theme }) => theme.sellTabBg};
      ${({ theme }) => theme.largeBorderRadius};
      border: 1px solid rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;
      &.active {
        border-color: #fff;
        background: ${({ theme }) => theme.sellTabActiveBg};
      }
      &:hover {
        opacity: 0.8;
        border-color: #fff;
      }
    }
    .item-text {
      margin-top: ${({ theme }) => theme.margins['1x']};
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.text8};
    }
  }
`

const dataCategories = [
  {
    icon: 'live-auction',
    name: 'Live auction'
  },
  {
    icon: 'open-bid',
    name: 'Open bid'
  },
  {
    icon: 'fixed-price',
    name: 'Fixed price'
  }
]

interface ICategory {
  category?: number
  setCategory?: (val: number) => void
}

export const SellCategory = ({ category, setCategory }: ICategory) => {
  return (
    <STYLED_SELL_CATEGORY justify="space-between">
      {dataCategories.map((item, index) => (
        <Col>
          <div className="item-wrap" onClick={() => setCategory(index)}>
            <img
              className={`${index === category ? 'active' : ''} item-image`}
              src={`/img/assets/${item?.icon}.svg`}
              alt=""
            />
            <div className="item-text">{item?.name}</div>
          </div>
        </Col>
      ))}
    </STYLED_SELL_CATEGORY>
  )
}
