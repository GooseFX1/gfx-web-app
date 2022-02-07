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
    height: 100%;
    padding: ${theme.margin(3)} ${theme.margin(5)} 0;
    overflow-x: hidden;
    overflow-y: scroll;
    
    .actions-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .profile-search-bar {
      width: 430px;
      margin-left: 0 !important;
      
      > div:nth-child(1) {
        height: 43px;
        padding: 0 ${theme.margin(2.5)};
        max-width: 430px;
      }
      input {
        width: 277px;
        font-size: 14px;
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
      display: flex;
      flex-wrap: wrap;
      margin: ${theme.margin(4)} -${theme.margin(1.5)};
      
    }
    
    ${theme.customScrollBar('4px')};

  `}
`
