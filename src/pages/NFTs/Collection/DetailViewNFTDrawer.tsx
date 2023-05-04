import { FC, ReactElement, useEffect, useMemo, useState } from 'react'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Drawer, Row, Tabs, Tooltip } from 'antd'

import { Button } from '../../../components/Button'
import { useNFTProfile, useNFTAggregator, useNFTDetails } from '../../../context'
import { checkMobile, formatSOLDisplay, truncateAddress } from '../../../utils'
import { GradientText } from '../adminPage/components/UpcomingMints'
import { AppraisalValue } from '../../../utils/GenericDegsin'
import TabPane from 'antd/lib/tabs/TabPane'
import { NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { AsksAndBidsForNFT, AttributesTabContent } from '../NFTDetails/AttributesTabContent'
import { useHistory } from 'react-router-dom'
import { AH_NAME } from '../../../web3/agg_program_ids'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useWallet } from '@solana/wallet-adapter-react'
import { ImageShowcase } from '../NFTDetails/ImageShowcase'
import { minimizeTheString } from '../../../web3/nfts/utils'

const DETAIL_VIEW = styled.div`
  ${({ theme }) => theme.customScrollBar('0px')};
`
const RIGHT_SECTION_TABS = styled.div<{ activeTab: string }>`
  ${tw`h-[390px]`}
  z-index: 0;
  .generalItemValue {
    color: ${({ theme }) => theme.text32};
    ${tw`text-[15px] leading-9 font-semibold pr-2 pl-4`}
  }
  .bidBy {
    ${tw`font-semibold`}
    color: ${({ theme }) => theme.text32};
  }
  ${({ theme }) => css`
    position: relative;
 
       .ant-tabs-nav {
        position: relative;
        z-index: 1;
        height: 60px !important;
 
        .ant-tabs-nav-wrap {
          ${tw`bg-[#3c3c3c]`}
          border-radius: 15px 15px 0px 0px;
           .ant-tabs-nav-list {
            ${tw`flex rounded-[40px] !pr-0 !pt-0 !h-[100%] !w-[100%]`}
            justify-content: space-around;
            .ant-tabs-tab{
              ${tw`w-[33%] `}
            }
            
          }
        }

        &:before {
          content: '';
          ${tw` top-0  left-0 w-[100%] h-[100%]`}
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
          ${tw`sm:text-tiny text-[17px]`}

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
        ${tw`sm:mb-12  h-[230px] mt-8`}
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
  const { buyNowClicked } = useNFTAggregator()
  const elem = document.getElementById('nft-aggerator-container') //TODO-PROFILE: Stop background scroll
  const history = useHistory()
  const { general, setNftMetadata, nftMetadata, setGeneral } = useNFTDetails()

  const goBackToNFTCollections = () => {
    history.replace({
      pathname: location.pathname,
      search: ''
    })
  }

  useEffect(
    () => () => {
      goBackToNFTCollections()
    },
    []
  )
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
      <ButtonContainer />
    </Drawer>
  )
}

const ImageViewer = (): ReactElement => {
  const [activeTab, setActiveTab] = useState('1')
  const { general, setNftMetadata, ask, setGeneral } = useNFTDetails()
  const { sessionUser } = useNFTProfile()

  return general ? (
    <div tw="flex flex-col justify-between relative h-full dark:text-white text-black px-[30px]">
      <DETAIL_VIEW tw="h-[calc(100vh - 6px)] overflow-y-scroll">
        <ImageShowcase
          setShowSingleNFT={() => {
            setGeneral(null)
          }}
        />

        <div tw="mt-4 flex items-center justify-between">
          <div tw="flex flex-col">
            <div tw="flex items-center">
              <div tw="text-[20px] font-semibold">
                {general?.nft_name?.split('#')[1] ? '#' + general?.nft_name?.split('#')[1] : '# Nft'}
              </div>
              <Tooltip title={AH_NAME(ask?.auction_house_key)}>
                {ask && (
                  <img
                    tw="h-[22px] w-[22px] ml-2.5"
                    src={`/img/assets/Aggregator/${AH_NAME(ask?.auction_house_key)}.svg`}
                    alt={`${AH_NAME(ask?.auction_house_key)}-icon`}
                    style={{ height: 30 }}
                  />
                )}
              </Tooltip>
            </div>
            <div>
              <GradientText
                text={minimizeTheString(general.collection_name, checkMobile() ? 12 : 20)}
                fontSize={20}
                fontWeight={600}
              />
            </div>
          </div>
          <div tw="flex items-center">
            {sessionUser !== null && (
              <img
                tw="h-7 w-8 mr-[12px] cursor-pointer"
                src={`/img/assets/heart-${sessionUser.user_likes.includes(general.uuid) ? 'red' : 'empty'}.svg`}
              />
            )}
            <div tw="flex items-center">
              <a href={`https://solscan.io/token/${general.mint_address}`} target="_blank" rel="noreferrer">
                <img tw="h-10 w-10 mr-[12px] ml-4 cursor-pointer" src={`/img/assets/solscanBlack.svg`} />
              </a>
              <img tw="h-10 w-10 cursor-pointer" src={`/img/assets/shareBlue.svg`} />
            </div>
          </div>
        </div>
        <div>{general?.nft_description}</div>

        <div tw="mt-[30px]">
          <AppraisalValue
            text={general.gfx_appraisal_value ? `${general.gfx_appraisal_value} SOL` : null}
            label={general.gfx_appraisal_value ? 'Apprasial Value' : 'Apprasial Not Supported'}
          />
        </div>
        {/* <img tw="h-[390px] w-[100%]" src="/img/assets/Aggregator/priceHistory.svg" /> */}
        <div tw="mt-8">
          <NFTTabSections activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </DETAIL_VIEW>
    </div>
  ) : (
    <></>
  )
}

