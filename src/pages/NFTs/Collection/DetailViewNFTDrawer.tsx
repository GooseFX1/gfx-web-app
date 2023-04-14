import { FC, ReactElement, useEffect, useMemo, useState } from 'react'
import { Col, Drawer, Row, Tabs } from 'antd'
import { Button } from '../../../components/Button'
import { useNFTProfile, useNFTAggregator, useNFTDetails, useConnectionConfig } from '../../../context'
import { checkMobile, truncateAddress } from '../../../utils'
import { GradientText } from '../adminPage/components/UpcomingMints'
import { AppraisalValue } from '../../../utils/GenericDegsin'
import TabPane from 'antd/lib/tabs/TabPane'
import { BidNFTModal, BuyNFTModal } from './BuyNFTModal'
import { NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { AsksAndBidsForNFT, AttributesTabContent } from '../NFTDetails/AttributesTabContent'
import { useHistory } from 'react-router-dom'

// import { INFTGeneralData } from '../../../types/nft_details'
// import { genericErrMsg } from '../../Farm/FarmClickHandler'
import { AH_PROGRAM_IDS } from '../../../web3/agg_program_ids'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

const RIGHT_SECTION_TABS = styled.div<{ activeTab: string }>`
  .generalItemValue {
    color: ${({ theme }) => theme.text32};
    ${tw`text-[15px] leading-9 font-semibold pr-2 pl-4`}
  }
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
            ${tw`flex rounded-[40px]`}
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
          ${tw`absolute top-0  left-0 w-[100%] h-[100%]`}
          background-color: ${theme.tabContentBidBackground};
          border-radius: 15px 15px 0 0;
        }
      }

      .general-item-title {
      ${tw`text-[15px] font-semibold leading-9	ml-4 text-[#636363]`}
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

export const DetailViewNFT: FC = (): JSX.Element => {
  const { bidNowClicked, buyNowClicked, setBidNow, setBuyNow } = useNFTAggregator()
  const elem = document.getElementById('nft-aggerator-container') //TODO-PROFILE: Stop background scroll
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())
  const history = useHistory()
  const { general, setNftMetadata, nftMetadata, setGeneral, fetchGeneral } = useNFTDetails()
  const { connection } = useConnectionConfig()

  useEffect(() => {
    if (params.address && (general === null || nftMetadata === null)) {
      fetchGeneral(params.address, connection)
    }
  }, [params.address])

  const goBackToNFTCollections = () => {
    history.replace({
      pathname: location.pathname,
      search: ''
    })
  }

  useEffect(() => general === null && goBackToNFTCollections(), [general])

  const closeTheDrawer = () => {
    if (!buyNowClicked) {
      // resets nft detail context
      setGeneral(null)
      setNftMetadata(null)
    }
  }

  return (
    <Drawer
      title={null}
      placement={checkMobile() ? 'bottom' : 'right'}
      closable={false}
      height={checkMobile() ? '90%' : 'auto'}
      onClose={() => closeTheDrawer()}
      getContainer={elem}
      visible={general !== null && nftMetadata !== null}
      width={checkMobile() ? '100%' : '450px'}
      bodyStyle={{ padding: '0' }}
    >
      <ImageViewer />
      <ButtonContainer
        general={general}
        setBuyNow={setBuyNow}
        buyNowClicked={buyNowClicked}
        bidNowClicked={bidNowClicked}
        setBidNow={setBidNow}
      />
    </Drawer>
  )
}

const ImageViewer = (): ReactElement => {
  const [activeTab, setActiveTab] = useState('1')
  const { general, setNftMetadata, ask, setGeneral } = useNFTDetails()
  const { sessionUser } = useNFTProfile()

  return general ? (
    <div tw="flex flex-col justify-between relative h-full dark:text-white text-black px-[30px]">
      <div
        tw="h-[30px] w-[30px] rounded-[50%] top-[8px] left-[8px] cursor-pointer
          bg-black-1 absolute flex items-center justify-center"
        onClick={() => {
          setGeneral(null)
          setNftMetadata(null)
        }}
      >
        <img src="/img/assets/close-white-icon.svg" alt="" height="12px" width="12px" />
      </div>
      <div tw="h-[calc(100vh - 86px)] overflow-y-scroll">
        <img
          tw="w-[390px] h-[390px] mt-[30px] sm:h-[100%] sm:w-[100%] 
            rounded-[20px] shadow-[3px 3px 14px 0px rgb(0 0 0 / 43%)]"
          height={'100%'}
          src={general.image_url}
          alt="the-nft"
        />
        <div tw="mt-4 flex items-center justify-between">
          <div tw="flex flex-col">
            <div tw="flex items-center">
              <div tw="text-[20px] font-semibold"> {general.nft_name}</div>
              {ask && (
                <img
                  tw="h-[22px] w-[22px] ml-2.5"
                  src={`/img/assets/Aggregator/${AH_PROGRAM_IDS[ask.auction_house_key]}.svg`}
                  alt={`${AH_PROGRAM_IDS[ask.auction_house_key]}-icon`}
                  style={{ height: 30 }}
                />
              )}
            </div>
            <div>
              <GradientText text={general.collection_name} fontSize={20} fontWeight={600} />
            </div>
          </div>
          <div tw="flex items-center">
            {sessionUser !== null && (
              <img
                tw="h-7 w-8 mr-[12px] cursor-pointer"
                src={`/img/assets/heart-${sessionUser.user_likes.includes(general.uuid) ? 'red' : 'empty'}.svg`}
              />
            )}
            <img tw="h-10 w-10 mr-[12px] cursor-pointer" src={`/img/assets/solscanBlack.svg`} />
            <img tw="h-10 w-10 cursor-pointer" src={`/img/assets/shareBlue.svg`} />
          </div>
        </div>
        <div>{general.nft_description}</div>

        <div tw="mt-[30px]">
          <AppraisalValue
            text={general.gfx_appraisal_value ? `${general.gfx_appraisal_value} SOL` : null}
            label={general.gfx_appraisal_value ? 'Apprasial Value' : 'Apprasial Not Supported'}
          />
        </div>
        <img tw="h-[390px] w-[100%]" src="/img/assets/Aggregator/priceHistory.svg" />
        <NFTTabSections activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  ) : (
    <></>
  )
}

const ButtonContainer = ({ general, setBuyNow, buyNowClicked, bidNowClicked, setBidNow }: any): ReactElement => (
  <div
    tw="absolute left-0 right-0 bottom-0 h-[86px] w-[100%] 
        dark:bg-black-2 bg-grey-5 px-[30px] flex items-center justify-between
        border-solid border-b-0 border-l-0 border-r-0 dark:border-black-4 border-grey-4"
  >
    {buyNowClicked && <BuyNFTModal />}
    {bidNowClicked && <BidNFTModal />}
    <Button height="56px" width="185px" cssStyle={tw`bg-blue-1`} onClick={() => setBidNow(general)}>
      <span tw="text-regular font-semibold text-white">Bid</span>
    </Button>
    <Button
      height="56px"
      width="185px"
      cssStyle={tw`bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2`}
      onClick={() => setBuyNow(general)}
    >
      <span tw="text-regular font-semibold text-white">Buy Now</span>
    </Button>
  </div>
)

const NFTDetailsTab = (): ReactElement => {
  const { general, nftMetadata } = useNFTDetails()

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
    [nftMetadata, general]
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

export const NFTTabSections: FC<{ activeTab: string; setActiveTab: any }> = ({
  activeTab,
  setActiveTab
}): ReactElement => {
  const { nftMetadata } = useNFTDetails()
  return (
    <RIGHT_SECTION_TABS activeTab={activeTab}>
      <Tabs defaultActiveKey="1" centered onChange={(key) => setActiveTab(key)}>
        <TabPane tab="Activity" key="1">
          <AsksAndBidsForNFT />
        </TabPane>
        <TabPane tab="Attributes" key="2">
          <AttributesTabContent data={nftMetadata ? nftMetadata.attributes : []} />
        </TabPane>
        <TabPane tab="Details" key="3">
          <NFTDetailsTab />
        </TabPane>
      </Tabs>
    </RIGHT_SECTION_TABS>
  )
}

export default DetailViewNFT
