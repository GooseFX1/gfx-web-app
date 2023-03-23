import styled from 'styled-components'
import tw from 'twin.macro'

export const NFT_STATS_CONTAINER = styled.div`
  ${tw`h-[36px] mt-4 ml-6 flex`}
`

export const STATS_BTN = styled.div`
  ${tw`flex items-center rounded-full h-[36px] p-[1px] ml-1 mr-[45px]`}
  background: linear-gradient(94deg, #f7931a 1%, #ac1cc7 100%);
  .innerCover {
    background: ${({ theme }) => theme.bg2};
    ${tw`rounded-full p-[4.5px] text-[15px] flex `}
    .innerTitle {
      ${tw`ml-1`}
      color: ${({ theme }) => theme.text20} !important;
    }
    .innerData {
      ${tw`font-semibold ml-2 mr-1`}
      color: ${({ theme }) => theme.text1};
    }
  }
`
export const WRAPPER_TABLE = styled.div<{ $navCollapsed; showBanner }>`
  margin-top: 10px;
  overflow-x: hidden;
  padding: 0px 20px;
  ${({ theme }) => theme.customScrollBar('0px')}
  @media(max-width: 500px) {
    height: calc(100vh - 240px);
    padding: 0;
  }
  table {
    @media (max-width: 500px) {
      width: 100vw;
      height: calc(100vh - 230px);
      ${tw`sticky mt-[0px]`}
    }
    ${tw`mt-[10px] w-full  `}
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
  }
  tbody {
    height: calc(
      100vh - ${({ showBanner }) => (showBanner ? '425px' : '215px')} -
        ${({ $navCollapsed }) => (!$navCollapsed ? '80px' : '0px')}
    );
    overflow-y: auto;
    @media (max-width: 500px) {
      height: calc(100vh - 280px);
    }
  }
  td {
    ${tw`h-[76px] sm:h-[78px]`}
  }
  tbody td,
  thead th {
    width: 12.5%;
    float: left;
    text-align: center;
    @media (max-width: 500px) {
      ${tw`w-[33%] `}
    }
  }
  .tdItem {
    ${tw`align-top text-center pt-[28px] sm:w-[30%]`}
  }

  tbody {
    overflow-y: auto;
    ${({ theme }) => theme.customScrollBar('4px')}
  }
  th {
    color: #636363 !important;
    background: #1e1e1e;
    padding-top: 15px;
  }
  td {
    text-align: center;
    ${tw`text-[15px] font-semibold`}
    color: ${({ theme }) => theme.text29};
    /* padding-top: 25px; */
  }
  .tableHeader {
    ${tw`text-base font-semibold h-[64px] sm:h-[52px]`}
  }
  .index {
    ${tw`sm:w-[5%] flex items-center ml-[6px]`}
  }
  .nftNameColumn {
    text-align: left;
    ${tw`w-[25%] sm:w-[60%]`}
    img {
      ${tw`w-10 h-10  sm:h-[42px] sm:w-[42px] ml-4 mt-5 rounded-full sm:mt-[18px] sm:ml-[8px]`}
    }
    span {
      ${tw` ml-[6px] font-semibold text-[15px]`}
    }
  }
  .nftCollectionName {
    ${tw`ml-16 -mt-7 sm:-mt-11 sm:ml-[60px] `}
    padding-top: 0!important;
  }
  .nftCollectionFloor {
    ${tw`ml-16 -mt-7 sm:-mt-0 sm:ml-[60px] flex text-[15px] font-semibold`}
    padding-top: 0!important;
  }
  .grey {
    ${tw`mr-1`}
    color: ${({ theme }) => theme.text17}
  }

  .borderRow {
    border-radius: 20px 0px 0px 25px;
    ${tw`w-[25%] pr-[10%] `}
    @media(max-width: 500px) {
      ${tw`w-[42%] h-[52px] pr-0`}
    }
  }
  .tableRow {
    border-bottom: 1px solid ${({ theme }) => theme.borderBottom};
  }

  .borderRow2 {
    border-radius: 0px 20px 25px 0px;
    color: ${({ theme }) => theme.tableHeader};
    @media (max-width: 500px) {
      ${tw`w-[26%] h-[52px]`}
    }
  }
`
export const SEARCH_RESULT_CONTAINER = styled.div`
  ${tw`absolute w-[420px] max-h-[290px] min-h-[50px] z-20 mt-14 ml-8`}
  border-radius: 10px;
  box-shadow: -3px 9px 8px 0 rgba(0, 0, 0, 0.2);
  background: ${({ theme }) => theme.bg2};
  ${({ theme }) => theme.customScrollBar('4px')};

  overflow-y: scroll;
  .searchResultRow {
    ${tw`h-[50px] text-[15px] font-semibold `}
    color: ${({ theme }) => theme.text1};
    display: flex;
    align-items: center;
    img {
      ${tw`w-[35px] h-[35px] ml-2  rounded-full`}
    }
    .searchText {
      ${tw`ml-4`}
    }
    &:hover {
      background: ${({ theme }) => theme.tableBorder};
    }
  }
`
