import React from 'react'
import styled from 'styled-components'
import { Card } from './Card'
import { NoContent } from './NoContent'
import { SearchBar } from '../SearchBar'

const TAB_CONTENT = styled.div`
  padding: 6px 40px 22px;
  .actions-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .search-group {
    display: flex;
    align-items: center;
    > div:nth-child(1) {
      height: 43px;
      padding: 0 20px;
      background-color: #404040;
    }
    input {
      width: 277px;
      background-color: #404040;
      font-size: 14px;
    }
    .ant-image-img {
      width: 18px;
    }
  }
  .total-result {
    color: #6f6f6f;
    font-size: 17px;
    font-weight: 600;
  }
  .cards-list {
    display: flex;
    flex-wrap: wrap;
    margin: 33px -12px 0;
    .card-item {
      width: 20%;
      padding: 0 12px;
      margin-bottom: 24px;
    }
  }
`

interface Props {
  type: string
  data?: Array<number>
}

export const TabContent = ({ data, type }: Props) => {
  return (
    <TAB_CONTENT>
      <div className="actions-group">
        <div className="search-group">
          <SearchBar />
          <div className="total-result">{data && data.length > 0 ? '2,335 Items' : '0 Item'}</div>
        </div>
      </div>
      {data && data.length > 0 ? (
        <div className="cards-list">
          {data.map((n: number, index: number) => (
            <Card key={index} data={{ order: n, type: type }} />
          ))}
        </div>
      ) : (
        <NoContent type={type} />
      )}
    </TAB_CONTENT>
  )
}
