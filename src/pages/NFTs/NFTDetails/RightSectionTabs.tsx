import { useEffect, useState, FC, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import styled, { css } from 'styled-components'
import { Col, Row, Tabs } from 'antd'
import { SpaceBetweenDiv } from '../../../styles'
import { useNFTDetails, useNFTProfile, useConnectionConfig } from '../../../context'
import { MintItemViewStatus, NFTDetailsProviderMode } from '../../../types/nft_details'
import { TradingHistoryTabContent } from './TradingHistoryTabContent'
import { AttributesTabContent } from './AttributesTabContent'
import RemoveAskModalContent from './RemoveAskModalContent'
import { Modal, SuccessfulListingMsg } from '../../../components'
import { NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { notify } from '../../../utils'
import { tradeStatePDA, callCancelInstruction } from '../actions'
import { BidModal } from '../OpenBidNFT/BidModal'
import { bnTo8 } from '../../../web3'
import BN from 'bn.js'

const { TabPane } = Tabs
//#region styles
const RIGHT_SECTION_TABS = styled.div<{ mode: string; activeTab: string }>`
  ${({ theme, activeTab, mode }) => css`
    position: relative;

    .ant-tabs-nav {
      position: relative;
      z-index: 1;

      .ant-tabs-nav-wrap {
        background-color: #000;
        border-radius: 15px 15px 25px 25px;
        padding-top: ${theme.margin(1.5)};
        padding-bottom: ${theme.margin(1.5)};
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

      .ant-tabs-tab-btn {
        font-size: 17px;
      }

      &.ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          color: #fff;
        }
      }
    }

    .desc {
      font-size: 11px;
      padding: ${({ theme }) => theme.margin(3)};
      font-family: Montserrat;
    }

    .ant-tabs-content-holder {
      height: 275px;
      background-color: ${theme.tabContentBidBackground};
      transform: translateY(-32px);
      padding-top: ${({ theme }) => theme.margin(4)};
      padding-bottom: ${({ theme }) => theme.margin(8)};
      border-radius: 0 0 25px 25px;

      .ant-tabs-content {
        height: 100%;
        overflow-x: none;
        overflow-y: scroll;
        ${({ theme }) => theme.customScrollBar('6px')};
      }
    }

    .cancel-button {
      background-color: red !important;
    }

    .rst-footer {
      width: 100%;
      position: absolute;
      display: flex;
      left: 0;
      bottom: 0;
      padding: ${theme.margin(2)};
      border-radius: 0 0 25px 25px;
      border-top: 1px solid ${theme.borderColorTabBidFooter};
      background: ${theme.tabContentBidFooterBackground};
      backdrop-filter: blur(23.9091px);

      .rst-footer-button {
        flex: 1;
        margin-right: ${theme.margin(1.5)};
        color: #fff;
        white-space: nowrap;

        cursor: pointer;
        width: ;
        height: 60px;
        ${theme.flexCenter}
        font-size: 17px;
        font-weight: 600;
        border: none;
        border-radius: 29px;
        padding: 0 ${theme.margin(2)};

        &:hover {
          opacity: 0.8;
        }

        &-buy {
          background-color: ${theme.success};
        }

        &-bid {
          background-color: ${theme.primary2};
        }

        &-sell {
          background-color: #bb3535;
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
const DETAILS_TAB_CONTENT = styled.div`
  ${({ theme }) => css`
    height: 100%;
    padding: ${theme.margin(0.5)} ${theme.margin(3)};
    color: ${theme.white};

    .dtc-item {
      padding: ${theme.margin(0.5)} 0;
      font-size: 16px;
      font-weight: 500;

      .dtc-item-value {
        color: #949494;
        color: ${theme.text8};
      }
      .dtc-item-title {
        color: ${theme.text7};
      }
    }
  `}
`

const REMOVE_ASK_MODAL = styled(Modal)`
  &.ant-modal {
    width: 501px !important;
  }

  .ant-modal-body {
    padding: ${({ theme }) => theme.margin(4.5)};
  }

  .modal-close-icon {
    width: 22px;
    height: 22px;
  }

  .bm-title {
    color: ${({ theme }) => theme.text1};
    font-size: 20px;
    font-weight: 500;
    text-align: center;
  }

  .bm-title-bold {
    font-weight: 600;
  }
`
//#endregion

export const RightSectionTabs: FC<{
  mode: NFTDetailsProviderMode
  status: MintItemViewStatus
}> = ({ mode, status, ...rest }) => {
  const history = useHistory()
  const [activeTab, setActiveTab] = useState('1')
  const { general, nftMetadata, ask, removeNFTListing } = useNFTDetails()
  const { sessionUser } = useNFTProfile()
  const { connection, network } = useConnectionConfig()
  const wallet = useWallet()
  const { publicKey } = wallet
  const { mint_address, owner, token_account } = general
  const [bidModal, setBidModal] = useState<boolean>(false)
  const [removeBid, setRemoveBid] = useState<boolean>(false)
  const [removeAskModal, setRemoveAskModal] = useState<boolean>(false)

  useEffect(() => {}, [publicKey])

  const nftData = useMemo(() => {
    return [
      {
        title: 'Mint address',
        value: `${mint_address.substr(0, 4)}...${mint_address.substr(-4, 4)}`
      },
      {
        title: 'Token Address',
        value: token_account ? `${token_account.substr(0, 4)}...${token_account.substr(-4, 4)}` : ''
      },
      {
        title: 'Owner',
        value: owner ? `${owner.substr(0, 6)}...${owner.substr(-4, 4)}` : ''
      },
      {
        title: 'Artist Royalties',
        value: `${(nftMetadata.seller_fee_basis_points / 100).toFixed(2)}%`
      },
      {
        title: 'Transaction Fee',
        value: `${NFT_MARKET_TRANSACTION_FEE}%`
      }
    ]
  }, [general])

  const derivePDAsForInstruction = async () => {
    const buyerPrice: BN = new BN(ask.buyer_price)

    const sellerTradeState: [PublicKey, number] = await tradeStatePDA(publicKey, general, bnTo8(buyerPrice))

    if (!sellerTradeState) {
      throw Error(`Could not derive values for sell instructions`)
    }

    return {
      sellerTradeState,
      buyerPrice
    }
  }

  const handleUpdateAsk = (e) => {
    e.preventDefault()
    ask === undefined ? history.push(`/NFTs/sell/${general.non_fungible_id}`) : setRemoveAskModal(true)
  }

  const handleRemoveAsk = async (e) => {
    e.preventDefault()

    const { sellerTradeState, buyerPrice } = await derivePDAsForInstruction()
    const { signature, confirm } = await callCancelInstruction(
      wallet,
      connection,
      general,
      sellerTradeState,
      buyerPrice
    )

    if (confirm.value.err === null) {
      notify(successfulListingMsg(signature, nftMetadata, buyerPrice.toString()))
      postCancelAskToAPI(general.non_fungible_id)
    }
  }

  const postCancelAskToAPI = async (id: any) => {
    const res = await removeNFTListing(id)
    console.log(res)
  }

  const successfulListingMsg = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Successfully removed ask for ${nftMetadata.name}!`}
        itemName={nftMetadata.name}
        supportText={`Removed asking price: ${price}`}
        tx_url={`https://explorer.solana.com/tx/${signature}?cluster=${network}`}
      />
    )
  })

  const handleSetBid = (type: string) => {
    setBidModal(true)
  }

  const handleModal = () => {
    if (removeAskModal) {
      return (
        <REMOVE_ASK_MODAL
          visible={removeAskModal}
          setVisible={setRemoveAskModal}
          title=""
          onCancel={() => console.log('cancel')}
        >
          <RemoveAskModalContent removeAsk={handleRemoveAsk} />
        </REMOVE_ASK_MODAL>
      )
    } else if (bidModal) {
      return <BidModal canCancelBid={setRemoveBid} cancel={removeBid} visible={bidModal} setVisible={setBidModal} />
    }
  }

  return (
    <RIGHT_SECTION_TABS activeTab={activeTab} mode={mode} {...rest}>
      {handleModal()}
      <Tabs defaultActiveKey="1" centered onChange={(key) => setActiveTab(key)}>
        <>
          <TabPane tab="Details" key="1">
            <DETAILS_TAB_CONTENT {...rest}>
              {nftData.map((item, index) => (
                <Row justify="space-between" align="middle" className="dtc-item" key={index}>
                  <Col className="dtc-item-title">{item.title}</Col>
                  <Col className="dtc-item-value">{item.value}</Col>
                </Row>
              ))}
            </DETAILS_TAB_CONTENT>
          </TabPane>
          <TabPane tab="Trading History" key="2">
            <TradingHistoryTabContent mode={mode} />
          </TabPane>
          <TabPane tab="Attributes" key="3">
            <AttributesTabContent data={nftMetadata.attributes} />
          </TabPane>
        </>
      </Tabs>
      {general.non_fungible_id && publicKey && (
        <SpaceBetweenDiv className="rst-footer">
          {sessionUser && sessionUser.user_id ? (
            publicKey.toBase58() === general.owner ? (
              <button className="rst-footer-button rst-footer-button-sell" onClick={handleUpdateAsk}>
                {ask === undefined ? 'List Item' : 'Remove Ask Price'}
              </button>
            ) : (
              <SpaceBetweenDiv style={{ flexGrow: 1 }}>
                <button
                  onClick={(e) => handleSetBid('bid')}
                  className={
                    removeBid
                      ? 'cancel-button rst-footer-button rst-footer-button-bid'
                      : 'rst-footer-button rst-footer-button-bid'
                  }
                >
                  {removeBid ? 'Cancel Bid' : 'Place Bid'}
                </button>
                {ask && (
                  <button onClick={(e) => handleSetBid('buy')} className="rst-footer-button rst-footer-button-buy">
                    Buy Now
                  </button>
                )}
              </SpaceBetweenDiv>
            )
          ) : (
            <button className="rst-footer-button rst-footer-button-bid" onClick={(e) => history.push('/NFTs/profile')}>
              Complete profile
            </button>
          )}

          <div className="rst-footer-share-button">
            <img src={`/img/assets/share.svg`} alt="share-icon" />
          </div>
        </SpaceBetweenDiv>
      )}
    </RIGHT_SECTION_TABS>
  )
}
