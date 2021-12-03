import styled from 'styled-components'
import { Dropdown, Menu } from 'antd'

export const StyledHeaderProfile = styled.div<{ mode?: string }>`
  ${({ theme, mode }) => `
  position: relative;
  height: 260px;
  padding: ${theme.margins['3x']};
  ${theme.largeBorderRadius}
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  background: rgb(30, 30, 30);
  background: ${mode === 'dark' ? 'linear-gradient(0deg, rgba(0, 0, 0, 1) 3%, rgba(30, 30, 30, 1) 43%)' : theme.white};
  .back-icon {
    position: absolute;
    top: 55px;
    left: 55px;
    transform: rotate(90deg);
    width: 26px;
    filter: ${
      mode === 'dark'
        ? 'invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%)'
        : '#000'
    };
    cursor: pointer;
  }
  .avatar-profile-wrap {
    position: relative;
    width: 80px;
    margin: 0 auto;
    .avatar-profile {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    .edit-icon {
      position: absolute;
      width: 31px;
      height: 31px;
      bottom: -5px;
      right: -1px;
      cursor: pointer;
    }
  }
  .name-wrap {
    margin-top: ${theme.margins['1x']};
    ${theme.flexCenter}
  }
  .name {
    color: ${theme.text1};
    font-size: 18px;
    display: inline-block;
    margin-right: ${theme.margins['1x']};
  }
  .check-icon {
    width: 20px;
    height: 20px;
  }
  .social-list {
    margin-top: ${theme.margins['2x']};
    ${theme.flexCenter}
    .social-item {
      display: inline-block;
      width: 35px;
      margin: 0 ${theme.margins['1x']};
    }
    .social-icon {
      width: 35px;
      height: 35px;
    }
  }
  .action-wrap {
    position: absolute;
    top: 44px;
    right: 21px;
    .btn-create {
      color: ${theme.white};
      background-color: #3735bb;
      height: 41px;
      min-width: 132px;
      ${theme.roundedBorders}
      font-size: 13px;
      border: none;
      cursor: pointer;
    }
  }
`}
`
export const StyledDropdown = styled(Dropdown)`
  width: auto;
  padding: 0;
  border: none;
  background: transparent;
  margin-left: ${({ theme }) => theme.margins['3x']};
  .more-icon {
    width: 43px;
    height: 41px;
  }
`
export const StyledMenu = styled(Menu)`
  ${({ theme }) => `
  font-size: 12px;
  color: ${theme.white};
  background-color: ${theme.black};
  min-width: 208px;
  padding: ${theme.margins['1x']} 0;
  ${theme.smallBorderRadius}
  margin-top: ${theme.margins['2x']};
  position: relative;
  li {
    padding: ${theme.margins['1x']} ${theme.margins['3x']};
  }
  &:before {
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-top-color: #000;
    border-left-color: #000;
    top: -5px;
    right: 18px;
    position: absolute;
    z-index: 1;
    display: block;
    width: 10px;
    height: 10px;
    background: transparent;
    border-style: solid;
    border-width: 5px;
    transform: rotate(45deg);
    content: '';
  }
`}
`
