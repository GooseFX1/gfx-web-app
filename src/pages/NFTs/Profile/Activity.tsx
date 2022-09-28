import React, { useState, useEffect } from 'react'
import { StyledTableList } from './TableList.styled'
import NoContent from './NoContent'
import { fetchNFTById } from '../../../api/NFTs'
import { SearchBar, Loader } from '../../../components'
import { StyledTabContent } from './TabContent.styled'
import { useNFTProfile, useConnectionConfig } from '../../../context'
import { checkMobile, truncateAddress } from '../../../utils'
import { INFTUserActivity } from '../../../types/nft_profile.d'

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

interface IProps {
  data: INFTUserActivity[]
}

const Activity = (props: IProps) => {
  const [activityLog, setActivitLog] = useState<any>([])
  const { sessionUser, nonSessionProfile } = useNFTProfile()
  const { connection } = useConnectionConfig()

  useEffect(() => {
    fetchActivity(props.data).then((actvsLog) => setActivitLog(actvsLog))
    return () => setActivitLog(undefined)
  }, [props.data])

  const fetchActivity = async (actvLog: INFTUserActivity[]): Promise<any> => {
    const userActivities = await Promise.all(
      actvLog.map(async (actv: INFTUserActivity) => {
        let nftDetails: any = {}
        try {
          const nftData = await fetchNFTById(actv.non_fungible_uuid)
          nftDetails = nftData.data[0]
        } catch (err) {
          console.error(err)
          throw new Error('Error Fetching Activity Details')
        }

        let transactionData = {}
        if (actv.tx_sig) {
          transactionData = await connection.getParsedConfirmedTransaction(actv.tx_sig, 'confirmed')
        }

        const currentUserAddress = nonSessionProfile ? nonSessionProfile.pubkey : sessionUser.pubkey
        const adjustedDate = parseFloat(actv.clock) * 1000

        return {
          ...actv,
          ...nftDetails,
          ...transactionData,
          from: truncateAddress(currentUserAddress),
          quantity: 1,
          price: 0,
          to: truncateAddress(nftDetails.mint_address),
          date: new Date(adjustedDate).toLocaleDateString('en-US'),
          item: {
            name: nftDetails.nft_name,
            image_url: nftDetails.image_url
          }
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
      {!activityLog ? (
        <div className="profile-content-loading">
          <div>
            <Loader />
          </div>
        </div>
      ) : activityLog.length > 0 ? (
        <StyledTableList columns={columns} dataSource={activityLog} pagination={false} bordered={false} />
      ) : (
        <NoContent type={'activity'} />
      )}
    </StyledTabContent>
  )
}

export default Activity
