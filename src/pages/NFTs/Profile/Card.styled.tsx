import styled from 'styled-components'

export const StyledCard = styled.div`
  ${({ theme }) => `
max-width: 285px;
${theme.largeBorderRadius}
background-color: #171717;
padding: ${theme.margins['2x']} ${theme.margins['2.5x']};
cursor: pointer;
z-index: 2;
.card-image {
  max-width: 245px;
  width: 100%;
  height: auto;
  ${theme.largeBorderRadius}
}
.info {
  margin-top: ${theme.margins['1.5x']};
  position: relative;
  text-align: left;
}
.name,
.number,
.other {
  color: #fff;
  font-size: 15px;
  font-family: Montserrat;
}
.name,
.number {
  font-weight: 600;
}
.number {
  margin-bottom: ${theme.margins['0.5x']};
}
.other {
  font-weight: 500;
}
.check-icon {
  margin-left: ${theme.margins['0.5x']};
  width: 14px;
  height: auto;
}
.like-group {
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  top: -5px;
  &.favorited-group {
    top: 5px;
    .like-count {
      color: #fff;
      font-size: 14px;
    }
  }
  .heart-purple {
    width: 32px;
    height: 32px;
    margin-right: ${theme.margins['1.5x']};
    padding-top: ${theme.margins['1x']};
  }

  .heart-red,
  .heart-empty {
    width: 15px;
    height: 15px;
    margin-right: ${theme.margins['0.5x']};
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
  .sell-now-btn,
  .buy-now-btn {
    width: 72px;
    height: 29px;
    border-radius: 29px;
    color: #fff;
    font-weight: 600;
    font-size: 11px;
    border: none;
    line-height: 23px;
    background-color: #3735bb;
    position: relative;
    cursor: pointer;
    z-index: 5;
  }
  .price-group {
    display: flex;
    font-size: 12px;
    .text {
      color: #ababab;
      margin-right: ${theme.margins['0.5x']};
      display: inline-block;
    }
  }
  .price-number {
    margin-left: ${theme.margins['0.5x']};
    display: inline-block;
    color: ${theme.text1};
  }
  .price-image {
    width: 19px;
    height: auto;
  }
  .card-logo {
    width: 50px;
    height: auto;
    border-radius: 4px;
  }
}
`}
`
