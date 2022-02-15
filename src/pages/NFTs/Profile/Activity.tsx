import React, { useState, useEffect } from 'react'
import { StyledTableList } from './TableList.styled'
import { useWallet } from '@solana/wallet-adapter-react'
import NoContent from './NoContent'
import apiClient from '../../../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../../../api/NFTs'
import { SearchBar, Loader } from '../../../components'
import { StyledTabContent } from './TabContent.styled'
import { useConnectionConfig } from '../../../context'
// import { INFTMetadata } from '../../../types/nft_details.d'

export const columns = [
  {
    title: 'Event',
    dataIndex: 'kind',
    key: 'kind',
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
  const { publicKey } = useWallet()
  const { connection } = useConnectionConfig()

  useEffect(() => {
    async function makeActivity() {
      let data = await Promise.all(
        props.data.map(async (datum) => {
          let extraData = await fetchGeneral(datum.non_fungible_id)
          let name = extraData.data[0].nft_name.split(' ')
          let transactionData = {}
          if (datum.tx_sig) {
            transactionData = await connection.getParsedConfirmedTransaction(datum.tx_sig, 'confirmed')
            // '8SWtsBv1BsqatXrsWpZX67bqyEFvyBRL6miazot3DZUsVznYW4rB2a5H2uVNe9ekSXuvy2qSKF7KLxTxQ4vtRw5' test signature
          }
          return {
            ...datum,
            from: publicKey.toString().slice(0, 4) + '...' + publicKey.toString().slice(-4),
            quantity: 1,
            price: datum.price || 0,
            ...extraData.data[0],
            to: extraData.data[0].mint_address.slice(0, 4) + '...' + extraData.data[0].mint_address.slice(-4),
            date: new Date(datum.clock * 1000).toLocaleDateString('en-US'),
            item: {
              name: name[1],
              other: name[0]
            },
            ...transactionData
          }
        })
      )

      setActivity(data)

      return () => {
        setActivity(undefined)
      }
    }

    makeActivity()
  }, [props.data])

  const fetchGeneral = async (id: string): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.SINGLE_NFT}?nft_id=${id}`)
      const nft = await res.data
      return nft
    } catch (err) {
      return err
    }
  }

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
