import { FC, ReactElement, useEffect, useMemo, useState, useCallback } from 'react'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Drawer, Row, Tabs } from 'antd'
import { INFTAsk, INFTBid } from '../../../types/nft_details'

import { Button } from '../../../components/Button'
import { useNFTProfile, useNFTAggregator, useNFTDetails } from '../../../context'
import { checkMobile, formatSOLDisplay, truncateAddress, capitalizeFirstLetter } from '../../../utils'
import { GradientText } from '../../../components/GradientText'
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
import { copyToClipboard, minimizeTheString, redirectBasedOnMarketplace } from '../../../web3/nfts/utils'
import { GenericTooltip } from '../../../utils/GenericDegsin'
import { Share } from '../Share'
import { ParsedAccount } from '../../../web3/nfts/types'

const DETAIL_VIEW = styled.div`
  ${({ theme }) => theme.customScrollBar('0px')};
`
const RIGHT_SECTION_TABS = styled.div<{ activeTab: string }>`
  ${tw`h-[380px]`}
  z-index: 0;
  .generalItemValue {
    color: ${({ theme }) => theme.text32};
    ${tw`text-[15px] leading-9 font-semibold pr-2 pl-4`}
  }
  .bidBy {
    ${tw`font-semibold`}
    color: ${({ theme }) => theme.text39};
  }
  .dtc-item-value {
    ${tw`text-[15px] font-semibold`}
    color:${({ theme }) => theme.text32};
    a {
      ${tw`text-[15px] font-semibold`}
      color:${({ theme }) => theme.text32};
    }
  }
  .dtc-item-title {
    ${tw`text-[15px] font-semibold text-grey-1`}
    a {
      ${tw`text-[15px] font-semibold text-grey-1`}
    }
  }

  ${({ theme }) => css`
    position: relative;
 
       .ant-tabs-nav {
        position: relative;
        z-index: 1;
        height: 60px !important;
 
        .ant-tabs-nav-wrap {
          border-radius: 15px 15px 0px 0px;
          border: 1px solid ${({ theme }) => theme.tokenBorder};
           .ant-tabs-nav-list {
            ${tw`flex rounded-[40px] !pr-0 !pt-0 !h-[100%] !w-[100%]`}
            justify-content: space-around;
          }
        }

        &:before {
          content: '';
          ${tw` top-0  left-0 w-[100%] h-[100%]`}
          background-color: ${theme.bgForNFTCollection};
          border-radius: 15px 15px 20px 20px;
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
        ${tw`text-[#636363] text-[15px] font-medium sm:!m-0 sm:!p-0`}

        .ant-tabs-tab-btn {
          ${tw`sm:text-tiny text-[17px]`}

          &:before {
            content: '' !important;
            height: 0 !important;
          }
        }

        &.ant-tabs-tab-active {
          .ant-tabs-tab-btn {
            color: ${({ theme }) => theme.text39};
          }
        }
      }


      .ant-tabs-content-holder {
        ${tw`sm:mb-12  mb-0 h-[240px] mt-1`}
        border: 1px solid ${({ theme }) => theme.tokenBorder};

        background-color: ${({ theme }) => theme.bgForNFTCollection};
        transform: translateY(-32px);
        padding: 28px 0px 0px 0;
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
    setGeneral(null)
    setNftMetadata(null)
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
  const { general, ask, setGeneral } = useNFTDetails()
  const { sessionUser } = useNFTProfile()
  const [shareModal, setShareModal] = useState<boolean>(false)
  const gfxAppraisalValue = general?.gfx_appraisal_value
    ? parseFloat(general?.gfx_appraisal_value) > 0
      ? general?.gfx_appraisal_value
      : null
    : null
  const onShare = async (social: string) => {
    if (social === 'copy link') {
      copyToClipboard()
      return
    }
  }

  const handleShareModal = useCallback(
    () => (
      <Share
        visible={shareModal}
        handleCancel={() => setShareModal(false)}
        socials={['twitter', 'telegram', 'facebook', 'copy link']}
        handleShare={onShare}
      />
    ),
    [shareModal]
  )

  const handleMarketplaceFormat = useCallback((ask: INFTAsk) => {
    if (ask.marketplace_name === null) return AH_NAME(ask.auction_house_key)
    const name = ask.marketplace_name
    const splitString = name.split('_')
    const capString = splitString.map((c) => capitalizeFirstLetter(c.toLowerCase()))
    return capString.join(' ')
  }, [])

  return (
    <div
      tw="flex flex-col justify-between relative dark:bg-black-1 border-solid border-1 dark:border-l-black-4
    border-r-0 border-t-0 dark:text-white text-black px-[29px] sm:px-[14px]  border-l-grey-4 sm:border-l-0"
    >
      <DETAIL_VIEW tw="h-[calc(100vh - 0px)] overflow-y-scroll">
        <ImageShowcase
          setShowSingleNFT={() => {
            setGeneral(null)
          }}
        />
        {handleShareModal()}
        <div tw="mt-4 flex items-center justify-between">
          <div tw="flex flex-col">
            <div tw="flex items-center">
              <div tw="text-[20px] font-semibold">
                {general?.nft_name?.split('#')[1] ? '#' + general?.nft_name?.split('#')[1] : '# Nft'}
              </div>
              {ask && (
                <GenericTooltip text={handleMarketplaceFormat(ask)}>
                  <img
                    tw="h-[22px] w-[22px] ml-2.5"
                    src={`/img/assets/Aggregator/${
                      ask?.marketplace_name === null ? AH_NAME(ask?.auction_house_key) : ask?.marketplace_name
                    }.svg`}
                    alt="marketplace icon"
                    style={{ height: 30 }}
                  />
                </GenericTooltip>
              )}
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
            {/* {sessionUser !== null && (
              <img
                tw="h-7 w-8 mr-[12px] cursor-pointer"
                src={`/img/assets/heart-${sessionUser.user_likes.includes(general.uuid) ? 'red' : 'empty'}.svg`}
              />
            )} */}
            <div tw="flex items-center">
              <a href={`https://solscan.io/token/${general.mint_address}`} target="_blank" rel="noreferrer">
                <img tw="h-10 w-10 mr-[12px] ml-4 cursor-pointer" src={`/img/assets/solscanBlack.svg`} />
              </a>
              <img
                tw="h-10 w-10 cursor-pointer"
                src={`/img/assets/shareBlue.svg`}
                onClick={() => copyToClipboard()}
              />
            </div>
          </div>
        </div>
        <div>{general?.nft_description}</div>

        <div tw="mt-[30px]">
          <AppraisalValue
            text={gfxAppraisalValue ? gfxAppraisalValue : null}
            label={gfxAppraisalValue ? 'Appraisal Value' : 'Appraisal Not Supported'}
          />
        </div>
        {/* <img tw="h-[390px] w-[100%]" src="/img/assets/Aggregator/priceHistory.svg" /> */}
        <div tw="mt-8">
          <NFTTabSections activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </DETAIL_VIEW>
    </div>
  )
}

export const ButtonContainer = (): ReactElement => {
  const { wallet } = useWallet()
  const { setSellNFT, setBidNow, setBuyNow, setCancelBidClicked, setDelistNFT } = useNFTAggregator()
  const { general, bids, ask } = useNFTDetails()
  const { sessionUser, sessionUserParsedAccounts } = useNFTProfile()

  const pubKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const isOwner: boolean = useMemo(() => {
    const findAccount: undefined | ParsedAccount =
      general && sessionUser !== null && sessionUserParsedAccounts.length > 0
        ? sessionUserParsedAccounts.find((acct) => acct.mint === general.mint_address)
        : undefined
    return findAccount === undefined ? false : true
  }, [sessionUser, sessionUserParsedAccounts, ask, general, wallet?.adapter?.publicKey])

  const openInNewTab = useCallback((url) => {
    const win = window.open(url, '_blank')
    win.focus()
  }, [])

  const showBid = !ask || (ask && ask.marketplace_name === null)

  const handleBuynowClicked = () => {
    if (redirectBasedOnMarketplace(ask, 'buy', general?.mint_address)) return
    setBuyNow(general)
  }
  const myBid = useMemo(() => {
    if (bids.length > 0 && pubKey) {
      return bids.filter((bid) => bid.wallet_key === pubKey?.toString())
    }
    return null
  }, [bids, pubKey])
  const bgForBtn = ask ? tw`bg-blue-1 ml-2 sm:!ml-0 sm:mr-0` : tw`bg-red-2 ml-2 sm:mr-0 sm:!ml-0`

  return (
    <div
      tw="absolute left-0 z-10 right-0 bottom-0 h-[75px] w-[100%] dark:border-l-black-4 
        dark:bg-black-1 bg-grey-5 px-[30px] sm:px-[14px] flex items-center justify-between  border-solid
        border-1 !border-b-0 border-r-0 dark:border-t-black-4 border-grey-4  dark:border-l-black-4"
    >
      {isOwner ? (
        <>
          {ask && (
            <Button
              height="44px"
              width={ask ? '190px' : '100%'}
              cssStyle={tw`bg-red-2 mr-2 sm:mr-0 sm:!ml-0`}
              onClick={() => {
                setDelistNFT(true)
              }}
            >
              <span tw="text-regular font-semibold text-white">Remove Listing </span>
            </Button>
          )}
          <Button
            height="44px"
            width={ask ? '190px' : '100%'}
            cssStyle={bgForBtn}
            onClick={() => {
              //setDrawerSingleNFT(false)
              setSellNFT(true)
            }}
          >
            <span tw="text-regular font-semibold text-white">{ask ? 'Modify Listing' : 'List Item'}</span>
          </Button>
        </>
      ) : (
        <>
          {myBid?.length > 0 && (
            <Button
              height="44px"
              width={ask ? '180px' : '100%'}
              cssStyle={tw`bg-red-2 mr-2`}
              onClick={() => setCancelBidClicked(general)}
            >
              <span tw="text-regular font-semibold text-white">Cancel Bid</span>
            </Button>
          )}

          {/* show bid only if from our market place should not show for tensor and ME listings */}
          {showBid && (
            <Button
              height="44px"
              width={ask ? (showBid ? '180px' : '180px') : '100%'}
              cssStyle={tw`bg-blue-1 mr-2`}
              onClick={() => setBidNow(general)}
            >
              <span tw="text-regular font-semibold text-white">Bid</span>
            </Button>
          )}
          {ask && (
            <Button
              height="44px"
              width={showBid ? '180px' : '100%'}
              cssStyle={tw`bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2`}
              onClick={() => handleBuynowClicked()}
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
  const { general, nftMetadata, onChainMetadata } = useNFTDetails()
  const solscanLink = `https://solscan.io/token/`
  const hostURL = useMemo(() => window.location.origin, [window.location.origin])
  const profileLink = hostURL + `/nfts/profile/`

  const nftData = useMemo(
    () => [
      {
        title: 'Mint address',
        value: (
          <a target="_blank" rel="noreferrer" href={solscanLink + general?.mint_address}>
            {truncateAddress(general?.mint_address)}
          </a>
        )
      },
      {
        title: 'Token Address',
        value: general.token_account ? (
          <a target="_blank" rel="noreferrer" href={solscanLink + general?.token_account}>
            {truncateAddress(general?.token_account)}
          </a>
        ) : (
          ''
        )
      },
      {
        title: 'Owner',
        value: general.owner ? (
          <a target="_blank" rel="noreferrer" href={profileLink + general?.owner}>
            {truncateAddress(general?.owner)}
          </a>
        ) : (
          ''
        )
      },
      {
        title: 'Artist Royalties',
        value: `${
          onChainMetadata?.data?.sellerFeeBasisPoints
            ? (onChainMetadata?.data?.sellerFeeBasisPoints / 100).toFixed(2)
            : 0
        }%`
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
          <Col className="dtc-item-title" tw="text-[15px] font-semibold leading-9 ml-4">
            {item.title}
          </Col>
          <Col className="dtc-item-value" tw="font-semibold mr-4">
            {item.value}
          </Col>
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
