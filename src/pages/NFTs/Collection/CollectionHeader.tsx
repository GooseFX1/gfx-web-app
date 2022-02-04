import { useState, useEffect } from 'react'
import { Button, Col, Dropdown, Menu, Row } from 'antd'
import styled from 'styled-components'
import { SearchBar } from '../../../components'
import { Sort } from './Sort'
import { Stats } from './Stats'
import { useHistory } from 'react-router-dom'
import { useNFTCollections } from '../../../context'

const COLLECTION_HEADER = styled.div`
  position: relative;
  height: auto;
  padding: ${({ theme }) => theme.margin(3)} ${({ theme }) => theme.margin(3)} ${({ theme }) => theme.margin(4.5)};
  border-radius: 20px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  background: ${({ theme }) => theme.collectionHeader};

  .collection-back-icon {
    position: absolute;
    top: 55px;
    left: 55px;
    transform: rotate(90deg);
    width: 36px;
    filter: ${({ theme }) => theme.filterBackIcon};
    cursor: pointer;
  }

  .collection-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }

  .collection-name-wrap {
    margin-top: ${({ theme }) => theme.margin(1.5)};
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .collection-name {
    color: ${({ theme }) => theme.text7};
    font-size: 18px;
    display: inline-block;
    margin-right: ${({ theme }) => theme.margin(1)};
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
      background-color: ${({ theme }) => theme.searchbarSmallBackground};

      > input {
        height: unset;
        background-color: unset;
        margin-right: ${({ theme }) => theme.margin(4.5)};
      }
    }
  }

  .collection-stats {
    color: #fff;
    margin-top: ${({ theme }) => theme.margin(2)};
  }

  .collection-cities {
    color: #fff;
    padding: ${({ theme }) => theme.margin(2)};
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text8};
  }
`
const DROPDOWN = styled(Dropdown)`
  width: auto;
  padding: 0;
  border: none;
  background: transparent;
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
    <Menu.Item>Share</Menu.Item>
    <Menu.Item>Report</Menu.Item>
  </MENU_LIST>
)

export const CollectionHeader = ({ setFilter, filter }) => {
  const history = useHistory()
  const { singleCollection, fixedPriceWithinCollection } = useNFTCollections()
  const [localStats, setLocalStats] = useState<any[]>([])

  useEffect(() => {
    if (singleCollection && fixedPriceWithinCollection) {
      setLocalStats([
        { title: 'Items', total: singleCollection.collection[0].size, unit: '' },
        { title: 'Owners', total: 0, unit: '' },
        {
          title: 'Price floor',
          total: `${fixedPriceWithinCollection.collection_floor ? fixedPriceWithinCollection.collection_floor : '0'}`,
          unit: 'SOL'
        },
        { title: 'Volume traded', total: singleCollection.collection_vol.yearly, unit: 'yr' }
      ])
    }
  }, [fixedPriceWithinCollection, singleCollection])

  return fixedPriceWithinCollection && singleCollection ? (
    <COLLECTION_HEADER>
      <img className="collection-back-icon" src={`/img/assets/arrow.svg`} alt="back" onClick={() => history.goBack()} />
      <Row justify="center">
        <Col>
          <img className="collection-avatar" src={singleCollection.collection[0].profile_pic_link} alt="" />
          <div className="collection-name-wrap">
            <span className="collection-name">{singleCollection.collection[0].collection_name}</span>
            {singleCollection.collection[0].is_verified && (
              <img className="collection-check-icon" src={`/img/assets/check-icon.png`} alt="" />
            )}
          </div>
        </Col>
      </Row>
      <Row justify="center" className="collection-stats">
        <Stats stats={localStats} />
      </Row>
      <Row justify="center" className="collection-cities">
        {singleCollection.collection[0].collection_description}
      </Row>
      <Row className="collection-action-wrap">
        <SearchBar
          className="collection-search-bar"
          placeholder="Search by nft or owner"
          setFilter={setFilter}
          filter={filter}
        />
        <Sort />
        <DROPDOWN overlay={menu} trigger={['click']} placement="bottomRight" align={{ offset: [0, 26] }}>
          <Button>
            <img className="collection-more-icon" src={`/img/assets/more_icon.svg`} alt="more" />
          </Button>
        </DROPDOWN>
      </Row>
    </COLLECTION_HEADER>
  ) : (
    <div>loading</div>
  )
}
