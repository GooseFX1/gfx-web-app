import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { NQ_GOFX_PRICE, NQ_SOL_PRICE } from '../../../constants'
import { PopupCustom } from '../Popup/PopupCustom'
import { MainButton } from '../../../components'
import { useConnectionConfig } from '../../../context'
import { ShareInternal } from './NestQuestComponent'
import { buyWithSOL, fetchAvailableNft, buyWithGOFX } from '../../../web3'
import { onShare } from './NestQuestSingleListing'
import { notify } from '../../../utils'
import Lottie from 'lottie-react'
import confettiAnimation from '../../../animations/confettiAnimation.json'

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
        margin-top: ${theme.margin(4)};
        width: 70%;
        font-family: Montserrat;
        font-size: 18px;
        font-weight: 500;
        margin-left: 15%;
        color: ${theme.text7};
        margin-bottom: ${theme.margin(4)};
        text-align: center;
      }

      .inner-title {
        font-family: Montserrat;
        font-size: 20px;
        font-weight: 600;
        color: ${theme.text7};
      }

      .ls-video {
        border-radius: 12px;
        z-index: 10;
        height: 180px;
        width: 180px;
      }

      .big-text {
        color: ${theme.text7};
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 18px;
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
    background-color: #5855FF;
    color: white;
    ${theme.roundedBorders}

    span {
      color: #fff !important;
    }

    &:hover, &:focus{
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    }
    
  `}
`

const LoadStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .confettiAnimation {
    position: absolute;
    height: 105%;
    bottom: -56px;
    z-index: 3;
    pointer-events: none;
  }
`

const CreatorStyle = styled(Row)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .icon {
    height: 18px;
    width: auto;
    margin-right: 5px;
  }
`

const ListStyle = styled(Row)`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 1rem 0.25rem 1rem;
  align-items: center;
  width: 100%;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text6};
`

const PriceStyle = styled(Row)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 1rem 0rem 1rem 0rem;
  font-family: Montserrat;

  .price {
    font-size: 18px;
    font-weight: 500;
    color: ${({ theme }) => theme.text6};
  }

  .Big-Price {
    font-size: 60px;
    font-weight: 600;
    color: ${({ theme }) => theme.text2};
  }

  .currency {
    font-size: 30px;
    font-weight: 600;
    color: ${({ theme }) => theme.text2};
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
    <>
      <p className="title">
        You're about to mint <span className="inner-title">{nestQuestData.name}</span> by{' '}
        <span className="inner-title">{nestQuestData.project}</span>{' '}
      </p>
      <div>
        <CreatorStyle>
          <img className="icon" src={`/img/assets/check-icon.png`} alt="back" />
          <span>This is a verified creator</span>
        </CreatorStyle>
        <PriceStyle>
          <span className="price">Price</span>
          <Col span={18}>
            <span className="Big-Price">{nestQuestData.token === 'SOL' ? NQ_SOL_PRICE : NQ_GOFX_PRICE}</span>
            <span className="currency">{nestQuestData.token}</span>
          </Col>
        </PriceStyle>
        <ListStyle className="">
          <span>Price per item</span>
          <span>{nestQuestData.token === 'SOL' ? `${NQ_SOL_PRICE} SOL` : `${NQ_GOFX_PRICE} GOFX`}</span>
        </ListStyle>
        <ListStyle className="">
          <span>Quantity</span>
          <span>1 NFT</span>
        </ListStyle>
        <ListStyle className="">
          <span>Service fee</span>
          <span>0.01 SOL</span>
        </ListStyle>
        <ListStyle className="">
          <span>Total Price</span>
          <span>{nestQuestData.token === 'SOL' ? `${NQ_SOL_PRICE} SOL` : `${NQ_GOFX_PRICE} GOFX + 0.01 SOL`}</span>
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
    </>
  )
}

const LoadBuy = ({ nestQuestData, setPhase, gatewayToken, gatewayStatus }: MintProps) => {
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
  }, [wallet.publicKey, connection])

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
            network: 'mainnet'
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
        <span className="big-text">Hold tight!</span>

        <p className="inner-title">We are minting your nft</p>

        <div className="image-wrapper">
          <img className="ls-video" src={`${window.origin}/img/assets/nft-preview.svg`} alt="minting" />
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
      <Lottie animationData={confettiAnimation} className="confettiAnimation" />
      <p className="big-text">Mission Accomplished!</p>
      <p className="inner-title" style={{ fontSize: '16px' }}>
        You are now a proud owner of:
      </p>
      <p className="inner-title">Tier #1 "The Egg"</p>
      <NFT_WRAPPER>
        <div className="inner-content">
          <video
            className="ls-video"
            autoPlay
            loop
            src={'https://gfxnestquest.s3.ap-south-1.amazonaws.com/Egg.mov'}
          ></video>
          <br />
          <span>Tier 1 "The Egg"</span>
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
