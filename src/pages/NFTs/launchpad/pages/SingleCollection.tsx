import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IProjectParams } from '../../../../types/nft_launchpad'
import { useNFTLPSelected } from '../../../../context/nft_launchpad'
import { useWallet } from '@solana/wallet-adapter-react'
import styled, { css } from 'styled-components'
import { Col, Row, Tabs } from 'antd'
import { SOCIAL_MEDIAS } from '../../../../constants'
import { MintProgressBar, TokenSwitch, MintStarts } from './LaunchpadComponents'
import { InfoDivLightTheme, InfoDivBrightTheme, Vesting } from './LaunchpadComponents'
import { SVGDynamicReverseMode } from '../../../../styles'
import { SkeletonCommon } from '../../Skeleton/SkeletonCommon'
import { DETAILS_TAB_CONTENT } from '../../NFTDetails/RightSectionTabs'
import { MintButton } from '../launchpadComp/MintButton'
import { TeamMembers } from './LaunchpadComponents'

export const RIGHT_SECTION_TABS = styled.div<{ activeTab: string }>`
  ${({ theme, activeTab }) => css`
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
      height: 450px;
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

const SOCIAL_ICON = styled.button`
  background: transparent;
  border: none;

  img {
    height: 24px;
  }
`
const { TabPane } = Tabs

const WRAPPER = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  .leftPart {
    width: 50%;
    padding-left: 70px;
    height: 80vh;
  }
  .button {
    border: none;
    background: pink;
    width: 80px;
  }
  .rightPart {
    width: 50%;
    padding-right: 70px;
    margin-left: 50px;
  }
  .collectionName {
    font-weight: 700;
    font-size: 55px;
    line-height: 67px;
  }
  .tagLine {
    font-weight: 600;
    font-size: 30px;
    line-height: 37px;
  }
`

const NFT_COVER = styled.div`
  .image-border {
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    width: 608px;
    height: 608px;
    border-radius: 20px;
    padding: 5px;
    margin-top: 32px;
    margin-bottom: 30px;
  }
  .inner-image {
    width: 600px;
    height: 600px;
    object-fit: cover;
    border-radius: 20px;
  }
`
const COLLECTION_NAME = styled.div`
  font-weight: 700;
  font-size: 55px;
  line-height: 67px;
`
const TAG_LINE = styled.div`
  margin-top: 14px;
  font-weight: 600;
  font-size: 30px;
  line-height: 37px;
`
const PRICE_SOCIAL = styled.div`
  display: flex;
  margin-top: 25px;
  margin-bottom: 35px;
`
const SUMMARY_TAB_CONTENT = styled.div``
export const SingleCollection: FC = () => {
  const params = useParams<IProjectParams>()
  const wallet = useWallet()
  const [noOfNFTToMint, setNumberOfNftToMint] = useState(1)
  const { selectedProject } = useNFTLPSelected()

  const isLive = parseInt(selectedProject?.startsOn) < Date.now()
  return (
    <div>
      <TokenSwitch />
      <WRAPPER>
        <div className="leftPart">
          <COLLECTION_NAME>{selectedProject?.collectionName}</COLLECTION_NAME>
          <TAG_LINE>{selectedProject?.tagLine}</TAG_LINE>
          <PRICE_SOCIAL>
            <InfoDivLightTheme
              items={selectedProject?.items}
              currency={undefined}
              price={undefined}
            ></InfoDivLightTheme>
            <InfoDivLightTheme
              items={selectedProject}
              price={selectedProject?.price}
              currency={selectedProject?.currency}
            ></InfoDivLightTheme>
            <Row justify="space-between" align="middle" style={{ marginLeft: '10px' }}>
              <Col span={2}>
                <SOCIAL_ICON onClick={(e) => window.open(SOCIAL_MEDIAS.nestquest)}>
                  <SVGDynamicReverseMode src="/img/assets/domains.svg" alt="domain-icon" />
                </SOCIAL_ICON>
              </Col>
              <Col span={2}>
                <SOCIAL_ICON onClick={(e) => window.open(SOCIAL_MEDIAS.discord)}>
                  <SVGDynamicReverseMode src="/img/assets/discord_small.svg" alt="discord-icon" />
                </SOCIAL_ICON>
              </Col>
              <Col span={2}>
                <SOCIAL_ICON onClick={(e) => window.open(SOCIAL_MEDIAS.twitter)}>
                  <SVGDynamicReverseMode src="/img/assets/twitter_small.svg" alt="twitter-icon" />
                </SOCIAL_ICON>
              </Col>
            </Row>
          </PRICE_SOCIAL>
          <>
            <RIGHT_SECTION_TABS activeTab={'4'}>
              <Tabs>
                <TabPane tab="Summary" key="1">
                  <SUMMARY_TAB_CONTENT>
                    A mysterious egg abandoned in a peculiar tree stump nest. The egg emits a faint glow, as your hand
                    gets close to the surface you feel radiant heat. Something is alive inside. You must incubate this
                    egg for it to hatch.
                  </SUMMARY_TAB_CONTENT>
                </TabPane>
                <TabPane tab="Roadmap" key="2">
                  <h1>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum consectetur inventore iste.
                    Commodi libero repellendus laudantium nemo provident er Lorem, ipsum dolor sit amet consectetur
                    adipisicing elit. Voluptatum consectetur inventore iste. Commodi libero repellendus laudantium nemo
                    provident er Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum consectetur
                    inventore iste. Commodi libero repellendus laudantium nemo provident er
                  </h1>
                </TabPane>
                <TabPane tab="Team" key="3">
                  <TeamMembers />
                </TabPane>
                <TabPane tab="Vesting" key="4">
                  <Vesting currency={selectedProject?.currency} str={'hllo'} />
                </TabPane>
              </Tabs>
            </RIGHT_SECTION_TABS>
            <MintButton isLive={isLive} />
          </>
        </div>
        <div className="rightPart">
          <NFT_COVER>
            {selectedProject?.coverUrl ? (
              <div className="image-border">
                <img className="inner-image" alt="cover" src={selectedProject?.coverUrl} />
              </div>
            ) : (
              <SkeletonCommon width="600px" height="600px" borderRadius="10px" />
            )}
          </NFT_COVER>
          {isLive ? (
            <MintProgressBar minted={selectedProject?.itemsMinted} totalNFTs={selectedProject?.items} />
          ) : (
            <MintStarts time={selectedProject?.startsOn} />
          )}
        </div>
      </WRAPPER>
    </div>
  )
}
