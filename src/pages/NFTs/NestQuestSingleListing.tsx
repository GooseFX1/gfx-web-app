import React, { FC, useEffect, useState, useCallback, useMemo, MouseEventHandler } from 'react'
import { Row, Col, Progress } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useWalletModal, useAccounts } from '../../context'
import { WRAPPED_SOL_MINT } from '../../web3'
import { MintItemViewStatus, INFTMetadata } from '../../types/nft_details'
import { SkeletonCommon } from './Skeleton/SkeletonCommon'
import { MainButton } from '../../components/MainButton'
import { SOCIAL_MEDIAS } from '../../constants'
import { SVGDynamicReverseMode } from '../../styles/utils'
import { FloatingActionButton } from '../../components'
import { Tabs } from 'antd'
const { TabPane } = Tabs

//#region styles
const IMAGE = styled.div`
  width: 100%;
  padding: 3px;
  border-radius: 20px;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);

  ${({ theme }) => css`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${theme.text1};

    .ls-image {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      border-radius: 20px;
      z-index: 0;
    }

    .ls-video {
      border-radius: 20px;
      box-shadow: 3px 3px 14px 0px rgb(0 0 0 / 43%);
      z-index: 10;
    }
  `}
`
const NFT_DETAILS = styled.div`
  position: relative;
  height: 100%;
  margin: 0 auto;
  padding-top: ${({ theme }) => theme.margin(6)};

  .nd-content {
    height: 100%;
  }

  .ant-tabs-top {
    overflow: initial;
    > .ant-tabs-nav {
      margin-bottom: 0;
      border-bottom: 0px solid #575757;
      padding-bottom: 0px;

      &::before {
        border: none;
      }

      .ant-tabs-nav-wrap {
        overflow: initial;
        display: block;

        .ant-tabs-nav-list {
          position: relative;
          display: flex;
          justify-content: space-around;
          transition: transform 0.3s;
          width: 100%;
          margin-left: auto;
          padding-right: 0px;
        }
      }
    }
  }

  .ant-tabs-nav {
    padding: 0px !important;
    border: 0px;
    background-color: ${({ theme }) => theme.bg1};
    border-radius: 20px 20px 0px 0px;
  }

  .ant-tabs-content {
    background-color: ${({ theme }) => theme.bg1};
    height: 473px;
    text-align: center;
    display: grid;
    place-items: center;
    font-size: 20px;
    margin-bottom: 2px;
    border-radius: 0px 0px 0px 0px;
    padding: 1rem;
  }

  .ant-tabs-nav-list {
    height: 75px;
    background-color: ${({ theme }) => theme.bg5};
    display: flex;
    justify-content: space-around;
    width: 100%;
    border-radius: 20px;
  }

  .ant-tabs-tab {
    color: ${({ theme }) => theme.tabNameColor};
    font-size: 20px;
    font-family: Montserrat;
    padding: 0;
    margin: 0;

    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: ${({ theme }) => theme.text7};
        font-weight: 600;
        position: relative;

        &:before {
          position: absolute;
          content: '';
          height: 0px;
          width: 0px;
          bottom: -28px;
          left: 0%;
          background: rgba(0, 0, 0);
          z-index: 0;
          display: inline-block;
          border-radius: 8px 8px 0 0;
          transform: translate(-50%, 0);
        }
      }
    }
  }
`

const YELLOW = styled.h3`
  font-weight: 700;
  font-size: 30px;
  line-height: 36.57px;
  background: linear-gradient(92.45deg, #ea7e00 6.46%, #f1c52a 107.94%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin: 0;
`

const TITLE = styled.h1`
  font-weight: 700;
  font-size: 60px;
  line-height: 73px;
  margin: 0;
  color: ${({ theme }) => theme.text1};
`

const SUBTITLE = styled.h2`
  font-weight: 700;
  font-size: 35px;
  line-height: 43px;
  margin: 0;
  color: ${({ theme }) => theme.text1};
`

