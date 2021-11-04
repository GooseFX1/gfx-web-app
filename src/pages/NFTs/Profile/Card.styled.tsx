import styled from 'styled-components'

export const StyledCard = styled.div`
  max-width: 285px;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.bg4};
  padding: 16px 20px;
  cursor: pointer;
  .card-image {
    max-width: 245px;
    width: 100%;
    height: auto;
    border-radius: 15px;
  }
  .info {
    margin-top: 12px;
    position: relative;
    text-align: left;
  }
  .name,
  .number,
  .other {
    color: ${({ theme }) => theme.text1};
    font-size: 15px;
    font-weight: 600;
  }
  .number {
    margin-bottom: 6px;
  }
  .check-icon {
    margin-left: 5px;
    width: 14px;
    height: auto;
  }
  .like-group {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    top: -5px;
    .heart-purple {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      padding-top: 6px;
    }

    .heart-red,
    .heart-empty {
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }
    .like-count {
      color: #4b4b4b;
      font-size: 13px;
      font-weight: 600;
      line-height: 15px;
    }
  }
  .option {
    position: absolute;
    bottom: 0;
    right: 0;
    .price-group {
      display: flex;
      font-size: 12px;
      .text {
        color: #ababab;
        margin-right: 5px;
        display: inline-block;
      }
    }
    .price-number {
      margin-left: 5px;
      display: inline-block;
      color: ${({ theme }) => theme.text1};
    }
    .price-image {
      width: 19px;
      height: auto;
    }
    .card-logo {
      width: 50px;
      height: auto;
      background: ${({ theme }) => theme.bg6};
      border-radius: 4px;
    }
  }
`
