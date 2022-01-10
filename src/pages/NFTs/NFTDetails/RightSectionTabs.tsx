import styled, { css } from 'styled-components'
import { Col, Row, Tabs, notification } from 'antd'
import { DetailsTabContent } from './DetailsTabContent'
import { useNFTDetails } from '../../../context'
import { MintItemViewStatus, NFTDEtailsProviderMode } from '../../../types/nft_details'
import { TradingHistoryTabContent } from './TradingHistoryTabContent'
import { AttributesTabContent } from './AttributesTabContent'
import { useState, FC } from 'react'

const { TabPane } = Tabs

const RIGHT_SECTION_TABS = styled.div<{ mode: string; activeTab: string }>`
  ${({ theme, activeTab, mode }) => css`
    position: relative;

    .ant-tabs-nav {
      position: relative;
      z-index: 1;

      .ant-tabs-nav-wrap {
        background-color: #000;
        border-radius: 15px 15px 25px 25px;
        padding-top: ${theme.margins['1x']};
        padding-bottom: ${activeTab === '3' ? theme.margins['1x'] : theme.margins['2.5x']};
        .ant-tabs-nav-list {
          justify-content: space-around;
          width: 100%;
        }
      }

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${theme.tabContentBidBackground};
        border-radius: 15px 15px 0 0;
      }
    }

    .ant-tabs-ink-bar {
      display: none;
    }

    .ant-tabs-top {
      > .ant-tabs-nav {
        margin-bottom: 0;

        &::before {
          border: none;
        }
      }
    }

    .ant-tabs-tab {
      color: #616161;
      font-size: 14px;
      font-weight: 500;

      &.ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          color: #fff;
        }
      }
    }

    .desc {
      font-size: 11px;
      padding: ${({ theme }) => theme.margins['3x']};
      font-family: Montserrat;
    }

    .ant-tabs-content-holder {
      height: 260px;
      background-color: ${theme.tabContentBidBackground};
      transform: translateY(-32px);
      padding-top: ${({ theme }) => theme.margins['4x']};
      padding-bottom: ${({ theme }) => theme.margins['8x']};
      border-radius: 0 0 25px 25px;

      .ant-tabs-content {
        height: 100%;
      }
    }

    .rst-footer {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      padding: ${theme.margins['2x']};
      border-radius: 0 0 25px 25px;
      backdrop-filter: blur(20px);
      border-top: 1px solid ${theme.borderColorTabBidFooter};
      background: ${theme.tabContentBidFooterBackground};

      .rst-footer-bid-button {
        flex: 1;
        margin-right: ${theme.margins['1.5x']};
        color: #fff;

        button {
          cursor: pointer;
          width: 100%;
          height: 60px;
          ${theme.flexCenter}
          font-size: 17px;
          font-weight: 600;
          border: none;
          border-radius: 29px;
          padding: 0 ${theme.margins['2x']};
          background-color: ${theme.primary2};

          &:hover {
            opacity: 0.8;
          }
        }
      }

      .rst-footer-share-button {
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  `}
`

const getButtonText = (mode: NFTDEtailsProviderMode): string => {
  switch (mode) {
    case 'live-auction-NFT':
    case 'open-bid-NFT':
      return 'Place a bid'
    case 'my-created-NFT':
      return 'Edit NFT'
    case 'mint-item-view':
      return 'Mint'
    case 'fixed-price-NFT':
      return 'Buy now'
  }
}

export const RightSectionTabs: FC<{
  mode: NFTDEtailsProviderMode
  status: MintItemViewStatus
  handleClickPrimaryButton: () => void
}> = ({ mode, status, handleClickPrimaryButton, ...rest }) => {
  const { detailTab, tradingHistoryTab, attributesTab } = useNFTDetails()
  const [activeTab, setActiveTab] = useState('1')

  const desc = {
    successful: [
      'Item successfully minted!',
      'Thirsty Cactus Garden Party, Item #2567',
      'Check your collection to check your new piece!'
    ],
    unsuccessful: ['Item unsucessfully minted!', 'Please try again, if the error persists please contact support.']
  }
  const openNotification = (status, desc) => {
    if (!['successful', 'unsuccessful'].includes(status)) {
      return
    }
    const description = (
      <>
        {desc[status].map((item, index) => (
          <div className={`text text-${index} ${status}`}>{item}</div>
        ))}
        <img src={`${process.env.PUBLIC_URL}/img/assets/${status}.svg`} alt="" />
      </>
    )
    if (status === 'successful') {
      notification.info({
        message: null,
        description,
        placement: 'bottomLeft',
        duration: 1,
        className: 'mint'
      })
      return
    }

    if (status === 'unsuccessful') {
      notification.error({
        message: null,
        description,
        placement: 'bottomLeft',
        duration: 1,
        className: 'mint'
      })
      return
    }
  }

  const handleButton = () => (mode === 'mint-item-view' ? openNotification(status, desc) : handleClickPrimaryButton())

  return (
    <RIGHT_SECTION_TABS activeTab={activeTab} mode={mode} {...rest}>
      <Tabs defaultActiveKey="1" centered onChange={(key) => setActiveTab(key)}>
        {mode === 'mint-item-view' ? (
          <TabPane tab="Details" key="1">
            <p className="desc">
              Earn holders benefit for life by minting a Thirsty Cactus. 100% of royalties go to the community. 1% of
              every sale distributed to initial holder for life - even if you sell. 4% of every sale distributes across
              all holders - as long as you hold a Cactus. 5% sent to the CacDAO - a community owned wallet to fund
              community ideas and projects. When our core community was getting priced out due to high gas fees on ETH,
              we became the first project to pause minting and move to SOL. Every decision we make is in the benefit our
              community. Mint your place in our community with a Thirsty Cactus on launch day
            </p>
          </TabPane>
        ) : (
          <>
            <TabPane tab="Details" key="1">
              <DetailsTabContent data={detailTab} />
            </TabPane>
            <TabPane tab="Trading History" key="2">
              <TradingHistoryTabContent data={tradingHistoryTab} />
            </TabPane>
            <TabPane tab="Attributes" key="3">
              <AttributesTabContent data={attributesTab} />
            </TabPane>
          </>
        )}
      </Tabs>
      <Row className="rst-footer">
        <Col className="rst-footer-bid-button">
          <button onClick={handleButton}>{getButtonText(mode)}</button>
        </Col>
        <Col className="rst-footer-share-button">
          <img src={`${process.env.PUBLIC_URL}/img/assets/share.svg`} alt="" />
        </Col>
      </Row>
    </RIGHT_SECTION_TABS>
  )
}
