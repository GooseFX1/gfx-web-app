/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, FC } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { useDarkMode } from '../../../context'
import { CircularArrow } from '../../../components/common/Arrow'

export const COLLECTION_VIEW_WRAPPER = styled.div`
  ${() => css`
    color: ${({ theme }) => theme.text30};
    ${({ theme }) => theme.customScrollBar(0)};
    .ant-drawer-content-wrapper {
      ${tw`sm:rounded-[10px]`}
    }
    .ant-drawer-content {
      ${tw`dark:bg-black-2 bg-grey-5 sm:rounded-[10px] sm:border-solid sm:border-1 sm:dark:border-black-4 
      sm:border-grey-2 `}
    }
    .addBorder {
      border: 1px solid #b5b5b5 !important;
    }

    .lastRefreshed {
      ${tw`flex flex-col h-[0px] justify-end items-center w-full sm:text-sm`}
      color: ${({ theme }) => theme.tabNameColor};
      animation: openAnimation 3s ease-in-out;
    }

    @keyframes openAnimation {
      0% {
        height: 0px;
      }
      30% {
        height: 64px;
      }
      50% {
        height: 64px;
      }
      100% {
        height: 0px;
      }
    }

    .nftStatsContainer {
      ${tw`flex items-center mt-[38px] sm:mt-5 mb-[20px] sm:mb-1 mx-3 sm:ml-2.5 sm:mr-2`}
      .backBtn {
        ${tw`h-8.75 w-8.75 rounded-full flex items-center justify-center cursor-pointer`}
        background: ${({ theme }) => theme.backBtnBg};
        img {
          ${tw`h-[18px] `}
        }
      }
      .collectionNameContainer {
        ${tw`flex items-center sm:items-start	w-full sm:flex-col`}
        .collectionName {
          ${tw`flex items-center sm:w-[100%] dark:text-grey-5 text-black-4`}

          .sweepMobile {
            ${tw`h-[48px] w-[48px] ml-auto`}
          }
        }
        .collectionNameImage {
          ${tw`sm:ml-0 ml-4 h-8.75 w-8.75 rounded-full`}
        }

        .shareMobile {
          ${tw`h-[48px] w-[48px] ml-auto`}
        }
        .shareBtn {
          ${tw`mt-3 sm:mt-0`}
          height: 25px !important;
          width: 30px !important;
        }

        .generalStats {
          ${tw`flex  justify-center items-center sm:!left-0  
          sm:w-[95%] sm:ml-2 sm:mt-3 sm:relative sm:flex sm:justify-between `}
          position: absolute;
          left: calc(50% - 270px);

          .wrapper {
            ${tw`flex flex-col ml-4 mr-4 sm:mr-1 sm:ml-1`}
          }
          .titleText {
            ${tw`text-[18px] sm:text-[18px] text-center font-semibold leading-none dark:text-grey-5 text-black-4`}
            img {
              ${tw`h-[20px] w-[20px] mr-1 mb-1`}
            }
          }
          .titleTextNoSupport {
            ${tw`text-[18px] sm:text-[18px] text-center font-semibold text-grey-1 leading-none`}
            img {
              ${tw`h-[20px] w-[20px] mr-1 mb-1`}
            }
          }
          .subTitleText {
            ${tw`text-[15px] sm:text-[12px] text-center font-semibold text-grey-1 dark:text-grey-2 `}
          }
          .subTitleTextNoSupport {
            ${tw`text-[15px] sm:text-[12px] text-center font-semibold text-grey-1`}
          }
        }
      }
    }
  `}
`
const ICON_WRAPPER_TD = styled.div`
  cursor: pointer;
  z-index: 200;
`

export const ArrowIcon: FC<{ isOpen: boolean; setIsOpen: any }> = ({ isOpen, setIsOpen }): ReactElement => (
  <ICON_WRAPPER_TD onClick={() => setIsOpen((prev) => !prev)}>
    <CircularArrow cssStyle={tw`h-5 w-5 sm:h-[30px] sm:w-[30px]`} invert={isOpen} />
  </ICON_WRAPPER_TD>
)

export const GRID_CONTAINER = styled.div`
  ${() => css`
    height: calc(100vh - 162px);
    ${tw`duration-500`}
    @media(max-width: 500px) {
      height: auto;
    }
    .ant-checkbox-wrapper {
      :hover {
        border: none;
      }
      .ant-checkbox-inner {
        ${tw`rounded-[2px]`}
        border: 1px solid ${({ theme }) => theme.text34};
      }
      .ant-checkbox-checked {
        ${tw`rounded-[2px]  `}
      }
    }

    .flexContainer {
      ${tw`flex h-screen pr-[14px] sm:px-0`}
    }

    .filtersContainer {
      border: 2px solid #3c3c3c;
      ${tw`h-[70px] `}
    }
  `}
`

