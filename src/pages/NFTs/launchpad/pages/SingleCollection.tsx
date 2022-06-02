import React, { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { IProjectParams } from '../../../../types/nft_launchpad'
import { fetchSelectedNFTLPData } from '../../../../api/NFTLaunchpad'
import { useNFTLPSelected } from '../../../../context/nft_launchpad'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { Col, Row, Tabs } from 'antd'
import { SOCIAL_MEDIAS } from '../../../../constants'
import { MintProgressBar, TokenSwitch } from './LaunchpadComponents'
import { InfoDivLightTheme, InfoDivBrightTheme } from './LaunchpadComponents'
import { SVGDynamicReverseMode } from '../../../../styles'
import { SkeletonCommon } from '../../Skeleton/SkeletonCommon'
import { DETAILS_TAB_CONTENT } from '../../NFTDetails/RightSectionTabs'

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
    height: 80vh;
    padding-left: 70px;
  }
  .button {
    border: none;
    background: pink;
    width: 80px;
  }
  .rightPart {
    width: 50%;
    height: 80vh;
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
const MINT_BUTTON_BAR = styled.div`
  margin-top: -100px;
  height: 70px;
  z-index: 99;
  position: absolute;
  border-radius: 0 0 25px 25px;
  width: 44%;
  backdrop-filter: blur(23.9091px);
  background: radial-gradient(
    81.62% 135.01% at 15.32% 21.04%,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(141, 141, 141, 0.05) 68.23%,
    rgba(255, 255, 255, 0.05) 77.08%,
    rgba(255, 255, 255, 0.0315) 100%
  );
`
const MINT_BTN = styled.div`
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 47px;
  width: 260px;
  height: 50px;
  margin: auto;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  justify-content: center;
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
export const SingleCollection: FC = () => {
  const params = useParams<IProjectParams>()
  const wallet = useWallet()
  const { selectedProject, setSelectedProject } = useNFTLPSelected()
  useEffect(() => console.log(selectedProject), [selectedProject])

  return (
    <div>
      <TokenSwitch />
      <WRAPPER>
        <div className="leftPart">
          <COLLECTION_NAME>{selectedProject?.collectionName}</COLLECTION_NAME>
          <TAG_LINE>{selectedProject?.tagLine}</TAG_LINE>
          <PRICE_SOCIAL>
            <InfoDivLightTheme items={selectedProject?.items} price={undefined}></InfoDivLightTheme>
            <InfoDivLightTheme items={selectedProject?.items} price={12}></InfoDivLightTheme>
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
            <Tabs>
              <TabPane tab="Details" key="1">
                <DETAILS_TAB_CONTENT>" Lorem ipsum dolor sit. "</DETAILS_TAB_CONTENT>
              </TabPane>
              <TabPane tab="Trading History" key="2">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum consectetur inventore iste. Commodi
                libero repellendus laudantium nemo provident er
              </TabPane>
              <TabPane tab="Attributes" key="3">
                Lorem ipsum dolor sit amet.
              </TabPane>
            </Tabs>
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
          <MintProgressBar minted={selectedProject?.itemsMinted} totalNFTs={selectedProject?.items} />
        </div>
      </WRAPPER>
    </div>
  )
}
