import React, { useEffect, useState, FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { fetchAllSingleNFTs } from '../../../api/NFTs'
import { useNavCollapse } from '../../../context'
import { Loader } from '../../Farm/Columns'
import { NFTColumnsTitleWeb } from './NFTTableColumns'

const WRAPPER = styled.div<{ $navCollapsed; showBanner }>`
  margin-top: 10px;
  /* height: calc(100vh - 400px - ${({ $navCollapsed }) => (!$navCollapsed ? '80px' : '0px')}); */
  overflow-x: hidden;
  padding: 0px 20px;

  ${({ theme }) => theme.customScrollBar('0px')}
  @media(max-width: 500px) {
    height: 100vh !important;
  }
  table {
    @media (max-width: 500px) {
      width: 100vw;
      position: sticky;
      margin-top: 2px;
    }
    padding: 0px 20px;
    width: 100%;
    margin-top: 25px;
    background: ${({ theme }) => theme.bg17};
    border-radius: 20px 20px 0 0;
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
    height: 60px;
    text-align: center;
    /*text-align: left;*/
  }
  tbody {
    height: calc(
      100vh - ${({ showBanner }) => (showBanner ? '400px' : '190px')} -
        ${({ $navCollapsed }) => (!$navCollapsed ? '80px' : '0px')}
    );
    overflow-y: auto;
    transition: 0.5s ease;
  }
  td {
    height: 76px;
  }
  tbody td,
  thead th {
    width: 12.5%;
    float: left;
    text-align: center;
  }
  .tdItem {
    ${tw`align-top text-center pt-[28px]`}
  }

  tbody {
    overflow-y: auto;
  }
  th {
    color: #636363 !important;
  }
  td {
    text-align: center;
    ${tw`text-[15px] font-semibold`}
    color: ${({ theme }) => theme.text29};
    /* padding-top: 25px; */
  }
  .tableHeader {
    ${tw`text-base font-semibold h-[64px]`}
    background:  #1E1E1E;
  }
  .firstCol {
    ${tw`w-[25%]`}
    text-align: left;
    padding-left: 2%;
    img {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      margin-top: 10px;
    }
  }
  .nftNameColumn {
    width: 25%;
    text-align: left;
    img {
      ${tw`w-10 h-10  ml-4 mt-5 rounded-full	`}
    }
  }
  .nftCollectionName {
    ${tw`ml-16 -mt-7`}
    padding-top: 0!important;
  }

  .borderRow {
    border-radius: 20px 0px 0px 25px;
    ${tw`h-[64px] w-[25%]`}
    @media(max-width: 500px) {
      width: 30%;
      height: 68px;
    }
  }
  .tableRow {
    border-bottom: 1px solid ${({ theme }) => theme.borderBottom};
  }
  .nftImage {
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }
  .borderRow2 {
    border-radius: 0px 20px 25px 0px;
    color: ${({ theme }) => theme.tableHeader};
  }
`

const NFTCollectionsTable: FC<{ showBanner: boolean }> = ({ showBanner }) => {
  const { isCollapsed } = useNavCollapse()
  const [allItems, setAllItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])
  useEffect(() => {
    ;(async () => {
      const res = await fetchAllSingleNFTs()
      setTimeout(() => {
        setAllItems(res)
      }, 2000)
    })()
  }, [])

  return (
    <WRAPPER $navCollapsed={isCollapsed} showBanner={showBanner}>
      <table>
        <thead className="tableHeader">
          <NFTColumnsTitleWeb />
        </thead>
        <tbody>
          <NFTTableRow allItems={allItems} />
        </tbody>
      </table>
    </WRAPPER>
  )
}

const NFTTableRow = ({ allItems }: any) => (
  <>
    {allItems.map((item, index) => (
      <tr className="tableRow" key={index}>
        <td className="nftNameColumn">
          {item?.nft_name ? (
            <div>
              <img src={item.image_url} alt="" />
              <div className="nftCollectionName">{item?.nft_name}</div>
            </div>
          ) : (
            <Loader />
          )}
        </td>
        <td className="tdItem">{item?.nft_name ? <>{item.nft_name} </> : <Loader />}</td>
        <td className="tdItem">{item?.nft_name ? <>{item.nft_name} </> : <Loader />}</td>
      </tr>
    ))}
  </>
)

export default NFTCollectionsTable
