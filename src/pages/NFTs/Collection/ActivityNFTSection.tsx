/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react'
import { fetchActivityOfAddress, fetchSingleNFT, NFT_ACTIVITY_ENDPOINT } from '../../../api/NFTs'
import { Loader } from '../../../components'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { useNavCollapse, useNFTAggregator, usePriceFeedFarm } from '../../../context'
import { checkMobile, formatSOLDisplay, formatSOLNumber, truncateAddress } from '../../../utils'
import { GradientText } from '../../../components/GradientText'
import { NFTActivitySectionWeb } from '../Home/NFTTableColumns'
import tw, { TwStyle, styled } from 'twin.macro'
import 'styled-components/macro'
import { AH_NAME } from '../../../web3'
import { handleMarketplaceFormat, minimizeTheString } from '../../../web3/nfts/utils'
import { Tooltip } from 'antd'
import NoContent from '../Profile/NoContent'
import { GenericTooltip } from '../../../utils/GenericDegsin'
import { parseUnixTimestamp } from '../../../utils'
import { NFTRowLoading } from '../Home/NFTLoading'
import { truncateBigNumber } from '../../TradeV3/perps/utils'

export interface IActivity {
  activity_id: number
  uuid: string
  tx_sig: string
  kind: string
  auction_house: string
  clock: string
  user_id: any
  non_fungible_id: number
  marketplace_name?: string
  non_fungible_uuid: string
  buyer_wallet: any
  seller_wallet: string
  price: string
  collection_id: number
  collection_address?: string
  mint_address?: string
}

const ACTIVITY_KIND = {
  EXECUTED_SALE: 'Sale',
  BUY: 'Bid',
  BID: 'Bid',
  SELL: 'Listed',
  CANCEL: 'Delist'
}

export const WRAPPER_TABLE = styled.div<{ $navCollapsed; $cssStyle }>`
  overflow-x: hidden;
  width: 100%;
  ${tw`dark:bg-black-1 bg-grey-6`}
  ${({ $cssStyle }) => $cssStyle};
  ${({ theme }) => theme.customScrollBar('0px')}
  @media(max-width: 500px) {
    height: 100vh !important;
  }
  table {
    @media (max-width: 500px) {
      width: 100%;
    }
    ${tw`w-full`}
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
    ${tw`sm:h-[100%]`}
  }
  td {
    ${tw`h-[76px] sm:h-[72px]`}
  }
  tbody td,
  thead th {
    float: left;
    text-align: center;
  }

  tbody {
    overflow-y: auto;
    ${({ theme }) => theme.customScrollBar('0px')}
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
    ${tw`h-14`}
    @media(max-width: 500px) {
      /* border-bottom: 1px solid ${({ theme }) => theme.borderBottom} ; */
    }
  }
  .tableHeader {
    ${tw`text-[15px] font-semibold h-[42px]`}
    tr {
      ${tw`h-full`}
    }
    .table-col-header {
      ${tw`flex justify-center items-center h-full`}
    }
  }
  .nftActivityImg {
    ${tw`w-[42px] h-[42px] rounded-[10px] ml-2 mt-2`}
  }
  .nftNameColumn {
    text-align: left;
    width: 25%;
    .nftNameImg {
      border-radius: 5px;
      ${tw`w-10 h-10 sm:mt-3 ml-4 mt-5`}
    }
  }
  .collectionName {
    ${tw`ml-16 flex text-[15px] sm:ml-16 sm:mt-0 
     sm:flex sm:justify-start sm:items-center w-[140%]`}/* padding-top: 0!important; */
  }
  .nftCollectionName {
    ${tw`ml-16 sm:-mt-11 -mt-10 sm:w-[180px]`}
    padding-top: 0!important;
  }
  .textContainer {
    ${tw`text-[15px] text-right pt-3 mr-[45px]  flex flex-col`}
  }
  .primaryText {
    ${tw`ml-auto`}
    color: ${({ theme }) => theme.text30};
    img {
      ${tw`h-[20px] w-[20px] ml-2`}
    }
  }
  .secondaryText {
    color: ${({ theme }) => theme.text20};
  }
  .solscan {
    ${tw`h-[35px] w-[35px] -mt-11 sm:mt-[-80px] ml-auto sm:ml-auto`}
  }
  .priceActivity {
    ${tw`flex flex-col w-[75%] pr-2`}
  }
`
const ActivityNFTSection: FC<{ address?: string; typeOfAddress?: string; cssStyle?: TwStyle }> = ({
  address,
  typeOfAddress,
  cssStyle
}): ReactElement => {
  const [activityData, setActivityData] = useState<IActivity[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (address && typeOfAddress) {
        setIsLoading(true)
        const data = await fetchActivityOfAddress(address, typeOfAddress)
        setActivityData(data)
        setIsLoading(false)
      }
    })()
  }, [])

  const { isCollapsed } = useNavCollapse()
  return (
    <WRAPPER_TABLE $navCollapsed={isCollapsed} $cssStyle={cssStyle}>
      {isLoading && <NFTRowLoading />}
      {activityData.length ? (
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
      ) : (
        <NoContent type="activity" cssStyle={cssStyle} />
      )}
    </WRAPPER_TABLE>
  )
}

