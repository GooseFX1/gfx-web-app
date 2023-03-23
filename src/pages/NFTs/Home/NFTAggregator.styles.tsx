import styled from 'styled-components'
import tw from 'twin.macro'

export const NFT_STATS_CONTAINER = styled.div`
  ${tw`h-[36px] mt-4 ml-6 flex`}
`

export const STATS_BTN = styled.div`
  ${tw`flex items-center rounded-full p-[2px] ml-1 mr-1`}
  background: linear-gradient(94deg, #f7931a 1%, #ac1cc7 100%);

  .innerCover {
    background: ${({ theme }) => theme.bg1};
    color: ${({ theme }) => theme.text28};
    height: 100%;
    ${tw` rounded-full p-1.5 font-semibold text-[15px] `}
  }
`
export const WRAPPER_TABLE = styled.div<{ $navCollapsed; showBanner }>`
  margin-top: 10px;
  overflow-x: hidden;
  padding: 0px 20px;

  ${({ theme }) => theme.customScrollBar('0px')}
  @media(max-width: 500px) {
    height: 100vh !important;
  }
  table {
    @media (max-width: 500px) {
      width: 100vw;
      ${tw`sticky mt-[20px]`}
    }
    ${tw`mt-[25px] w-full  `}
    /* padding: 0px 20px; */
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
      100vh - ${({ showBanner }) => (showBanner ? '410px' : '200px')} -
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
    ${tw`text-base font-semibold h-[64px]`}
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
    ${tw`w-[25%] pr-[10%]`}
    @media(max-width: 500px) {
      ${tw`w-[30%] h-[68px]`}
    }
  }
  .tableRow {
    border-bottom: 1px solid ${({ theme }) => theme.borderBottom};
  }

  .borderRow2 {
    border-radius: 0px 20px 25px 0px;
    color: ${({ theme }) => theme.tableHeader};
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
