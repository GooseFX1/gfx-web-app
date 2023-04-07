/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, FC } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { useDarkMode } from '../../../context'

export const COLLECTION_VIEW_WRAPPER = styled.div<{ navCollapsed }>`
  ${({ navCollapsed }) => css`
    color: ${({ theme }) => theme.text30};
    .ant-drawer-content {
      background: ${({ theme }) => theme.bg26} !important;
    }

    .nftStatsContainer {
      ${tw`mt-[20px] mb-[20px] ml-4 sm:ml-2 sm:mr-2 mr-5 flex items-center`}
      .backBtn {
        ${tw`h-[40px] w-10 rounded-full flex items-center justify-center cursor-pointer`}
        background: ${({ theme }) => theme.backBtnBg};
        img {
          ${tw`h-[18px] `}
        }
      }
      .collectionNameContainer {
        ${tw`flex items-center sm:items-start	w-full justify-between sm:flex-col`}
        .collectionName {
          ${tw`flex items-center sm:w-[100%]`}
          .title {
            ${tw`text-[30px] sm:text-[22px] ml-3 font-bold`}
          }
          .sweepMobile {
            ${tw`h-[48px] w-[48px] ml-auto`}
          }
          img {
            ${tw`sm:ml-0 ml-4 h-[65px] w-[65px] sm:h-[55px] sm:w-[55px] rounded-full`}
          }
        }
        .shareMobile {
          ${tw`h-[48px] w-[48px] ml-auto`}
        }
        .shareBtn {
          ${tw`mt-3 `}
          height: 25px !important;
          width: 30px !important;
        }
        .moreOptions {
          ${tw`flex`}
          div {
            ${tw`mr-4 cursor-pointer`}
          }
        }
        .generalStats {
          ${tw`flex items-center ml-4 sm:w-[100%] sm:ml-0 sm:flex sm:justify-between sm:mt-2`}

          .wrapper {
            ${tw`flex flex-col ml-4 mr-4 sm:mr-1 sm:ml-1`}
          }
          .titleText {
            ${tw`text-[20px] sm:text-[18px] text-center font-semibold`}
            img {
              ${tw`h-[20px] w-[20px] mr-1 mb-1`}
            }
          }
          .subTitleText {
            ${tw`text-[15px] sm:text-[12px] text-center font-semibold`}
            color: ${({ theme }) => theme.text20};
          }
        }
      }
    }
  `}
`
const ICON_WRAPPER_TD = styled.div`
  cursor: pointer;
  z-index: 1000;
  .invertArrow {
    transform: rotate(180deg);
    transition: transform 500ms ease-out;
  }
  .dontInvert {
    transition: transform 500ms ease-out;
  }
  @media (max-width: 500px) {
    img {
      transition: transform 500ms ease-out;
      ${tw`mr-2`}
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
export const GRID_CONTAINER = styled.div<{ navCollapsed?: boolean }>`
  ${({ navCollapsed }) => css`
    height: calc(100vh - 110px - ${navCollapsed ? '0px' : '80px'});
    ${tw`duration-500`}
    @media(max-width: 500px) {
      height: auto;
    }
    .flexContainer {
      ${tw`flex h-screen`}
    }

    .filtersContainer {
      border: 2px solid #3c3c3c;
      ${tw`h-[70px] `}
    }
  `}
`

export const NFT_COLLECTIONS_GRID = styled.div<{ gridType?: string }>`
  ${tw`w-full`}
  background: ${({ theme }) => theme.bg23};
  ${({ theme }) => theme.customScrollBar('4px')}
  overflow-y: auto;
  .profile-content-loading {
    position: relative;
    height: calc(100vh - 260px);
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      position: relative;
      height: 1px;
      width: 1px;
    }
  }
  .gridContainer {
    grid-template-columns: repeat(auto-fit, minmax(195px, ${({ gridType }) => (gridType ? gridType : '1fr')}));
    ${tw`grid sm:pl-1 sm:grid-cols-2 rounded-xl`}
  }
  .gridContainerProfile {
    grid-template-columns: repeat(auto-fit, minmax(195px, ${({ gridType }) => (gridType ? gridType : '1fr')}));
    ${tw`grid pl-3 sm:grid-cols-2 rounded-xl overflow-y-auto`}
    ${({ theme }) => theme.customScrollBar('2px')}
  }
  .pinkGradient {
    background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
  }
  .gridItem:last-child {
    ${tw`mb-[350px]`}
  }

  .gridItem {
    ${tw`h-[295px] w-[190px] sm:w-[185px] rounded-[15px] dark:bg-black-1 bg-white 
      duration-500 cursor-pointer mt-[20px] mx-auto`}

    img {
      ${tw`h-[140px] rounded-[15px] w-[92.5%]`}
    }

    .gridItemContainer {
      ${tw`flex p-[8px] pb-0 justify-center relative `}

      .nftImg {
        ${tw`w-full h-auto `}
      }
      .hoverAddToBag {
        ${tw`h-[35px] w-[35px] right-3 top-1.5 absolute`}
      }
      .hoverButtons {
        ${tw`h-[30px] absolute bottom-1 text-white flex items-center justify-center w-[96%] px-2`}
      }
      div {
        ${tw`absolute opacity-0`}
      }
      .hoverNFT {
        ${tw`opacity-100 duration-300 z-10 w-full h-[102%] mt-[-8px] rounded-[15px] pl-1`}
        background: ${({ theme }) => theme.hoverGradient};
      }
      .loadingNFT {
        ${tw`absolute opacity-100 mt-[-8px] z-50 duration-300 
          flex items-center w-[190px] h-[295px] rounded-[15px] pl-1`}
        background: ${({ theme }) => theme.hoverGradient};
      }
    }
    .nftTextContainer {
      ${tw`relative p-[8px]`}
    }
    .collectionId {
      ${tw`text-[13px] font-semibold flex items-center justify-between`}

      .isVerified {
        ${tw` ml-2 w-[12px] h-[12px]`}
      }

      .ah-name {
        ${tw`w-[22px] h-[22px] absolute top-[8px] right-[8px]`}
      }
    }
    .nftPrice {
      ${tw`font-semibold text-[15px] flex items-center pt-2`}
      img {
        ${tw`w-5 h-5 ml-2.5`}
      }
    }
    .apprisalPrice {
      ${tw`font-semibold text-[15px] mt-[-2px] text-[#636363] flex items-center`}
      img {
        ${tw`w-[20px] h-[20px] ml-2.5`}
      }
    }

    .ls-favorite-heart {
      ${tw`absolute right-[10px] bottom-[10px] w-[20px] h-[20px]`}
    }
  }
