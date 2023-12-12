import styled from 'styled-components'
import { Row, Col } from 'antd'
import { FC } from 'react'
import tw from 'twin.macro'
import 'styled-components/macro'

const MESSAGE = styled.div`
  margin: -12px 0;
  font-size: 12px;
  font-weight: 700;
  ${tw``}

  .add-text {
    font-weight: 600;
  }
  .mTitle {
    margin-bottom: 16px;
  }

  .mIcon {
    width: 20.5px;
    height: 20px;
  }
`

interface ISuccessfulListingMsg {
  title: string
  itemName: string
  supportText?: string
  additionalText?: string
  tx_url?: string
}

export const SuccessfulListingMsg: FC<ISuccessfulListingMsg> = (props) => (
  <MESSAGE>
    <Row className="mTitle" justify="space-between" align="middle">
      <Col>{props.title}</Col>
      <Col>
        <img className="mIcon" src={`/img/assets/bid-success-icon.svg`} alt="" />
      </Col>
    </Row>

    <div tw="font-medium">{props.supportText}</div>
    <div className="add-text">{props.additionalText}</div>
    <div>
      <a
        style={{
          color: 'white',
          fontWeight: 'bold',
          textDecoration: 'underline',
          display: 'flex',
          alignItems: 'center'
        }}
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
export const SuccessfulListingMsgAMM: FC<ISuccessfulListingMsg> = (props) => (
  <MESSAGE>
    <Row className="mTitle" justify="space-between" align="middle">
      <Col>{props.title}</Col>
      <Col>
        <img className="mIcon" src={`/img/assets/bid-success-icon.svg`} alt="" />
      </Col>
    </Row>

    <div tw="font-medium">{props?.supportText}</div>
    <div className="add-text">{props?.additionalText}</div>
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
    <Row className="mTitle" justify="space-between" align="middle">
      <Col>{props.title}</Col>
      <Col>
        <img className="mIcon" src={`/img/assets/close-white-icon.svg`} alt="" />
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
export const SuccessSSLMessage: FC<{
  operation?: string
  token?: string
  amount?: number | string
  wallet_name: string
}> = ({ operation, token, amount, wallet_name }) => {
  const walletName = wallet_name
  return (
    <MESSAGE>
      <div tw="flex items-center justify-between">
        <div tw="text-[15px]">Success</div>
        <div>
          <img className="mIcon" src={`/img/assets/Success-icon.svg`} alt="" />
        </div>
      </div>

      <div tw="font-semibold text-[13px]">
        <div tw="font-semibold text-[13px]">
          {walletName !== 'SquadsX'
            ? `You’ve ${operation} ${amount} ${token} ${
                operation === 'deposited' ? 'to' : 'from'
              } ${token} POOL, Remember the more you deposit the more you can earn!`
            : `You’ve initialized a ${operation} for ${amount} ${token} ${
                operation === 'deposited' ? 'to' : 'from'
              } ${token} POOL on SquadsX. Remember the more you deposit the more you can earn!`}
        </div>
      </div>
    </MESSAGE>
  )
}

export const SuccessClaimMessage: FC<{
  token?: string
}> = ({ token }) => (
  <MESSAGE>
    <div tw="flex items-center justify-between">
      <div tw="text-[15px]">Success</div>
      <div>
        <img className="mIcon" src={`/img/assets/Success-icon.svg`} alt="" />
      </div>
    </div>

    <div tw="font-semibold text-[13px]">
      <div tw="font-semibold text-[13px]">
        {`Congratulations, 
          You’ve won ${token} from our Raffle.`}
      </div>
    </div>
  </MESSAGE>
)

export const TransactionErrorMsgSSL: FC = () => (
  <MESSAGE>
    <div tw="flex items-center justify-between">
      <div tw="text-regular text-white">We didn't catch that!</div>
      <div>
        <img className="mIcon" src={`/img/assets/close-circle.svg`} alt="" />
      </div>
    </div>
    <div tw="text-[13px] font-semibold">
      {/* Ask Emiliano what must be here */}
      Please bear with us and try again, or if the error continues{' '}
      <a href="https://solscan.com/tx/" target="_blank" tw="text-white font-semibold" rel="noreferrer">
        <u>go to docs</u>
      </a>
    </div>
  </MESSAGE>
)
export const SuccessfulNFTBidAMM: FC<{ collectionName: string }> = ({ collectionName }) => (
  <MESSAGE>
    <div tw="flex items-center justify-between">
      <div tw="text-regular text-white">Congratulations!</div>
      <div>
        <img className="mIcon" src={`/img/assets/close-circle.svg`} alt="" />
      </div>
    </div>
    <div tw="text-[13px] font-semibold">
      Please bear{collectionName} with us and try again, or if the error continues{' '}
    </div>
  </MESSAGE>
)