export const NFT_COLLECTIONS_GRID = styled.div<{ gridType?: string }>`
  ${tw`w-full `}
  ${({ theme }) => theme.customScrollBar('0px')}
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
    ${tw`grid pl-2 sm:pl-1 sm:grid-cols-2 rounded-[10px] pb-[300px]`}
  }
  .gridContainerProfile {
    grid-template-columns: repeat(auto-fit, minmax(195px, ${({ gridType }) => (gridType ? gridType : '1fr')}));
    ${tw`grid p-3 sm:p-1 sm:pl-1 sm:grid-cols-2  overflow-y-auto pb-[316px] dark:bg-black-1 bg-grey-6 `}
    ${({ theme }) => theme.customScrollBar('0px')}
  }
  .pinkGradient {
    background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
    white-space: nowrap;
  }

  .gridItemRegular {
    ${tw`w-full h-full p-[1px] sm:flex max-h-[305px] max-w-[300px]
     sm:w-[175px] sm:h-[270px] sm:mt-1 rounded-[10px] mx-auto sm:ml-0.5 z-[0]`}
    background: ${({ theme }) => theme.borderForNFTCard};
  }
  .gridGradient {
    ${tw`p-[1.2px] sm:p-[1.5px]`}
    background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
  }

  .gridItem {
    ${tw`relative h-full w-full rounded-[9.7px] dark:bg-black-1 bg-white 
      duration-500 cursor-pointer mx-auto z-[0]`}
  }

  .gridItemCollections {
    ${tw`h-[295px] w-[190px] sm:w-[185px] rounded-[10px] dark:bg-black-1 bg-white
      duration-500 cursor-pointer mb-[10px] mt-[15px] sm:mt-[8px] mx-auto sm:ml-0.5 z-[0]`};
    border: 1px solid ${({ theme }) => theme.borderForNFTCard}; // change lite mode
  }

  .gridItemContainer {
    ${tw`flex p-[8px] pb-0 justify-center relative z-[1] `}

    .nftImg {
      ${tw`flex items-center w-full min-h-[164px] max-h-[184px] sm:!max-h-[157px] sm:max-w-[157px]
       overflow-hidden rounded-[5px] sm:min-h-[150px] `}
      img {
        height: auto;
        width: 100%;
      }
    }
    .hoverAddToBag {
      ${tw`h-[35px] w-[35px] right-[15px] top-[15px] absolute`}
    }
    .hoverButtons {
      ${tw`h-[30px] absolute bottom-4 text-white flex items-center justify-center w-[100%] py-[15px]`}
    }

    .hoverNFT {
      ${tw`absolute opacity-100 duration-300 z-10 w-full h-[102%] mt-[-8px] rounded-[10px]`}
      background: ${({ theme }) => theme.hoverGradient};
    }
  }
  .nftTextContainer {
    ${tw`relative p-2.5 sm:px-2.5 sm:py-1 dark:text-white text-black-4 sm:h-[105px]`}
  }
  .collectionId {
    ${tw`text-[15px] font-semibold flex items-center leading-[18px] justify-between`}

    .isVerified {
      ${tw` ml-2 w-[15px] h-[15px]`}
    }

    .ah-name {
      ${tw`w-[22px] h-[22px]`}
    }
  }
  .nftPrice {
    ${tw`font-semibold text-[15px] flex items-center pt-3 sm:pt-1.5`}
    img {
      ${tw`w-5 h-5 ml-2.5`}
    }
  }
  .apprisalPrice {
    ${tw`font-semibold text-[15px] mt-[-2px] dark:text-grey-5 text-grey-1 flex items-center`}
    img {
      ${tw`w-[20px] h-[20px] ml-2.5`}
    }
  }
  .apprisalPriceProfile {
    ${tw`font-semibold text-[15px] sm:mt-0 mt-[8px] text-[#636363] absolute bottom-2.5 flex items-center`}
    img {
      ${tw`w-[20px] h-[20px] ml-2.5`}
    }
  }

  .card-like {
    ${tw`absolute right-[10px] bottom-[10px] w-[20px] h-[20px]`}
  }
