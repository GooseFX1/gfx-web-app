import styled from 'styled-components'

export const StyledTabContent = styled.div`
  .profile-content-loading {
    position: relative;
    height: calc(100% - 44px);
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      position: relative;
    }
  }

  ${({ theme }) => `
    height: calc(100% + 66px);
    margin-top: -66px;
    padding: 0 ${theme.margin(5)};
    
    .actions-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom:21px;
      * {
        z-index: 50;
      }
    }
    
    .profile-search-bar {
      width: 430px;
      padding: 12px 24px;
      margin-left: 0 !important;
      z-index: 20;
      
      > div:nth-child(1) {
        height: 43px;
        padding: 0 ${theme.margin(2.5)};
        max-width: 430px;
      }
      input {
        width: 277px;
        line-height: 21px;
        height: 21px;
        font-size: 17px;
      }
      .ant-image-img {
        width: 18px;
      }
    }

    .total-result {
      color: #6f6f6f;
      font-size: 17px;
      font-weight: 600;
    }

    .cards-list {
      position:relative;
      height: calc(100% - 66px);
      display: flex;
      flex-wrap: wrap;
      padding: ${theme.margin(4)} 0;
      overflow-x: hidden;
      overflow-y: scroll;
      ${theme.customScrollBar('4px')};
    }

  `}
`
