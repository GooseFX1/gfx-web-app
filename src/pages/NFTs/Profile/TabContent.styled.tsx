import styled from 'styled-components'

export const StyledTabContent = styled.div`
  ${({ theme }) => `
  padding: ${theme.margins['1x']} ${theme.margins['5x']} ${theme.margins['3x']};
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
      padding: 0 ${theme.margins['2.5x']};
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
    margin: ${theme.margins['4x']} -${theme.margins['1.5x']} 0;
    .card-item {
      width: 20%;
      padding: 0 ${theme.margins['1.5x']};
      margin-bottom: ${theme.margins['3x']};
    }
  }
`}
`
