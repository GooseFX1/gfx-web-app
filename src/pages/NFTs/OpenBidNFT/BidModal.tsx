import { FC, useState, useEffect, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { Col, Row } from 'antd'
import { MainButton, Modal } from '../../../components'
import { notify } from '../../../utils'
import { useNFTProfile, useNFTDetails } from '../../../context'
import { ISingleNFT } from '../../../types/nft_details'
import { NFT_MARKET_TRANSACTION_FEE } from '../../../constants'

// TODO: Set variables to demo here
const notEnough = false
const isVerified = true

//#region styles
const BUTTON = styled(MainButton)`
  ${({ theme }) => `
  cursor: pointer;
  ${theme.flexCenter}
  font-size: 17px;
  font-weight: 600;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background-color: #7d7d7d;
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
    padding: ${({ theme }) => theme.margin(4.5)};
    padding-bottom: ${({ theme }) => theme.margin(1)};
  }

  .modal-close-icon {
    width: 22px;
    height: 22px;
  }

  .bm-title {
    color: ${({ theme }) => theme.text1};
    font-size: 20px;
    font-weight: 500;
    text-align: center;
  }

  .bm-title-bold {
    font-weight: 600;
  }

  .bm-confirm {
    margin-left: 0 auto;
    margin-top: ${({ theme }) => theme.margin(4.5)};
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
      margin-bottom: -${({ theme }) => theme.margin(1)};
      color: ${({ theme }) => theme.text1};
      background: transparent;
      border: 0px;
      width: 60%;
      align-self: center;
      text-align: center;

      &:after {
        content: 'SOL';
        position: absolute;
        right: -60px;
        bottom: 12px;
        font-size: 22px;
      }

      &:focus {
        outline: none;
        border-color: inherit;
        -webkit-box-shadow: none;
        box-shadow: none;
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
    margin-top: ${({ theme }) => theme.margin(3)};
    margin-bottom: ${({ theme }) => theme.margin(3)};
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
    margin-top: ${({ theme }) => theme.margin(1)};
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #ff6b6b;
  }

  .bm-not-enough-visible {
    visibility: visible;
    padding-bottom: ${({ theme }) => theme.margin(1)};
  }

  .bm-review-alert {
    font-size: 10px;
    font-weight: 600;
    padding-bottom: ${({ theme }) => theme.margin(2)};
    color: ${({ theme }) => theme.text5};
  }

  .bm-details {
    min-height: 100px;
    margin-top: ${({ theme }) => theme.margin(3.5)};
    margin-bottom: ${({ theme }) => theme.margin(1)};
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};

    .bm-details-price {
      width: 100px;
      margin-top: ${({ theme }) => theme.margin(0.5)};
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
//#endregion

export const BidModal: FC<{ setVisible: (x: boolean) => void; visible: boolean; details?: ISingleNFT }> = (props) => {
  const { setVisible, visible, details } = props
  const [mode, setMode] = useState('bid')
  const { sessionUser, fetchSessionUser } = useNFTProfile()
  const { connected, publicKey } = useWallet()
  const { nftMetadata, bidOnSingleNFT } = useNFTDetails()
  const [isLoading, setIsLoading] = useState(false)
  const [bidPrice, setBidPrice] = useState('')
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

  const onCancel = () => setMode('bid')
  const reviewBid = () => setMode('review')

  useEffect(() => {
    if (connected && publicKey) {
      if (!sessionUser || sessionUser.pubkey !== `${publicKey}`) {
        fetchUser()
      }
      setIsLoading(false)
    } else {
      setIsLoading(false)
      notify({
        type: 'error',
        message: (
          <MESSAGE>
            <div>Couldn't fetch user data, please connect your wallet and refresh this page.</div>
          </MESSAGE>
        )
      })
    }

    return () => {}
  }, [publicKey, connected])

  const fetchUser = () => {
    fetchSessionUser('address', `${publicKey}`).then((res) => {
      if (!res || (res.response && res.response.status !== 200) || res.isAxiosError) {
        notify({
          type: 'error',
          message: (
            <MESSAGE>
              <div>Couldn't fetch user data, please refresh this page.</div>
            </MESSAGE>
          )
        })
      }
    })
  }

  const confirmBid = async () => {
    setIsLoading(true)
    const bidObject = {
      clock: Date.now() + '', // string, not a number
      tx_sig: 'RANDOM_TX_SIG_HERE',
      wallet_key: 'WALLET_KEY_HERE',
      auction_house_key: 'AUCTION_HOUSE_KEY_HERE',
      token_account_key: 'RANDOM_TOKEN_ACCOUNT_KEY_HERE',
      auction_house_treasury_mint_key: 'AUCTION_HOUSE_TREASURY_KEY_HERE',
      token_account_mint_key: 'TOKEN_ACCOUNT_MINT_KEY_HERE',
      buyer_price: 1.03 * Number(bidPrice) + '',
      token_size: 'TOKEN_SIZE_HERE',
      non_fungible_id: details.non_fungible_id,
      collection_id: details.collection_id,
      user_id: sessionUser?.user_id
    }

    try {
      const res = await bidOnSingleNFT(bidObject)
      console.dir(res)

      notify({
        message: (
          <MESSAGE>
            <Row className="m-title" justify="space-between" align="middle">
              <Col>Live auction bid sucessfull!</Col>
              <Col>
                <img className="m-icon" src={`/img/assets/bid-success-icon.svg`} alt="" />
              </Col>
            </Row>
            <div>{details?.nft_name}</div>
            <div>My bid: {`${bidPrice} (up to ${1.03 * Number(bidPrice)})`}</div>
          </MESSAGE>
        )
      })
      setBidPrice('')
      setMode('bid')
      setVisible(false)
    } catch (error) {
      console.dir(error)
      notify({
        type: 'error',
        message: (
          <MESSAGE>
            <Row className="m-title" justify="space-between" align="middle">
              <Col>Live auction bid error!</Col>
              <Col>
                <img className="m-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
              </Col>
            </Row>
            <div>Please try again, if the error persists please contact support.</div>
          </MESSAGE>
        )
      })
    } finally {
      setIsLoading(false)
    }

    // // TODO: Fake API
    // setTimeout(() => {
    //   setIsLoading(false)
    //   setVisible(false)
    //   setMode('bid')
    //   notify({
    //     message: (
    //       <MESSAGE>
    //         <Row className="m-title" justify="space-between" align="middle">
    //           <Col>Live auction bid sucessfull!</Col>
    //           <Col>
    //             <img className="m-icon" src={`/img/assets/bid-success-icon.svg`} alt="" />
    //           </Col>
    //         </Row>
    //         <div>Genesis #3886, Solcities</div>
    //         <div>My bid: 150.5 SOL (up to 160.5 SOL)</div>
    //       </MESSAGE>
    //     )
    //   })
    // }, 1000)
  }

  const handleBidInput = (e) => {
    if (!isNaN(Number(e.target.value))) {
      setBidPrice(e.target.value)
      if (e.target.value.length === 0) {
        setMode('bid')
      }
    }
  }

  // TODO: change usd approx to real figure using conversion rate
  return (
    <PURCHASE_MODAL setVisible={setVisible} title="" visible={visible} onCancel={onCancel}>
      <div className="bm-title">You are about to purchase a</div>
      <Row className="bm-title" align="middle" justify="center" gutter={4}>
        <Col className="bm-title-bold">{details?.nft_name || '(Name of the NFT)'}</Col>
        <Col>by</Col>
        <Col className="bm-title-bold">{creator}</Col>
      </Row>
      <div className="bm-confirm">
        <div className="bm-confirm-text-1">Place your bid:</div>
        <input value={bidPrice} onChange={handleBidInput} className="bm-confirm-price" placeholder="000.000" />
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
                  <Col>{bidPrice}</Col>
                  <Col>SOL</Col>
                </Row>
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col>Service fee ({`${NFT_MARKET_TRANSACTION_FEE}%`})</Col>
              <Col>
                <Row className="bm-details-price" justify="space-between" align="middle">
                  <Col>{((NFT_MARKET_TRANSACTION_FEE / 100) * Number(bidPrice)).toFixed(3)}</Col>
                  <Col>SOL</Col>
                </Row>
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col>Total </Col>
              <Col>
                <Row className="bm-details-price" justify="space-between" align="middle">
                  <Col>{(Number(bidPrice) * (NFT_MARKET_TRANSACTION_FEE / 100) + Number(bidPrice)).toFixed(3)}</Col>
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
            src={`/img/assets/${isVerified ? 'check-icon.png' : 'close-icon.svg'}`}
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
          className={`bm-bid-button ${notEnough || bidPrice.length === 0 ? 'bm-bid-button-disabled' : ''}`}
          onClick={reviewBid}
          disabled={notEnough || bidPrice.length === 0}
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
