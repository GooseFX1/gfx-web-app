import React from 'react'
import { Row, Col } from 'antd'
import styled from 'styled-components'

export const STYLED_SELL_CATEGORY = styled(Row)`
  margin-bottom: ${({ theme }) => theme.margins['3x']};

  .item-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    .item-image {
      width: 114px;
      height: 114px;
      padding: ${({ theme }) => theme.margins['3.5x']};
      background: #131313;
      ${({ theme }) => theme.largeBorderRadius};
      border: 1px solid rgba(255, 255, 255, 0.5);
      &.active {
        border-color: #fff;
      }
    }
    .item-text {
      margin-top: ${({ theme }) => theme.margins['1x']};
      font-size: 14px;
      font-weight: 600;
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

export const SellCategory = () => {
  return (
    <STYLED_SELL_CATEGORY justify="space-between">
      {dataCategories.map((item, index) => (
        <Col>
          <div className="item-wrap">
            <img
              className={`${index === 0 ? 'active' : ''} item-image`}
              src={`${process.env.PUBLIC_URL}/img/assets/${item?.icon}.svg`}
              alt=""
            />
            <div className="item-text">{item?.name}</div>
          </div>
        </Col>
      ))}
    </STYLED_SELL_CATEGORY>
  )
}
