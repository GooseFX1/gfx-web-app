import React from 'react'
import { Row, Col } from 'antd'
import styled from 'styled-components'

export const STYLED_SELL_CATEGORY = styled(Row)`
  margin-bottom: ${({ theme }) => theme.margin(5)};

  .item-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    .item-image {
      width: 114px;
      height: 114px;
      padding: ${({ theme }) => theme.margin(3.5)};
      background: ${({ theme }) => theme.sellTabBg};
      ${({ theme }) => theme.largeBorderRadius};
      border: 1px solid transparent;
      transition: all 0.3s ease;
      opacity: 0.8;

      &.active {
        border-color: #fff;
        opacity: 1;
      }
      &:hover {
        opacity: 1;
      }
    }
    .item-text {
      margin-top: ${({ theme }) => theme.margin(1)};
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.text8};
    }
  }
`

const dataCategories = [
  {
    icon: 'fixed-price',
    name: 'Fixed price'
  }
]

interface ICategory {
  category: string
  setCategory: (val: string) => void
}

export const SellCategory = ({ category, setCategory }: ICategory) => (
  <STYLED_SELL_CATEGORY gutter={[48, 0]}>
    {dataCategories.map((item, index) => (
      <Col key={index}>
        <div className="item-wrap" onClick={() => setCategory(item.icon)}>
          <img
            className={`${item.icon === category ? 'active' : ''} item-image`}
            src={`/img/assets/${item.icon}${item.icon === category ? '-active' : ''}.svg`}
            alt={item.icon}
          />
          <div className="item-text">{item.name}</div>
        </div>
      </Col>
    ))}
  </STYLED_SELL_CATEGORY>
)
