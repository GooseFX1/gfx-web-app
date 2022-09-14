import React, { useEffect, useState } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react'
import styled from 'styled-components'
import { Image, Row } from 'antd'
import { NQ_GOFX_PRICE, NQ_SOL_PRICE } from '../../../constants'
import { PopupCustom } from '../Popup/PopupCustom'
import { MainButton } from '../../../components'
import { useConnectionConfig, useDarkMode } from '../../../context'
import { ShareInternal } from './NestQuestComponent'
import { buyWithSOL, fetchAvailableNft, buyWithGOFX } from '../../../web3'
import { onShare } from './NestQuestSingleListing'
import { notify } from '../../../utils'
import Lottie from 'lottie-react'
import confettiYellowAnimation from '../../../animations/confettiYellowAnimation.json'

//#region styles
const STYLED_POPUP = styled(PopupCustom)`
  ${({ theme }) => `
    .ant-modal-content {
      height: 100%;
    }
    .ant-modal-body {
      height: 100%;
      padding: 48px 40px 32px;

      .title {
        width: 100%;
        font-size: 24px;
        font-weight: 500;
        color: ${theme.text1};
        text-align: center;
        margin: 0;
        z-index: 10;
      }

      .inner-title {
        font-size: 24px;
        font-weight: 700;
        
        background: linear-gradient(92.45deg, #f7931a 6.46%, #ac1cc7 107.94%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        z-index: 10;
      }

      .ls-video {
        border-radius: 12px;
        height: 180px;
        width: 180px;
        z-index: 10;
      }

      .big-text {
        color: ${theme.text7};
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 18px;
        z-index: 10;
      }
  `}
`

const STYLED_CREATE_BTN = styled(MainButton)`
  ${({ theme }) => `
    margin-top: ${theme.margin(2)};
    height: 60px;
    width: 100%;
    font-size: 17px;
    font-weight: 600;
    line-height: 45px;
    border: none;
    background: ${theme.primary3};
    color: white;
    ${theme.roundedBorders}

    span {
      color: #fff !important;
    }

    &:hover, &:focus {
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    }
    
  `}
`

const LoadStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .confettiAnimation {
    position: absolute;
    height: 100%;
    bottom: 0px;
    pointer-events: none;
  }
`

const CONFIRM_MINT = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`

const CreatorStyle = styled(Row)`
  margin-top: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  span {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.text8};
  }

  .icon {
    height: 32px;
    width: 32px;
    margin-right: 8px;
  }
`

const ListStyle = styled(Row)`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 1rem 0.25rem 1rem;
  align-items: center;
  width: 100%;

  span {
    font-size: 17px;
    font-weight: 600;
    color: ${({ theme }) => theme.text4};
  }
`

const PriceStyle = styled(Row)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 1rem 0rem 1rem 0rem;

  .price {
    font-size: 24px;
    font-weight: 600;
    color: #858585;
  }

  .Big-Price {
    font-size: 64px;
    font-weight: 600;
    color: ${({ theme }) => theme.textWhitePurple};
  }

  .currency {
    font-size: 30px;
    font-weight: 600;
    color: ${({ theme }) => theme.textWhitePurple};
  }
`
const MINTING_PROGRESS = styled.div`
  height: 100%;
  text-align: center;

  .image-wrapper {
    position: relative;
    width: 180px;
    height: 180px;
    margin: 128px auto;
  }

  @keyframes loadingAnimation {
    from {
      width: 20%;
    }

    to {
      width: 100%;
    }
  }

  .pink-loading-overlay {
    position: absolute;
    background: linear-gradient(272.26deg, #dd3dff 2%, rgba(220, 31, 255, 0) 108.73%);
    opacity: 0.55;
    top: 0;
    height: 100%;
    border-radius: 12px;
    animation-duration: 3s;
    animation-name: loadingAnimation;
    animation-iteration-count: infinite;
    animation-direction: normal;
  }
`

const NFT_WRAPPER = styled.div`
  padding: 2px;
  border-radius: 12px;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  box-shadow: 3px 3px 14px 0px rgb(0 0 0 / 43%);
  margin-bottom: 32px;
  z-index: 10;

  .inner-content {
    display: flex;
    flex-direction: column;
    padding: 12px;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.bg19};

    span {
      color: white;
      font-weight: 500;
      font-size: 18px;
      line-height: 22px;
      text-align: center;
      margin-bottom: 6px;
    }
  }
`
//#endregion

interface Props {
  modalVisible: boolean
  setModalOpen: (data: any) => void
  nestQuestData: any
}

const RoyaltiesStep = ({ modalVisible, setModalOpen, nestQuestData }: Props) => {
  const [phase, setPhase] = useState(1)
  const { requestGatewayToken, gatewayStatus, gatewayToken } = useGateway()

  useEffect(() => {
    ;(async function () {
      if (!gatewayToken || gatewayStatus !== GatewayStatus.ACTIVE) {
        setModalOpen(false)
        await requestGatewayToken()
      }
    })()
  }, [gatewayToken, gatewayStatus, requestGatewayToken, setModalOpen])

  return (
    <>
      <STYLED_POPUP
        height={'786px'}
        width={'532px'}
        title={null}
        visible={modalVisible}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        {phase === 1 ? (
          <ConfirmMint nestQuestData={nestQuestData} setPhase={setPhase} />
        ) : phase === 2 ? (
          <LoadBuy
            nestQuestData={nestQuestData}
            setPhase={setPhase}
            gatewayToken={gatewayToken}
            gatewayStatus={gatewayStatus}
          />
        ) : (
          <SuccessBuy />
        )}
      </STYLED_POPUP>
    </>
  )
}

interface MintProps {
  modalVisible?: boolean
  setPhase: (data: number) => void
  nestQuestData: any
  gatewayToken?: any
  gatewayStatus?: any
}

const ConfirmMint = ({ nestQuestData, setPhase }: MintProps) => {
  const [loading, setLoading] = useState(false)

  return (
    <CONFIRM_MINT>
      <div>
        <p className="title">You're about to mint</p>
        <p className="title">
          <span className="inner-title">{nestQuestData.name}</span> by{' '}
          <span className="inner-title">{nestQuestData.project}</span>
        </p>
        <CreatorStyle>
          <img className="icon" src={`/img/assets/check-icon.svg`} alt="back" />
          <span>This is a verified creator</span>
        </CreatorStyle>
      </div>

      <PriceStyle>
        <span className="price">Price</span>
        <span>
          <span className="Big-Price">{nestQuestData.token === 'SOL' ? NQ_SOL_PRICE : NQ_GOFX_PRICE}</span>{' '}
          <span className="currency">{nestQuestData.token}</span>
        </span>
      </PriceStyle>

      <div style={{ width: '100%' }}>
        <ListStyle>
          <span>Price per item</span>
          <span>{nestQuestData.token === 'SOL' ? `${NQ_SOL_PRICE} SOL` : `${NQ_GOFX_PRICE} GOFX`}</span>
        </ListStyle>
        <ListStyle>
          <span>Quantity</span>
          <span>1 NFT</span>
        </ListStyle>
        <ListStyle>
          <span>Service fee</span>
          <span>0.01 SOL</span>
        </ListStyle>
        <ListStyle>
          <span>Total Price</span>
          <span style={{ fontWeight: '700' }}>
            {nestQuestData.token === 'SOL' ? `${NQ_SOL_PRICE} SOL` : `${NQ_GOFX_PRICE} GOFX + 0.01 SOL`}
          </span>
        </ListStyle>

        <STYLED_CREATE_BTN
          loading={loading}
          className="create-collection-btn"
          onClick={() => {
            setLoading(true)
            setTimeout(() => {
              setPhase(2)
            }, 3000)
          }}
        >
          Mint
        </STYLED_CREATE_BTN>
      </div>
    </CONFIRM_MINT>
  )
}

const LoadBuy = ({ nestQuestData, setPhase, gatewayToken, gatewayStatus }: MintProps) => {
  const { mode } = useDarkMode()
  const wallet = useWallet()
  const { connection, network } = useConnectionConfig()

  useEffect(() => {
    if (wallet.publicKey && connection) {
      fetchAvailableNft(connection, network)
        .then((res) => {
          if (res) {
            purchase(nestQuestData.token, res.nft)
          } else {
            throw new Error('NFT sold out')
          }
        })
        .catch((err) => {
          console.log(err)
          notify({ type: 'error', message: err?.message })
          setPhase(1)
        })
    }
  }, [wallet.publicKey, connection, network])

  console.log({ gatewayToken, gatewayStatus, stat: GatewayStatus.ACTIVE })

  const purchase = (token: string, nft: any) => {
    const buyFunction =
      token === 'SOL'
        ? buyWithSOL(wallet, connection, network, nft, gatewayToken?.publicKey)
        : buyWithGOFX(wallet, connection, network, nft, gatewayToken?.publicKey)

    buyFunction
      .then((result) => {
        if (result) {
          setPhase(3)
          notify({
            type: 'success',
            message: 'Purchase successful!',
            description: `You bought 1 "Tier 1 Egg" for ${
              token === 'SOL' ? `${NQ_SOL_PRICE} SOL` : `${NQ_GOFX_PRICE} GOFX`
            }`,
            icon: 'success',
            txid: result as string,
            network: network
          })
        } else {
          throw new Error('an error occured')
        }
      })
      .catch((err) => {
        console.log(err)
        notify({ type: 'error', message: err?.message })
        setPhase(1)
      })
  }

  return (
    <LoadStyle>
      <MINTING_PROGRESS>
        <p className="big-text">Hold tight!</p>
        <p className="title">We are minting your nft</p>

        <div className="image-wrapper">
          <Image
            className="ls-video"
            fallback={`${window.origin}/img/assets/nft-preview-${mode}.svg`}
            src={`${window.origin}/img/assets/nft-preview-${mode}.svg`}
            preview={false}
            alt={'loading'}
          />
          <div className="pink-loading-overlay"></div>
        </div>
      </MINTING_PROGRESS>
    </LoadStyle>
  )
}

const SuccessBuy = () => {
  const wallet = useWallet()

  return (
    <LoadStyle>
      <Lottie animationData={confettiYellowAnimation} className="confettiAnimation" />
      <p className="big-text">Mission Accomplished!</p>
      <p className="title" style={{ fontSize: '16px', zIndex: 1 }}>
        You are now a proud owner of:
      </p>
      <p className="title" style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', zIndex: 1 }}>
        Tier #1 "The Egg"
      </p>
      <NFT_WRAPPER>
        <div className="inner-content">
          <video
            className="ls-video"
            autoPlay
            loop
            src={'https://gfxnestquest.s3.ap-south-1.amazonaws.com/Egg.mov'}
          ></video>
          <br />
          <span>Tier #1 "The Egg"</span>
          <span>By NestQuest</span>
        </div>
      </NFT_WRAPPER>
      <ShareInternal socials={['twitter', 'telegram', 'facebook', 'copy link']} handleShare={onShare} />
      <STYLED_CREATE_BTN
        className="collection-button"
        onClick={() => {
          window.location.href = `/NFTs/profile/${wallet.publicKey}`
        }}
      >
        Go to collection
      </STYLED_CREATE_BTN>
    </LoadStyle>
  )
}

export default React.memo(RoyaltiesStep)
