import { Button, Dropdown, Menu } from 'antd'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

const COLLECTION_HEADER_V2 = styled.div`
  position: relative;
  .collection-header-banner {
    width: 100%;
    height: auto;
  }

  .collection-back-icon {
    position: absolute;
    top: 55px;
    left: 55px;
    transform: rotate(90deg);
    width: 36px;
    filter: ${({ theme }) => theme.filterBackIcon};
    cursor: pointer;
  }

  .collection-header-content {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    left: 0;
    width: 100%;
    bottom: 0;
    height: 80px;
    padding: 0 ${({ theme }) => theme.margin(5)};
  }

  .solcities {
    display: flex;
    margin-right: ${({ theme }) => theme.margin(8.5)};

    .label {
      font-size: 35px;
      font-weight: 500;
      margin-right: ${({ theme }) => theme.margin(2)};
    }

    img {
      width: 40px;
      height: 40px;
    }
  }

  .desc {
    font-size: 20px;
    font-weight: 600;
    margin-right: ${({ theme }) => theme.margin(10)};
  }

  .categories {
    display: flex;
    .item {
      margin-right: ${({ theme }) => theme.margin(10)};
    }

    .value {
      font-size: 25px;
      font-weight: 600;
    }

    .text {
      font-size: 18px;
    }
  }
`

const DROPDOWN = styled(Dropdown)`
  width: 55px;
  height: 55px;
  padding: 0;
  border: none;
  background: transparent;
  z-index: 2;
  position: relative;
  margin-left: ${({ theme }) => theme.margin(3)};

  .collection-more-icon {
    width: 43px;
    height: 41px;
  }

  &:after {
    content: none;
  }
`
const MENU_LIST = styled(Menu)`
  color: #fff;
  background-color: ${({ theme }) => theme.bg6};
  min-width: 120px;
  border-radius: 10px;
  position: relative;
  padding: ${({ theme }) => theme.margin(1.5)};

  li {
    padding: ${({ theme }) => `${theme.margin(0.5)} ${theme.margin(1.5)}`};
    font-size: 11px;
    text-align: center;
    color: ${({ theme }) => theme.text1};

    &:hover {
      color: ${({ theme }) => theme.secondary4};
    }
  }

  &:before {
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-top-color: ${({ theme }) => theme.bg6};
    border-left-color: ${({ theme }) => theme.bg6};
    top: -5px;
    right: 16px;
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
`

const menu = (
  <MENU_LIST>
    <Menu.Item>Text 1</Menu.Item>
    <Menu.Item>Text 1</Menu.Item>
  </MENU_LIST>
)

export const CollectionHeaderV2 = () => {
  const history = useHistory()
  return (
    <COLLECTION_HEADER_V2>
      <img className="collection-back-icon" src={`/img/assets/arrow.svg`} alt="back" onClick={() => history.goBack()} />
      <img className="collection-header-banner" src={`/img/assets/collection-header-banner.png`} alt="banner" />
      <div className="collection-header-content">
        <div className="solcities">
          <span className="label">Solcities</span>
          <img src={`/img/assets/check-icon.png`} alt="check" />
        </div>
        <div className="desc">9,999 3D levitating cities of the metaverse on Solana.</div>
        <div className="categories">
          <div className="item">
            <div className="value">1.05 SOL</div>
            <div className="text">Floor price</div>
          </div>
          <div className="item">
            <div className="value">33.5 K SOL </div>
            <div className="text">Volume Traded</div>
          </div>
          <DROPDOWN overlay={menu} trigger={['click']} placement="bottomRight" align={{ offset: [0, 26] }}>
            <Button>
              <img className="collection-more-icon" src={`/img/assets/more_icon.svg`} alt="more" />
            </Button>
          </DROPDOWN>
        </div>
      </div>
    </COLLECTION_HEADER_V2>
  )
}
