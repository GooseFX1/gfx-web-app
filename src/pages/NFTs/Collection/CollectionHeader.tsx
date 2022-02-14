import { useState, useEffect } from 'react'
import { Button, Dropdown, Menu, Row, Col } from 'antd'
import styled from 'styled-components'
import { Stats } from './Stats'
import { useHistory } from 'react-router-dom'
import { useNFTCollections } from '../../../context'
import { ShareProfile } from '../Profile/ShareProfile'

const COLLECTION_HEADER = styled.div`
  position: relative;
  height: calc(52% + 50px);
  margin-top: -50px;

  * {
    color: white;
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
    margin-bottom: ${({ theme }) => theme.margin(3.5)};
  }

  .title {
    display: flex;
    margin-right: ${({ theme }) => theme.margin(2)};

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
    line-height: 24.38px;

    max-height: 42px;
    overflow-y: auto;
    -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
    mask-image: linear-gradient(to bottom, black 40%, transparent 100%);

    &::-webkit-scrollbar {
      width: 0; /* Remove scrollbar space */
      background: transparent; /* Optional: just make scrollbar invisible */
    }
  }

  .categories {
    display: flex;

    .item {
      padding: 0 ${({ theme }) => theme.margin(2)};
    }

    .value {
      font-size: 25px;
      font-weight: 600;
      ${({ theme }) => theme.ellipse}
    }

    .text {
      font-size: 18px;
      ${({ theme }) => theme.ellipse}
    }
  }
`

const BANNER = styled.div<{ $url: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(rgb(0 0 0 / 2%), rgb(0 0 0 / 80%)), ${({ $url }) => `url(${$url})`}, center;
  background-size: auto 120%;
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

export const CollectionHeader = ({ setFilter, filter }) => {
  const history = useHistory()
  const { singleCollection, fixedPriceWithinCollection } = useNFTCollections()
  const [visible, setVisible] = useState(false)

  const handleClick = (e) => {
    console.log('handleClick e:', e)
    setVisible(true)
  }

  const menu = (
    <MENU_LIST onClick={handleClick}>
      <Menu.Item key="share">Share</Menu.Item>
      {/* <Menu.Item>Report</Menu.Item> */}
    </MENU_LIST>
  )

  return fixedPriceWithinCollection && singleCollection ? (
    <COLLECTION_HEADER>
      <img className="collection-back-icon" src={`/img/assets/arrow.svg`} alt="back" onClick={() => history.goBack()} />
      <BANNER $url={singleCollection.collection[0].banner_link}></BANNER>
      <div className="collection-header-content">
        <div style={{ width: '55%' }}>
          <div className="title">
            <span className="label">{singleCollection.collection[0].collection_name}</span>
            {singleCollection.collection[0].is_verified && <img src={`/img/assets/check-icon.png`} alt="" />}
          </div>
          <div className="desc">{singleCollection.collection[0].collection_description}</div>
        </div>
        <div className="categories">
          <div className="item">
            <div className="value">{singleCollection.collection_floor || '0.00'} SOL</div>
            <div className="text">Floor price</div>
          </div>
          <div className="item">
            <div className="value">{singleCollection.collection_vol.yearly} Yr </div>
            <div className="text">Volume Traded</div>
          </div>
          <DROPDOWN overlay={menu} trigger={['click']} placement="bottomRight" align={{ offset: [0, 26] }}>
            <Button>
              <img className="collection-more-icon" src={`/img/assets/more_icon.svg`} alt="more" />
            </Button>
          </DROPDOWN>
        </div>
      </div>
      <ShareProfile visible={visible} handleCancel={() => setVisible(false)} />
    </COLLECTION_HEADER>
  ) : (
    <div>loading</div>
  )
}
