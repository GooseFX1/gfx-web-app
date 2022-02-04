import styled from 'styled-components'

export const StyledTabContent = styled.div`
  ${({ theme }) => `
  padding: ${theme.margin(1)} ${theme.margin(5)} ${theme.margin(3)};
  .actions-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: ${theme.margin(1.5)};
  }
  .search-group {
    display: flex;
    align-items: center;
    width: 100%;
    > div:nth-child(1) {
      height: 43px;
      padding: 0 ${theme.margin(2.5)};
      max-width: 430px;
      margin-left: 0;
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
    display: flex;
    flex-wrap: wrap;
    margin: ${theme.margin(4)} -${theme.margin(1.5)} 0;
    .card-item {
      width: 226px;
      margin-left: 25px;
      margin-right: 25px;
      margin-bottom: ${theme.margin(3)};
    }
  }
`}
`
