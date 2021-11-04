import { Button, Col, Dropdown, Menu, Row } from 'antd'
import { SearchBar } from '../SearchBar'
import { Sort } from './Sort'
import { Stats } from './Stats'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { statsData } from './mockData'

const COLLECTION_HEADER = styled.div`
  position: relative;
  height: 290px;
  padding: ${({ theme }) => theme.margins['3x']};
  border-radius: 20px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  background: ${({ theme }) => theme.collectionHeader};

  .collection-back-icon {
    position: absolute;
    top: 55px;
    left: 55px;
    transform: rotate(90deg);
    width: 36px;
    filter: invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%);
    cursor: pointer;
  }

  .collection-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }

  .collection-name-wrap {
    margin-top: ${({ theme }) => theme.margins['1.5x']};
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .collection-name {
    color: #fff;
    font-size: 18px;
    display: inline-block;
    margin-right: ${({ theme }) => theme.margins['1x']};
  }

  .collection-check-icon {
    width: 20px;
    height: 20px;
  }

  .collection-action-wrap {
    position: absolute;
    top: 44px;
    right: 21px;

    .collection-search-bar {
      width: unset;
      background-color: #404040;

      > input {
        height: unset;
        background-color: unset;
        margin-right: ${({ theme }) => theme.margins['4.5x']};
      }
    }
  }

  .collection-cities,
  .collection-stats {
    color: #fff;
    margin-top: ${({ theme }) => theme.margins['2x']};
  }

  .collection-cities {
    font-size: 12px;
    font-weight: 500;
  }
`
const DROPDOWN = styled(Dropdown)`
  width: auto;
  padding: 0;
  border: none;
  background: transparent;
  margin-left: ${({ theme }) => theme.margins['3x']};

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
  padding: ${({ theme }) => theme.margins['1.5x']};

  li {
    padding: ${({ theme }) => `${theme.margins['.5x']} ${theme.margins['1.5x']}`};
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
    <Menu.Item>Share</Menu.Item>
    <Menu.Item>Report</Menu.Item>
  </MENU_LIST>
)

export const CollectionHeader = () => {
  const history = useHistory()

  return (
    <COLLECTION_HEADER>
      <img
        className="collection-back-icon"
        src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`}
        alt="back"
        onClick={() => history.goBack()}
      />
      <Row justify="center">
        <Col>
          <img className="collection-avatar" src={`${process.env.PUBLIC_URL}/img/assets/avatar@3x.png`} alt="" />
          <div className="collection-name-wrap">
            <span className="collection-name">Solcities</span>
            <img className="collection-check-icon" src={`${process.env.PUBLIC_URL}/img/assets/check-icon.png`} alt="" />
          </div>
        </Col>
      </Row>
      <Row justify="center" className="collection-stats">
        <Stats stats={statsData} />
      </Row>
      <Row justify="center" className="collection-cities">
        9,999 3D levitating cities of the metaverse on Solana.
      </Row>
      <Row className="collection-action-wrap">
        <SearchBar className="collection-search-bar" placeholder="Search by nft or owner" />
        <Sort />
        <DROPDOWN overlay={menu} trigger={['click']} placement="bottomRight" align={{ offset: [0, 26] }}>
          <Button>
            <img
              className="collection-more-icon"
              src={`${process.env.PUBLIC_URL}/img/assets/more_icon.svg`}
              alt="more"
            />
          </Button>
        </DROPDOWN>
      </Row>
    </COLLECTION_HEADER>
  )
}
