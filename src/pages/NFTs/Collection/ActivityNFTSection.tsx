/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { fetchActivityOfAddress, fetchSingleNFT, NFT_ACTIVITY_ENDPOINT } from '../../../api/NFTs'
import { Loader } from '../../../components'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { useNavCollapse } from '../../../context'
import { checkMobile, truncateAddress } from '../../../utils'
import { GradientText } from '../adminPage/components/UpcomingMints'
import { NFTActivitySectionWeb } from '../Home/NFTTableColumns'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { AH_NAME } from '../../../web3'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { Tooltip } from 'antd'
export interface IActivity {
  activity_id: number
  uuid: string
  tx_sig: string
  kind: string
  auction_house: string
  clock: number
  user_id: any
  non_fungible_id: number
  non_fungible_uuid: string
  buyer_wallet: any
  seller_wallet: string
  price: string
  collection_id: number
  collection_address?: string
  mint_address?: string
}

const ACTIVITY_KIND = {
  EXECUTED_SALE: 'Sell',
  BUY: 'Buy',
  BID: 'Bid',
  SELL: 'Sell',
  CANCEL: 'Cancel'
}

export const WRAPPER_TABLE = styled.div<{ $navCollapsed }>`
  overflow-x: hidden;
  width: 100%;

  ${({ theme }) => theme.customScrollBar('0px')}
  @media(max-width: 500px) {
    height: 100vh !important;
  }
  table {
    @media (max-width: 500px) {
      width: 100%;
    }
    ${tw`w-full`}
    background: ${({ theme }) => theme.bg17};
  }
  thead,
  tbody,
  tr,
  td,
  th {
    display: block;
  }

  tr:after {
    content: ' ';
    /* display: block; */
    visibility: hidden;
    clear: both;
  }
  thead th {
    height: 26px;
    text-align: center;
  }
  tbody {
    height: calc(100vh - ${({ $navCollapsed }) => (!$navCollapsed ? '80px' : '0px')});
    overflow-y: auto;
    transition: 0.5s ease;
  }
  td {
    ${tw`h-[76px] sm:h-[72px]`}
  }
  tbody td,
  thead th {
    width: 13.5%;
    float: left;
    text-align: center;
  }
  .tdItem {
    ${tw`align-top text-center pt-[28px]`}
  }

  tbody {
    overflow-y: auto;
    ${({ theme }) => theme.customScrollBar('4px')}
  }
  th {
    color: ${({ theme }) => theme.text33};
  }
  td {
    text-align: center;
    ${tw`text-[15px] font-semibold`}
    color: ${({ theme }) => theme.text20};
  }
  .tableRow {
    ${tw``}
    @media(max-width: 500px) {
      /* border-bottom: 1px solid ${({ theme }) => theme.borderBottom} ; */
    }
  }
  .tableHeader {
    ${tw`text-[15px] font-semibold h-[26px]`}
  }
  .nftNameColumn {
    text-align: left;
    width: 17%;
    .nftNameImg {
      border-radius: 5px;
      ${tw`w-10 h-10 sm:mt-3 ml-4 mt-5`}
    }
  }
  .collectionName {
    ${tw`ml-16 flex text-[15px] sm:ml-16 sm:mt-0
     sm:flex sm:justify-between sm:items-center w-[140%]`}/* padding-top: 0!important; */
  }
  .nftCollectionName {
    ${tw`ml-16 sm:-mt-11 -mt-10`}
    padding-top: 0!important;
  }
  .textContainer {
    ${tw`text-[15px] text-right pt-3 mr-[45px] `}
  }
  .primaryText {
    color: ${({ theme }) => theme.text30};
    img {
      ${tw`h-[20px] w-[20px] ml-2`}
    }
  }
  .secondaryText {
    color: ${({ theme }) => theme.text20};
  }
  .solscan {
    ${tw`h-[35px] w-[35px] -mt-11 ml-auto`}
  }
  .priceActivity {
    ${tw`flex flex-col w-[42%]`}
  }
`
const ActivityNFTSection: FC<{ address?: string; typeOfAddress?: string }> = ({
  address,
  typeOfAddress
}): ReactElement => {
  const [activityData, setActivityData] = useState<IActivity[]>([])

  useEffect(() => {
    ;(async () => {
      if (address && typeOfAddress) {
        const data = await fetchActivityOfAddress(address, typeOfAddress)
        setActivityData(data)
      }
    })()
  }, [])

  const { isCollapsed } = useNavCollapse()
  return (
    <WRAPPER_TABLE $navCollapsed={isCollapsed}>
      <table>
        {!checkMobile() && (
          <thead className="tableHeader">
            <NFTActivitySectionWeb />
          </thead>
        )}
        <tbody>
          {/* <NFTTableRow allItems={allItems} /> */}
          {checkMobile()
            ? activityData && <NFTActivityRowMobile activityData={activityData} />
            : activityData && <NFTActivityRowWeb activityData={activityData} />}
        </tbody>
      </table>
    </WRAPPER_TABLE>
  )
}

