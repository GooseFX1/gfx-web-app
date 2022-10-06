import { MainButton } from './../../components/MainButton'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const OPERATIONS_BTN = styled(MainButton)`
  ${tw`w-96 h-11 text-base font-semibold text-white ml-3 mr-3 mt-2 cursor-pointer`}
  border-radius: 50px;
  opacity: 0.65;
  border: 2px solid;
  background: #131313;
  &:focus,
  &.active {
    opacity: 1;
    background: ${({ theme }) => theme.primary3};
  }
  &:disabled {
    opacity: 0.5;
    border: none;
  }
`
export const STYLED_RIGHT_CONTENT = styled.div`
  display: flex;
  &.connected {
    width: 60%;
  }
  .rightInner {
    display: flex;
    margin-right: 0;
    margin-left: auto;
  }
`
export const STYLED_LEFT_CONTENT = styled.div`
  width: 25%;
  &.connected {
    width: 25%;
  }
  .leftInner {
    display: flex;
    align-items: center;
  }
  &.disconnected {
    .leftInner {
      max-width: 270px;
    }
  }
`
export const STYLED_DESC = styled.div`
  ${tw`flex -mt-1.5`}
  .balanceAvailable {
    font-size: 15px;
    ${tw` font-medium my-1 `}
  }
  .value {
    font-size: 15px;
    ${tw` font-medium my-1 ml-2`}
    color: ${({ theme }) => theme.text7};
  }
`
export const INPUT_CONTAINER = styled.div`
  ${tw`flex justify-between items-center w-96 h-16`}
  &.active {
    .value {
      color: #fff;
      font-weight: 600;
    }
  }
  .halfMaxText {
    ${tw`text-base font-semibold text-center mb-1.5 flex -ml-32 cursor-pointer`}
    color: ${({ theme }) => theme.text14};
  }
  .text2 {
    margin-left: ${({ theme }) => theme.margin(1.5)};
  }
`
export const STYLED_INPUT = styled.input`
  ${tw`w-96 h-11 flex items-center justify-between border-none font-semibold ml-4 
  text-xl font-semibold text-left  pl-4 `}
  background-color: ${({ theme }) => theme.solPillBg};
  border-radius: 60px;
  color: #fff;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  margin: 0 ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(1)};

  .text2 {
    margin-left: ${({ theme }) => theme.margin(2)};
  }
`

export const TABLE_ROW = styled.tr<{ isOpen: boolean; publicKey: any; checkMobile: boolean }>`
  ${({ isOpen, publicKey, checkMobile }) => css`
    cursor: ${!isOpen && 'pointer'};
    height: ${!isOpen && '90px'} !important;
    background: ${({ theme }) => (checkMobile ? theme.expendedRowBg : theme.cellBackground)};
    background: ${!isOpen && 'none'};
    border-bottom: 1px solid ${({ theme }) => theme.borderBottom};
    border-bottom: ${isOpen && 'none'};
    @media (max-width: 500px) {
      height: ${isOpen ? (publicKey ? '470px' : '250px') : '80px'} !important;
    }
  `}

  ${tw`text-base font-medium`}
  td {
    ${tw`align-top text-center pt-8`}
  }
  .nameColumn {
    width: 11%;
    img {
      ${tw`w-10 h-10 mr-12 -mt-2.5`}
    }
    .columnText {
      ${tw`pl-12 -mt-8`}
      margin-left: 5%;
      @media (max-width: 500px) {
        margin-left: 15px;
        padding-top: 2px;
      }
    }
  }
  .balanceColumn {
    width: 18%;
  }
  .balanceConnectWallet {
    width: 17%;
    padding-left: 4vw;
  }
  .volumeColumn {
    width: 15%;
    padding-right: 40px;
  }
  .earnedColumn {
    width: 15%;
  }
`
export const STYLED_STAKED_EARNED_CONTENT = styled.div`
  .info-item {
    ${tw`flex flex-col items-start`}
    min-width: 170px;
    .title,
    .value {
      ${tw`text-lg font-semibold mt-1`}
      color: ${({ theme }) => theme.text7};
    }
    .price {
      ${tw`text-lg font-semibold mb-4 mt-1`}
      color: ${({ theme }) => theme.text13};
    }
  }
`
export const TOKEN_OPERATIONS_CONTAINER = styled.td`
  height: 160px;
  background: ${({ theme }) => theme.expendedRowBg};
  border-bottom: 1px solid ${({ theme }) => theme.borderBottom};
  padding-left: 2.5vw;
  .availableToMint {
    ${tw`text-lg font-semibold mt-4 flex`}
  }
  .halfMaxBtn {
    cursor: pointer;
  }
  .arrowDown {
    transform: rotate(90deg);
  }
  @media (max-width: 500px) {
    left: 0;
    width: 100vw;
  }
`
