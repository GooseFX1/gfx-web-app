import React, { useState, useEffect, FC } from 'react'
import { StyledTableList } from './TableList.styled'
import NoContent from './NoContent'
import { fetchNFTById } from '../../../api/NFTs'
import { SearchBar, Loader, ArrowDropdown } from '../../../components'
import { StyledTabContent } from './TabContent.styled'
import { useNFTProfile, useConnectionConfig } from '../../../context'
import { checkMobile, truncateAddress } from '../../../utils'
import { INFTUserActivity } from '../../../types/nft_profile.d'
import styled from 'styled-components'
import tw from 'twin.macro'
import { CenteredDiv } from '../../../styles'

const WRAPPER = styled.div`
  background-color: ${({ theme }) => theme.primary3};
  position: absolute;
  left: 367px;
  height: 40px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  width: 115px;
  border-radius: 59px;
  display: flex;
  justify-content: center;

  .ant-row {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
`

const REFRESH = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  right: 110px;
  cursor: pointer;
`
const Toggle = styled(CenteredDiv)<{ $mode: boolean }>`
  ${tw`h-[25px] w-[50px] rounded-[40px] cursor-pointer`}
  border-radius: 30px;
  background-image: linear-gradient(to right, #f7931a 25%, #ac1cc7 100%);
  position: absolute;
  right: 20px;
  top: 30px;

  > div {
    ${tw`h-[30px] w-[30px]`}
    ${({ theme }) => theme.roundedBorders}
    box-shadow: 0 3.5px 3.5px 0 rgba(0, 0, 0, 0.25);
    background-image: url('/img/assets/solana-logo.png');
    background-position: center; 
    background-size: 100%;
    background-repeat: no-repeat;
    transform: translateX(${({ $mode }) => ($mode ? '-12px' : '12px')});
`

const DROPDOWN_WRAPPER = styled.div`
  padding: 12px;
  width: 115px;
  height: 98px;
  border-radius: 5px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  background-color: ${({ theme }) => theme.bg23};

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  input[type='radio'] {
    width: 15px;
    height: 15px;
    appearance: none;
    border-radius: 50%;
    outline: none;
    background: ${({ theme }) => theme.bg24};
    accent-color: yellow;
    cursor: pointer;
  }

  input[type='radio']:checked {
    background-image: linear-gradient(111deg, #f7931a 11%, #ac1cc7 94%);
    border: 3px solid #1c1c1c;
  }
`

export const columns = [
  {
    title: 'Event',
    dataIndex: 'kind',
    key: 'kind',
    render: (text): JSX.Element => <span className="normal-text">{text === 'bid_matched' ? 'sold' : text}</span>
  },
  {
    title: 'Item',
    dataIndex: 'item',
    key: 'item',
    render: (record): JSX.Element => (
      <div className="item">
        <img className="image" src={record.image_url} alt="" />
        <div className="content">
          <div className="content-name">{record.name}</div>
        </div>
      </div>
    )
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: '22%',
    render: (price): JSX.Element => (
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
    render: (text): JSX.Element => <span className="normal-text">{text}</span>
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    render: (text): JSX.Element => <span className="sender">{text}</span>
  },
  {
    title: 'To',
    dataIndex: 'to',
    key: 'to',
    render: (text): JSX.Element => <span className="sender">{text}</span>
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (text): JSX.Element => <span className="normal-text">{text}</span>
  }
]

interface IProps {
  data: INFTUserActivity[]
}

interface Props {
  nftFilterArr: string[]
  setNftFilter: (index: number) => void
}

const Activity: FC<IProps> = (props) => {
  const [activityLog, setActivitLog] = useState<any>([])
  const { sessionUser, nonSessionProfile } = useNFTProfile()
  const { connection } = useConnectionConfig()
  const [isSol, setIsSol] = useState<boolean>(true)
  const nftFilterArr = ['All', 'Offers', 'On Sale']
  const [nftFilter, setNftFilter] = useState<number>(0)

  const toggleSol = () => {
    setIsSol((prev) => !prev)
  }

  const Menu: FC<Props> = ({ nftFilterArr, setNftFilter }): JSX.Element => (
    <>
      <DROPDOWN_WRAPPER>
        {nftFilterArr.map((item, index) => (
          <div key={index}>
            <span>{item}</span>
            <input
              type="radio"
              value={item}
              name="nft_filter"
              checked={index === nftFilter}
              onChange={() => {
                setNftFilter(index)
              }}
            />
          </div>
        ))}
      </DROPDOWN_WRAPPER>
    </>
  )

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
        <>
          <div className="actions-group">
            <div className="search-group">
              <SearchBar className={'profile-search-bar '} />
            </div>
          </div>
          <WRAPPER>
            <ArrowDropdown
              measurements="16px"
              offset={[4, 8]}
              placement="bottom"
              overlay={<Menu nftFilterArr={nftFilterArr} setNftFilter={setNftFilter} />}
              onVisibleChange={() => {
                console.log('haha')
              }}
            >
              <div className="active">{nftFilterArr[nftFilter]}</div>
            </ArrowDropdown>
          </WRAPPER>
          <REFRESH>
            <img src="/img/assets/refresh.svg" alt="refresh" />
          </REFRESH>
          <Toggle $mode={isSol} onClick={toggleSol}>
            <div />
          </Toggle>
        </>
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
