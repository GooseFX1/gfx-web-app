/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { Loader } from '../../../components'
import { useNavCollapse } from '../../../context'
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
      ${tw`sticky mt-[20px]`}
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
    display: block;
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
    height: 76px;
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
  .tableHeader {
    ${tw`text-[15px] font-semibold h-[26px]`}
  }
  .nftNameColumn {
    text-align: left;
    border: 1px solid;
    img {
      border-radius: 5px;
      ${tw`w-10 h-10  ml-4 mt-5`}
    }
  }
  .collectionName {
    ${tw`ml-16 -mt-0`}/* padding-top: 0!important; */
  }
  .nftCollectionName {
    ${tw`ml-16 -mt-10`}
    padding-top: 0!important;
  }
`
const ActivityNFTSection = (): ReactElement => {
  console.log('first')
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
        time: new Date().toLocaleDateString()
      })
    }
    setActivityData(arr)
  }, [])
  const { isCollapsed } = useNavCollapse()
  return (
    <WRAPPER_TABLE $navCollapsed={isCollapsed}>
      <table>
        <thead className="tableHeader">
          <NFTActivitySectionWeb />
        </thead>
        <tbody>
          {/* <NFTTableRow allItems={allItems} /> */}
          {activityData && <NFTActivityRow activityData={activityData} />}
        </tbody>
      </table>
    </WRAPPER_TABLE>
  )
}

const NFTActivityRow = ({ activityData }: any): any => (
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
