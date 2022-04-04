import { useState } from 'react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Button, Dropdown, Menu } from 'antd'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useNFTCollections, useDarkMode } from '../../../context'
import { ShareProfile } from '../Profile/ShareProfile'
import { SVGToGrey2 } from '../../../styles'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'

//#region styled
const COLLECTION_HEADER = styled.div<{ $height: string }>`
  position: relative;
  height: ${({ $height }) => `${$height}vh`};
  margin-top: -50px;

  * {
    color: white;
  }

  .collection-back-icon {
    position: absolute;
    top: 72px;
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
    margin-bottom: ${({ theme }) => theme.margin(4)};
  }

  .title-desc {
    width: 55%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-flow: wrap;

    .title {
      display: flex;
      align-items: center;
      max-width: 40%;
      margin-right: ${({ theme }) => theme.margin(2)};
      ${({ theme }) => theme.mediaWidth.upToMedium({ width: '100%', maxWidth: 'unset' })}};
      

      .label {
        ${({ theme }) => theme.ellipse};
        font-weight: 500;
        margin-right: ${({ theme }) => theme.margin(2)};
        span {
          font-size: 35px;
        }
      }

      img {
        width: 40px;
        height: 40px;
      }
    }

    .desc {
      font-weight: 600;
      line-height: 22px;
      font-size: 20px;
      max-width: 70%;
      max-height: 42px;
      overflow-y: auto;
      -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
      mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
      &::-webkit-scrollbar {
        width: 0; /* Remove scrollbar space */
        background: transparent; /* Optional: just make scrollbar invisible */
      }
      ${({ theme }) => theme.mediaWidth.upToMedium({ width: '100%', maxWidth: 'unset' })};
      span {
        font-size: 20px;
      }
    }
  }

  .categories {
    display: flex;

    .item {
      padding: 0 ${({ theme }) => theme.margin(2)};
    }

    .value {
      font-weight: 600;
      margin-bottom: 0 ${({ theme }) => theme.margin(1)};
      ${({ theme }) => theme.ellipse}
      span {
        font-size: 25px;
        line-height: 30.48px;
      }
    }

    .text {
      ${({ theme }) => theme.ellipse}
      span {
        font-size: 18px;
      }
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
  background-color: ${({ theme }) => theme.bg3};
  min-width: 120px;
  border-radius: 10px;
  position: relative;
  padding: ${({ theme }) => theme.margin(1.5)};

  li {
    font-size: 11px;
    text-align: center;
    color: ${({ theme }) => theme.text1};

    .ant-dropdown-menu-title-content {
      &:hover {
        color: ${({ theme }) => theme.secondary4};
      }
    }
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

const COVER = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: absolute;
  margin-top: -38px;
`

const BANNER_TOGGLE = styled.button`
  position: absolute;
  top: -5px;
  width: 40px;
  height: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg3};
  border: 1px solid ${({ theme }) => theme.bg3};
  cursor: pointer;

  .collection-banner-toggle-icon {
    margin-top: 5px;
    height: 10px;
    width: 10px;
    transform: rotate(0deg);
  }
`
//#endregion

export const CollectionHeader = ({ setFilter, filter, collapse, setCollapse }) => {
  const { mode } = useDarkMode()
  const history = useHistory()
  const { singleCollection, fixedPriceWithinCollection, openBidWithinCollection } = useNFTCollections()
  const [visible, setVisible] = useState(false)

  const isCollectionItemEmpty: boolean = !singleCollection || !fixedPriceWithinCollection || !openBidWithinCollection
  // const isCollectionItemEmpty: boolean = true

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

  const iconStyle = { transform: `rotate(${collapse ? 0 : 180}deg)`, marginTop: `${collapse ? '5px' : '2px'}` }
  return (
    <COLLECTION_HEADER $height={collapse ? '30' : '45'}>
      <img className="collection-back-icon" src={`/img/assets/arrow.svg`} alt="back" onClick={() => history.goBack()} />
      {isCollectionItemEmpty ? (
        <SkeletonCommon height="30vh" borderRadius="0" />
      ) : (
        <BANNER
          $url={
            singleCollection.collection[0].banner_link
              ? singleCollection.collection[0].banner_link
              : openBidWithinCollection.open_bid[0].image_url
          }
        ></BANNER>
      )}
      <div className="collection-header-content">
        <div className="title-desc">
          <div className="title">
            {
              <span className="label">
                {isCollectionItemEmpty ? (
                  <SkeletonCommon width="147px" height="43px" />
                ) : (
                  <span>{singleCollection.collection[0].collection_name}</span>
                )}
              </span>
            }
            {isCollectionItemEmpty ? (
              <SkeletonCommon width="40px" height="40px" borderRadius="50%" />
            ) : (
              singleCollection.collection[0].is_verified && <img src={`/img/assets/check-icon.png`} alt="" />
            )}
          </div>
          {isCollectionItemEmpty ? (
            <SkeletonCommon width="548px" height="26px" />
          ) : (
            <div className="desc">{singleCollection.collection[0].collection_description}</div>
          )}
        </div>
        <div className="categories">
          <div className="item">
            <div className="value">
              {isCollectionItemEmpty ? (
                <SkeletonCommon width="106px" height="25px" />
              ) : (
                <span>{singleCollection.collection_floor / LAMPORTS_PER_SOL || '0.00'} SOL</span>
              )}
            </div>
            <div className="text">
              {isCollectionItemEmpty ? <SkeletonCommon width="106px" height="18px" /> : <span>Floor price</span>}
            </div>
          </div>
          <div className="item">
            <div className="value">
              {isCollectionItemEmpty ? (
                <SkeletonCommon width="106px" height="25px" />
              ) : (
                <span>
                  {singleCollection.collection_vol ? singleCollection.collection_vol.yearly.toFixed(3) : '0.00'} Yr
                </span>
              )}
            </div>
            <div className="text">
              {isCollectionItemEmpty ? <SkeletonCommon width="106px" height="18px" /> : <span>Volume Traded</span>}
            </div>
          </div>
          <DROPDOWN overlay={menu} trigger={['click']} placement="bottomRight" align={{ offset: [0, 26] }}>
            <Button>
              <img className="collection-more-icon" src={`/img/assets/more_icon.svg`} alt="more" />
            </Button>
          </DROPDOWN>
        </div>
      </div>
      <ShareProfile visible={visible} handleCancel={() => setVisible(false)} />

      <COVER>
        <BANNER_TOGGLE onClick={() => setCollapse(!collapse)}>
          {mode === 'dark' ? (
            <img
              className="collection-banner-toggle-icon"
              style={iconStyle}
              src={`/img/assets/arrow-down.svg`}
              alt="collection-banner"
            />
          ) : (
            <SVGToGrey2
              className="collection-banner-toggle-icon"
              style={iconStyle}
              src={`/img/assets/arrow-down.svg`}
              alt="collection-banner"
            />
          )}
        </BANNER_TOGGLE>
      </COVER>
    </COLLECTION_HEADER>
  )
}
