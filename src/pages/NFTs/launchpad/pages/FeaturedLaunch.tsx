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
import { InfoDivUSDCTheme, DarkDiv, TokenSwitch } from './LaunchpadComponents'
import { useNFTLaunchpad } from '../../../../context/nft_launchpad'
import { useSolToggle } from '../../../../context/nftlp_price'

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

const LEFT_WRAPPER = styled.div`
  width: 35vw;
  .mintContainer {
    display: flex;
    margin-top: 40px;
    .navigationImg {
      cursor: pointer;
    }
  }
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
const GRAPHIC_IMG = styled.div``

export const SpaceBetweenDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
//#endregion
const MINT_BTN = styled.div`
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 47px;
  width: 219px;
  height: 60px;
  margin-left: -5px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  justify-content: center;
  margin-right: 60px;
  cursor: pointer;
`

const ITEMS = styled.div`
  font-weight: 600;
  font-size: 22px;
`
const PRICE_DISPLAY = styled.div`
  display: flex;
`
export const GetNftPrice = ({ item }) => {
  return (
    <PRICE_DISPLAY>
      <span>{`Price: ${item?.price}`}</span>
      <img
        style={{ margin: '0px 10px 5px 10px', width: '25px', height: '25px' }}
        src={`/img/crypto/${item?.currency}.svg`}
      />
      <span>{`  ${item?.currency}`}</span>
    </PRICE_DISPLAY>
  )
}
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

  // const [notEnough, setNotEnough] = useState<boolean>(false)
  const { isUSDC } = useSolToggle()
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [featuredDisplay, setFeaturedDisplay] = useState([])
  const [featuredList, setFeaturedList] = useState([])
  const { liveNFTProjects } = useNFTLaunchpad()

  useEffect(() => {
    setFeaturedList(
      isUSDC
        ? liveNFTProjects.filter((data) => data.currency === 'USDC')
        : liveNFTProjects.filter((data) => data.currency === 'SOL')
    )
  }, [isUSDC, liveNFTProjects])

  const handleScroller = (direction: string) => {
    const length = featuredList?.length
    if (direction === '+') {
      setFeaturedIndex((prev) => (prev + 1) % length)
    }
    if (direction === '-') {
      if (featuredIndex === 0) setFeaturedIndex(length - 1)
      else setFeaturedIndex((prev) => (prev - 1) % length)
    }
  }

  useEffect(() => {
    if (featuredList) {
      setFeaturedDisplay([featuredList[featuredIndex]])
    }
  }, [featuredIndex, liveNFTProjects, featuredList])

  return (
    <>
      {featuredDisplay[0]?.currency ? <TokenSwitch disabled={false} currency={featuredDisplay[0]?.currency} /> : <></>}

      <NFT_DETAILS {...rest}>
        {!featuredDisplay[0] ? (
          <>
            <img
              className="nd-back-icon"
              src={`/img/assets/arrow.svg`}
              alt="back"
              onClick={() => {
                backUrl ? history.push(backUrl) : history.goBack()
              }}
            />
            <SkeletonCommon width="100%" height="400px" borderRadius="10px" />
            <br />
          </>
        ) : (
          <div className="detailsContainer">
            <div className="nd-details">
              <div>
                {!featuredDisplay[0].collectionName ? (
                  <>
                    <SkeletonCommon width="100%" height="75px" borderRadius="10px" />
                    <br />
                    <SkeletonCommon width="100%" height="350px" borderRadius="10px" />
                    <br />
                  </>
                ) : (
                  <LEFT_WRAPPER>
                    <YELLOW>Featured Launch </YELLOW>
                    <TITLE className="rs-name">{featuredDisplay[0]?.collectionName}</TITLE>
                    <SUBTITLE>{featuredDisplay[0]?.tagLine}</SUBTITLE>
                    <br />
                    <Row justify="space-between" align="middle" style={{ marginRight: '50px' }}>
                      <ITEMS>{`Items ${featuredDisplay[0]?.items}`}</ITEMS>
                      <ITEMS>
                        <GetNftPrice item={featuredDisplay[0]} />
                      </ITEMS>
                    </Row>
                    <br />
                    <DESCRIPTION>{featuredDisplay[0]?.summary}</DESCRIPTION>
                    <div className="mintContainer">
                      <MINT_BTN onClick={() => history.push(`/NFTs/launchpad/${featuredDisplay[0].urlName}`)}>
                        Mint
                      </MINT_BTN>
                      <img
                        className="navigationImg"
                        alt="navigateImg"
                        onClick={() => handleScroller('-')}
                        src="/img/assets/navigateLeft.svg"
                      />
                      <img
                        className="navigationImg"
                        alt="navigateImg"
                        onClick={() => handleScroller('+')}
                        src="/img/assets/navigateRight.svg"
                      />
                    </div>
                  </LEFT_WRAPPER>
                )}
              </div>
            </div>
            <GRAPHIC_IMG>
              {featuredDisplay[0] ? (
                <DarkDiv coverUrl={featuredDisplay[0]?.coverUrl} />
              ) : (
                <SkeletonCommon width="100%" height="550px" borderRadius="10px" />
              )}
            </GRAPHIC_IMG>
          </div>
        )}
      </NFT_DETAILS>
    </>
  )
}