const NFTActivityRowMobile = ({ activityData }: any): any => (
  <>
    {activityData.map((item, index) => (
      <tr className="tableRow" key={index}>
        <td className="nftNameColumn" colSpan={4}>
          {item?.collectionId ? (
            <div>
              <img src={item.img} alt="" />
              <div className="nftCollectionName">{item?.collectionId}</div>
              <div className="collectionName">
                Type:
                <GradientText text={item?.type} fontSize={15} fontWeight={600} />
              </div>
            </div>
          ) : (
            <div>
              <Loader />
            </div>
          )}
        </td>
        <td></td>
        <td></td>
        <td></td>
        {/* <td></td> */}
        <td className="priceActivity">
          <div className="textContainer">
            <div className="primaryText">
              {item?.price}
              <img src="/img/crypto/SOL.png" />
            </div>
            <div className="secondaryText">
              <div>{item?.clock}</div>
            </div>
          </div>

          <div style={{ display: 'flex' }}>
            <img src="/img/assets/Aggregator/solscan.svg" className="solscan" />
          </div>
        </td>
      </tr>
    ))}
  </>
)
const NFTActivityRowWeb = ({ activityData }: any): any => (
  <>
    {activityData.map((activity: IActivity, index: number) => (
      <NFTActivityRowWebContents activity={activity} index={index} />
    ))}
  </>
)
const NFTActivityRowWebContents: FC<{ activity: IActivity; index: number }> = ({ activity, index }) => {
  const [nftDetails, setNFTDetails] = useState<any>()
  useEffect(() => {
    ;(async () => {
      const { data } = await fetchSingleNFT(activity?.mint_address)
      console.log(data.data[0])
      setNFTDetails(data.data[0])
    })()
  }, [])
  return (
    <tr className="tableRow" key={index}>
      <td className="nftNameColumn">
        {nftDetails?.nft_name ? (
          <div tw="flex">
            <img className="nftNameImg" src={nftDetails.image_url} alt="" />
            <div tw="flex flex-col mt-4.5 ml-2">
              <Tooltip title={nftDetails?.nft_name}>
                <div tw="flex items-center ">
                  <div>{minimizeTheString(nftDetails?.nft_name)}</div>
                  <a target="_blank" href={`https://solscan.io/tx/${activity?.tx_sig}`} rel="noreferrer">
                    <img src="/img/assets/solscan.png" alt="solscan" tw="!h-5 !w-5 ml-1" />
                  </a>
                </div>
              </Tooltip>

              <GradientText
                text={minimizeTheString(
                  nftDetails?.collection_name ? nftDetails?.collection_name : nftDetails?.nft_name
                )}
                fontSize={18}
                fontWeight={600}
              />
            </div>

            {/* <div className="collectionName">
            </div> */}
          </div>
        ) : (
          <div>
            <Loader />
          </div>
        )}
      </td>
      <td className="tdItem" tw="dark:text-white text-grey-1">
        {activity?.kind ? <>{ACTIVITY_KIND[activity?.kind]} </> : <Loader />}
      </td>
      <td className="tdItem" tw="flex items-center justify-center">
        {activity?.price ? (
          <div tw="flex items-center justify-center pl-2">
            {(parseFloat(activity?.price) / LAMPORTS_PER_SOL_NUMBER).toFixed(2)}
            <img src={'/img/crypto/SOL.svg'} tw="w-5 h-5 ml-1" />
          </div>
        ) : (
          <Loader />
        )}
      </td>
      <td className="tdItem">
        {activity?.auction_house ? (
          <div tw="flex items-center justify-center pl-2">
            {AH_NAME(activity?.auction_house)}
            <img
              tw="h-5 w-5 ml-1"
              src={`/img/assets/Aggregator/${AH_NAME(activity?.auction_house)}.svg`}
              alt={`${AH_NAME(activity?.auction_house)}-icon`}
              style={{ height: 30 }}
            />
          </div>
        ) : (
          <Loader />
        )}
      </td>
      <td className="tdItem">
        {activity?.buyer_wallet ? (
          <>
            <a
              href={`https://solscan.io/account/${activity?.buyer_wallet}`}
              tw="text-white font-semibold underline cursor-pointer"
              target="_blank"
              rel="noreferrer"
            >
              {truncateAddress(activity.buyer_wallet)}
            </a>
          </>
        ) : (
          <Loader />
        )}
      </td>
      <td className="tdItem">
        {activity?.seller_wallet ? (
          <>
            <a
              href={`https://solscan.io/account/${activity?.seller_wallet}`}
              tw="text-white font-semibold underline cursor-pointer"
              target="_blank"
              rel="noreferrer"
            >
              {truncateAddress(activity.seller_wallet)}
            </a>
          </>
        ) : (
          <Loader />
        )}
      </td>
      <td className="tdItem">
        {activity?.clock ? (
          <>{new Date(activity?.clock * 1000)?.toLocaleTimeString().substring(0, 5)}</>
        ) : (
          <Loader />
        )}
      </td>
    </tr>
  )
}

export default ActivityNFTSection
