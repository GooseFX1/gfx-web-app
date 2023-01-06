/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { Loader } from '../../../components'
import { useNavCollapse } from '../../../context'
import { checkMobile } from '../../../utils'
import { GradientText } from '../adminPage/components/UpcomingMints'
import { NFTActivitySectionWeb } from '../Home/NFTTableColumns'

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
    width: 14%;
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
    img {
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
const ActivityNFTSection = (): ReactElement => {
  const [activityData, setActivityData] = useState<any[]>()
  useEffect(() => {
    const arr = []
    for (let i = 1; i < 25; i++) {
      arr.push({
        collectionId: '#' + i * 20,
        collectionName: 'DeGods',
        type: i % 2 === 0 ? 'Sell' : 'Buy',
        price: i * 10,
        buyer: 'Lorem, ipsum.',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGDjdpLSpGgAdpvFjjmgtkdhCeH6vSUrxLOA&usqp=CAU',
        seller: 'Lorem, ipsum',
        time: '14:52 pm'
      })
    }
    setActivityData(arr)
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
              <div>{item?.time}</div>
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
    {activityData.map((item, index) => (
      <tr className="tableRow" key={index}>
        <td className="nftNameColumn">
          {item?.collectionId ? (
            <div>
              <img src={item.img} alt="" />
              <div className="nftCollectionName">{item?.collectionId}</div>
              <div className="collectionName">
                <GradientText text={item?.collectionName} fontSize={18} fontWeight={600} />
              </div>
            </div>
          ) : (
            <div>
              <Loader />
            </div>
          )}
        </td>
        <td className="tdItem">{item?.type ? <>{item.type} </> : <Loader />}</td>
        <td className="tdItem">{item?.price ? <>{item.price} </> : <Loader />}</td>
        <td className="tdItem">{item?.collectionName ? <>{item.collectionName} </> : <Loader />}</td>
        <td className="tdItem">{item?.buyer ? <>{item.buyer} </> : <Loader />}</td>
        <td className="tdItem">{item?.seller ? <>{item.seller} </> : <Loader />}</td>
        <td className="tdItem">{item?.time ? <>{item.time} </> : <Loader />}</td>
      </tr>
    ))}
  </>
)

export default ActivityNFTSection