const NFTActivityRowMobile = ({ activityData }: any): any => (
  <>
    {activityData.map((activity: IActivity, index: number) => (
      <NFTActivityRowMobileContents activity={activity} index={index} key={index} />
    ))}
  </>
)
const NFTActivityRowMobileContents: FC<{ activity: IActivity; index: number }> = ({ activity, index }) => {
  const [nftDetails, setNFTDetails] = useState<any>()
  const { currencyView } = useNFTAggregator()
  const { solPrice } = usePriceFeedFarm()
  useEffect(() => {
    ;(async () => {
      const { data } = await fetchSingleNFT(activity?.mint_address)
      setNFTDetails(data.data[0])
    })()
  }, [])

  const displayPrice = useMemo(() => {
    if (currencyView === 'USDC') return truncateBigNumber(solPrice * formatSOLNumber(activity?.price))
    return truncateBigNumber(formatSOLNumber(activity?.price))
  }, [currencyView, activity])
  // src={`/img/assets/Aggregator/${
  //   localAsk?.marketplace_name === null
  //     ? AH_NAME(localAsk?.auction_house_key)
  //     : localAsk?.marketplace_name
  // }.svg`}

  return (
    <>
      <tr className="tableRow" key={index}>
        <td className="nftNameColumn" colSpan={4}>
          {activity?.collection_id && (
            <div>
              <img className="nftActivityImg" src={nftDetails?.image_url} alt="" />
              <div className="nftCollectionName">{minimizeTheString(nftDetails?.nft_name, 18)}</div>
              <div className="collectionName">
                <div tw="mr-2">Type:</div>

                <GradientText text={ACTIVITY_KIND[activity?.kind]} fontSize={15} fontWeight={600} />
                <img
                  tw="h-5 w-5 ml-2"
                  src={`/img/assets/Aggregator/${
                    activity?.marketplace_name ? activity?.marketplace_name : AH_NAME(activity?.auction_house)
                  }.svg`}
                  alt={`${AH_NAME(activity?.auction_house)}-icon`}
                  style={{ height: 30 }}
                />
              </div>
            </div>
          )}
        </td>
        {/* <td></td> */}
        <td className="priceActivity" tw="flex items-end justify-end">
          <div className="textContainer">
            <div className="primaryText">
              <PriceWithToken token={currencyView} price={displayPrice} />
            </div>
            <div className="secondaryText">
              <div>
                {activity && activity.clock ? (
                  <>{parseUnixTimestamp(activity?.clock).split(',')[1]}</>
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>

          <a target="_blank" href={`https://solscan.io/tx/${activity?.tx_sig}`} rel="noreferrer">
            <img src="/img/assets/Aggregator/solscan.svg" className="solscan" />
          </a>
        </td>
      </tr>
    </>
  )
}

const NFTActivityRowWeb = ({ activityData }: any): any => (
  <>
    {activityData.map((activity: IActivity, index: number) => (
      <NFTActivityRowWebContents activity={activity} index={index} key={index} />
    ))}
  </>
)
const NFTActivityRowWebContents: FC<{ activity: IActivity; index: number }> = ({ activity, index }) => {
  const [nftDetails, setNFTDetails] = useState<any>()
  const { currencyView } = useNFTAggregator()
  const { solPrice } = usePriceFeedFarm()

  const displayPrice = useMemo(() => {
    if (currencyView === 'USDC') {
      return formatSOLDisplay(parseFloat(activity?.price) * solPrice)
    }
    return formatSOLDisplay(activity?.price)
  }, [activity?.price, currencyView])

  useEffect(() => {
    ;(async () => {
      const { data } = await fetchSingleNFT(activity?.mint_address)
      setNFTDetails(data.data[0])
    })()
  }, [])
  const hostURL = useMemo(() => window.location.origin, [window.location.origin])
  const profileLink = hostURL + `/nfts/profile/`

  const marketImage = useMemo(
    () =>
      activity?.marketplace_name
        ? activity?.marketplace_name
        : activity?.auction_house
        ? AH_NAME(activity?.auction_house)
        : null,
    [activity]
  )
  return (
    <tr className="tableRow" key={index}>
      <td className="nftNameColumn" tw="!w-[20%]">
        {nftDetails?.nft_name ? (
          <div tw="flex">
            <img className="nftNameImg" src={nftDetails.image_url} alt="" />
            <div tw="flex flex-col mt-4.5 ml-2">
              <GenericTooltip text={nftDetails?.nft_name}>
                <div tw="flex items-center ">
                  <div>{minimizeTheString(nftDetails?.nft_name, 12)}</div>
                  <a target="_blank" href={`https://solscan.io/tx/${activity?.tx_sig}`} rel="noreferrer">
                    <img src="/img/assets/solscan.png" alt="solscan" tw="!h-5 !w-5 ml-1" />
                  </a>
                </div>
              </GenericTooltip>

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
      <td tw="align-top w-[10%] text-center pt-[28px] dark:text-white text-grey-1">
        {activity?.kind ? <>{ACTIVITY_KIND[activity?.kind]} </> : <Loader />}
      </td>
      <td tw="align-top text-center pt-[28px] flex items-center justify-center w-[13%]">
        {activity?.price ? (
          <div tw="flex items-center justify-center pl-2">
            <PriceWithToken token={currencyView} price={displayPrice} cssStyle={tw`w-5 h-5 ml-1`} />
          </div>
        ) : (
          <Loader />
        )}
      </td>
      <td tw="align-top text-center pt-[28px] w-[13%]">
        {activity?.auction_house || marketImage ? (
          <div tw="flex items-center justify-center pl-2">
            {marketImage ? handleMarketplaceFormat(marketImage) : AH_NAME(activity?.auction_house)}
            <img
              tw="h-5 w-5 ml-1"
              src={`/img/assets/Aggregator/${marketImage}.svg`}
              alt={`${marketImage}-icon`}
              style={{ height: 30 }}
            />
          </div>
        ) : (
          <Loader />
        )}
      </td>
      <td tw="align-top text-center pt-[28px] w-[13%]">
        {activity?.buyer_wallet ? (
          <>
            <a
              href={profileLink + `${activity?.buyer_wallet}`}
              tw="dark:text-white text-purple-1  font-semibold underline cursor-pointer"
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
      <td tw="align-top text-center pt-[28px] w-[13%]">
        {activity?.seller_wallet ? (
          <>
            <a
              href={profileLink + `${activity?.seller_wallet}`}
              tw="dark:text-white text-purple-1  font-semibold underline cursor-pointer"
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
      <td tw="align-top text-center pt-[28px] w-[15%]">
        {activity && activity.clock ? <>{parseUnixTimestamp(activity?.clock)}</> : <Loader />}
      </td>
    </tr>
  )
}

export default ActivityNFTSection
