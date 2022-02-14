import { useState, useEffect } from 'react'
import { Button, Dropdown, Menu, Row } from 'antd'
import styled from 'styled-components'
import { Stats } from './Stats'
import { useHistory } from 'react-router-dom'
import { useNFTCollections } from '../../../context'

const COLLECTION_HEADER = styled.div`
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
    bottom: 10px;
    height: 80px;
    padding: 0 2.22%;
  }

  .solcities {
    display: flex;
    margin-right: 4.64%;

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
    margin-right: 5.55%;
  }

  .categories {
    display: flex;
    .item {
      margin-right: ${({ theme }) => theme.margin(8)};
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
      <img className="collection-header-banner" src={singleCollection.collection[0].banner_link} alt="banner" />
      <div className="collection-header-content">
        <div className="solcities">
          <span className="label">{singleCollection.collection[0].collection_name}</span>
          {singleCollection.collection[0].is_verified && <img src={`/img/assets/check-icon.png`} alt="" />}
        </div>
        <div className="desc">{singleCollection.collection[0].collection_description}</div>
        <div className="categories">
          <div className="item">
            <div className="value">{singleCollection.collection_floor}SQL</div>
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
    </COLLECTION_HEADER>
  ) : (
    <div>loading</div>
  )
}