`
export const DROPDOWN_CONTAINER = styled.div`
  ${tw`rounded-md p-1 -mt-1 sm:w-[185px] text-[15px] font-semibold`}
  background-color: ${({ theme }) => theme.dropdownBackground};
  color: ${({ theme }) => theme.text1};
  border: 1px solid #b5b5b5;
  ${({ theme }) => theme.customScrollBar('0px')}
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
      color: ${({ theme }) => theme.bg20};
    }
  }
  > div {
    ${tw`flex items-center mb-2`}
    > span {
      ${tw`text-white text-regular font-semibold`}
    }
    > input[type='radio'] {
      ${tw`appearance-none absolute right-3 h-[15px] w-[15px]   rounded-small cursor-pointer`}
      background: ${({ theme }) => theme.bg22};
    }
    > input[type='radio']:checked:after {
      ${tw`rounded-small w-[10px] h-[10px] relative top-[-4px] left-[2.3px] inline-block`}
      background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
      content: '';
    }
  }
`
export const NFT_FILTERS_CONTAINER = styled.div<{ index }>`
  ${({ index }) => css`
    ${tw`duration-500 items-center flex h-[70px] sm:h-[98px] sm:flex-col px-3.5`}
    // this border bottom only for web and not for mobile
    border-bottom: 1px solid ${({ theme }) => theme.borderBottom};
    @media (max-width: 500px) {
      border-bottom: none;
    }
    .pinkGradient {
      background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
      white-space: nowrap;
    }
    .sortingBtn {
      ${tw`w-[180px] text-black-4 dark:text-white h-8.75 dark:bg-black-2 bg-white rounded-3xl ml-[15px]	
      font-semibold text-[15px] flex items-center justify-center cursor-pointer`}
    }
    .offerBtn {
      ${tw`w-[115px] ml-2 text-white h-[40px] dark:bg-black-2 bg-white rounded-3xl text-black-4 dark:text-white
      	font-semibold text-[15px]
       flex items-center pl-3 cursor-pointer`}
    }
   
    .filtersViewCategory {
       ${tw`text-[15px] ml-auto flex font-semibold sm:ml-0 overflow-x-auto sm:mt-2 sm:w-[100%]`};
       ::-webkit-scrollbar {
      display: none;
    }
    }
    .flitersFlexContainer {
      ${tw`text-[15px] flex ml-[-10px] font-medium sm:ml-1 sm:mt-2.5 mt-1 sm:w-[100%] items-center `}
    }
    .flexContainer {
      margin-left: auto;
      height: fit-content;
      color: ${({ theme }) => theme.text12};
      ${tw`mt-10 text-[15px] font-medium`}
    }
    .selected {
      ${tw`w-auto sm:pl-3 sm:pr-6  sm:w-[125px] mb-4 sm:mb-0 items-center sm:mt-1 text-[15px] duration-500
       font-semibold text-white flex justify-between flex-col cursor-pointer`}
        white-space: nowrap; /* Prevent content from wrapping */
    }
    .flexItemProfile {
      ${tw`w-[130px] sm:w-[33%] mb-4 sm:mt-1 text-grey-1 !z-[20]
      items-center flex justify-between flex-col cursor-pointer`}
    }
    .selectedProfile {
      ${tw`w-[130px] sm:w-[33%] sm:pl-1 mb-4 items-center sm:mt-1 text-[#5855ff] dark:text-white
       font-semibold  flex justify-between flex-col cursor-pointer !z-[20]`}
    }
    }
    
    .flexItem {
      ${tw` w-auto sm:pl-4 sm:pr-6 mb-4 font-medium text-[15px] text-grey-1
       sm:mt-1 items-center flex justify-between flex-col cursor-pointer sm:w-[125px]`}
        white-space: nowrap; /* Prevent content from wrapping */
    }
   
    .activeItem {
      ${tw`h-2  block mt-3 sm:mt-8 rounded-b-circle sm:absolute font-semibold duration-500 
      bg-[#5855ff] w-[70%] sm:w-[20%]`}
    }
    .activeItemMobile {
      ${tw`!h-[7px]  sm:mt-[0px] rounded-b-circle  font-semibold duration-500 
      bg-blue-1 text-blue-1  sm:w-[60px] relative duration-500`}
       transform: rotate(180deg);
    }
    .activeItemProfile {
      ${tw`h-2  block mt-3 sm:mt-2 rounded-b-circle font-semibold sm:absolute
       duration-500 bg-[#5855ff] w-[65%] sm:w-[20%] sm:mt-[34px]`}
      content: '';
      transform: rotate(180deg);
      margin-left: ${index * 260 + `px`};
      @media (max-width: 500px) {
        margin-left: calc( ${index * 33.2 + `%`} + 25px);
      }
    }
  `}
`
