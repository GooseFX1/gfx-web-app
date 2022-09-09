import styled from 'styled-components'

export const StyledTabContent = styled.div`
  .profile-content-loading {
    position: relative;
    height: calc(100% - 66px);
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      position: relative;
    }
  }

  ${({ theme }) => `
    height: 58vh;
    margin-top: -66px;
        
    .profile-search-bar {
      position: absolute;
      left: 40px;
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
      padding: ${theme.margin(12)} ${theme.margin(5)}  ${theme.margin(4)};
      overflow-x: hidden;
      overflow-y: scroll;
      ${theme.customScrollBar('4px')}

      .card{
        @media(max-width: 500px){
          display: flex;
          flex-direction: column;
          height: auto;
          justify-content: center;
        }

        .card-image-wrapper{
          @media(max-width: 500px){
            padding: 8px;
          }
        }
      }
    }

  `}
`
