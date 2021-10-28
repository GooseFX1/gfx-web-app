import React from 'react'
import styled from 'styled-components'
import DropdowButton from '../../../layouts/App/DropDownButton'
import { colors } from '../../../theme'
import SearchBar from '../SearchBar'
import TableList from './TableList'
import Card from './Card'
import NoContent from './NoContent'

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
    margin-bottom: 33px;
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
    margin: 0 -12px;
    .card-item {
      width: 20%;
      padding: 0 12px;
      margin-bottom: 24px;
    }
  }
`
const sortButtonn = {
  width: 100,
  height: 40,
  backgroundColor: colors('lite').secondary2,
  justifyContent: 'space-between'
}

interface Props {
  type: string
  data?: Array<number>
}

const TabContent = ({ data, type }: Props) => {
  return (
    <TAB_CONTENT>
      {type === 'activity' ? (
        <TableList />
      ) : (
        <>
          <div className="actions-group">
            <div className="search-group">
              <SearchBar />
              <div className="total-result">{data && data.length > 0 ? '2,335 Items' : '0 Item'}</div>
            </div>
            <DropdowButton
              style={sortButtonn}
              title="Sort"
              options={[
                { name: 'Name', icon: 'all' },
                { name: 'Time', icon: 'art' }
              ]}
            />
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
        </>
      )}
    </TAB_CONTENT>
  )
}

export default TabContent
