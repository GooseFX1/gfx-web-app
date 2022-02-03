import styled from 'styled-components'

export const StyledMyNFT = styled.div`
  ${({ theme }) => `
  display: flex;
  justify-content: space-between;
  padding: ${theme.margin(9, 11)};
  margin: ${theme.margin(2)} 0;
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
    padding-right: ${theme.margin(11)};
    .my-created-NFT-image {
      width: 100%;
      height: auto;
      ${theme.largeBorderRadius}
    }
    .heading {
      margin: ${theme.margin(2)} 0;
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
          margin-left: ${theme.margin(1)};
          display: inline-block;
        }
      }
    }
    .countdown {
      height: 75px;
      background-color: ${theme.bg5};
      padding: 0 ${theme.margin(4.5)};
      ${theme.largeBorderRadius}
      display: flex;
      align-items: center;
      justify-content: space-around;
      .unit {
        & + .unit {
          margin-left: ${theme.margin(7.5)};
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
        margin-right: ${theme.margin(1)};
      }
      .text {
        font-size: 12px;
        font-weight: 600;
        color: ${theme.text1};
      }
    }
  }
  .block-right {
    padding-left: ${theme.margin(11)};
    .heading {
      display: flex;
      justify-content: space-between;
      margin-bottom: ${theme.margin(1.5)};
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
      margin-bottom: ${theme.margin(2)};
      .price-sol-image {
        width: 32px;
        height: 32px;
        margin-right: ${theme.margin(1.5)};
      }
      .price {
        font-size: 25px;
        font-weight: bold;
        color: ${theme.text1};
        margin-right: ${theme.margin(1.5)};
      }
      .price-usd {
        font-size: 14px;
        font-weight: 500;
        color: ${theme.text1};
        margin-right: ${theme.margin(1.5)};
      }
      .progress-image {
        width: 14px;
        height: auto;
        margin-right: ${theme.margin(1)};
      }
      .percent {
        font-size: 11px;
        font-weight: 600;
        color: ${theme.text1};
      }
    }
    .title {
      margin-bottom: ${theme.margin(1)};;
      font-size: 22px;
      font-weight: 600;
      color: ${theme.text1};
    }
    .description {
      font-size: 12px;
      font-weight: 500;
      color: ${theme.text1};
      margin-bottom: ${theme.margin(1.5)};;
    }
    .collection-group {
      display: flex;
      align-items: center;
      margin-bottom: ${theme.margin(2)};;
      .item {
        margin-right: ${theme.margin(5)};;
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
          margin-right: ${theme.margin(1)};;
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
        padding: ${theme.margin(3)};
        font-size: 14px;
        font-weight: 600;
        color: ${theme.text1};
        .info-item {
          & + .info-item {
            margin-left: ${theme.margin(7)};
          }
        }
      }
      .content {
        padding: ${theme.margin(1.5, 3)};
        .content-row {
          display: flex;
          justify-content: space-around;
          width: 100%;
          & + .content-row {
            margin-top: ${theme.margin(1.5)};
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
        padding: ${theme.margin(2, 3, 1.5)};
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .btn-edit {
          border: none;
          width: calc(100% - 76px);
          margin-right: ${theme.margin(1)};;
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
          margin-left: ${theme.margin(1)};
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