const PILL_SECONDARY = styled.div`
  background: linear-gradient(90deg, rgba(247, 147, 26, 0.5) 0%, rgba(220, 31, 255, 0.5) 100%);
  border-radius: 50px;
  width: 150px;
  height: 45px;
  padding: 2px;

  div {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    background: #3c3b3ba6;
    border-radius: 50px;
    filter: drop-shadow(0px 6px 9px rgba(36, 36, 36, 0.15));
  }
`

const SOCIAL_ICON = styled.button`
  background: transparent;
  border: none;

  img {
    height: 24px;
  }
`

const DESCRIPTION = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: ${({ theme }) => theme.text4};
`

const REMNANT = styled.p`
  font-size: 18px;
  line-height: 22px;
  color: ${({ theme }) => theme.text1};
  margin: 0px;

  span {
    color: #7d7d7d;
  }
`

const MINT_PROGRESS = styled(Progress)<{ num: number }>`
  width: 75%;
  .ant-progress-outer {
    height: 50px;
    margin-right: 0;
    padding-right: 0;
    .ant-progress-inner {
      height: 100%;
      background-color: ${({ theme }) => theme.bg1};

      .ant-progress-bg {
        height: 100% !important;
        background: linear-gradient(96.79deg, #5855ff 4.25%, #dc1fff 97.61%);
      }
    }
  }
  .ant-progress-text {
    position: absolute;
    top: 19px;
    left: calc(${({ num }) => num}% - 64px);
  }
`

const MINT_PROGRESS_WRAPPER = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.bg18};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 15px;
`

const CONNECT = styled(MainButton)`
  height: 50px;
  width: 70%;
  background: linear-gradient(96.79deg, #5855ff 4.25%, #dc1fff 97.61%);
`

const Live = styled(MainButton)`
  height: 40px;
  width: 120px;
  border: 1.5px solid #fff;
  border-radius: 10px;
  position: absolute;
  top: 16px;
  left: 75%;
  z-index: 10;
`

const ACTION_BELOW = styled.div`
  width: 100%;
  height: 80px;
  padidng: 1rem;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 0px 0px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LiveText = styled.span`
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
`

const ORANGE_BTN = styled(MainButton)`
  height: 50px;
  width: 70%;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);

  &:disabled {
    background: grey;
  }
`

export const SpaceBetweenDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const FLOATING_ACTION_ICON = styled.img`
  transform: rotate(90deg);
  width: 16px;
  filter: ${({ theme }) => theme.filterBackIcon};
