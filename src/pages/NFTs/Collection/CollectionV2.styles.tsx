/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, FC } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { useDarkMode } from '../../../context'

export const COLLECTION_VIEW_WRAPPER = styled.div<{ navCollapsed }>`
  ${({ navCollapsed }) => css`
    color: ${({ theme }) => theme.text30};

    .nftStatsContainer {
      ${tw`mt-[20px] mb-[20px] ml-4 mr-5 flex items-center`}
      .backBtn {
        ${tw`h-[40px] w-10 rounded-full flex items-center justify-center cursor-pointer`}
        background: ${({ theme }) => theme.backBtnBg};
        img {
          ${tw`h-[18px] `}
        }
      }
      .collectionNameContainer {
        ${tw`flex items-center w-full justify-between`}
        .collectionName {
          ${tw`flex items-center`}
          .title {
            ${tw`text-[30px] ml-3 font-bold`}
          }
          img {
            ${tw` ml-4 h-[65px] w-[65px] rounded-full`}
          }
        }
        .moreOptions {
          ${tw`flex`}
          div {
            ${tw`mr-4 cursor-pointer`}
          }
        }
        .generalStats {
          ${tw`flex items-center ml-4`}
          .wrapper {
            ${tw`flex flex-col ml-4 mr-4`}
          }
          .titleText {
            ${tw`text-[20px] text-center font-semibold`}
          }
          .subTitleText {
            ${tw`text-[15px] text-center font-semibold`}
            color: ${({ theme }) => theme.text20};
          }
        }
      }
    }
  `}
`
const ICON_WRAPPER_TD = styled.div`
  cursor: pointer;
  .invertArrow {
    transform: rotate(180deg);
    transition: transform 500ms ease-out;
  }
  .dontInvert {
    transition: transform 500ms ease-out;
  }
  @media (max-width: 500px) {
    width: 33%;
    img {
      transition: transform 500ms ease-out;
      ${tw`mt-1.5 ml-3 absolute`}
    }
  }
`

export const ArrowIcon: FC<{ isOpen: boolean; setIsOpen: any }> = ({ isOpen, setIsOpen }): ReactElement => {
  const { mode } = useDarkMode()
  return (
    <ICON_WRAPPER_TD onClick={() => setIsOpen((prev) => !prev)}>
      <img
        className={isOpen ? 'invertArrow' : 'dontInvert'}
        src={`/img/assets/arrow-down-${mode}.svg`}
        alt="arrow"
      />
    </ICON_WRAPPER_TD>
  )
}
export const GRID_CONTAINER = styled.div<{ navCollapsed }>`
  ${({ navCollapsed }) => css`
    height: calc(100vh - 110px - ${navCollapsed ? '0px' : '80px'});
    ${tw`duration-500`}

    .flexContainer {
      ${tw`flex h-screen`}
    }

    .filtersContainer {
      border: 2px solid #3c3c3c;
      ${tw`h-[70px] `}
    }
  `}
`

export const NFT_COLLECTIONS_GRID = styled.div`
  ${tw`w-full`}
  background: ${({ theme }) => theme.bg23};
  overflow-y: auto;
  .gridContainer {
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto;
    border-radius: 12px;
    padding-left: 10px;
  }
  .gridItem {
    height: 240px;
    background-color: ${({ theme }) => theme.bgForNFTCollection};
    margin: 20px 13px 0px 0px;
    border-radius: 12px;

    .gridItemContainer {
      ${tw`flex pt-2 justify-center`}
    }
    .nftTextContainer {
      ${tw`pl-2 pr-2 pt-2`}
    }
    .collectionId {
      ${tw`text-[13px] font-semibold flex items-center`}
      img {
        ${tw` ml-2 w-[15px] h-[15px]`}
      }
    }
    .nftPrice {
      ${tw`font-semibold text-[15px] mt-2 flex items-center`}
      img {
        ${tw`w-5 h-5 ml-2.5`}
      }
    }
    img {
      ${tw`h-[140px]  w-[92.5%]`}
      border-radius: 12px !important;
    }
  }
`
export const NFT_FILTERS_CONTAINER = styled.div<{ index }>`
  ${({ index }) => css`
    ${tw`duration-500 items-center flex h-[70px]`}
    border-radius: 30px 30px 0 0;
    background: ${({ theme }) => theme.bg23};
    border-bottom: 1px solid ${({ theme }) => theme.borderBottom};
    .sortingBtn {
      ${tw`w-[185px] text-white h-[40px] bg-[#5855ff] rounded-3xl	font-semibold text-[15px]
       flex items-center justify-center cursor-pointer`}
    }
    img {
      ${tw`h-10 w-10 ml-3 cursor-pointer`}
    }
    .flexContainer {
      margin-left: auto;
      height: fit-content;
      color: ${({ theme }) => theme.text12};
      ${tw`mt-10 text-[15px] font-medium`}
    }
    .selected {
      color: ${({ theme }) => theme.text4};
      ${tw`w-[140px] mb-4 items-center font-semibold  flex justify-between flex-col cursor-pointer`}
    }
    .flexItem {
      ${tw` w-[140px] mb-4 items-center  flex justify-between flex-col cursor-pointer`}
    }
    .activeItem {
      ${tw`h-2  block mt-3 rounded-b-circle font-semibold duration-500 	`}
      content: '';
      width: 70%;
      background: #5855ff;
      transform: rotate(180deg);
      margin-left: ${index * 280 + `px`};
    }
  `}
`
