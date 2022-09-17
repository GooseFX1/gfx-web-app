import React, { useState, useEffect } from 'react'
import { StyledTableList } from './TableList.styled'
import NoContent from './NoContent'
import { fetchNFTById } from '../../../api/NFTs'
import { SearchBar, Loader } from '../../../components'
import { StyledTabContent } from './TabContent.styled'
import { useNFTProfile, useConnectionConfig } from '../../../context'
import { checkMobile, truncateAddress } from '../../../utils'

export const columns = [
  {
    title: 'Event',
    dataIndex: 'kind',
    key: 'kind',
    render: (text) => <span className="text-normal">{text === 'bid_matched' ? 'sold' : text}</span>
  },
  {
    title: 'Item',
    dataIndex: 'item',
    key: 'item',
    render: (record) => (
      <div className="item">
        <img className="image" src={record.image_url} alt="" />
        <div className="text">
          <div className="text-name">{record.name}</div>
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
        <span className="price">{price} SOL</span>
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
  const { sessionUser, nonSessionProfile } = useNFTProfile()
  const { connection } = useConnectionConfig()

  useEffect(() => {
    fetchActivity().then((activities) => setActivity(activities))

    return () => setActivity(undefined)
  }, [props.data])

  const fetchActivity = async (): Promise<any> => {
    const userActivities = await Promise.all(
      props.data.map(async (activity) => {
        const extraData = await fetchNFTById(activity.non_fungible_id, 'mainnet')

        let transactionData = {}
        if (activity.tx_sig) {
          transactionData = await connection.getParsedConfirmedTransaction(activity.tx_sig, 'confirmed')
        }

        const currentUserAddress = nonSessionProfile ? nonSessionProfile.pubkey : sessionUser.pubkey

        return {
          ...activity,
          from: truncateAddress(currentUserAddress),
          quantity: 1,
          price: activity.price || 0,
          ...extraData.data[0],
          to: truncateAddress(extraData.data[0].mint_address),
          date: new Date(activity.clock * 1000).toLocaleDateString('en-US'),
          item: {
            name: extraData.data[0].nft_name,
            image_url: extraData.data[0].image_url
          },
          ...transactionData
        }
      })
    )

    return userActivities.sort((a: any, b: any) => b.clock - a.clock)
  }

  return (
    <StyledTabContent>
      {!checkMobile() && (
        <div className="actions-group">
          <div className="search-group">
            <SearchBar className={'profile-search-bar '} />
          </div>
        </div>
      )}
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
