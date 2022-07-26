import React, { FC, useEffect, useState } from 'react'
import { useNFTLPSelected } from '../../../../context/nft_launchpad'
import styled, { css } from 'styled-components'
import { Col, Row, Tabs } from 'antd'
import { MintProgressBar, TokenSwitch, MintStarts } from './LaunchpadComponents'
import { InfoDivLightTheme, Vesting, RoadMap } from './LaunchpadComponents'
import { SVGBlackToGrey, SVGDynamicReverseMode } from '../../../../styles'
import { SkeletonCommon } from '../../Skeleton/SkeletonCommon'
import { MintButton } from '../launchpadComp/MintButton'
import { TeamMembers } from './LaunchpadComponents'
import { useDarkMode, useNavCollapse } from '../../../../context'
import { useHistory } from 'react-router-dom'
import tw from 'twin.macro'
import 'styled-components/macro'
import { checkMobile } from '../../../../utils'
import analytics from '../../../../analytics'
import { logEvent } from 'firebase/analytics'

export const RIGHT_SECTION_TABS = styled.div<{ activeTab: string }>`
  ${({ theme, activeTab }) => css`
    position: relative;
    width: 35vw;
    max-width: 800px;
    min-width: 650px;
    @media(max-width: 500px){
      width: 90%;
      min-width: 300px;
      margin: 0 auto;
    }
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
        border-radius: 15px 15px 25px 25px;
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
      @media(max-width: 500px){
        margin: 0;
      }
      color: #616161;
      font-size: 14px;
      font-weight: 500;
      .ant-tabs-tab-btn {
        @media(max-width: 500px){
          font-size: 15px;
        }
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
      @media(max-width: 500px){
        height: 350px;
      }
      height: 450px;
      z-index: 0;
      background-color: ${({ theme }) => theme.bg9}; !important;
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
const BACK_IMG = styled.div`
  width: 40px;
  height: 40px;
  margin-left: -30px;
  transform: scale(1.2);
  margin-top: 20px;
  margin-right: 0px;
  cursor: pointer;

  @media (max-width: 500px) {
    position: relative;
    left: 5%;
    margin: 0;
    margin-top: 20px;

    img {
      height: 20px;
      width: 10px;
    }
  }
`
const SOCIAL_ICON = styled.button`
  background: transparent;
  border: none;

  img {
    height: 24px;
  }
`
const { TabPane } = Tabs

const WRAPPER = styled.div<{ $navCollapsed: boolean }>`
  display: flex;
  align-items: center;
  margin-top: calc(100px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
  justify-content: space-between;
  .leftPart {
    width: 45%;
    margin-left: 5%;
    display: flex;
    justify-content: end;
  }
  .button {
    border: none;
    background: pink;
    width: 80px;
  }
  .rightPart {
    width: 50%;
    padding-right: 70px;
    margin-left: 100px;
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

    @media (max-width: 500px) {
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
      width: 90%;
      height: 350px;
      border-radius: 18px;
      padding: 3px;
      margin: 30px auto;
    }
  }
  .ended-img {
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    width: 0px;
    height: 0px;
    border-radius: 20px;
    padding: 5px;
    margin-top: 32px;
    margin-bottom: 30px;
    opacity: 0.4;
  }
  .sold-text {
    position: absolute;
    width: 00px;
    margin-top: -35%;
    height: 600px;
    font-weight: 700;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 24px;
    text-align: center;
  }
  .inner-image {
    width: 600px;
    height: 600px;
    object-fit: cover;
    border-radius: 20px;

    @media (max-width: 500px) {
      width: 100%;
      height: 344px;
    }
  }
`
const COLLECTION_NAME = styled.div`
  font-weight: 700;
  font-size: 55px;
  line-height: 67px;
  color: ${({ theme }) => theme.text7};

  @media (max-width: 500px) {
    font-family: Montserrat;
    font-size: 35px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    padding: 0 5%;
  }
`
const TAG_LINE = styled.div`
  margin-top: 14px;
  font-weight: 600;
  font-size: 30px;
  line-height: 37px;
  color: ${({ theme }) => theme.text4};
  margin-bottom: 14px;

  @media (max-width: 500px) {
    font-family: Montserrat;
    margin-top: 0;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    color: #eee;
    padding: 0 5%;
  }
`
const PRICE_SOCIAL = styled.div`
  display: flex;
  margin-top: 25px;
  margin-bottom: 35px;
`
const HEIGHT = styled.div`
  min-height: 800px !important ;
`

const TOGGLE_SPACE = styled.div`
  width: 260px;
  position: absolute;
  z-index: 299;
  top: 0;
  margin-left: 420px;
`
const SUMMARY_TAB_CONTENT = styled.div`
  @media (max-width: 500px) {
    margin: 20px auto;
    font-weight: 500;
    font-size: 15px;
    color: #eeeeee;
    line-height: 1.5;
  }
  margin: auto;
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 6%;
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.text4};
  div {
    text-align: center;
    span {
      color: ${({ theme }) => theme.primary3};
      text-align: center;
    }
  }
`
const TIER_WRAPPER = styled.div`
  @media (max-width: 500px) {
    padding: 0 15px;
  }
  margin: auto;
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 6%;
  margin-bottom: 6%;
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.text4};
  .tierRow {
    height: 55px;
    width: 100%;
    margin-bottom: 20px;
    border: 1px solid ${({ theme }) => theme.text1h};
    border-radius: 8px;
    &.active {
      border-image-source: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
      border-image-slice: 1;
    }
    .rightSection {
      @media (max-width: 500px) {
        margin-right: 5px;
      }
      margin-left: auto;
      margin-right: 20px;
      .textStatus {
        @media (max-width: 500px) {
          border: 1px solid #7d7d7d;
          color: #7d7d7d;
        }
        border: 1.5px solid ${({ theme }) => theme.text8};
        color: ${({ theme }) => theme.text8};
        &.active {
          border: 1.5px solid ${({ theme }) => theme.primary1Active};
          color: ${({ theme }) => theme.primary1Active};
        }
      }
      .textPrice {
        @media (max-width: 500px) {
          color: #7d7d7d;
        }
        color: ${({ theme }) => theme.text8};
        &.active {
          color: ${({ theme }) => theme.primary1Active};
        }
      }
    }
    .leftSection {
      margin-left: 20px;
      .label-text {
        color: ${({ theme }) => theme.text7};
      }
      .limit-text {
        color: ${({ theme }) => theme.text11};
      }
    }
  }
`
const getRemaningTime = (time): string => {
  const startsOn = parseFloat(time)
  const timeDiffrence = startsOn - Date.now()
  let seconds = Number(timeDiffrence / 1000)
  var d = Math.floor(seconds / (3600 * 24))
  var h = Math.floor((seconds % (3600 * 24)) / 3600)
  var m = Math.floor((seconds % 3600) / 60)
  var s = Math.floor(seconds % 60)

  var dDisplay = d > 0 ? d + (d === 1 ? 'd ' : 'd ') : ''
  var hDisplay = h > 0 ? h + (h === 1 ? 'h ' : 'h ') : ''
  var mDisplay = m > 0 ? m + (m === 1 ? 'min ' : 'mins ') : ''
  var sDisplay = s > 0 ? s + (s === 1 ? 's ' : 's') : ''
  return d > 0 ? dDisplay + hDisplay : h > 0 ? hDisplay + mDisplay : mDisplay + sDisplay
}

const MOB_WRAPPER = styled.div<{ $navCollapsed: boolean }>`
  margin-top: calc(120px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
`

const ROW = styled.div`
  display: flex;
  justify-content: center;

  button {
    margin-right: 10px;
  }
`

export const SingleCollection: FC = () => {
  const { selectedProject, cndyValues } = useNFTLPSelected()
  const { isCollapsed } = useNavCollapse()
  const { mode } = useDarkMode()
  const history = useHistory()
  const [time, setTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const an = analytics()
    an !== null &&
      logEvent(an, 'screen_view', {
        firebase_screen: 'Launchpad: Mint',
        firebase_screen_class: 'load'
      })
  }, [])

  const isLive =
    (selectedProject?.whitelist && parseInt(selectedProject?.whitelist) < Date.now()) ||
    (!selectedProject?.whitelist && parseInt(selectedProject?.startsOn) < Date.now())
  const displayProgressBar =
    isLive && cndyValues ? (
      <MintProgressBar minted={cndyValues?.itemsRedeemed} totalNFTs={selectedProject?.items} />
    ) : isLive && !cndyValues ? (
      checkMobile() ? (
        <SkeletonCommon
          style={{ marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}
          width="90%"
          height={'60px'}
          borderRadius="10px"
        />
      ) : (
        <SkeletonCommon style={{ marginTop: '20px' }} width="600px" height={'70px'} borderRadius="10px" />
      )
    ) : (
      <MintStarts time={selectedProject?.whitelist || selectedProject?.startsOn} />
    )
  let ProgressBar = selectedProject?.items ? (
    displayProgressBar
  ) : checkMobile() ? (
    <SkeletonCommon
      style={{ marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}
      width="90%"
      height={'60px'}
      borderRadius="10px"
    />
  ) : (
    <SkeletonCommon style={{ marginTop: '20px' }} width="600px" height={'70px'} borderRadius="10px" />
  )
  if (selectedProject?.ended) ProgressBar = <></>

  if (checkMobile()) {
    return (
      <MOB_WRAPPER $navCollapsed={isCollapsed}>
        <ROW>
          <BACK_IMG onClick={() => history.goBack()}>
            <img src={`/img/assets/arrow-left${mode}.svg`} />{' '}
          </BACK_IMG>
          {selectedProject?.collectionName ? (
            <COLLECTION_NAME>{selectedProject?.collectionName}</COLLECTION_NAME>
          ) : (
            <COLLECTION_NAME>
              <SkeletonCommon width="100%" height="100%" borderRadius="10px" />
            </COLLECTION_NAME>
          )}
        </ROW>
        {selectedProject?.tagLine ? (
          <TAG_LINE>{selectedProject?.tagLine}</TAG_LINE>
        ) : (
          <TAG_LINE>
            <SkeletonCommon width="100%" height="100%" borderRadius="10px" />
          </TAG_LINE>
        )}
        <ROW>
          <SOCIAL_ICON onClick={(e) => window.open(selectedProject?.website)}>
            <SVGBlackToGrey src="/img/assets/domains.svg" alt="domain-icon" />
          </SOCIAL_ICON>
          <SOCIAL_ICON onClick={(e) => window.open(selectedProject?.discord)}>
            <SVGBlackToGrey src="/img/assets/discord_small.svg" alt="discord-icon" />
          </SOCIAL_ICON>
          <SOCIAL_ICON onClick={(e) => window.open(selectedProject?.twitter)}>
            <SVGBlackToGrey src="/img/assets/twitter_small.svg" alt="twitter-icon" />
          </SOCIAL_ICON>
        </ROW>
        <ROW style={{ justifyContent: 'space-evenly', marginTop: '18px' }}>
          <InfoDivLightTheme items={selectedProject?.items} currency={undefined} price={undefined}></InfoDivLightTheme>
          <InfoDivLightTheme
            items={selectedProject}
            price={selectedProject?.price}
            currency={selectedProject?.currency}
          ></InfoDivLightTheme>
        </ROW>
        <NFT_COVER>
          {selectedProject?.coverUrl ? (
            <>
              <div className={selectedProject?.ended ? 'ended-img' : 'image-border'}>
                <img className="inner-image" alt="cover" src={selectedProject?.coverUrl} />
              </div>
              {selectedProject?.ended ? <div className="sold-text">SOLD OUT</div> : <></>}
            </>
          ) : (
            <SkeletonCommon width="90%" height="350px" borderRadius="10px" />
          )}
        </NFT_COVER>
        {ProgressBar}
        {selectedProject?.summary ? (
          <div>
            <RIGHT_SECTION_TABS activeTab={'4'}>
              <Tabs defaultActiveKey={'2'}>
                <TabPane tab="Summary" key="1">
                  <SUMMARY_TAB_CONTENT>
                    <div>{selectedProject?.summary}</div>
                    <br />
                    <div>
                      <span style={{ fontSize: '18px' }}>{selectedProject?.highlightText}</span>
                    </div>
                  </SUMMARY_TAB_CONTENT>
                </TabPane>
                <TabPane tab="Tiers" key="2">
                  <TIER_WRAPPER>
                    {selectedProject?.tiers?.map((item, index) => (
                      <div
                        className={'tierRow ' + (cndyValues?.activeTierInfo?.name === item.name ? 'active' : '')}
                        tw="flex"
                      >
                        <div className="leftSection">
                          <div tw="flex flex-col items-start justify-center h-full">
                            <div tw="text-[15px]" className="label-text">
                              {'Tier ' + (index + 1) + ' - ' + item.name}
                            </div>
                            <div tw="text-[12px]" className="limit-text">
                              {item.number + " NFT's. Max " + item.limit + " NFT's"}
                            </div>
                          </div>
                        </div>
                        <div className="rightSection">
                          <div tw="flex flex-col items-end justify-center h-full">
                            <div
                              className={
                                'textStatus ' + (cndyValues?.activeTierInfo?.name === item.name ? 'active' : '')
                              }
                              tw="text-[11px] px-1"
                            >
                              <span>
                                {cndyValues?.tiers[index]?.status === 'live'
                                  ? 'Ends in: '
                                  : cndyValues?.tiers[index]?.status === 'upcoming'
                                  ? 'Starts in: '
                                  : 'Ended'}
                              </span>
                              {cndyValues?.tiers[index]?.status !== 'ended' &&
                              index !== selectedProject?.tiers.length - 1 ? (
                                <span>{getRemaningTime(cndyValues?.tiers[index]?.time)}</span>
                              ) : index === selectedProject?.tiers.length - 1 ? (
                                <span>{getRemaningTime(selectedProject?.startsOn)}</span>
                              ) : null}
                            </div>
                            <div
                              className={
                                'textPrice ' + (cndyValues?.activeTierInfo?.name === item.name ? 'active' : '')
                              }
                              tw="text-[12px]"
                            >
                              {item.price ? item.price : 'FREE'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TIER_WRAPPER>
                </TabPane>
                <TabPane tab="Roadmap" key="3">
                  <RoadMap roadmap={selectedProject?.roadmap} />
                </TabPane>
                <TabPane tab="Team" key="4">
                  <TeamMembers teamMembers={selectedProject?.team} />
                </TabPane>
                <TabPane tab="Vesting" key="5">
                  <Vesting currency={selectedProject?.currency} str={''} />
                </TabPane>
              </Tabs>
            </RIGHT_SECTION_TABS>
            {!selectedProject?.ended ? <MintButton isLive={isLive} /> : <></>}
          </div>
        ) : (
          <>
            <SkeletonCommon width="700px" height={'450px'} borderRadius="10px" />
          </>
        )}
      </MOB_WRAPPER>
    )
  }

  return (
    <HEIGHT style={{ height: isCollapsed ? '90vh' : '82vh' }}>
      <WRAPPER $navCollapsed={isCollapsed}>
        <div className="leftPart">
          <BACK_IMG onClick={() => history.goBack()}>
            <img src={`/img/assets/arrow-left${mode}.svg`} />{' '}
          </BACK_IMG>
          <div>
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
                      <SVGBlackToGrey src="/img/assets/domains.svg" alt="domain-icon" />
                    </SOCIAL_ICON>
                  </Col>
                  <Col span={2}>
                    <SOCIAL_ICON onClick={(e) => window.open(selectedProject?.discord)}>
                      <SVGBlackToGrey src="/img/assets/discord_small.svg" alt="discord-icon" />
                    </SOCIAL_ICON>
                  </Col>
                  <Col span={2}>
                    <SOCIAL_ICON onClick={(e) => window.open(selectedProject?.twitter)}>
                      <SVGBlackToGrey src="/img/assets/twitter_small.svg" alt="twitter-icon" />
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
                <div>
                  <RIGHT_SECTION_TABS activeTab={'4'}>
                    <Tabs defaultActiveKey={'2'}>
                      <TabPane tab="Summary" key="1">
                        <SUMMARY_TAB_CONTENT>
                          <div>{selectedProject?.summary}</div>
                          <br />
                          <div>
                            <span style={{ fontSize: '18px' }}>{selectedProject?.highlightText}</span>
                          </div>
                        </SUMMARY_TAB_CONTENT>
                      </TabPane>
                      <TabPane tab="Tiers" key="2">
                        <TIER_WRAPPER>
                          {selectedProject?.tiers?.map((item, index) => (
                            <div
                              className={'tierRow ' + (cndyValues?.activeTierInfo?.name === item.name ? 'active' : '')}
                              tw="flex"
                            >
                              <div className="leftSection">
                                <div tw="flex flex-col items-start justify-center h-full">
                                  <div tw="text-[17px]" className="label-text">
                                    {'Tier ' + (index + 1) + ' - ' + item.name}
                                  </div>
                                  <div tw="text-[14px]" className="limit-text">
                                    {item.number + " NFT's. Max " + item.limit + " NFT's"}
                                  </div>
                                </div>
                              </div>
                              <div className="rightSection">
                                <div tw="flex flex-col items-end justify-center h-full">
                                  <div
                                    className={
                                      'textStatus ' + (cndyValues?.activeTierInfo?.name === item.name ? 'active' : '')
                                    }
                                    tw="text-[11px] px-1"
                                  >
                                    <span>
                                      {cndyValues?.tiers[index]?.status === 'live'
                                        ? 'Ends in: '
                                        : cndyValues?.tiers[index]?.status === 'upcoming'
                                        ? 'Starts in: '
                                        : 'Ended'}
                                    </span>
                                    {cndyValues?.tiers[index]?.status === 'upcoming' ? (
                                      <span>{getRemaningTime(cndyValues?.tiers[index]?.time)}</span>
                                    ) : cndyValues?.tiers[index]?.status !== 'ended' &&
                                      index !== selectedProject?.tiers.length - 1 ? (
                                      <span>{getRemaningTime(cndyValues?.tiers[index]?.time)}</span>
                                    ) : index === selectedProject?.tiers.length - 1 ? (
                                      <span>{getRemaningTime(selectedProject?.startsOn)}</span>
                                    ) : null}
                                  </div>
                                  <div
                                    className={
                                      'textPrice ' + (cndyValues?.activeTierInfo?.name === item.name ? 'active' : '')
                                    }
                                    tw="text-[14px]"
                                  >
                                    {item.price ? item.price : 'FREE'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </TIER_WRAPPER>
                      </TabPane>
                      <TabPane tab="Roadmap" key="3">
                        <RoadMap roadmap={selectedProject?.roadmap} />
                      </TabPane>
                      <TabPane tab="Team" key="4">
                        <TeamMembers teamMembers={selectedProject?.team} />
                      </TabPane>
                      <TabPane tab="Vesting" key="5">
                        <Vesting currency={selectedProject?.currency} str={''} />
                      </TabPane>
                    </Tabs>
                  </RIGHT_SECTION_TABS>
                  {!selectedProject?.ended ? <MintButton isLive={isLive} /> : <></>}
                </div>
              ) : (
                <>
                  <SkeletonCommon width="700px" height={'450px'} borderRadius="10px" />
                </>
              )}
            </>
          </div>
        </div>
        <div className="rightPart">
          <NFT_COVER>
            {selectedProject?.coverUrl ? (
              <>
                <div className={selectedProject?.ended ? 'ended-img' : 'image-border'}>
                  <img className="inner-image" alt="cover" src={selectedProject?.coverUrl} />
                </div>
                {selectedProject?.ended ? <div className="sold-text">SOLD OUT</div> : <></>}
              </>
            ) : (
              <SkeletonCommon width="600px" height="600px" borderRadius="10px" />
            )}
          </NFT_COVER>
          {ProgressBar}
        </div>
      </WRAPPER>
    </HEIGHT>
  )
}
