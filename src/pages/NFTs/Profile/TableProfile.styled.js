import styled from 'styled-components'

export const StyledTabProfile = styled.div`
  z-index: 3;
  margin-top: -52px;
  .ant-tabs-ink-bar {
    display: none;
  }
  .ant-tabs-top {
    > .ant-tabs-nav {
      &::before {
        border: none;
      }
    }
  }
  .ant-tabs-tab {
    color: #616161;
    font-size: 18px;
    + .ant-tabs-tab {
      margin: 0 0 0 55px;
    }
    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: ${({ theme }) => theme.text1};
        font-weight: 600;
      }
    }
  }
`
