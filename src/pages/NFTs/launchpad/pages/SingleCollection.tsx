import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IProjectParams } from '../../../../types/nft_launchpad'
import { useNFTLPSelected } from '../../../../context/nft_launchpad'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { Col, Row, Tabs } from 'antd'
import { SOCIAL_MEDIAS } from '../../../../constants'
import { MintProgressBar, TokenSwitch, MintStarts } from './LaunchpadComponents'
import { InfoDivLightTheme, InfoDivBrightTheme, Vesting, RoadMap } from './LaunchpadComponents'
import { SVGDynamicReverseMode } from '../../../../styles'
import { SkeletonCommon } from '../../Skeleton/SkeletonCommon'
import { DETAILS_TAB_CONTENT } from '../../NFTDetails/RightSectionTabs'
import { MintButton } from '../launchpadComp/MintButton'
import { TeamMembers } from './LaunchpadComponents'

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
const SUMMARY_TAB_CONTENT = styled.div`
  display: flex;
  margin: auto;
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 10%;
  font-weight: 600;
  font-size: 20px;
`
export const SingleCollection: FC = () => {
  const params = useParams<IProjectParams>()
  const wallet = useWallet()
  const { selectedProject } = useNFTLPSelected()

  const isLive = parseInt(selectedProject?.startsOn) < Date.now() && 0
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
                <SOCIAL_ICON onClick={(e) => window.open(selectedProject?.website)}>
                  <SVGDynamicReverseMode src="/img/assets/domains.svg" alt="domain-icon" />
                </SOCIAL_ICON>
              </Col>
              <Col span={2}>
                <SOCIAL_ICON onClick={(e) => window.open(selectedProject?.discord)}>
                  <SVGDynamicReverseMode src="/img/assets/discord_small.svg" alt="discord-icon" />
                </SOCIAL_ICON>
              </Col>
              <Col span={2}>
                <SOCIAL_ICON onClick={(e) => window.open(selectedProject?.twitter)}>
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
                    <div>{selectedProject?.summary}</div>
                  </SUMMARY_TAB_CONTENT>
                </TabPane>
                <TabPane tab="Roadmap" key="2">
                  <RoadMap roadmap={selectedProject?.roadmap} />
                </TabPane>
                <TabPane tab="Team" key="3">
                  <TeamMembers teamMembers={selectedProject?.team} />
                </TabPane>
                <TabPane tab="Vesting" key="4">
                  <Vesting currency={selectedProject?.currency} str={'hllo'} />
                </TabPane>
              </Tabs>
            </RIGHT_SECTION_TABS>
            <MintButton isLive={isLive} />
          </>
          <button> Mint</button>
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
