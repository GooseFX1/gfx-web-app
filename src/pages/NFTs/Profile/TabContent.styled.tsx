import styled from 'styled-components'

export const StyledTabContent = styled.div`
  padding: 6px 40px 22px;
  .actions-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .search-group {
    display: flex;
    align-items: center;
    width: 100%;
    > div:nth-child(1) {
      height: 43px;
      padding: 0 20px;
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
    display: flex;
    flex-wrap: wrap;
    margin: ${({ theme }) => theme.margins['4x']} -${({ theme }) => theme.margins['1.5x']} 0;
    .card-item {
      width: 20%;
      padding: 0 12px;
      margin-bottom: 24px;
    }
  }
`
