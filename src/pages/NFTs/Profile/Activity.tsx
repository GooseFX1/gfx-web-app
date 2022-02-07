import React, { useState, useEffect } from 'react'
import { StyledTableList } from './TableList.styled'

import NoContent from './NoContent'
import { SearchBar, Loader } from '../../../components'
import { StyledTabContent } from './TabContent.styled'
// import { INFTMetadata } from '../../../types/nft_details.d'

export const columns = [
  {
    title: 'Event',
    dataIndex: 'event',
    key: 'event',
    render: (text) => <span className="text-normal">{text}</span>
  },
  {
    title: 'Item',
    dataIndex: 'item',
    key: 'item',
    render: (record) => (
      <div className="item">
        <img className="image" src={`/img/assets/card-1.png`} alt="" />
        <div className="text">
          <div className="text-name">{record?.name}</div>
          <div className="text-other">{record?.other}</div>
        </div>
      </div>
    )
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: '22%',
    render: (price) => (
      <div className="price-wrap">
        <img className="image" src={`/img/assets/price.svg`} alt="" />
        <span className="price">{price}</span>
      </div>
    )
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (text) => <span className="text-normal">{text}</span>
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    render: (text) => <span className="from">{text}</span>
  },
  {
    title: 'To',
    dataIndex: 'to',
    key: 'to',
    render: (text) => <span className="from">{text}</span>
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (text) => <span className="text-normal">{text}</span>
  }
]

interface IActivity {
  data: any
}

const Activity = (props: IActivity) => {
  const [activity, setActivity] = useState<any>()

  useEffect(() => {
    setActivity(props.data)

    return () => {
      setActivity(undefined)
    }
  }, [props.data])

  return (
    <StyledTabContent>
      <div className="actions-group">
        <div className="search-group">
          <SearchBar className={'profile-search-bar '} />
        </div>
      </div>
      {!activity ? (
        <div className="profile-content-loading">
          <div>
            <Loader />
          </div>
        </div>
      ) : activity.length > 0 ? (
        <StyledTableList columns={columns} dataSource={activity} pagination={false} bordered={false} />
      ) : (
        <NoContent type={'activity'} />
      )}
    </StyledTabContent>
  )
}

export default Activity
