import styled from 'styled-components'

export const StyledMyNFT = styled.div`
  ${({ theme }) => `
  display: flex;
  justify-content: space-between;
  padding: ${theme.margins['9x']} ${theme.margins['11x']};
  margin: ${theme.margins['2x']} 0;
  text-align: left;
  max-width: 1250px;
  margin: 0 auto;
  background-color: ${theme.bg3};
  position: relative;
  ${theme.largeBorderRadius}
  .back-icon {
    position: absolute;
    top: 35px;
    left: 35px;
    transform: rotate(90deg);
    width: 18px;
    filter: invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%);
    cursor: pointer;
  }
  .width-50 {
    width: 50%;
  }
  .block-left {
    padding-right: ${theme.margins['11x']};
    .my-created-NFT-image {
      width: 100%;
      height: auto;
      ${theme.largeBorderRadius}
    }
    .heading {
      margin: ${theme.margins['2x']} 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 12px;
        font-weight: 600;
        color: ${theme.text1};
      }
      .liked {
        display: flex;
        align-items: center;
        .heart-empty {
          width: 24px;
          height: auto;
        }
        .liked-count {
          font-size: 18px;
          font-weight: 600;
          color: #636363;
          margin-left: ${theme.margins['1x']};
          display: inline-block;
        }
      }
    }
    .countdown {
      height: 75px;
      background-color: ${theme.bg5};
      padding: 0 ${theme.margins['4.5x']};
      ${theme.largeBorderRadius}
      display: flex;
      align-items: center;
      justify-content: space-around;
      .unit {
        & + .unit {
          margin-left: ${theme.margins['7.5x']};
        }
      }
      .number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: inline-block;
        font-size: 18px;
        font-weight: 500;
        color: #fff;
        background-color: ${theme.bg7};
        line-height: 40px;
        text-align: center;
        margin-right: ${theme.margins['1x']};
      }
      .text {
        font-size: 12px;
        font-weight: 600;
        color: ${theme.text1};
      }
    }
  }
  .block-right {
    padding-left: ${theme.margins['11x']};
    .heading {
      display: flex;
      justify-content: space-between;
      margin-bottom: ${theme.margins['1.5x']};
      .text-1 {
        font-size: 18px;
        font-weight: 600;
        color: ${theme.text1};
      }
      .text-2 {
        font-size: 14px;
        font-weight: 600;
        color: ${theme.text1};
      }
    }
    .price-group {
      display: flex;
      align-items: center;
      margin-bottom: ${theme.margins['2x']};
      .price-sol-image {
        width: 32px;
        height: 32px;
        margin-right: ${theme.margins['1.5x']};
      }
      .price {
        font-size: 25px;
        font-weight: bold;
        color: ${theme.text1};
        margin-right: ${theme.margins['1.5x']};
      }
      .price-usd {
        font-size: 14px;
        font-weight: 500;
        color: ${theme.text1};
        margin-right: ${theme.margins['1.5x']};
      }
      .progress-image {
        width: 14px;
        height: auto;
        margin-right: ${theme.margins['1x']};
      }
      .percent {
        font-size: 11px;
        font-weight: 600;
        color: ${theme.text1};
      }
    }
    .title {
      margin-bottom: ${theme.margins['1x']};;
      font-size: 22px;
      font-weight: 600;
      color: ${theme.text1};
    }
    .description {
      font-size: 12px;
      font-weight: 500;
      color: ${theme.text1};
      margin-bottom: ${theme.margins['1.5x']};;
    }
    .collection-group {
      display: flex;
      align-items: center;
      margin-bottom: ${theme.margins['2x']};;
      .item {
        margin-right: ${theme.margins['5x']};;
        .image {
          display: flex;
          align-items: center;
          .name {
            font-size: 14px;
            font-weight: 500;
            color: ${theme.text1};
          }
        }
        .collect-image {
          border-radius: 50%;
          width: 30px;
          height: 30px;
          margin-right: ${theme.margins['1x']};;
        }
      }
      .title {
        font-size: 16px;
        font-weight: 600;
        color: ${theme.text1};
      }
    }
    .table-info {
      background-color: ${theme.bg7};
      ${theme.largeBorderRadius}
      .list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        background-color: ${theme.bg5};
        ${theme.largeBorderRadius}
        padding: ${theme.margins['3x']};
        font-size: 14px;
        font-weight: 600;
        color: ${theme.text1};
        .info-item {
          & + .info-item {
            margin-left: ${theme.margins['7x']};
          }
        }
      }
      .content {
        padding: ${theme.margins['1.5x']} ${theme.margins['3x']};
        .content-row {
          display: flex;
          justify-content: space-around;
          width: 100%;
          & + .content-row {
            margin-top: ${theme.margins['1.5x']};
          }
          .text-1 {
            font-size: 14px;
            font-weight: 500;
            color: ${theme.text1};
            text-align: left;
            width: 50%;
          }
          .text-2 {
            font-size: 14px;
            font-weight: 500;
            color: ${theme.text5};
            width: 50%;
            text-align: right;
          }
        }
      }
      .actions {
        background: ${theme.bg8};
        border-radius: 0 0 20px 20px;
        padding: ${theme.margins['2x']} ${theme.margins['3x']} ${theme.margins['1.5x']};
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .btn-edit {
          border: none;
          width: calc(100% - 76px);
          margin-right: ${theme.margins['1x']};;
          height: 60px;
          line-height: 60px;
          border-radius: 29px;
          background-color: #3735bb;
          font-size: 17px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
        }
        .share-link {
          display: inline-block;
          margin-left: ${theme.margins['1x']};
          .share-image {
            width: 60px;
            height: 60px;
          }
        }
      }
    }
  }
`}
`