`
export const DROPDOWN_CONTAINER = styled.div`
  ${tw`rounded-md p-1 -mt-1 sm:w-[185px] text-[15px] font-semibold`}
  background-color: ${({ theme }) => theme.dropdownBackground};
  color: ${({ theme }) => theme.text1};
  .checkboxContainer {
    ${tw`ml-auto`}
    input {
      ${tw`w-[18px] h-[18px]`}
    }
  }
  .number {
    ${tw`flex items-center justify-center`}
    border: 1px solid;
  }
  .marketImg {
    ${tw`w-[30px] h-[30px]`}
  }
  .option {
    ${tw`flex cursor-pointer items-center justify-between p-1`}
    input {
      /* color: ${({ theme }) => theme.bg26}; */
    }
  }
`
export const NFT_FILTERS_CONTAINER = styled.div<{ index }>`
  ${({ index }) => css`
    ${tw`duration-500 items-center flex h-[70px] sm:h-[58px] sm:flex-col `}
    border-radius: 30px 30px 0 0;
    background: ${({ theme }) => theme.bg23};
    border-bottom: 1px solid ${({ theme }) => theme.borderBottom};
    .sortingBtn {
      ${tw`w-[185px] text-white h-[40px] bg-[#5855ff] rounded-3xl	font-semibold text-[15px]
       flex items-center justify-center cursor-pointer`}
    }
    .offerBtn {
      ${tw`w-[115px] ml-2 text-white h-[40px] bg-[#5855ff] rounded-3xl	font-semibold text-[15px]
       flex items-center justify-center cursor-pointer`}
    }
    img {
      ${tw`h-10 w-10 ml-3 cursor-pointer`}
    }

    .flitersViewCategory {
      ${tw`text-[15px] flex font-medium ml-auto sm:ml-0 sm:mt-1 mt-10`}
    }
    .flitersFlexContainer {
      ${tw`text-[15px] flex font-medium mt-2`}
    }
    .flexContainer {
      margin-left: auto;
      height: fit-content;
      color: ${({ theme }) => theme.text12};
      ${tw`mt-10 text-[15px] font-medium`}
    }
    .selected {
      color: ${({ theme }) => theme.text4};
      ${tw`w-[140px] sm:w-[128px] mb-4 items-center sm:mt-1 text-[14px]
       font-semibold  flex justify-between flex-col cursor-pointer`}
    }
    .selectedProfile {
      color: ${({ theme }) => theme.text4};
      ${tw`w-[170px] mb-4 items-center sm:mt-1
       font-semibold  flex justify-between flex-col cursor-pointer`}
    }
    }
    .flexItem {
      ${tw` w-[140px] sm:w-[130px] mb-4 sm:mt-1 items-center flex justify-between flex-col cursor-pointer`}
    }
    .flexItemProfile {
      ${tw`w-[170px] sm:w-[140px] mb-4 sm:mt-1 items-center flex justify-between flex-col cursor-pointer`}
    }
    .activeItem {
      ${tw`h-2  block mt-3 sm:mt-2 rounded-b-circle font-semibold duration-500 bg-[#5855ff] w-[70%]`}
      content: '';
      width: 70%;
      transform: rotate(180deg);
      margin-left: ${index * 280 + `px`};
      @media (max-width: 500px) {
        margin-left: ${index * 260 + `px`};
      }
    }
    .activeItemProfile {
      ${tw`h-2  block mt-3 sm:mt-2 rounded-b-circle font-semibold duration-500 bg-[#5855ff] w-[68%] `}
      content: '';
      transform: rotate(180deg);
      margin-left: ${index * 365 + `px`};
      @media (max-width: 500px) {
        margin-left: ${index * 300 + `px`};
      }
    }
  `}
`
