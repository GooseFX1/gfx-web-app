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
import { SVGDynamicReverseMode } from '../../styles/utils'

//#region styles
const IMAGE = styled.div`
  width: 100%;
  min-height: 550px;

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
  height: 100%;
  margin: 0 auto;
  padding-top: ${({ theme }) => theme.margin(6)};

  .nd-content {
    height: 100%;
  }

  ${({ theme }) => css`
    .nd-back-icon {
      position: absolute;
      top: 132px;
      left: 30px;
      transform: rotate(90deg);
      width: 25px;
      filter: ${theme.filterBackIcon};
      cursor: pointer;
    }
  `};
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
  width: 150px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  background: linear-gradient(180deg, rgba(247, 147, 26, 0.1) 0%, rgba(220, 31, 255, 0.1) 100%);
  border-image-source: linear-gradient(180deg, rgba(247, 147, 26, 0.5) 0%, rgba(220, 31, 255, 0.5) 100%);
  border-radius: 50px;
  filter: drop-shadow(0px 6px 9px rgba(36, 36, 36, 0.15));
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

const MINT_PROGRESS = styled(Progress)<{ num: number }>`
  .ant-progress-outer {
    height: 50px;
    margin-right: 0;
    padding-right: 0;
    .ant-progress-inner {
      height: 100%;
      background-color: ${({ theme }) => theme.bg1};

      .ant-progress-bg {
        height: 100% !important;
        background-color: ${({ theme }) => theme.primary4};
      }
    }
  }
  .ant-progress-text {
    position: absolute;
    top: 19px;
    left: calc(${({ num }) => num}% - 64px);
  }
`

const CONNECT = styled(MainButton)`
  height: 50px;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary3};
`

const ORANGE_BTN = styled(MainButton)`
  height: 50px;
  width: 100%;
  background: linear-gradient(270deg, #dc1fff 0%, #f7931a 106.38%);

  &:disabled {
    background: grey;
    cursor: not-allowed;
  }
`

export const SpaceBetweenDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
      <img
        className="nd-back-icon"
        src={`/img/assets/arrow.svg`}
        alt="back"
        onClick={() => {
          backUrl ? history.push(backUrl) : history.goBack()
        }}
      />

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
                <YELLOW>Featured Launch</YELLOW>
                <TITLE className="rs-name">NestQuest</TITLE>
                <SUBTITLE>Tier #1 "The Egg"</SUBTITLE>
                <br />

                <Row justify="space-between" align="middle">
                  <Col span={7}>
                    <PILL_SECONDARY>Items 10,018</PILL_SECONDARY>
                  </Col>
                  <Col span={7}>
                    <PILL_SECONDARY>Price {mintPrice} SOL</PILL_SECONDARY>
                  </Col>
                  <Col span={2}>
                    <SOCIAL_ICON onClick={(e) => window.open('https://nestquest.io/')}>
                      <SVGDynamicReverseMode src="/img/assets/domains.svg" alt="domain-icon" />
                    </SOCIAL_ICON>
                  </Col>
                  <Col span={2}>
                    <SOCIAL_ICON
                      onClick={(e) => window.open('https://discord.com/channels/833693973687173121/833742620371058688')}
                    >
                      <SVGDynamicReverseMode src="/img/assets/discord_small.svg" alt="discord-icon" />
                    </SOCIAL_ICON>
                  </Col>
                  <Col span={2}>
                    <SOCIAL_ICON onClick={(e) => window.open('https://twitter.com/GooseFX1')}>
                      <SVGDynamicReverseMode src="/img/assets/twitter_small.svg" alt="twitter-icon" />
                    </SOCIAL_ICON>
                  </Col>
                </Row>
                <br />
                <div>
                  <DESCRIPTION>
                    A mysterious egg abandoned in a peculiar tree stump nest. The egg emits a faint glow, as your hand
                    gets close to the surface you feel radiant heat. Something is alive inside. You must incubate this
                    egg for it to hatch.
                  </DESCRIPTION>
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
          {!isLoading && notEnough !== undefined ? (
            <Row gutter={8}>
              <Col span={7}>
                {publicKey ? (
                  <ORANGE_BTN
                    height={'40px'}
                    status="action"
                    width={'141px'}
                    onClick={(e) => console.log('mint nestquest egg')}
                    disabled={notEnough}
                  >
                    <span>{notEnough ? 'Not enough funds' : 'Mint'}</span>
                  </ORANGE_BTN>
                ) : (
                  <CONNECT onClick={handleWalletModal}>
                    <span>Connect Wallet</span>
                  </CONNECT>
                )}
              </Col>
              <Col span={17}>
                <MINT_PROGRESS percent={30} status="active" num={30} />
              </Col>
            </Row>
          ) : (
            <SkeletonCommon width="100%" height="50px" borderRadius="50px" />
          )}
        </Col>
      </Row>
    </NFT_DETAILS>
  )
}
