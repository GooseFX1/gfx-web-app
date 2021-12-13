import { Col, Row } from 'antd'
import { FC, useState } from 'react'
import styled from 'styled-components'
import { MainButton, Modal } from '../../../components'
import { notify } from '../../../utils'

// TODO: Set variables to demo here
const notEnough = false
const isVerified = true

const BUTTON = styled(MainButton)`
  ${({ theme }) => `
  cursor: pointer;
  ${theme.flexCenter}
  font-size: 17px;
  font-weight: 600;

  &:hover {
    opacity: 0.8;
  }

  &.bm-bid-button {
    width: 100%;
    font-size: 18px;
    font-weight: 600;
    background-color: ${theme.primary1};
  }

  &.bm-bid-button-disabled {
    pointer-events: none;
    background-color: #656565;
    &:hover {
      opacity: 1;
    }
  }

  &.bm-confirm-button {
    background-color: ${theme.secondary2};
  }
`}
`

const PURCHASE_MODAL = styled(Modal)`
  &.ant-modal {
    width: 501px !important;
  }

  .ant-modal-body {
    padding: ${({ theme }) => theme.margins['4.5x']};
    padding-bottom: ${({ theme }) => theme.margins['1x']};
  }

  .modal-close-icon {
    width: 22px;
    height: 22px;
  }

  .bm-title {
    color: ${({ theme }) => theme.text1};
    font-size: 20px;
    font-weight: 500;
  }

  .bm-title-bold {
    font-weight: 600;
  }

  .bm-confirm {
    margin-left: 0 auto;
    margin-top: ${({ theme }) => theme.margins['4.5x']};
    display: flex;
    flex-direction: column;
    align-items: center;

    .bm-confirm-text-1 {
      font-size: 19px;
      font-weight: 600;
      color: ${({ theme }) => theme.text5};
    }

    .bm-confirm-price {
      position: relative;
      font-size: 50px;
      font-weight: 600;
      margin-bottom: -${({ theme }) => theme.margins['1x']};
      color: ${({ theme }) => theme.text1};

      &:after {
        content: 'SOL';
        position: absolute;
        right: -60px;
        bottom: 12px;
        font-size: 22px;
      }
    }

    .bm-confirm-text-2 {
      font-size: 16px;
      font-weight: 500;
      color: ${({ theme }) => theme.text5};
      max-width: 240px;
      text-align: center;
    }
  }

  .bm-verified {
    margin-top: ${({ theme }) => theme.margins['3x']};
    margin-bottom: ${({ theme }) => theme.margins['3x']};
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.text5};

    .bm-alert {
      max-width: 200px;
    }

    .bm-check-icon {
      width: 28px;
      height: 28px;
    }
  }

  .bm-not-enough-funds {
    visibility: hidden;
    margin-top: ${({ theme }) => theme.margins['1x']};
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #ff6b6b;
  }

  .bm-not-enough-visible {
    visibility: visible;
    padding-bottom: ${({ theme }) => theme.margins['1x']};
  }

  .bm-review-alert {
    font-size: 10px;
    font-weight: 600;
    padding-bottom: ${({ theme }) => theme.margins['2x']};
    color: ${({ theme }) => theme.text5};
  }

  .bm-details {
    min-height: 100px;
    margin-top: ${({ theme }) => theme.margins['3.5x']};
    margin-bottom: ${({ theme }) => theme.margins['1x']};
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};

    .bm-details-price {
      width: 100px;
      margin-top: ${({ theme }) => theme.margins['0.5x']};
    }

    .bm-details-total {
      font-size: 12px;
      font-weight: 500;
      color: ${({ theme }) => theme.text5};

      .bm-details-price {
        margin-top: 0;
      }
    }
  }
`

const MESSAGE = styled.div`
  margin: -12px 0;
  font-size: 12px;
  font-weight: 700;

  .m-title {
    margin-bottom: 16px;
  }

  .m-icon {
    width: 20.5px;
    height: 20px;
  }
`

