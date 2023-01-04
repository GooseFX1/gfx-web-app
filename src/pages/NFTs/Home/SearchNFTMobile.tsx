/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { SearchBar } from '../../../components'
import { PopupCustom } from '../Popup/PopupCustom'

const STYLED_POPUP = styled(PopupCustom)`
  &.ant-modal {
    ${tw`top-0 m-0 max-w-full rounded-none`}
    background: ${({ theme }) => theme.bg2};
  }
  .ant-modal-content {
    display: flex;
  }
  .ant-modal-body {
    padding-top: 16px !important;
    padding-left: 0;
  }
  .searchBarContainer {
    ${tw`text-[15px] ml-4 w-[80vw]`}
    border: 1px solid;
  }
  .wrapper {
    ${tw`w-[95vw]`}
  }
  .title {
    ${tw`ml-2 font-semibold text-[15px]`}
    color: ${({ theme }) => theme.text11};
  }
  .greyText {
    line-height: 14px;
    ${tw`ml-2 text-[#636363] font-semibold text-[15px]`}
  }
  .searchGraphic {
    ${tw`flex flex-col  text-center mt-[35%]  ml-[5%] text-[18px] font-semibold text-[#636363]`}
    img {
      ${tw`w-[250px] h-[220px] ml-[15%] mb-[10%] `}
    }
  }
  .alignRight {
    ${tw`ml-auto mr-2 mt-1.5 text-[15px] font-semibold`}
    img {
      ${tw`h-[20px] w-[20px] ml-1`}
    }
  }
  .displayRow {
    ${tw`flex mt-2 mb-2 `}
    .nftImg {
      ${tw`w-[35px] h-[35px] mt-1`}
    }
  }
  .searchWrapper {
    ${tw`ml-2 mt-2`}
  }
  .recentTitle {
    ${tw`font-semibold text-[18px] pb-1 pt-2 text-[#636363]`}
    border-bottom: 1px solid;
  }
`

const SearchNFTMobile: FC<{ searchPopup: boolean; setSearchPopup: any }> = ({
  searchPopup,
  setSearchPopup
}): ReactElement => {
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [prevSearches, setPrevSearches] = useState<any>('undefined')
  return (
    <STYLED_POPUP
      height={'100vh'}
      width={'100vw'}
      title={null}
      visible={searchPopup ? true : false}
      onCancel={() => setSearchPopup(false)}
      footer={null}
    >
      <div className="wrapper">
        <SearchBar
          className="searchBarContainer"
          placeholder="Search by collection or item"
          setSearchFilter={setSearchFilter}
        />
        {!prevSearches && (
          <div className="searchGraphic">
            <img src="/img/assets/Aggregator/searchGraphic.png" />
            Find your favourite NFT's <br />
            by collection or item.
          </div>
        )}

        <RecentNFT />
        <RecentCollection />
      </div>
    </STYLED_POPUP>
  )
}

const arr = [
  {
    collectionName: 'SMB',
    item: '#2044',
    volume: '8000 SOL',
    itemsListed: 8000,
    price: 4000,
    currency: 'SOL',
    img: 'https://ca.slack-edge.com/T021XPFKRQV-U028SL6BUCT-3b38dffe3712-512'
  },
  {
    collectionName: 'Y00ts',
    item: '#1234',
    volume: '9800 SOL',
    itemsListed: 6000,
    price: 4000,
    currency: 'USDC',
    img: 'https://ca.slack-edge.com/T021XPFKRQV-U028SL6BUCT-3b38dffe3712-512'
  }
]
const RecentNFT = () => {
  console.log('object')
  return (
    <div className="searchWrapper">
      <div className="recentTitle">Recent</div>
      {arr.map((ar, index) => (
        <div className="displayRow" key={index}>
          <img className="nftImg" src={ar.img} alt="" />
          <div>
            <div className="title">{ar.item}</div>
            <div className="greyText">{ar.collectionName}</div>
          </div>
          <div className="alignRight">
            {ar.price}
            <img src={`/img/crypto/${ar.currency}.svg`} alt="" />
          </div>
        </div>
      ))}
    </div>
  )
}

const RecentCollection = () => {
  console.log('object')
  return (
    <div className="searchWrapper">
      <div className="recentTitle">Collections</div>
      {arr.map((ar, index) => (
        <div className="displayRow" key={index}>
          <img className="nftImg" src={ar.img} alt="" />
          <div>
            <div className="title">{ar.collectionName}</div>
            <div className="greyText">24h Volume: {ar.volume}</div>
          </div>
          <div className="alignRight">{ar.itemsListed} Listed</div>
        </div>
      ))}
    </div>
  )
}
export default SearchNFTMobile
