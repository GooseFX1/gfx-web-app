/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, ReactElement, useEffect, useMemo, useState } from 'react'
import { Button, Col, Drawer, Row, Tabs } from 'antd'
import { ImageShowcase } from '../NFTDetails/ImageShowcase'
import { RightSection } from '../NFTDetails/RightSection'
import { checkMobile, truncateAddress } from '../../../utils'
import { useNFTAggregator, useNFTDetails } from '../../../context'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { GradientText } from '../adminPage/components/UpcomingMints'
import { AppraisalValue } from '../../../utils/GenericDegsin'
import TabPane from 'antd/lib/tabs/TabPane'
import Item from 'antd/lib/list/Item'
import { BidNFTModal, BuyNFTModal } from './BuyNFTModal'
import { NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { AttributesTabContent } from '../NFTDetails/AttributesTabContent'

const RIGHT_SECTION_TABS = styled.div<{ activeTab: string }>`
  ${({ theme }) => css`
    position: relative;
 
       .ant-tabs-nav {
        position: relative;
        z-index: 1;
        height: 60px !important;

        .ant-tabs-nav-wrap {
          ${tw`bg-[#3c3c3c]`}
          border-radius: 15px 15px 15px 15px;
          width: 100%;
          .ant-tabs-nav-list {
            display: flex;
            border-radius: 40px;
            justify-content: space-around;
            width: 100% !important;
            padding-right: 0 !important;
            height: 100% !important;
            padding-top: 0 !important;
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
        ${tw`text-[#636363] text-[15px] font-semibold sm:!m-0 sm:!p-0`}

        .ant-tabs-tab-btn {
          ${tw`sm:text-tiny sm:!my-0 sm:!mx-5 text-[17px]`}

          &:before {
            content: '' !important;
            height: 0 !important;
          }
        }

        &.ant-tabs-tab-active {
          .ant-tabs-tab-btn {
            color: #fff;
          }
        }
      }


      .ant-tabs-content-holder {
        ${tw`sm:mb-12 sm:rounded-none h-[230px] mt-8`}
        background-color: ${({ theme }) => theme.bgForNFTCollection};
        transform: translateY(-32px);
        padding: 15px 0;
        border-radius: 0 0 25px 25px;

        .ant-tabs-content {
          height: 100%;
          overflow-x: none;
          overflow-y: scroll;
          ${({ theme }) => theme.customScrollBar('6px')};
        }
      }
    }
    
  `}
`
const WRAPPER = styled.div`
  ${({ theme }) => css`
    ${tw`flex flex-col justify-between relative`}
    color: ${theme.text1};
    .buttonContainer {
      ${tw`h-[65px] w-[100%] flex items-center justify-between `}
      border-top: 1px solid;
      button {
        ${tw`h-[56px] w-[185px] sm:w-[165px] sm:h-[45px] rounded-[60px] border-none mt-6`}
        span {
          ${tw`text-[16px] font-semibold`}
        }
        :hover,
        :focus {
          ${tw`text-white`}
        }
      }
    }
    .bidButton {
      ${tw`bg-[#5855ff]`}
    }
    .buyNowButton {
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    }
    .general-item-title {
      ${tw`text-[15px] font-semibold leading-9	ml-4 text-[#636363]`}
    }
    .general-item-value {
      ${tw`text-[15px] font-semibold leading-9	mr-4`}
      color: ${({ theme }) => theme.text32};
    }

    .close-icon-holder {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      background: #131313;
      position: absolute;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 12px;
      left: 12px;
      cursor: pointer;
    }

    .ls-image {
      border-radius: 20px;
      ${tw`w-[390px] h-[390px] sm:h-[100%] sm:w-[100%]`}
      box-shadow: 3px 3px 14px 0px rgb(0 0 0 / 43%);
    }
    .infoContainer {
      ${tw`mt-4 flex items-center`}
    }
    .iconsContainer {
      ${tw`flex items-center gap-4 absolute right-0`}
    }
    .infoText {
      color: ${({ theme }) => theme.text20};
      max-height: 60px;
      ${tw`text-[15px] font-medium mt-2.5 overflow-y-auto	`}
    }
    .titleContainer {
    }
    .ls-bottom-panel {
      margin-top: ${theme.margin(2.5)};
      display: flex;
      justify-content: center;
      align-items: center;

      .img-holder {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ls-end-text {
        font-size: 12px;
        font-weight: 600;
        color: ${theme.text7};
      }

      .ls-favorite {
        margin-bottom: ${theme.margin(2)};
      }

      .ls-favorite-number {
        font-size: 18px;
        font-weight: 600;
        color: #4b4b4b;
        margin-right: 12px;
      }

      .ls-favorite-number-highlight {
        color: ${theme.text1};
        margin-right: 12px;
      }

      .ls-action-button {
        color: ${theme.text1};
        margin-right: auto;
      }

      .solscan-icon {
        margin-right: 12px;
        height: 40px;
        width: 40px;
        cursor: pointer;
      }

      .share-icon {
        width: 40px;
        height: 40px;
        cursor: pointer;
      }
    }
  `}
`

export const DetailViewNFT: FC = (): JSX.Element => {
  const { selectedNFT, setSelectedNFT, bidNowClicked, buyNowClicked, setBidNow, setBuyNow } = useNFTAggregator()

  const elem = document.getElementById('nft-aggerator-container') //TODO-PROFILE: Stop background scroll
  return (
    <Drawer
      title={null}
      placement={checkMobile() ? 'bottom' : 'right'}
      closable={false}
      height={checkMobile() ? '90%' : 'auto'}
      onClose={() => !buyNowClicked && setSelectedNFT(false)}
      getContainer={elem}
      visible={selectedNFT ? true : false}
      width={checkMobile() ? '100%' : '450px'}
    >
      <ImageViewer
        setBuyNow={setBuyNow}
        setBidNow={setBidNow}
        bidNowClicked={bidNowClicked}
        buyNowClicked={buyNowClicked}
      />
    </Drawer>
  )
}

const ImageViewer = ({ setBuyNow, buyNowClicked, setBidNow, bidNowClicked }: any): ReactElement => {
  const [activeTab, setActiveTab] = useState('1')
  const { selectedNFT, setSelectedNFT } = useNFTAggregator()
  const collectionName = selectedNFT ? selectedNFT.nft_name.split('#')[0] : 'Unknown'
  const nftId = selectedNFT ? selectedNFT.nft_name.split('#')[1] : 'Unknown'
  const { nftMetadata } = useNFTDetails()

  return (
    <WRAPPER>
      <div
        className="close-icon-holder"
        onClick={() => {
          setSelectedNFT(false)
        }}
      >
        <img src="/img/assets/close-white-icon.svg" alt="" height="12px" width="12px" />
      </div>
      <img className="ls-image" height={'100%'} src={selectedNFT?.image_url} alt="the-nft" />
      <div className="infoContainer">
        <div tw="flex flex-col">
          <div tw="flex items-center">
            <div tw="text-[20px] font-semibold"> #{nftId}</div>
            <img tw="h-[22px] w-[22px] ml-2.5" src="/img/assets/Aggregator/magicEden.svg" />
          </div>
          <div>
            {' '}
            <GradientText text={collectionName} fontSize={20} fontWeight={600} />
          </div>
        </div>
        <div className="iconsContainer">
          <img tw="h-7 w-8" src={`/img/assets/heart-red.svg`} />
          <img tw="h-10 w-10" src={`/img/assets/solscanBlack.svg`} />
          <img tw="h-10 w-10" src={`/img/assets/shareBlue.svg`} />
        </div>
      </div>
      <div className="infoText">{selectedNFT?.nft_description}</div>

      <AppraisalValue />
      <img tw="h-[390px] w-[100%]" src="/img/assets/Aggregator/priceHistory.svg" />
      <RIGHT_SECTION_TABS activeTab={activeTab}>
        <Tabs defaultActiveKey="1" centered onChange={(key) => setActiveTab(key)}>
          <TabPane tab="Activity" key="1">
            <>dasd </>
          </TabPane>
          <TabPane tab="Attributes" key="2">
            <AttributesTabContent data={nftMetadata.attributes} />
          </TabPane>
          <TabPane tab="Details" key="3">
            <NFTDetailsTab />
          </TabPane>
        </Tabs>
      </RIGHT_SECTION_TABS>
      <ButtonContainer
        setBuyNow={setBuyNow}
        buyNowClicked={buyNowClicked}
        bidNowClicked={bidNowClicked}
        setBidNow={setBidNow}
      />
    </WRAPPER>
  )
}

const ButtonContainer = ({ setBuyNow, buyNowClicked, bidNowClicked, setBidNow }: any): ReactElement => {
  const { selectedNFT } = useNFTAggregator()

  return (
    <div className="buttonContainer">
      {buyNowClicked && <BuyNFTModal />}
      {bidNowClicked && <BidNFTModal />}
      <Button className="bidButton" onClick={() => setBidNow(selectedNFT)}>
        Bid
      </Button>
      <Button className="buyNowButton" onClick={() => setBuyNow(selectedNFT)}>
        Buy Now
      </Button>
    </div>
  )
}

const NFTDetailsTab = (): ReactElement => {
  const { selectedNFT } = useNFTAggregator()
  const { nftMetadata, general } = useNFTDetails()

  const nftData = useMemo(
    () => [
      {
        title: 'Mint address',
        value: truncateAddress(general.mint_address)
      },
      {
        title: 'Token Address',
        value: general.token_account ? truncateAddress(general.token_account) : ''
      },
      {
        title: 'Owner',
        value: general.owner ? truncateAddress(general.owner) : ''
      },
      {
        title: 'Artist Royalties',
        value: `${(nftMetadata.seller_fee_basis_points / 100).toFixed(2)}%`
      },
      {
        title: 'Transaction Fee',
        value: `${NFT_MARKET_TRANSACTION_FEE}%`
      }
    ],
    [general]
  )

  return (
    <div>
      {nftData.map((item, index) => (
        <Row justify="space-between" align="middle" className="dtc-item" key={index}>
          <Col className="general-item-title">{item.title}</Col>
          <Col className="general-item-value">{item.value}</Col>
        </Row>
      ))}
    </div>
  )
}

export default DetailViewNFT