export const BidModal: FC<{ setVisible: (x: boolean) => void; visible: boolean }> = (props) => {
  const { setVisible, visible } = props
  const [mode, setMode] = useState('bid')
  const [isLoading, setIsLoading] = useState(false)

  const onCancel = () => setMode('bid')
  const reviewBid = () => setMode('review')
  const confirmBid = () => {
    setIsLoading(true)
    // TODO: Fake API
    setTimeout(() => {
      setIsLoading(false)
      setVisible(false)
      setMode('bid')
      notify({
        message: (
          <MESSAGE>
            <Row className="m-title" justify="space-between" align="middle">
              <Col>Live auction bid sucessfull!</Col>
              <Col>
                <img className="m-icon" src={`${process.env.PUBLIC_URL}/img/assets/bid-success-icon.svg`} alt="" />
              </Col>
            </Row>
            <div>Genesis #3886, Solcities</div>
            <div>My bid: 150.5 SOL (up to 160.5 SOL)</div>
          </MESSAGE>
        )
      })
    }, 1000)
  }

  return (
    <PURCHASE_MODAL setVisible={setVisible} title="" visible={visible} onCancel={onCancel}>
      <div className="bm-title">You are about to purchase a</div>
      <Row className="bm-title" align="middle" gutter={4}>
        <Col className="bm-title-bold">(Name of the NFT)</Col>
        <Col>by</Col>
        <Col className="bm-title-bold">(Name of the artist)</Col>.
      </Row>
      <div className="bm-confirm">
        <div className="bm-confirm-text-1">Place your bid:</div>
        <div className="bm-confirm-price">000.000</div>
        <div className="bm-confirm-text-2">
          {mode === 'bid' ? 'There is no minimum amount this is an open bid.' : '25,366.9 USD aprox'}
        </div>
      </div>
      <div className="bm-details">
        {mode === 'review' && (
          <>
            <Row justify="space-between" align="middle">
              <Col>Bid up to</Col>
              <Col>
                <Row className="bm-details-price" justify="space-between" align="middle">
                  <Col>160.55</Col>
                  <Col>SOL</Col>
                </Row>
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col>Service fee</Col>
              <Col>
                <Row className="bm-details-price" justify="space-between" align="middle">
                  <Col>0.33</Col>
                  <Col>SOL</Col>
                </Row>
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col>Total </Col>
              <Col>
                <Row className="bm-details-price" justify="space-between" align="middle">
                  <Col>160.88</Col>
                  <Col>SOL</Col>
                </Row>
              </Col>
            </Row>
            <Row justify="end" align="middle" className="bm-details-total">
              <div className="bm-details-price">25,419.04 USD</div>
            </Row>
          </>
        )}
      </div>
      <Row className="bm-verified" align="middle" gutter={8}>
        <Col>
          <img
            className="bm-check-icon"
            src={`${process.env.PUBLIC_URL}/img/assets/${isVerified ? 'check-icon.png' : 'close-icon.svg'}`}
            alt=""
          />
        </Col>
        <Col className="bm-alert">{`${
          isVerified ? 'This is a verfied creator' : 'This creator is not verfied (purchase at your own risk)'
        }`}</Col>
      </Row>
      {mode === 'review' && (
        <div className="bm-review-alert">
          When you comfirm your bid, it means you’re committing to buy this NFT if you’re the winning bidder.
        </div>
      )}
      {mode === 'bid' && (
        <BUTTON
          status="initial"
          width="100%"
          height="53px"
          className={`bm-bid-button ${notEnough ? 'bm-bid-button-disabled' : ''}`}
          onClick={reviewBid}
        >
          Review bid
        </BUTTON>
      )}
      {mode === 'review' && (
        <BUTTON
          status="initial"
          width="100%"
          height="53px"
          className="bm-confirm-button"
          onClick={confirmBid}
          loading={isLoading}
        >
          Send bid
        </BUTTON>
      )}
      <div className={`bm-not-enough-funds ${notEnough ? 'bm-not-enough-visible' : ''}`}>Not enough funds </div>
    </PURCHASE_MODAL>
  )
}