`
//#endregion

export const NestQuestSingleListing: FC<{
  handleClickPrimaryButton?: (type: string) => void
  status?: MintItemViewStatus
  backUrl?: string
  arbData?: INFTMetadata
}> = ({ status = '', backUrl, handleClickPrimaryButton, ...rest }) => {
  const history = useHistory()
  const { connected, publicKey } = useWallet()
  const { setVisible: setModalVisible } = useWalletModal()
  const { getUIAmount } = useAccounts()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [notEnough, setNotEnough] = useState<boolean>(false)
  const mintPrice: number = useMemo(() => 1.5, [])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  useEffect(() => {
    if (publicKey && connected) {
      setNotEnough(mintPrice >= getUIAmount(WRAPPED_SOL_MINT.toBase58()) ? true : false)
    }
  }, [connected, publicKey, getUIAmount])

  const handleWalletModal: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented && !connected && !publicKey) {
        setModalVisible(true)
      }
    },
    [setModalVisible, publicKey, connected]
  )

  return (
    <NFT_DETAILS {...rest}>
      <div style={{ position: 'absolute', top: '48px', left: '24px' }}>
        <FloatingActionButton height={50} onClick={() => history.goBack()}>
          <FLOATING_ACTION_ICON src={`/img/assets/arrow.svg`} alt="back" />
        </FloatingActionButton>
      </div>

      <Row gutter={[24, 16]} className="nd-content" justify="center" align="top">
        <Col sm={10} xl={10} xxl={8} className="nd-details">
          <div>
            {isLoading ? (
              <>
                <SkeletonCommon width="100%" height="75px" borderRadius="10px" />
                <br />
                <SkeletonCommon width="100%" height="350px" borderRadius="10px" />
                <br />
              </>
            ) : (
              <div>
                <YELLOW>Featured Launch </YELLOW>
                <DESCRIPTION>coming soon</DESCRIPTION>
                <TITLE className="rs-name">NestQuest</TITLE>
                <SUBTITLE>Tier #1 "The Egg"</SUBTITLE>
                <br />
                <Row justify="space-between" align="middle">
                  <Col span={7}>
                    <PILL_SECONDARY>
                      <div>Items 10,018</div>
                    </PILL_SECONDARY>
                  </Col>
                  <Col span={7}>
                    <PILL_SECONDARY>
                      <div>Price {mintPrice} SOL</div>
                    </PILL_SECONDARY>
                  </Col>
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
                <br />
                <div>
                  <Tabs className={'collection-tabs'} defaultActiveKey="1" centered>
                    <TabPane tab="Summary" key="1">
                      <DESCRIPTION>
                        A mysterious egg abandoned in a peculiar tree stump nest. The egg emits a faint glow, as your
                        hand gets close to the surface you feel radiant heat. Something is alive inside. You must
                        incubate this egg for it to hatch.
                      </DESCRIPTION>
                    </TabPane>
                    <TabPane tab="Roadmap" key="2">
                      <DESCRIPTION>Roadmap</DESCRIPTION>
                    </TabPane>
                    <TabPane tab="Team" key="3">
                      <DESCRIPTION>John Luke Weiyuan Usman Shrihari Others...</DESCRIPTION>
                    </TabPane>
                    <TabPane tab="Vesting" key="4">
                      <DESCRIPTION>
                        Month1 Setup data Month2 Setup staking Month3 Setup Gaming Month4-12 Setup Show
                      </DESCRIPTION>
                    </TabPane>
                  </Tabs>
                  <ACTION_BELOW>
                    {publicKey ? (
                      <ORANGE_BTN
                        status="action"
                        onClick={(e) => console.log('mint nestquest egg')}
                        disabled={notEnough}
                      >
                        Mint
                      </ORANGE_BTN>
                    ) : (
                      <CONNECT onClick={handleWalletModal}>
                        <span>Connect Wallet</span>
                      </CONNECT>
                    )}
                  </ACTION_BELOW>
                </div>
              </div>
            )}
          </div>
        </Col>
        <Col span={1}></Col>
        <Col sm={10} xl={10} xxl={8}>
          {!isLoading ? (
            <IMAGE>
              <video
                className="ls-video"
                autoPlay
                loop
                src={'https://gfxnestquest.s3.ap-south-1.amazonaws.com/Egg.mov'}
              ></video>
            </IMAGE>
          ) : (
            <SkeletonCommon width="100%" height="550px" borderRadius="10px" />
          )}
          <br />

          <Live>
            <LiveText>Live</LiveText>
          </Live>

          {!isLoading && notEnough !== undefined ? (
            <Row gutter={8}>
              {/* <Col span={7}>
                {publicKey ? (
                  <ORANGE_BTN
                    height={'40px'}
                    status="action"
                    width={'141px'}
                    onClick={(e) => console.log('mint nestquest egg')}
                    disabled={notEnough}
                  ></ORANGE_BTN>
                ) : (
                  <CONNECT onClick={handleWalletModal}>
                    <span>Connect Wallet</span>
                  </CONNECT>
                )}
              </Col> */}
              <MINT_PROGRESS_WRAPPER>
                <MINT_PROGRESS percent={50} status="active" num={50} />
                <REMNANT>
                  <span>5000</span>/10000
                </REMNANT>
              </MINT_PROGRESS_WRAPPER>
            </Row>
          ) : (
            <SkeletonCommon width="100%" height="50px" borderRadius="50px" />
          )}
        </Col>
      </Row>
    </NFT_DETAILS>
  )
}
