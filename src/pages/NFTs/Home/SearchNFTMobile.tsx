/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { fetchGlobalSearchNFT } from '../../../api/NFTs'
import { SearchBar } from '../../../components'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { PopupCustom } from '../Popup/PopupCustom'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { useDarkMode } from '../../../context'
import { truncateBigNumber } from '../../TradeV3/perps/utils'
import debounce from 'lodash.debounce'

const STYLED_POPUP = styled(PopupCustom)`
  &.ant-modal {
    ${tw`top-0 m-0 max-w-full rounded-none`}
    background: ${({ theme }) => theme.bg2};
  }
  .ant-modal-close {
    visibility: hidden;
  }
  .ant-modal-content {
    display: flex;
  }
  .ant-modal-body {
    padding-top: 16px !important;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 10px;
  }
  .searchBarContainer {
    ${tw`text-[15px] ml-1.5 w-[82vw]`}
  }
  .wrapper {
    ${tw`w-[95vw]`}
  }
  .title {
    ${tw`ml-2 font-semibold text-[15px]`}
    color: ${({ theme }) => theme.text32};
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
    ${tw`ml-auto mt-1.5 text-[15px] font-semibold`}
    color: ${({ theme }) => theme.text32};
    img {
      ${tw`h-[20px] w-[20px] ml-1`}
    }
  }
  .displayRow {
    ${tw`flex mt-2.5 mb-2.5`}
    .nftImg {
      ${tw`w-[35px] rounded-[100%] h-[35px] mt-1`}
    }
  }
  .searchWrapper {
    ${tw`ml-2 mt-2 h-[calc(100vh - 95px)]`}
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
  const { mode } = useDarkMode()
  const handleSearch = useCallback((searchQuery) => debouncer(searchQuery), [])

  const debouncer = debounce((searchQuery) => {
    globalSearchCall(searchQuery)
  }, 500)

  const globalSearchCall = (searchQuery) => {
    fetchGlobalSearchNFT(searchQuery)
      .then((res) => {
        setSearchResult(res.collections)
      })
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    if (searchFilter && searchFilter.length > 0) {
      handleSearch(searchFilter)
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
        <div tw="flex items-center">
          <SearchBar
            className="searchBarContainer"
            shouldFocus={true}
            filter={searchFilter}
            bgColor={mode === 'dark' ? '#1f1f1f' : '#fff'}
            placeholder="Search by collection"
            setSearchFilter={setSearchFilter}
          />
          <div>
            <img
              tw="right-[18px] absolute h-4 w-4 top-[30px]"
              onClick={() => setSearchPopup(false)}
              src={`/img/assets/close-${mode}.svg`}
            />
          </div>
        </div>
        {!searchFilter && (
          <div className="searchGraphic">
            <img src="/img/assets/Aggregator/searchGraphic.png" />
            Find your favorite NFT's <br />
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
  const history = useHistory()
  const { mode } = useDarkMode()

  return (
    <div className="searchWrapper">
      <div className="recentTitle">Collections</div>
      {searchResult &&
        searchResult.map((ar, index) => (
          <div
            className="displayRow"
            key={index}
            onClick={() =>
              history.push(
                `/nfts/collection/${encodeURIComponent(ar?.collection?.collection_name).replaceAll('%20', '_')}`
              )
            }
          >
            <img className="nftImg" src={ar?.collection?.profile_pic_link} alt="" />
            <div>
              <div className="title" tw="sm:flex sm:items-center">
                {minimizeTheString(ar?.collection?.collection_name, 18)}
                {ar?.collection?.is_verified && (
                  <img
                    tw="w-[18px] sm:h-[15px] sm:w-[15px] h-[18px] ml-1"
                    src="/img/assets/Aggregator/verifiedNFT.svg"
                  />
                )}
              </div>
              <div className="greyText">24H Volume: {truncateBigNumber(ar?.collection?.daily_volume)} SOL</div>
            </div>
            <div className="alignRight" tw="flex justify-center items-center">
              <div>{ar.listed_count} Listed</div>
              <div>
                <div>
                  <img tw="w-3 h-3 ml-1" src={`/img/assets/Aggregator/arrow-right-${mode}.svg`} alt="arrow" />{' '}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
export default SearchNFTMobile
