import styled from 'styled-components'
import { Col, Row, Tabs } from 'antd'
import { DetailsTabContent } from './DetailsTabContent'
import { useNFTDetails } from '../../../context'
import { NFTDEtailsProviderMode } from '../../../types/nft_details'
import { FC } from 'react'
import { TradingHistoryTabContent } from './TradingHistoryTabContent'
import { AttributesTabContent } from './AttributesTabContent'
import { useState } from 'react'

const { TabPane } = Tabs

const RIGHT_SECTION_TABS = styled.div`
  ${({ theme }) => `
position: relative;

.ant-tabs-nav {
  position: relative;
  z-index: 1;

  .ant-tabs-nav-wrap {
    background-color: #000;
    border-radius: 15px 15px 25px 25px;
    padding-top: ${theme.margins['1.5x']};
    padding-bottom: ${theme.margins['2.5x']};

    .ant-tabs-nav-list {
      width: 100%;
      justify-content: space-around;
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #131313;
      border-radius: 15px 15px 0 0;
    }
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
      color: ${theme.white};
    }
  }
}

.ant-tabs-content-holder {
  height: 250px;
  background-color: #131313;
  transform: translateY(-32px);
  padding-top: ${theme.margins['4x']};
  padding-bottom: ${theme.margins['8x']};
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
  background: linear-gradient(90deg, rgba(25, 25, 25, 0.8) 0%, #131313 100%);

  .rst-footer-bid-button {
    flex: 1;
    margin-right: ${theme.margins['1.5x']};
    color: ${theme.white};

    button {
      cursor: pointer;
      width: 100%;
      height: 100%;
      ${theme.flexCenter}
      font-size: 17px;
      font-weight: 600;
      border: none;
      border-radius: 29px;
      padding: 0 ${theme.margins['2x']};
      background-color: ${theme.primary2};
    }
  }

  .rst-footer-share-button {
    cursor: pointer;
  }
}
`}
`

const getButtonText = (mode: NFTDEtailsProviderMode): string => {
  switch (mode) {
    case 'live-auction-NFT':
      return 'Place a bid'
    case 'my-created-NFT':
      return 'Edit NFT'
  }
}

export const RightSectionTabs: FC<{ mode: NFTDEtailsProviderMode; handleClickPrimaryButton: () => void }> = ({
  mode,
  handleClickPrimaryButton,
  ...rest
}) => {
  const { detailTab, tradingHistoryTab, attributesTab } = useNFTDetails()
  const [activeTab, setActiveTab] = useState('1')

  return (
    <RIGHT_SECTION_TABS {...rest}>
      <Tabs defaultActiveKey="1" centered onChange={(key) => setActiveTab(key)}>
        <TabPane tab="Details" key="1">
          <DetailsTabContent data={detailTab} />
        </TabPane>
        <TabPane tab="Trading History" key="2">
          <TradingHistoryTabContent data={tradingHistoryTab} />
        </TabPane>
        <TabPane tab="Attributes" key="3">
          <AttributesTabContent data={attributesTab} />
        </TabPane>
      </Tabs>
      <Row className="rst-footer">
        <Col className="rst-footer-bid-button">
          <button onClick={handleClickPrimaryButton}>{getButtonText(mode)}</button>
        </Col>
        <Col className="rst-footer-share-button">
          <img src={`${process.env.PUBLIC_URL}/img/assets/share.svg`} alt="" />
        </Col>
      </Row>
    </RIGHT_SECTION_TABS>
  )
}
