import React, { FC, useEffect, useState } from 'react'
import { useNFTLPSelected } from '../../../../context/nft_launchpad'
import styled, { css } from 'styled-components'
import { Tabs } from 'antd'
import { MintProgressBar, MintStarts } from './LaunchpadComponents'
import { InfoDivLightTheme, Vesting, RoadMap, Socials } from './LaunchpadComponents'
import { SkeletonCommon } from '../../Skeleton/SkeletonCommon'
import { MintButton } from '../launchpadComp/MintButton'
import { TeamMembers } from './LaunchpadComponents'
import { useDarkMode } from '../../../../context'
import { useHistory } from 'react-router-dom'
import tw from 'twin.macro'
import 'styled-components/macro'
import { checkMobile } from '../../../../utils'
import { logData } from '../../../../api/analytics'

export const RIGHT_SECTION_TABS = styled.div<{ activeTab: string }>`
  ${({ theme }) => css`
   ${tw`relative w-[35vw] max-w-[800px] min-w-[650px] sm:w-[90%] sm:my-5 sm:mx-auto sm:min-w-[300px]`}
    .ant-tabs-nav {
      ${tw`relative z-10`}
      .ant-tabs-nav-wrap {
        ${tw`rounded-t-average rounded-b-half py-3 bg-black`}
        .ant-tabs-nav-list {
          ${tw`justify-around w-full`}
        }
      }
      &:before {
        ${tw`absolute top-0 left-0 w-full h-full bg-[#2a2a2a] rounded-t-average rounded-b-half`}
        content: '';
      }
    }
    .ant-tabs-ink-bar {
      ${tw`hidden`}
    }
    .ant-tabs-top {
      > .ant-tabs-nav {
       ${tw`mb-0`}
        &::before {
          ${tw`border-none border-0`}
        }
      }
    }
    .ant-tabs-tab {
      ${tw`sm:m-0 text-[#616161] text-[14px] font-medium`}
      .ant-tabs-tab-btn {
        ${tw`sm:text-tiny text-[17px]`}
      }
      &.ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          ${tw`text-white`}
        }
      }
    }
    .desc {
      ${tw`text-smallest p-6`}
      font-family: Montserrat;
    }
    .ant-tabs-content-holder {
      ${tw`sm:h-[350px] sm:pb-8 sm:mb-[50px] h-[450px] z-0 pt-8 pb-16 rounded-t-none rounded-b-half`}
      background-color: ${({ theme }) => theme.bg9}; !important;
      transform: translateY(-32px);
      .ant-tabs-content {
        ${tw`h-full overflow-y-scroll`}
        overflow-x: none;
        ${({ theme }) => theme.customScrollBar('6px')};
      }
    }
    .rst-footer {
      ${tw`w-full absolute flex flex-row left-0 top-0 p-4 rounded-t-none rounded-b-half border-t border-solid`}
      border-top-color: ${theme.borderColorTabBidFooter};
      background: ${theme.tabContentBidFooterBackground};
      backdrop-filter: blur(23.9091px);
      .rst-footer-button {
        ${tw`text-white h-[55px] text-[17px] flex flex-row justify-center items-center 
        font-semibold border-0 border-none rounded-half py-0 px-4 cursor-pointer whitespace-nowrap`}
        flex: 1;
        &:not(:last-child) {
          ${tw`mr-3`}
        }
        &:hover {
          ${tw`opacity-80`}
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
        ${tw`cursor-pointer`}
        &:hover {
          ${tw`opacity-80`}
        }
      }
    }
  `}
`
const BACK_IMG = styled.div`
  ${tw`w-10 h-10 ml-[-30px] mt-2.5 mr-0 cursor-pointer sm:relative sm:left-[5%] sm:m-0 sm:mt-[15px]`}
  transform: scale(1.2);
    img {
      ${tw`sm:h-5 sm:w-2.5`}
    }
  }
`

const { TabPane } = Tabs

const WRAPPER = styled.div`
  ${tw`flex flex-row items-center justify-between`}
  margin-top: calc(100px - 0px);

  .leftPart {
    ${tw`sm:w-full sm:ml-0 w-[45%] ml-[5%]`}
  }
  .button {
    ${tw`border-none border-0 bg-[pink] w-20`}
  }
  .rightPart {
    ${tw`sm:w-0 sm:pr-0 sm:ml-0 w-1/2 pr-[70px] ml-[100px]`}
  }
  .collectionName {
    ${tw`font-bold text-[55px]`}
  }
  .tagLine {
    ${tw`font-semibold text-3xl`}
  }
`

const NFT_COVER = styled.div`
  ${tw`h-[550px] w-[550px] sm:h-[350px] sm:w-full`}
  .image-border {
    ${tw`w-[608px] h-[608px] p-[5px] rounded-bigger mt-8 mb-[30px] 
    sm:w-[90%] sm:h-[350px] sm:rounded-[18px] sm:p-[3px] sm:my-[30px] sm:mx-auto`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  }
  .ended-img {
    ${tw`h-[550px] w-[550px] rounded-bigger p-[5px] mt-8 
    mb-[30px] opacity-40 sm:h-[354px] sm:w-[90%] sm:my-0 sm:mx-auto`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  }

  .sold-text {
    ${tw`relative font-bold text-center bottom-[300px] mt-0 text-[50px] sm:bottom-[200px]`}
  }
  .inner-image {
    ${tw`h-[540px] w-[540px] rounded-bigger object-cover sm:h-[344px] sm:w-full`}
  }
`
const COLLECTION_NAME = styled.div`
  ${tw`font-bold text-[55px] leading-[67px] sm:text-[35px] sm:text-center sm:text-white sm:py-0 sm:px-[5%]`}
  color: ${({ theme }) => theme.text7};
`
const TAG_LINE = styled.div`
  ${tw`my-[14px] font-semibold text-3xl sm:mt-0 sm:text-center sm:text-white sm:py-0 sm:px-[5%] sm:text-[20px]`}
  color: ${({ theme }) => theme.text4};
`
const PRICE_SOCIAL = styled.div`
  ${tw`flex flex-row mt-[25px] mb-[35px] sm:justify-evenly`}
`
const HEIGHT = styled.div`
  ${tw`!min-h-[800px]`}
  * {
    font-family: ${({ theme }) => theme.fontFamily};
  }
`

const SUMMARY_TAB_CONTENT = styled.div`
  ${tw`sm:my-5 sm:mx-auto sm:font-medium sm:text-tiny sm:text-[#eeeeee] 
  sm:leading-normal m-auto px-[30px] mt-[6%] font-semibold text-[20px]`}
  color: ${({ theme }) => theme.text4};
  div {
    ${tw`text-center`}
    span {
      ${tw`text-center`}
      color: ${({ theme }) => theme.primary3};
    }
  }
`
const TIER_WRAPPER = styled.div`
  ${tw`sm:py-0 sm:px-[15px] m-auto px-[30px] font-semibold my-[6%] text-[20px]`}
  color: ${({ theme }) => theme.text4};
  .tierRow {
    ${tw`h-[55px] w-full mb-5 rounded-[8px]`}
    border: 1px solid ${({ theme }) => theme.text1h};
    &.active {
      border-image-source: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
      border-image-slice: 1;
    }
    .rightSection {
      ${tw`sm:mr-[5px] ml-auto mr-5`}
      .textStatus {
        @media (max-width: 500px) {
          border: 1px solid #7d7d7d;
          color: #7d7d7d;
        }
        border: 1.5px solid ${({ theme }) => theme.text4};
        color: ${({ theme }) => theme.text4};
        &.active {
          border: 1.5px solid ${({ theme }) => theme.primary1Active};
          color: ${({ theme }) => theme.primary1Active};
        }
      }
      .textPrice {
        @media (max-width: 500px) {
          color: #7d7d7d;
        }
        color: ${({ theme }) => theme.text4};
        &.active {
          color: ${({ theme }) => theme.primary1Active};
        }
      }
    }
    .leftSection {
      ${tw`ml-5`}
      .label-text {
        ${tw`text-[17px] sm:text-tiny`}
        color: ${({ theme }) => theme.text7};
      }
      .limit-text {
        ${tw`text-[14px] sm:text-[12px]`}
        color: ${({ theme }) => theme.text11};
      }
    }
  }
`
const ROW = styled.div`
  ${tw`flex flex-row justify-start items-center sm:justify-center`}
`

const getRemaningTime = (time): string => {
  const startsOn = parseFloat(time)
  const timeDiffrence = startsOn - Date.now()
  const seconds = Number(timeDiffrence / 1000)
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  const dDisplay = d > 0 ? d + (d === 1 ? 'd ' : 'd ') : ''
  const hDisplay = h > 0 ? h + (h === 1 ? 'h ' : 'h ') : ''
  const mDisplay = m > 0 ? m + (m === 1 ? 'min ' : 'mins ') : ''
  const sDisplay = s > 0 ? s + (s === 1 ? 's ' : 's') : ''
  return d > 0 ? dDisplay + hDisplay : h > 0 ? hDisplay + mDisplay : mDisplay + sDisplay
}

export const SingleCollection: FC = () => {
  const { selectedProject, cndyValues } = useNFTLPSelected()
  const { mode } = useDarkMode()
  const history = useHistory()
  const [, setTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    logData('launchpad mint')
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
          style={{
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'block',
            marginBottom: '-20px',
            width: '90%'
          }}
          width="90%"
          height={'60px'}
          borderRadius="10px"
        />
      ) : (
        <SkeletonCommon style={{ marginTop: '20px' }} width="540px" height={'70px'} borderRadius="10px" />
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
    <SkeletonCommon style={{ marginTop: '20px' }} width="540px" height={'70px'} borderRadius="10px" />
  )
  if (selectedProject?.ended) ProgressBar = <></>

  return (
    <HEIGHT style={{ height: checkMobile() ? '100%' : '82vh' }}>
      <WRAPPER>
        <div className="leftPart">
          <div>
            <ROW>
              <BACK_IMG onClick={() => history.goBack()}>
                <img src={`/img/assets/arrow-left${mode}.svg`} alt="arrow" />{' '}
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
            {selectedProject?.items && checkMobile() ? (
              <>
                <Socials />
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
                </PRICE_SOCIAL>
              </>
            ) : !checkMobile() ? (
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
                <Socials />
              </PRICE_SOCIAL>
            ) : (
              <SkeletonCommon
                width={checkMobile() ? '90%' : '500px'}
                height="35px"
                borderRadius="10px"
                style={{ display: 'block', margin: checkMobile() ? '0 auto' : '0' }}
              />
            )}
            <>
              {checkMobile() ? (
                <>
                  <NFT_COVER>
                    {selectedProject?.coverUrl ? (
                      <>
                        <div className={selectedProject?.ended ? 'ended-img' : 'image-border'}>
                          <img className="inner-image" alt="cover" src={selectedProject?.coverUrl} />
                        </div>
                        {selectedProject?.ended ? <div className="sold-text">SOLD OUT</div> : <></>}
                      </>
                    ) : (
                      <SkeletonCommon
                        width="90%"
                        height="354px"
                        borderRadius="10px"
                        style={{ display: 'block', margin: 'auto' }}
                      />
                    )}
                  </NFT_COVER>
                  {ProgressBar}
                </>
              ) : (
                ''
              )}
              {selectedProject?.summary ? (
                <div>
                  <RIGHT_SECTION_TABS activeTab={'4'}>
                    <Tabs defaultActiveKey={'1'}>
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
                              className={
                                'tierRow ' + (cndyValues?.activeTierInfo?.name === item.name ? 'active' : '')
                              }
                              tw="flex"
                              key={index}
                            >
                              <div className="leftSection">
                                <div tw="flex flex-col items-start justify-center h-full">
                                  <div className="label-text">{'Tier ' + (index + 1) + ' - ' + item.name}</div>
                                  <div tw="text-[14px]" className="limit-text">
                                    {item.number + " NFT's. Max " + item.limit + " NFT's"}
                                  </div>
                                </div>
                              </div>
                              <div className="rightSection">
                                <div tw="flex flex-col items-end justify-center h-full">
                                  <div
                                    className={
                                      'textStatus ' +
                                      (cndyValues?.activeTierInfo?.name === item.name ? 'active' : '')
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
                                      'textPrice ' +
                                      (cndyValues?.activeTierInfo?.name === item.name ? 'active' : '')
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
        {!checkMobile() ? (
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
                <SkeletonCommon width="540px" height="540px" borderRadius="10px" />
              )}
            </NFT_COVER>
            {ProgressBar}
          </div>
        ) : (
          ''
        )}
      </WRAPPER>
    </HEIGHT>
  )
}
