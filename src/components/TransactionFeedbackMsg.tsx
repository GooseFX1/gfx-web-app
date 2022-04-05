import styled from 'styled-components'
import { Row, Col } from 'antd'

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

interface ISuccessfulListingMsg {
  title: string
  itemName: string
  supportText: string
  tx_url: string
}

export const SuccessfulListingMsg = (props: ISuccessfulListingMsg) => (
  <MESSAGE>
    <Row className="m-title" justify="space-between" align="middle">
      <Col>{props.title}</Col>
      <Col>
        <img className="m-icon" src={`/img/assets/bid-success-icon.svg`} alt="" />
      </Col>
    </Row>
    <div>{props.itemName}</div>
    <div>{props.supportText}</div>
    <div>
      <a
        style={{ color: 'white', fontWeight: 'bold', textDecoration: 'underline' }}
        href={props.tx_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>
          <img
            style={{ height: '18px', marginRight: '4px' }}
            src="https://www.gitbook.com/cdn-cgi/image/height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F2775063016-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-M2WGem6IdHOZpBD3zJX%252Flogo%252Fw9pblAvM5UayZbYEg4Cj%252FBlack.png%3Falt%3Dmedia%26token%3D9a925146-c226-4f09-b39b-f61642681016"
            alt="solscan-icon"
          />
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

export const TransactionErrorMsg = (props: ITransactionErrorMsg) => (
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
              src="https://www.gitbook.com/cdn-cgi/image/height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F2775063016-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-M2WGem6IdHOZpBD3zJX%252Flogo%252Fw9pblAvM5UayZbYEg4Cj%252FBlack.png%3Falt%3Dmedia%26token%3D9a925146-c226-4f09-b39b-f61642681016"
              alt="solscan-icon"
            />
          </span>
          Transaction ID
        </a>
      </div>
    )}
  </MESSAGE>
)
