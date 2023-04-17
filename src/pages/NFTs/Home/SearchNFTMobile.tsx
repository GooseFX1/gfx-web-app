/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { fetchGlobalSearchNFT } from '../../../api/NFTs'
import { SearchBar } from '../../../components'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { PopupCustom } from '../Popup/PopupCustom'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

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
    ${tw`ml-2 text-[#636363] font-semibold flex items-center  text-[15px]`}
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
    ${tw`flex mt-2.5 mb-2 `}
    .nftImg {
      ${tw`w-[35px] rounded-[5px] h-[35px] mt-1`}
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
  const [searchResult, setSearchResult] = useState<any>([])
  useEffect(() => {
    if (searchFilter && searchFilter.length > 1) {
      fetchGlobalSearchNFT(searchFilter)
        .then((res) => {
          setSearchResult(res.collections)
        })
        .catch((err) => console.log(err))
    }
  }, [searchFilter])
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
        {!searchFilter && (
          <div className="searchGraphic">
            <img src="/img/assets/Aggregator/searchGraphic.png" />
            Find your favourite NFT's <br />
            by collection or item.
          </div>
        )}

        {/* <RecentNFT /> */}
        {searchFilter && <RecentCollection searchResult={searchResult} />}
      </div>
    </STYLED_POPUP>
  )
}

const RecentNFT = () => {
  console.log('recent')
  return (
    <div className="searchWrapper">
      <div className="recentTitle">Recent</div>
      {[].map((ar, index) => (
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

const RecentCollection: FC<{ searchResult: any }> = ({ searchResult }) => {
  console.log(searchResult)
  const history = useHistory()
  return (
    <div className="searchWrapper">
      <div className="recentTitle">Collections</div>
      {searchResult &&
        searchResult.map((ar, index) => (
          <div
            className="displayRow"
            key={index}
            onClick={() =>
              history.push(`/nfts/collection/${encodeURIComponent(ar.collection_name).replaceAll('%20', '_')}`)
            }
          >
            <img className="nftImg" src={ar.profile_pic_link} alt="" />
            <div>
              <div className="title">
                {ar.collection_name}
                {ar.is_verified && (
                  <img tw="w-[18px] h-[18px] ml-1" src="/img/assets/Aggregator/verifiedNFT.svg" />
                )}
              </div>
              <div className="greyText">
                24h Volume:{' '}
                <PriceWithToken token="SOL" price={ar.daily_volume} cssStyle={tw`ml-1 text-white w-5 h-5`} />
              </div>
            </div>
            {/* <div className="alignRight">{ar.itemsListed} Listed</div> */}
          </div>
        ))}
    </div>
  )
}
export default SearchNFTMobile
