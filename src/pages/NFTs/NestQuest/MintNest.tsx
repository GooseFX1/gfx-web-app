import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { PopupCustom } from '../Popup/PopupCustom'
import { MainButton } from '../../../components'
import { useConnectionConfig } from '../../../context'
import { ShareInternal } from './NestQuestComponent'
import { onShare } from './NestQuestSingleListing'
import { buyWithSOL, fetchAvailableNft, buyWithGOFX } from '../../../web3'
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react'
import { notify } from '../../../utils'
import Lottie from 'lottie-react'
import confettiAnimation from '../../../animations/confettiAnimation.json'

//#region styles
const STYLED_POPUP = styled(PopupCustom)`
  * {
    font-family: 'Montserrat';
    color: ${({ theme }) => theme.text2};
    z-index: 900 !important;
  }

  .ant-modal-wrap {
    z-index: 900 !important;
  }

  .ant-input-number {
    width: 100%;
  }
  ${({ theme }) => `
    .ant-modal-body {
      padding: ${theme.margin(3.5)} ${theme.margin(6)} ${theme.margin(2)};
    }

    .ant-modal-close {
      right: 35px;
      top: 35px;
      left: auto;
      svg {
        color: ${theme.text7};
      }
    }
    .title {
      margin-top: ${theme.margin(4)};
      width: 70%;
      font-family: Montserrat;
      font-size: 18px;
      font-weight: 500;
      margin-left: 15%;
      color: ${theme.text6};
      margin-bottom: ${theme.margin(4)};
      text-align: center;
    }

    .inner-title {
      font-family: Montserrat;
      font-size: 20px;
      font-weight: 600;
      color: ${theme.text1};
    }

    .ls-video {
      border-radius: 12px;
      z-index: 10;
      height: 180px;
      width: 180px;
    }

    .big-text {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 18px;
    }

    .collection-button{
      background: none;
      background-color: #5855FF;
      width: 80%;
      color: white;
    }
  `}
`

const STYLED_CREATE_BTN = styled(MainButton)`
  ${({ theme }) => `
    margin-top: ${theme.margin(2)};
    width: 100%;
    font-size: 17px;
    font-weight: 600;
    line-height: 45px;
    height: 53px;
    ${theme.roundedBorders}
    border: none;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
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
  width: 100%;

  .confettiAnimation {
    position: absolute;
    top: 0px;
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
  text-align: center;

  .image-wrapper {
    position: relative;
    width: 180px;
    height: 180px;
    margin: 56px auto;
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
    background-color: ${({ theme }) => theme.cardBg};

    span {
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
        width="532px"
        height={'auto'}
        title={null}
        visible={modalVisible}
        onCancel={() => {
          setModalOpen(false)
        }}
        closeIcon={
          <div>
            <img className="close-white-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
          </div>
        }
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

const GOFX_Price = 500
const SOL_Price = 1

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
            <span className="Big-Price">{nestQuestData.token === 'SOL' ? SOL_Price : GOFX_Price}</span>
            <span className="currency">{nestQuestData.token}</span>
          </Col>
        </PriceStyle>
        <ListStyle className="">
          <span>Price per item</span>
          <span>{nestQuestData.token === 'SOL' ? `${SOL_Price} SOL` : `${GOFX_Price} GOFX`}</span>
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
          <span>{nestQuestData.token === 'SOL' ? `${SOL_Price} SOL` : `${GOFX_Price} GOFX + 0.01 SOL`}</span>
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
  const { connection } = useConnectionConfig()

  useEffect(() => {
    if (wallet.publicKey && connection) {
      fetchAvailableNft(connection)
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
        ? buyWithSOL(wallet, connection, nft, gatewayToken?.publicKey)
        : buyWithGOFX(wallet, connection, nft, gatewayToken?.publicKey)

    buyFunction
      .then((result) => {
        if (result) {
          setPhase(3)
          notify({
            type: 'success',
            message: 'Purchase successful!',
            description: `You bought 1 "Tier 1 Egg" for ${token === 'SOL' ? `${SOL_Price} SOL` : `${GOFX_Price} GOFX`}`,
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
          <video
            className="ls-video"
            style={{ margin: '56px 0' }}
            autoPlay
            loop
            src={'https://gfxnestquest.s3.ap-south-1.amazonaws.com/Egg.mov'}
          ></video>
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
      <p style={{ fontSize: '16px' }}>You are now a proud owner of:</p>
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
