import styled from 'styled-components'
import { Row, Col } from 'antd'
import { FC } from 'react'

const MESSAGE = styled.div`
  margin: -12px 0;
  font-size: 12px;
  font-weight: 700;

  .add-text {
    font-weight: 600;
  }
  .m-title {
    margin-bottom: 16px;
  }

  .m-icon {
    width: 20.5px;
    height: 20px;
  }
`

interface ISuccessfulListingMsg {
  title: string
  itemName: string
  supportText?: string
  additionalText?: string
  tx_url: string
}

export const SuccessfulListingMsg: FC<ISuccessfulListingMsg> = (props) => (
  <MESSAGE>
    <Row className="m-title" justify="space-between" align="middle">
      <Col>{props.title}</Col>
      <Col>
        <img className="m-icon" src={`/img/assets/bid-success-icon.svg`} alt="" />
      </Col>
    </Row>
    <div>{props.itemName}</div>
    <div>{props.supportText}</div>
    <div className="add-text">{props.additionalText}</div>
    <div>
      <a
        style={{ color: 'white', fontWeight: 'bold', textDecoration: 'underline' }}
        href={props.tx_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>
          <img style={{ height: '18px', marginRight: '4px' }} src={`/img/assets/solscan.png`} alt="solscan-icon" />
        </span>
        Transaction ID
      </a>
    </div>
  </MESSAGE>
)

interface ITransactionErrorMsg {
  title: string
  itemName: string
  supportText: string
  tx_url?: string
}

export const TransactionErrorMsg: FC<ITransactionErrorMsg> = (props) => (
  <MESSAGE>
    <Row className="m-title" justify="space-between" align="middle">
      <Col>{props.title}</Col>
      <Col>
        <img className="m-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
      </Col>
    </Row>
    <div>{props.itemName}</div>
    <div>{props.supportText}</div>
    {props.tx_url && (
      <div>
        <a href={props.tx_url} target="_blank" rel="noopener noreferrer">
          <span>
            <img
              style={{ height: '18px', marginRight: '4px' }}
              src={`/img/assets/solscan.png`}
              alt="solscan-icon"
            />
          </span>
          Transaction ID
        </a>
      </div>
    )}
  </MESSAGE>
)
