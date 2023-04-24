import { Col, Row } from 'antd'
import styled from 'styled-components'
import { SuccessfulListingMsg } from '../../../../components'
import { INFTMetadata } from '../../../../types/nft_details'
import { notify } from '../../../../utils'

export const MESSAGE = styled.div`
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

export const couldNotFetchNFTMetaData = (): any =>
  notify({
    type: 'error',
    message: (
      <MESSAGE>
        <Row className="m-title" justify="space-between" align="middle">
          <Col>Buy error!</Col>
          <Col>
            <img className="m-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
          </Col>
        </Row>
        <div>Could not fetch NFT metadata for buy instructions</div>
      </MESSAGE>
    )
  })
export const couldNotDeriveValueForBuyInstruction = (): any =>
  notify({
    type: 'error',
    message: (
      <MESSAGE>
        <Row className="m-title" justify="space-between" align="middle">
          <Col>Open bid error!</Col>
          <Col>
            <img className="m-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
          </Col>
        </Row>
        <div>Could not derive values for buy instructions</div>
      </MESSAGE>
    )
  })
export const couldNotFetchUserData = (): any =>
  notify({
    type: 'error',
    message: (
      <MESSAGE>
        <div>Couldn't fetch user data, please refresh this page.</div>
      </MESSAGE>
    )
  })
export const successfulListingMessage = (signature: string, nftMetadata: INFTMetadata, price: string): any => ({
  message: (
    <SuccessfulListingMsg
      title={`Successfully placed a bid on ${nftMetadata?.name}!`}
      itemName={nftMetadata.name}
      supportText={`Bid of: ${price}`}
      tx_url={`https://solscan.io/tx/${signature}`}
    />
  )
})

export const successBidMatchedMessage = (signature: string, nftMetadata: INFTMetadata, price: string): any => ({
  message: (
    <SuccessfulListingMsg
      title={`Your bid matched!`}
      itemName={nftMetadata.name}
      supportText={`You have just acquired ${nftMetadata.name} for ${price} SOL!`}
      tx_url={`https://solscan.io/tx/${signature} `}
    />
  )
})
