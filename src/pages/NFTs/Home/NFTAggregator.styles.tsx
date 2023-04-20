import styled from 'styled-components'
import tw from 'twin.macro'

export const STATS_BTN = styled.div`
  ${tw`flex items-center justify-center pl-[2px] pr-[1.5px] rounded-full h-[36px] pt-[1px] pb-[1px]
   ml-1 mr-[45px]`}
  background: linear-gradient(94deg, #f7931a 1%, #ac1cc7 100%);

  .innerCover {
    background: ${({ theme }) => theme.bg2};
    ${tw`rounded-full p-[4.5px] text-[15px]  flex dark:`}
    .innerTitle {
      ${tw`ml-1.5`}
      color: ${({ theme }) => theme.text20} !important;
    }
    .innerData {
      ${tw`font-semibold ml-2 mr-1 dark:text-[#fff] text-[#3c3c3c]`}
    }
  }
`
export const WRAPPER_TABLE = styled.div<{ $navCollapsed; showBanner }>`
  margin-top: 10px;
  overflow-x: hidden;
  padding: 0px 20px;
  ${({ theme }) => theme.customScrollBar('0px')}

  @media(max-width: 500px) {
    height: calc(100vh - 200px);
    padding: 0;
  }

  table {
    ${tw`dark:bg-black-3 bg-white mt-[10px] w-full `}
    border-radius: 20px 20px 0 0;
    overflow-x: hidden;

    @media (max-width: 500px) {
      width: 100vw;
      height: calc(100vh - 200px);
      ${tw`sticky mt-[0px]`}
    }
  }

  thead,
  tbody,
  tr,
  td,
  th {
    display: block;
  }

  thead {
    ${tw`dark:bg-black-3 bg-black-4 text-base font-semibold h-[64px] sm:h-[52px] rounded-[20px 20px 5px 5px]`}

    tr {
      ${tw`h-full`}

      th {
        ${tw`h-full dark:text-grey-1 text-grey-2 text-center`}

        & > div {
          ${tw`h-full `}
        }
      }
    }
  }

  tbody {
    height: calc(
      100vh - ${({ showBanner }) => (showBanner ? '425px' : '236px')} -
        ${({ $navCollapsed }) => (!$navCollapsed ? '80px' : '0px')}
    );
    ${({ theme }) => theme.customScrollBar('4px')}
    overflow-x: hidden;

    @media (max-width: 500px) {
      height: calc(100vh - 220px);
    }

    tr {
      ${tw`dark:bg-black-2 bg-white cursor-pointer`}
      border-bottom: 1px solid ${({ theme }) => theme.borderBottom};

      &:hover {
        ${tw`dark:bg-black-4 bg-grey-5`}
      }

      &:after {
        content: ' ';
        display: block;
        visibility: hidden;
        clear: both;
      }
    }
    td {
      ${tw`h-[76px] sm:h-[78px] text-[15px] font-semibold text-center dark:text-grey-5 text-grey-1`}
      text-align: center;
    }
  }

  tbody td,
  thead th {
    width: 14%;
    float: left;
    text-align: center;

    @media (max-width: 500px) {
      ${tw`w-[33%] `}
    }
  }

  .tdItem {
    ${tw`text-center flex items-center justify-center sm:w-[30%]`}
  }

  .index {
    ${tw`sm:w-[5%] flex items-center ml-[6px]`}
  }
  .nftNameImg {
    ${tw`w-10 h-10 sm:mt-0 sm:h-[42px] sm:w-[42px] ml-4  rounded-full sm:ml-[8px]`}
  }
  .nftNameColumn {
    text-align: left;
    ${tw`w-[25%] sm:w-[60%] flex items-center  `}
    span {
      ${tw` ml-[6px] font-semibold text-[15px]`}
    }
  }
  .nftCollectionName {
    ${tw`sm:ml-[10px] ml-[15px] flex flex-col items-start justify-start`}
    padding-top: 0!important;
  }
  .nftCollectionFloor {
    ${tw`ml-16 -mt-10  sm:ml-0 sm:mt-[0px] sm:ml-0 flex text-[15px] items-center font-semibold`}
    padding-top: 0!important;
  }
  .grey {
    ${tw`mr-1`}
    color: ${({ theme }) => theme.text17}
  }

  .borderRow {
    border-radius: 20px 0px 0px 25px;
    ${tw`w-[25%] pr-[10%] cursor-pointer`}
    @media(max-width: 500px) {
      ${tw`w-[42%] h-[52px] pr-0`}
    }
  }

  .borderRow2 {
    ${tw`w-[5%] dark:text-black-2 text-grey-1`}

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
    ${tw`h-[50px] text-[15px] font-semibold cursor-pointer `}
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
