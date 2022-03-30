import React, { useEffect, useMemo, FC, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Col, Row } from 'antd'
import styled, { css } from 'styled-components'
import { moneyFormatter } from '../../../utils'
import { RightSectionTabs } from './RightSectionTabs'
import { useNFTDetails, useNFTProfile, usePriceFeed } from '../../../context'
import { INFTAsk, MintItemViewStatus } from '../../../types/nft_details'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { MintInfo } from '@solana/spl-token'
import { useHistory } from 'react-router-dom'
import { MintModal } from '../OpenBidNFT/MintModal'

//#region styles
const RIGHT_SECTION = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;

    color: ${theme.text1};
    text-align: left;
    height: 100%;

    .rs-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: ${theme.margin(1)};
      color: ${theme.text7};
    }

    .rs-type {
      font-size: 14px;
      font-weight: 600;
    }

    .rs-prices {
      margin-bottom: ${theme.margin(1)};

      .rs-solana-logo {
        width: 43px;
        height: 43px;
      }

      .rs-price {
        font-size: 25px;
        font-weight: bold;
        color: ${theme.text8};
      }

      .rs-fiat {
        font-size: 14px;
        font-weight: 500;
        color: ${theme.text8};
      }

      .rs-percent {
        font-size: 11px;
        font-weight: 600;
        margin-left: ${theme.margin(0.5)};
        color: ${theme.text8};
      }
    }

    .rs-name {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: ${theme.margin(0.5)};
      color: ${theme.text7};
    }

    .rs-intro {
      font-size: 15px;
      font-weight: 500;
      max-height: 70px;
      margin-bottom: ${theme.margin(1.5)};
      color: ${theme.text8};
      overflow-y: scroll;
      overflow-x: hidden;
      ${({ theme }) => theme.customScrollBar('4px')};
    }

    .rs-charity-text {
      font-size: 12px;
      font-weight: 600;
      max-width: 64px;
      margin-left: ${theme.margin(1.5)};
      color: ${theme.text8};
    }
  `}
`
const RIGHT_SECTION_TABS = styled.div`
  ${({ theme }) => css`
    position: relative;

    .desc {
      font-size: 11px;
      padding: ${({ theme }) => theme.margin(3)};
      font-family: Montserrat;
    }

    .rst-footer {
      width: 100%;
      position: relative;
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
        color: #fff;
        white-space: nowrap;
        height: 55px;
        ${theme.flexCenter}
        font-size: 17px;
        font-weight: 600;
        border: none;
        border-radius: 29px;
        padding: 0 ${theme.margin(2)};
        cursor: pointer;

        &:not(:last-child) {
          margin-right: ${theme.margin(1.5)};
        }

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

        &-flat {
          background-color: transparent;
          color: ${theme.text1};
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

export const SpaceBetweenDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const GRID_INFO = styled(Row)`
  ${({ theme }) => css`
  width: 100%;
  margin-bottom: ${theme.margin(3)};

  .gi-item {
    .gi-item-category-title {
      font-size: 19px;
      font-weight: 600;
      margin-bottom: ${theme.margin(1)};
      color: ${theme.text7};
    }

    .gi-item-thumbnail-wrapper {
      position: relative;
      margin-right: ${theme.margin(1)};

      .gi-item-check-icon {
        position: absolute;
        right: 4px;
        bottom: -3px;
        width: 15px;
        height: 15px;
      }
    }

    .gi-item-thumbnail {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: ${theme.margin(1)};
    }

    .gi-item-icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: ${theme.margin(1)};
      background: ${theme.bg1};
      display: flex;
      justify-content: center;
      align-items: center;
      
      img {
        width: 16px;
        height: 16px;
      }
    }

    .gi-item-title {
      font-size: 18px;
      font-weight: 500;
      color: ${theme.text8};
      text-transform: capitalize;
    }
  `}
`

const HIGHEST_BIDDER = styled.span`
  color: ${({ theme }) => theme.text9};
`
//#endregion

export const NestQuestRightSection: FC<{
  status: MintItemViewStatus
}> = ({ status, ...rest }) => {
  const { publicKey } = useWallet()
  const { general, nftMetadata, bids, curHighestBid, ask } = useNFTDetails()
  const { prices } = usePriceFeed()
  const { sessionUser } = useNFTProfile()
  const history = useHistory()
  const wallet = useWallet()
  const [mintModal, setMintModal] = useState<boolean>(false)
  const [isBuying, setIsBuying] = useState<string>()
  const [removeAskModal, setRemoveAskModal] = useState<boolean>(false)
  const [removeMintModal, setRemoveMintModal] = useState<boolean>(false)

  const enum NFT_ACTIONS {
    BID = 'bid',
    BUY = 'buy',
    CANCEL_BID = 'cancel-bid',
    MINT = 'mint'
  }

  const creator = useMemo(() => {
    if (nftMetadata?.collection) {
      return Array.isArray(nftMetadata.collection) ? nftMetadata.collection[0].name : nftMetadata.collection?.name
    } else if (nftMetadata?.properties?.creators?.length > 0) {
      const addr = nftMetadata?.properties?.creators?.[0]?.address
      return `${addr.substr(0, 4)}...${addr.substr(-4, 4)}`
    } else {
      return null
    }
  }, [nftMetadata])

  const handleSetBid = (type: string) => {
    switch (type) {
      case NFT_ACTIONS.MINT:
        setIsBuying(undefined)
        setMintModal(true)
        break
      case NFT_ACTIONS.BUY:
        setMintModal(true)
        setIsBuying(ask.buyer_price)
        break
      case NFT_ACTIONS.CANCEL_BID:
        setRemoveMintModal(true)
        break
      default:
        return null
    }
  }

  const handleModal = () => {
    if (mintModal) {
      return <MintModal visible={mintModal} setVisible={setMintModal} purchasePrice={isBuying} />
    }
  }

  const price: number | null = useMemo(() => {
    return parseFloat('1000000') / LAMPORTS_PER_SOL
  }, [])

  const marketData = useMemo(() => prices['SOL/USDC'], [prices])

  const fiat = `${marketData && price ? (marketData.current * price).toFixed(3) : ''} USD aprox`
  const percent = '+ 1.15 %'
  const isForCharity = false

  useEffect(() => {}, [bids])

  if (nftMetadata === null) {
    return <div>Error loading metadata</div>
  }

  const isLoading = false

  return (
    <RIGHT_SECTION {...rest}>
      {isLoading ? (
        <>
          <SkeletonCommon width="100%" height="75px" borderRadius="10px" />
          <br />
        </>
      ) : (
        <div>
          {price && (
            <Row align="middle" gutter={8} className="rs-prices">
              <Col>
                <img className="rs-solana-logo" src={`/img/assets/solana-logo.png`} alt="" />
              </Col>
              <Col className="rs-price">{`${moneyFormatter(price)} SOL`}</Col>

              <Col className="rs-fiat">{`(${fiat})`}</Col>

              <Col>
                <Row>
                  <img src={`/img/assets/increase-arrow.svg`} alt="" />
                  <div className="rs-percent">{percent}</div>
                </Row>
              </Col>
            </Row>
          )}
        </div>
      )}

      {isLoading ? (
        <>
          <SkeletonCommon width="100%" height="75px" borderRadius="10px" />
          <br />
        </>
      ) : (
        <Row justify="space-between" align="middle">
          <Col span={24}>
            <div className="rs-name">{'NestQuest'}</div>
            <div className="rs-intro">
              {
                'Tier 1 - The Egg - A mysterious egg abandoned in a peculiar tree stump nest. The egg emits a faint glow, as your hand gets close to the surface you feel radiant heat. Something is alive inside. You must incubate this egg for it to hatch.'
              }
            </div>
          </Col>
        </Row>
      )}

      {isLoading ? (
        <SkeletonCommon width="100%" height="300px" borderRadius="10px" />
      ) : (
        <GRID_INFO justify="space-between">
          <Col className="gi-item">
            <div className="gi-item-category-title">Creator</div>
            <Row align="middle">
              <div className="gi-item-thumbnail-wrapper">
                <img className="gi-item-thumbnail" src="https://placeimg.com/30/30" alt="" />
                <img className="gi-item-check-icon" src={`/img/assets/check-icon.png`} alt="" />
              </div>
              <div className="gi-item-title">{'NestQuest'}</div>
            </Row>
          </Col>
          {
            <Col className="gi-item">
              <div className="gi-item-category-title">Collection</div>
              <Row align="middle">
                <img className="gi-item-thumbnail" src="https://placeimg.com/30/30" alt="" />
                <div className="gi-item-title">{'NestQuest'}</div>
              </Row>
            </Col>
          }
          <Col className="gi-item">
            <div className="gi-item-category-title">Category</div>
            <Row align="middle">
              <div className="gi-item-icon">
                <img src={`dummy.svg`} alt="" />
              </div>
              <div className="gi-item-title">{'Video'}</div>
            </Row>
          </Col>
        </GRID_INFO>
      )}

      <RIGHT_SECTION_TABS>
        {handleModal()}
        {!isLoading && wallet.publicKey && (
          <SpaceBetweenDiv className="rst-footer">
            {sessionUser && sessionUser.user_id ? (
              <SpaceBetweenDiv style={{ flexGrow: 1 }}>
                <button
                  onClick={(e) => handleSetBid(NFT_ACTIONS.MINT)}
                  className={'rst-footer-button rst-footer-button-bid'}
                >
                  Mint
                </button>
              </SpaceBetweenDiv>
            ) : (
              <button
                className="rst-footer-button rst-footer-button-bid"
                onClick={(e) => history.push('/NFTs/profile')}
              >
                Complete profile
              </button>
            )}
          </SpaceBetweenDiv>
        )}
      </RIGHT_SECTION_TABS>
    </RIGHT_SECTION>
  )
}
