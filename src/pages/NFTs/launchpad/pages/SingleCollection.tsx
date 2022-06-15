import React, { FC } from 'react'
import { useNFTLPSelected } from '../../../../context/nft_launchpad'
import styled, { css } from 'styled-components'
import { Col, Row, Tabs } from 'antd'
import { MintProgressBar, TokenSwitch, MintStarts } from './LaunchpadComponents'
import { InfoDivLightTheme, Vesting, RoadMap } from './LaunchpadComponents'
import { SVGDynamicReverseMode } from '../../../../styles'
import { SkeletonCommon } from '../../Skeleton/SkeletonCommon'
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
  const { selectedProject, cndyValues } = useNFTLPSelected()

  const isLive = parseInt(selectedProject?.startsOn) < Date.now()
  const displayProgressBar =
    isLive && cndyValues ? (
      <MintProgressBar minted={cndyValues?.itemsRedeemed} totalNFTs={cndyValues?.itemsAvailable} />
    ) : isLive && !cndyValues ? (
      <SkeletonCommon style={{ marginTop: '20px' }} width="600px" height={'70px'} borderRadius="10px" />
    ) : (
      <MintStarts time={selectedProject?.startsOn} />
    )
  const ProgressBar = selectedProject?.items ? (
    displayProgressBar
  ) : (
    <SkeletonCommon style={{ marginTop: '20px' }} width="600px" height={'70px'} borderRadius="10px" />
  )
  return (
    <div>
      <TokenSwitch />
      <WRAPPER>
        <div className="leftPart">
          {selectedProject?.collectionName ? (
            <COLLECTION_NAME>{selectedProject?.collectionName}</COLLECTION_NAME>
          ) : (
            <COLLECTION_NAME>
              <SkeletonCommon width="100%" height="100%" borderRadius="10px" />
            </COLLECTION_NAME>
          )}
          {selectedProject?.tagLine ? (
            <TAG_LINE>{selectedProject?.tagLine}</TAG_LINE>
          ) : (
            <TAG_LINE>
              <SkeletonCommon width="100%" height="100%" borderRadius="10px" />
            </TAG_LINE>
          )}
          {selectedProject?.items ? (
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
          ) : (
            <PRICE_SOCIAL>
              <SkeletonCommon width="500px" height="35px" borderRadius="10px" />
            </PRICE_SOCIAL>
          )}
          <>
            {selectedProject?.summary ? (
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
            ) : (
              <>
                <SkeletonCommon width="700px" height={'450px'} borderRadius="10px" />
              </>
            )}
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
          {ProgressBar}
        </div>
      </WRAPPER>
    </div>
  )
}
