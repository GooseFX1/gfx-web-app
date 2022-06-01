import React, { FC, useEffect, useState, useCallback, useMemo, MouseEventHandler } from 'react'
import { Row, Col, Progress } from 'antd'
// import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
// import { WRAPPED_SOL_MINT } from '../../web3'
import { MintItemViewStatus, INFTMetadata } from '../../../../types/nft_details'
import { SkeletonCommon } from '../../Skeleton/SkeletonCommon'
import { MainButton } from '../../../../components/MainButton'
import { SOCIAL_MEDIAS } from '../../../../constants'
import { SVGDynamicReverseMode } from '../../../../styles/utils'
import { InfoDivUSDCTheme, DarkDiv } from './LaunchpadComponents'

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

  .nd-content {
    height: 100%;
  }
  .detailsContainer {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    height: 567px;
    margin: 20px 70px 0px 0px;
  }
  .nd-details {
    width: 450px;
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
  margin-bottom: 50px;
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
  margin-top: 50px;
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

export const FeaturedLaunch: FC<{
  handleClickPrimaryButton?: (type: string) => void
  status?: MintItemViewStatus
  backUrl?: string
  arbData?: INFTMetadata
}> = ({ status = '', backUrl, handleClickPrimaryButton, ...rest }) => {
  const history = useHistory()
  // const { connected, publicKey } = useWallet()
  // const { setVisible: setModalVisible } = useWalletModal()
  // const { getUIAmount } = useAccounts()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // const [notEnough, setNotEnough] = useState<boolean>(false)
  const mintPrice: number = useMemo(() => 1.5, [])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
  }, [])

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
      <div className="detailsContainer">
        <div className="nd-details">
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
                <TITLE className="rs-name">NestQuest</TITLE>
                <SUBTITLE>Tier #1 "The Egg"</SUBTITLE>
                <br />
                <Row justify="space-between" align="middle">
                  <div>Items 10,018</div>
                  <Col span={7}>
                    <div>Price {mintPrice} SOL</div>
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
                <DESCRIPTION>
                  A mysterious egg abandoned in a peculiar tree stump nest. The egg emits a faint glow, as your hand
                  gets close to the surface you feel radiant heat. Something is alive inside. You must incubate this egg
                  for it to hatch.
                </DESCRIPTION>
              </div>
            )}
          </div>
        </div>
        <div className="grapic-image" onClick={() => history.push('launchpad/1012')}>
          {!isLoading ? <DarkDiv /> : <SkeletonCommon width="100%" height="550px" borderRadius="10px" />}
        </div>
      </div>
    </NFT_DETAILS>
  )
}
