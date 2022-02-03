import styled from 'styled-components'

export const StyledCard = styled.div<{ $border?: boolean }>`
  ${({ theme, $border }) => `
  border: ${$border ? '1px solid white' : 'none'};
max-width: 285px;
${theme.largeBorderRadius}
background-color: #171717;
padding: ${theme.margin(2)} ${theme.margin(2.5)};
cursor: pointer;
z-index: 2;
.card-image {
  max-width: 245px;
  width: 100%;
  height: auto;
  ${theme.largeBorderRadius}
}
.info {
  margin-top: ${theme.margin(1.5)};
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
  margin-bottom: ${theme.margin(0.5)};
}
.other {
  font-weight: 500;
}
.check-icon {
  margin-left: ${theme.margin(0.5)};
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
    margin-right: ${theme.margin(1.5)};
    padding-top: ${theme.margin(1)};
  }

  .heart-red,
  .heart-empty {
    width: 15px;
    height: 15px;
    margin-right: ${theme.margin(0.5)};
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
      margin-right: ${theme.margin(0.5)};
      display: inline-block;
    }
  }
  .price-number {
    margin-left: ${theme.margin(0.5)};
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
