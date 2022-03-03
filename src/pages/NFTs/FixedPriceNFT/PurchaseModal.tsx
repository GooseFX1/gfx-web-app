import { Col, Row } from 'antd'
import { FC, useMemo } from 'react'
import styled from 'styled-components'
import { MainButton, Modal } from '../../../components'
import { useNFTDetails } from '../../../context'

// TODO: Set variables to demo here
const notEnough = false
const isVerified = true

const BUTTON = styled(MainButton)`
  cursor: pointer;
  ${({ theme }) => `${theme.flexCenter}`}
  font-size: 13px;
  font-weight: 600;

  &:hover {
    opacity: 0.8;
  }

  &.pm-purchase-button {
    width: 100%;
    font-size: 18px;
    font-weight: 600;
    background-color: ${({ theme }) => theme.primary1};
  }

  &.pm-purchase-button-disabled {
    pointer-events: none;
    background-color: #656565;
    &:hover {
      opacity: 1;
    }
  }
`

const PURCHASE_MODAL = styled(Modal)`
  &.ant-modal {
    width: 501px !important;
  }

  .ant-modal-body {
    padding: ${({ theme }) => theme.margin(4.5)};
    padding-bottom: ${({ theme }) => theme.margin(1)};
  }

  .modal-close-icon {
    width: 22px;
    height: 22px;
  }

  .pm-title {
    color: ${({ theme }) => theme.text1};
    font-size: 20px;
    font-weight: 500;
  }

  .pm-title-bold {
    font-weight: 600;
  }

  .pm-confirm {
    margin-left: 0 auto;
    margin-top: ${({ theme }) => theme.margin(4.5)};
    display: flex;
    flex-direction: column;
    align-items: center;

    .pm-confirm-text-1 {
      font-size: 19px;
      font-weight: 600;
      color: ${({ theme }) => theme.text5};
    }

    .pm-confirm-price {
      position: relative;
      font-size: 50px;
      font-weight: 600;
      margin-bottom: -${({ theme }) => theme.margin(1)};
      color: ${({ theme }) => theme.text1};

      &:after {
        content: 'SOL';
        position: absolute;
        right: -60px;
        bottom: 12px;
        font-size: 22px;
      }
    }

    .pm-confirm-text-2 {
      font-size: 16px;
      font-weight: 500;
      color: ${({ theme }) => theme.text5};
    }
  }

  .pm-verified {
    margin-top: ${({ theme }) => theme.margin(3)};
    margin-bottom: ${({ theme }) => theme.margin(3)};
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.text5};

    .pm-alert {
      max-width: 200px;
    }

    .pm-check-icon {
      width: 28px;
      height: 28px;
    }
  }

  .pm-not-enough-funds {
    visibility: hidden;
    margin-top: ${({ theme }) => theme.margin(1)};
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #ff6b6b;
  }

  .pm-not-enough-visible {
    visibility: visible;
    padding-bottom: ${({ theme }) => theme.margin(1)};
  }

  .pm-details {
    margin-top: ${({ theme }) => theme.margin(3.5)};
    margin-bottom: ${({ theme }) => theme.margin(1)};
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }
`

export const PurchaseModal: FC<{ setVisible: (x: boolean) => void; visible: boolean }> = (props) => {
  const { setVisible, visible } = props
  const { nftMetadata } = useNFTDetails()

  const creator = useMemo(() => {
    if (nftMetadata.properties.creators.length > 0) {
      const addr = nftMetadata.properties.creators[0].address
      return `${addr.substr(0, 4)}...${addr.substr(-4, 4)}`
    } else if (nftMetadata.collection) {
      return Array.isArray(nftMetadata.collection) ? nftMetadata.collection[0].name : nftMetadata.collection.name
    } else {
      return null
    }
  }, [nftMetadata])

  return (
    <PURCHASE_MODAL setVisible={setVisible} title="" visible={visible}>
      <div className="pm-title">You are about to purchase a</div>
      <Row className="pm-title" align="middle" gutter={4}>
        <Col className="pm-title-bold">(Name of the NFT)</Col>
        <Col>by</Col>
        <Col className="pm-title-bold">{creator}</Col>.
      </Row>
      <div className="pm-confirm">
        <div className="pm-confirm-text-1">You are about to pay</div>
        <div className="pm-confirm-price">000.000</div>
        <div className="pm-confirm-text-2">000.000 USD</div>
      </div>
      <div className="pm-details">
        <Row justify="space-between" align="middle">
          <Col>Your buying balance</Col>
          <Col>
            <Row className="pm-details-price" justify="space-between" align="middle">
              <Col>000.000</Col>
              <Col>SOL</Col>
            </Row>
          </Col>
        </Row>
        <Row justify="space-between" align="middle">
          <Col>Your balance</Col>
          <Col>
            <Row className="pm-details-price" justify="space-between" align="middle">
              <Col>000.000</Col>
              <Col>SOL</Col>
            </Row>
          </Col>
        </Row>
        <Row justify="space-between" align="middle">
          <Col>Service fee</Col>
          <Col>
            <Row className="pm-details-price" justify="space-between" align="middle">
              <Col>000.000</Col>
              <Col>SOL</Col>
            </Row>
          </Col>
        </Row>
        <Row justify="space-between" align="middle">
          <Col>You will pay </Col>
          <Col>
            <Row className="pm-details-price" justify="space-between" align="middle">
              <Col>000.000</Col>
              <Col>SOL</Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Row className="pm-verified" align="middle" gutter={8}>
        <Col>
          <img
            className="pm-check-icon"
            src={`/img/assets/${isVerified ? 'check-icon.png' : 'close-icon.svg'}`}
            alt=""
          />
        </Col>
        <Col className="pm-alert">{`${
          isVerified ? 'This is a verified creator' : 'This creator is not verified (purchase at your own risk)'
        }`}</Col>
      </Row>
      <BUTTON
        status="initial"
        width="100%"
        height="53px"
        className={`pm-purchase-button ${notEnough ? 'pm-purchase-button-disabled' : ''}`}
      >
        Purchase
      </BUTTON>
      <div className={`pm-not-enough-funds ${notEnough ? 'pm-not-enough-visible' : ''}`}>Not enough funds </div>
    </PURCHASE_MODAL>
  )
}
