import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { PopupCustom } from '../Popup/PopupCustom'
import { MainButton } from '../../../components'
import { useConnectionConfig } from '../../../context'
import { ShareInternal } from './NestQuestComponent'
import { onShare } from './NestQuestSingleListing'
import { StringPublicKey, buyWithSOL, fetchAvailableNft, buyWithGOFX } from '../../../web3'
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react'
import { notify } from '../../../utils'

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
      border-radius: 20px;
      box-shadow: 3px 3px 14px 0px rgb(0 0 0 / 43%);
      z-index: 10;
      height: 180px;
      width: 180px;
    }

    .big-text {
      font-size: 32px;
      font-weight: 600;
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

//#endregion

interface UserValue {
  key: StringPublicKey
  label: StringPublicKey
  value: StringPublicKey
}

interface Royalty {
  creatorKey: StringPublicKey
  amount: number
}

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
            <span className="Big-Price">{nestQuestData.token === 'SOL' ? '2.00' : '750'}</span>
            <span className="currency">{nestQuestData.token}</span>
          </Col>
        </PriceStyle>
        <ListStyle className="">
          <span>Price per item</span>
          <span>{nestQuestData.token === 'SOL' ? '2.00 SOL' : '750 GOFX'}</span>
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
          <span>{nestQuestData.token === 'SOL' ? '2.01 SOL' : '750 GOFX + 0.01 SOL'}</span>
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
            description: `You bought 1 "Tier 1 Egg" for at least ${token === 'SOL' ? '2 SOL' : '750 GOFX'}`,
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
      <p className="big-text">Hold Tight!</p>

      <p className="inner-title">We are minting your nft</p>
      <video
        className="ls-video"
        autoPlay
        loop
        src={'https://gfxnestquest.s3.ap-south-1.amazonaws.com/Egg.mov'}
      ></video>
    </LoadStyle>
  )
}

const SuccessBuy = () => {
  const wallet = useWallet()
  return (
    <LoadStyle>
      <p className="big-text">Mission Accomplished!</p>
      <p className="inner-title">You are now a proud owner of:</p>
      <p className="inner-title">Tier 1 "The Egg"</p>
      <video
        className="ls-video"
        autoPlay
        loop
        src={'https://gfxnestquest.s3.ap-south-1.amazonaws.com/Egg.mov'}
      ></video>

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
