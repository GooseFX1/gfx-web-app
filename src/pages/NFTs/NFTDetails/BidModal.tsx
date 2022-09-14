import { FC, useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { PublicKey, TransactionInstruction, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { Col, Row } from 'antd'
import { MainButton, Modal, SuccessfulListingMsg } from '../../../components'
import { checkMobile, notify, truncateAddress } from '../../../utils'
import { useNFTProfile, usePriceFeed, useNFTDetails, useConnectionConfig, useAccounts } from '../../../context'
import { NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import BN from 'bn.js'
import {
  AUCTION_HOUSE,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE_AUTHORITY,
  AH_FEE_ACCT,
  AUCTION_HOUSE_PROGRAM_ID,
  TREASURY_MINT,
  WRAPPED_SOL_MINT,
  BuyInstructionArgs,
  getMetadata,
  BuyInstructionAccounts,
  createBuyInstruction,
  createCancelInstruction,
  CancelInstructionArgs,
  CancelInstructionAccounts,
  StringPublicKey,
  toPublicKey,
  bnTo8
} from '../../../web3'
import { tradeStatePDA, getBuyInstructionAccounts, tokenSize } from '../actions'
import { TXT_PRIMARY_GRADIENT, GFX_LINK } from '../../../styles'

// TODO: Set variables to demo here
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
    width: 570px !important;
  }

  .ant-modal-body {
    padding: ${({ theme }) => theme.margin(4.5)};
    overflow: auto !important;
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
      color: ${({ theme }) => theme.text2};
      max-width: 240px;
      text-align: center;
    }
  }

  .bm-verified {
    margin-top: ${({ theme }) => theme.margin(3)};
    margin-bottom: ${({ theme }) => theme.margin(3)};
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.text2};
    @media (max-width: 500px) {
      justify-content: center;
    }

    .bm-alert {
      max-width: 200px;
    }

    .bm-check-icon {
      width: 28px;
      height: 28px;
    }
  }

  .bm-not-enough {
    margin-top: ${({ theme }) => theme.margin(2)};
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #ff6b6b;
    width: 100%;
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

interface IBidModal {
  setVisible: (x: boolean) => void
  visible: boolean
  purchasePrice?: string
}

export const BidModal: FC<IBidModal> = ({ setVisible, visible, purchasePrice }: IBidModal) => {
  const { prices } = usePriceFeed()
  const { getUIAmount } = useAccounts()
  const history = useHistory()
  const { sessionUser, fetchSessionUser } = useNFTProfile()
  const { connected, publicKey, sendTransaction } = useWallet()
  const { connection, network } = useConnectionConfig()
  const { general, nftMetadata, bidOnSingleNFT, ask } = useNFTDetails()

  const [mode, setMode] = useState<string>(purchasePrice ? 'review' : 'bid')
  const [bidPriceInput, setBidPriceInput] = useState<string>(
    purchasePrice ? `${parseFloat(purchasePrice) / LAMPORTS_PER_SOL}` : ''
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pendingTxSig, setPendingTxSig] = useState<string>()

  const creator = useMemo(() => {
    if (nftMetadata === undefined) return null
    if (nftMetadata.properties.creators.length > 0) {
      const addr = nftMetadata.properties.creators[0].address
      return truncateAddress(addr)
    } else if (nftMetadata.collection) {
      return Array.isArray(nftMetadata.collection) ? nftMetadata.collection[0].name : nftMetadata.collection.name
    } else {
      return null
    }
  }, [nftMetadata])

  const bidPrice: number | null = useMemo(
    () => (bidPriceInput.length > 0 ? parseFloat(bidPriceInput) : null),
    [bidPriceInput]
  )
  const servicePriceCalc: number = useMemo(
    () => (bidPrice ? parseFloat(((NFT_MARKET_TRANSACTION_FEE / 100) * Number(bidPrice)).toFixed(3)) : 0),
    [bidPrice]
  )

  const marketData = useMemo(() => prices['SOL/USDC'], [prices])

  const fiatCalc: string = useMemo(
    () => `${marketData && bidPrice ? (marketData.current * bidPrice).toFixed(3) : ''}`,
    [marketData, bidPrice]
  )

  const notEnough: boolean = useMemo(
    () => (bidPrice >= getUIAmount(WRAPPED_SOL_MINT.toBase58()) ? true : false),
    [bidPrice]
  )

  useEffect(
    () => () => {
      setMode('bid')
      setBidPriceInput('')
      setIsLoading(false)
    },
    []
  )

  useEffect(() => {
    if (connected && publicKey) {
      if (!sessionUser || sessionUser.pubkey !== publicKey.toBase58()) {
        fetchUser()
      }
      setIsLoading(false)
    } else {
      setIsLoading(false)
      if (visible) {
        notify({
          type: 'error',
          message: (
            <MESSAGE>
              <div>Couldn't fetch user data, please connect your wallet and refresh this page.</div>
            </MESSAGE>
          )
        })
      }
    }

    return null
  }, [publicKey, connected])

  const fetchUser = () => {
    fetchSessionUser('address', publicKey.toBase58(), connection).then((res) => {
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

  const derivePDAsForInstruction = async () => {
    const buyerPriceInLamports = bidPrice * LAMPORTS_PER_SOL
    const buyerPrice: BN = new BN(buyerPriceInLamports)

    const metaDataAccount: StringPublicKey = await getMetadata(general.mint_address)

    const escrowPaymentAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION_HOUSE_PREFIX), toPublicKey(AUCTION_HOUSE).toBuffer(), publicKey.toBuffer()],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const buyerTradeState: [PublicKey, number] = await tradeStatePDA(publicKey, general, bnTo8(buyerPrice))

    if (!metaDataAccount || !escrowPaymentAccount || !buyerTradeState) {
      return {
        metaDataAccount: undefined,
        escrowPaymentAccount: undefined,
        buyerTradeState: undefined,
        buyerPrice: undefined
      }
    }

    return {
      metaDataAccount,
      escrowPaymentAccount,
      buyerTradeState,
      buyerPrice
    }
  }

  const callBuyInstruction = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const { metaDataAccount, escrowPaymentAccount, buyerTradeState, buyerPrice } = await derivePDAsForInstruction()

    if (!metaDataAccount || !escrowPaymentAccount || !buyerTradeState) {
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

      setTimeout(() => setVisible(false), 1000)
      return
    }

    const buyInstructionArgs: BuyInstructionArgs = {
      tradeStateBump: buyerTradeState[1],
      escrowPaymentBump: escrowPaymentAccount[1],
      buyerPrice: buyerPrice,
      tokenSize: tokenSize
    }

    const buyInstructionAccounts: BuyInstructionAccounts = await getBuyInstructionAccounts(
      publicKey,
      general,
      metaDataAccount,
      escrowPaymentAccount[0],
      buyerTradeState[0]
    )

    const buyIX: TransactionInstruction = await createBuyInstruction(buyInstructionAccounts, buyInstructionArgs)
    console.log(buyIX)

    const transaction = new Transaction().add(buyIX)
    try {
      const signature = await sendTransaction(transaction, connection)
      console.log(signature)
      setPendingTxSig(signature)

      const confirm = await connection.confirmTransaction(signature, 'finalized')
      console.log(confirm)

      if (confirm.value.err === null) {
        postBidToAPI(signature, buyerPrice, tokenSize).then((res) => {
          console.log(res)

          notify(successfulListingMessage(signature, nftMetadata, bidPrice.toString()))

          if (res === 'Error') {
            callCancelInstruction()
            setVisible(false)
          } else if (res.data.bid_matched && res.data.tx_sig) {
            fetchUser()
            notify(successBidMatchedMessage(res.data.tx_sig, nftMetadata, bidPrice.toString()))
            setTimeout(() => history.push(`/NFTs/profile/${publicKey.toBase58()}`), 2000)
          } else {
            setVisible(false)
          }
        })
      }
    } catch (error) {
      setIsLoading(false)
      notify({
        type: 'error',
        message: (
          <MESSAGE>
            <Row className="m-title" justify="space-between" align="middle">
              <Col>NFT Biding error!</Col>
              <Col>
                <img className="m-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
              </Col>
            </Row>
            <div>{error.message}</div>
            <div>Please try again, if the error persists please contact support.</div>
          </MESSAGE>
        )
      })
    }
  }

  const postBidToAPI = async (txSig: any, buyerPrice: BN, tokenSize: BN) => {
    const bidObject = {
      clock: Date.now().toString(),
      tx_sig: txSig,
      wallet_key: publicKey.toBase58(),
      auction_house_key: AUCTION_HOUSE,
      token_account_key: general.token_account,
      auction_house_treasury_mint_key: TREASURY_MINT,
      token_account_mint_key: general.mint_address,
      buyer_price: buyerPrice.toString(),
      token_size: tokenSize.toString(),
      non_fungible_id: general.non_fungible_id,
      collection_id: general.collection_id,
      user_id: sessionUser.user_id
    }

    try {
      const res = await bidOnSingleNFT(bidObject)
      if (res.isAxiosError) {
        notify({
          type: 'error',
          message: (
            <MESSAGE>
              <Row className="m-title" justify="space-between" align="middle">
                <Col>NFT Biding error!</Col>
                <Col>
                  <img className="m-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
                </Col>
              </Row>
              <div>Please try again, if the error persists please contact support.</div>
            </MESSAGE>
          )
        })
        return 'Error'
      } else {
        setBidPriceInput('')
        setMode('bid')
        return res
      }
    } catch (error) {
      console.dir(error)
      setIsLoading(false)
      return 'Error'
    }
  }

  const handleBidInput = (e) => {
    if (!isNaN(Number(e.target.value))) {
      setBidPriceInput(e.target.value)
      if (e.target.value.length === 0) {
        setMode('bid')
      }
    }
  }

  const successfulListingMessage = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Successfully placed a bid on ${nftMetadata?.name}!`}
        itemName={nftMetadata.name}
        supportText={`Bid of: ${price}`}
        tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
      />
    )
  })

  const successBidMatchedMessage = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Your bid matched!`}
        itemName={nftMetadata.name}
        supportText={`You have just acquired ${nftMetadata.name} for ${price} SOL!`}
        tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
      />
    )
  })

  const callCancelInstruction = async () => {
    const { buyerTradeState, buyerPrice } = await derivePDAsForInstruction()

    const cancelInstructionArgs: CancelInstructionArgs = {
      buyerPrice: buyerPrice,
      tokenSize: tokenSize
    }

    const cancelInstructionAccounts: CancelInstructionAccounts = {
      wallet: publicKey,
      tokenAccount: new PublicKey(general.token_account),
      tokenMint: new PublicKey(general.mint_address),
      authority: new PublicKey(AUCTION_HOUSE_AUTHORITY),
      auctionHouse: new PublicKey(AUCTION_HOUSE),
      auctionHouseFeeAccount: new PublicKey(AH_FEE_ACCT),
      tradeState: buyerTradeState[0]
    }

    const cancelIX: TransactionInstruction = await createCancelInstruction(
      cancelInstructionAccounts,
      cancelInstructionArgs
    )

    const transaction = new Transaction().add(cancelIX)
    const signature = await sendTransaction(transaction, connection)
    console.log(signature)
    const confirm = await connection.confirmTransaction(signature, 'finalized')
    console.log(confirm)
  }

  const onCancel = () => setMode('bid')

  const reviewBid = () => setMode('review')

  return (
    <PURCHASE_MODAL setVisible={setVisible} title="" visible={visible} onCancel={onCancel}>
      <div className="bm-title">
        You are about to{' '}
        {purchasePrice && `${parseFloat(bidPriceInput) * LAMPORTS_PER_SOL}` === ask.buyer_price
          ? 'purchase'
          : 'bid on'}{' '}
      </div>
      <Row className="bm-title" align="middle" justify="center" gutter={4}>
        <Col className="bm-title-bold">
          <TXT_PRIMARY_GRADIENT>{general?.nft_name}</TXT_PRIMARY_GRADIENT>
        </Col>
        <Col>by</Col>
        <Col className="bm-title-bold">{creator}</Col>
      </Row>
      <div className="bm-confirm">
        {!notEnough && purchasePrice === undefined && <div className="bm-confirm-text-1">Place your bid:</div>}
        <input
          value={bidPriceInput}
          onChange={handleBidInput}
          className="bm-confirm-price"
          placeholder={checkMobile() ? '00.00' : '000.000'}
        />
        <div className="bm-confirm-text-2">
          {mode === 'bid' ? 'There is no minimum amount this is an open bid.' : `${fiatCalc} USD`}
        </div>
      </div>
      <div className="bm-details">
        {mode === 'review' && (
          <>
            <Row justify="space-between" align="middle">
              {purchasePrice === undefined && (
                <>
                  <Col>Bid up to</Col>
                  <Col>
                    <Row className="bm-details-price" justify="space-between" align="middle">
                      <Col>{bidPriceInput}</Col>
                      <Col>SOL</Col>
                    </Row>
                  </Col>
                </>
              )}
            </Row>
            <Row justify="space-between" align="middle">
              <Col>Service fee ({`${NFT_MARKET_TRANSACTION_FEE}%`})</Col>
              <Col>
                <Row className="bm-details-price" justify="space-between" align="middle">
                  <Col>{servicePriceCalc}</Col>
                  <Col>SOL</Col>
                </Row>
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col>Total </Col>
              <Col>
                <Row className="bm-details-price" justify="space-between" align="middle">
                  <Col>{bidPrice}</Col>
                  <Col>SOL</Col>
                </Row>
              </Col>
            </Row>
            <Row justify="end" align="middle" className="bm-details-total">
              <div className="bm-details-price">{fiatCalc} USD</div>
            </Row>
          </>
        )}
      </div>
      <Row className="bm-verified" align="middle" gutter={8}>
        <Col>
          <img
            className="bm-check-icon"
            src={`/img/assets/${isVerified ? 'check-icon.svg' : 'close-icon.svg'}`}
            alt=""
          />
        </Col>
        <Col className="bm-alert">{`${
          isVerified ? 'This is a verified creator' : 'This creator is not verified (purchase at your own risk)'
        }`}</Col>
      </Row>

      {pendingTxSig && (
        <div style={{ marginBottom: '56px' }} className="bm-title">
          <span>
            <img
              style={{ height: '26px', marginRight: '6px' }}
              src={`/img/assets/solscan.png`}
              alt="solscan-icon"
            />
          </span>
          <GFX_LINK
            href={`http://solscan.io/tx/${pendingTxSig}?cluster=${network}`}
            target={'_blank'}
            rel="noreferrer"
          >
            View Transaction
          </GFX_LINK>
        </div>
      )}

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
          className={`bm-bid-button ${
            notEnough || bidPriceInput.length === 0 || bidPrice < 0.021 ? 'bm-bid-button-disabled' : ''
          }`}
          onClick={reviewBid}
          disabled={notEnough || bidPriceInput.length === 0 || bidPrice < 0.021}
        >
          Review bid
        </BUTTON>
      )}
      {!notEnough && mode === 'review' && (
        <BUTTON
          status="initial"
          width="100%"
          height="53px"
          className={`bm-confirm-button ${
            notEnough || bidPriceInput.length === 0 || bidPrice < 0.021 ? 'bm-bid-button-disabled' : ''
          }`}
          onClick={callBuyInstruction}
          loading={isLoading}
          disabled={isLoading || notEnough || bidPriceInput.length === 0 || bidPrice < 0.021}
        >
          {purchasePrice ? 'Buy Now' : 'Send bid'}
        </BUTTON>
      )}
      {notEnough && <div className={`bm-not-enough`}>Not enough funds </div>}
      {bidPriceInput.length > 0 && bidPrice < 0.021 && <div className={`bm-not-enough`}>Bid too small </div>}
    </PURCHASE_MODAL>
  )
}