export const ButtonContainer = (): ReactElement => {
  const { ask } = useNFTDetails()
  const { wallet } = useWallet()
  const { setSellNFT, setBidNow, setBuyNow } = useNFTAggregator()
  const pubKey = wallet?.adapter?.publicKey
  const { general } = useNFTDetails()
  const { sessionUser, sessionUserParsedAccounts } = useNFTProfile()
  const isOwner: boolean = useMemo(() => {
    if (ask && pubKey) {
      if (ask?.wallet_key === pubKey.toString()) return true
    }
    return false
  }, [sessionUser, sessionUserParsedAccounts, ask, wallet?.adapter?.publicKey])

  return (
    <div
      tw="absolute left-0 z-10 right-0 bottom-0 h-[86px] w-[100%] 
        dark:bg-black-2 bg-grey-5 px-[30px] flex items-center justify-between
        border-solid border-b-0 border-l-0 border-r-0 dark:border-black-4 border-grey-4"
    >
      {isOwner ? (
        <>
          {ask && (
            <div>
              <label tw="dark:text-grey-1 text-black-3 font-semibold  sm:text-[14px] text-average">
                On Sale for:
              </label>
              <div tw="flex items-center text-lg dark:text-grey-5 text-black-2 font-semibold">
                <span>{formatSOLDisplay(ask.buyer_price)}</span>
                <img src={`/img/crypto/SOL.svg`} alt={'SOL'} tw="h-[20px] ml-2" />
              </div>
            </div>
          )}
          <Button
            height="56px"
            width={ask ? '250px' : '100%'}
            cssStyle={tw`bg-red-1 mr-2`}
            onClick={() => {
              //setDrawerSingleNFT(false)
              setSellNFT(true)
            }}
          >
            <span tw="text-regular font-semibold text-white">{ask ? 'Modify Price' : 'List Item'}</span>
          </Button>
        </>
      ) : (
        <>
          <Button
            height="56px"
            width={ask ? '185px' : '100%'}
            cssStyle={tw`bg-blue-1 mr-2`}
            onClick={() => setBidNow(general)}
          >
            <span tw="text-regular font-semibold text-white">Bid</span>
          </Button>
          {ask && (
            <Button
              height="56px"
              width="185px"
              cssStyle={tw`bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2`}
              onClick={() => setBuyNow(general)}
            >
              <span tw="text-regular font-semibold text-white">Buy Now</span>
            </Button>
          )}
        </>
      )}
    </div>
  )
}

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
          <Col tw="text-[15px] font-semibold leading-9 ml-4 dark:text-white text-grey-1">{item.title}</Col>
          <Col tw="dark:text-white text-black-4 font-semibold mr-4">{item.value}</Col>
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

  const hasAttributes: boolean = useMemo(
    () => nftMetadata && nftMetadata.attributes && nftMetadata.attributes.length > 0,
    [nftMetadata]
  )
  return (
    <RIGHT_SECTION_TABS activeTab={activeTab}>
      <Tabs defaultActiveKey="1" onChange={(key) => setActiveTab(key)}>
        <TabPane tab="Activity" key="1">
          <AsksAndBidsForNFT />
        </TabPane>
        <TabPane tab="Attributes" key="2">
          <AttributesTabContent data={hasAttributes ? nftMetadata.attributes : []} />
        </TabPane>
        <TabPane tab="Details" key="3">
          <NFTDetailsTab />
        </TabPane>
      </Tabs>
    </RIGHT_SECTION_TABS>
  )
}

{
  /* <TabPane tab="Attributes" key="2">
<AttributesTabContent data={hasAttributes ? nftMetadata.attributes : []} />
</TabPane>
<TabPane tab="Details" key="3">
<NFTDetailsTab />
</TabPane> */
}
export default DetailViewNFT
