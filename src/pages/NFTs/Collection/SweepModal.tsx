import { FC, useEffect, useState, useRef, useMemo } from 'react'
import { Loader, Modal } from '../../../components'
import styled from 'styled-components'
import { Col, Dropdown, Row, Menu, Checkbox, Button, Card } from 'antd'
import {
  useAccounts,
  useConnectionConfig,
  useNFTCollections,
  useNFTDetails,
  useNFTProfile,
  useTokenRegistry,
  useDarkMode,
  usePriceFeed
} from '../../../context'
import { CenteredDiv, SVGToWhite, SVGDynamicReverseMode } from '../../../styles'
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction, SystemProgram } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import BN from 'bn.js'
import {
  AUCTION_HOUSE,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE_PROGRAM_ID,
  TREASURY_MINT,
  BuyInstructionArgs,
  getMetadata,
  BuyInstructionAccounts,
  createBuyInstruction,
  StringPublicKey,
  toPublicKey,
  bnTo8,
  getParsedAccountByMint,
  createWithdrawInstruction
} from '../../../web3'
import { notify } from '../../../utils'
import { getBuyInstructionAccounts, callWithdrawInstruction } from '../actions'
import { generateTinyURL } from '../../../api/tinyUrl'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Meta from 'antd/lib/card/Meta'
import Lottie from 'lottie-react'
import confettiAnimation from '../../../animations/confettiAnimation.json'

const ARROW_CLICKER = styled(CenteredDiv)`
  margin-left: ${({ theme }) => theme.margin(1)};
  border: none;
  background: transparent;
  cursor: pointer;
  display: inline-block;
  img {
    transition: transform 200ms ease-in-out;
    width: 20px;
  }
`

const SWEEP_MODAL = styled(Modal)`
  &.ant-modal {
    width: 650px !important;
  }

  .ant-modal-body {
    padding: ${({ theme }) => theme.margin(4.5)};
    padding-bottom: ${({ theme }) => theme.margin(5)};
    overflow: auto !important;
    height: 100%;
    color: ${({ theme }) => theme.text4};
  }
  .ant-modal-content {
    height: 100%;
  }

  .modal-close-icon {
    width: 22px;
    height: 22px;
  }
  .sweep-details {
    min-height: 100px;
    margin-top: -${({ theme }) => theme.margin(3)};
    margin-bottom: ${({ theme }) => theme.margin(1)};
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.text4};

    .sweep-details-price {
      width: 100px;
      margin-top: ${({ theme }) => theme.margin(0.5)};
    }
    .Vector {
      width: 52px;
      height: 54px;
      flex-grow: 0;
      margin: 0;
      border: solid 4px #fff;
      display: inline-block;
      vertical-align: middle;
      line-height: 55px;
      position: relative;
      z-index: 0;
      border-radius: 15px;
    }
    .Collection-Sweeper {
      width: 180px;
      height: 22px;
      flex-grow: 0;
      margin: 0px;
      font-family: Montserrat;
      font-size: 18px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      text-align: center;
      line-height: 55px;
      color: #fff;
      vertical-align: middle;
      line-height: 55px;
      position: relative;
      right: 0px;
      z-index: 2;
    }
    .confettiAnimation {
      position: absolute;
      top: 0px;
      z-index: 3;
      pointer-events: none;
    }
    .topbar-no-nft {
      font-size: 35px;
      font-weight: 600;
      text-align: center;
      margin-top: 50px;
    }
    .no-nft-text {
      text-align: center;
      font-size: 22px;
      font-weight: 500;
      margin-top: 50px;
      color: ${({ theme }) => theme.text15};
      width: 100%;
      padding: 50px;
      padding-bottom: 0px;
    }
    .topbar {
      text-align: center;
      vertical-align: middle;
      font-size: 35px;

      .topbar-image {
        height: 42px;
      }
    }
    .collection-name-sweeper {
      font-size: 22px;
      margin-left: 15px;
    }
    .successful-sweeps {
      margin-top: 15px;
      font-size: 16px;
      text-align: center;
      .count {
        margin-left: ${({ theme }) => theme.margin(1)};
        margin-right: ${({ theme }) => theme.margin(1)};
      }
    }
    .rowTwo {
      margin-top: 12px;
    }
    .rowThree {
      margin-top: 8px;
      font-size: 16px;
    }
    .rowShare {
      margin-top: 25px;
      font-size: 22px;
    }
    .socials {
      margin-top: 20px;
      .social-icon {
        width: 60px;
        height: 60px;
        margin-right: 40px;
        cursor: pointer;

        &:last-child {
          margin: 0;
        }
      }
      .settling-container {
        width: 80%;
        height: 80px;
        border: 1px solid;
        border-color: ${({ theme }) => theme.text4};
        border-radius: 20px;
        padding-left: 20px;
        padding-top: 15px;
        .info-icon {
          height: 20px;
          width: 20px;
          margin-right: 10px;
        }
        .line1 {
          font-size: 16px;
          margin-bottom: 8px;
          color: ${({ theme }) => theme.text4};
        }
        .line2 {
          font-size: 14px;
          color: ${({ theme }) => theme.text15};
        }
      }
    }
    .sweepNumber {
      margin-right: 10px;
    }
    .primary3color {
      color: ${({ theme }) => theme.primary3};
    }
    .rowFour {
      margin-top: 16px;
      font-size: 20px;
      padding-left: ${({ theme }) => theme.margin(2)};
      padding-right: ${({ theme }) => theme.margin(2)};
    }
    .sweepIndexRow {
      margin-top: 25px;
      font-size: 25px;
      padding-left: ${({ theme }) => theme.margin(2)};
      padding-right: ${({ theme }) => theme.margin(2)};
    }
    .dropdown-choose {
      background-color: #9625ae;
      color: white;
      border: none;
      border-radius: 20px;
      width: 140px;
      height: 40px;
    }
    .rowFive {
      margin-top: 30px;
      padding-left: ${({ theme }) => theme.margin(2)};
      padding-right: ${({ theme }) => theme.margin(2)};
    }
    .sweepStatus {
      position: relative;
      height: 80px;
      width: 300px;
      border-radius: 17px;
      border: none;
      background-color: ${({ theme }) => theme.sweepProgressCard};
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 40px;
      .sweepCompleted {
        height: 38px;
        width: 38px;
        margin-bottom: 10px;
      }
      .sweepProgress {
        margin-bottom: 10px;
      }
    }
    .rowSix {
      margin-top: 5px;
      padding-left: ${({ theme }) => theme.margin(2)};
      padding-right: ${({ theme }) => theme.margin(2)};
    }
    .rowSeven {
      margin-top: 5px;
      padding-left: ${({ theme }) => theme.margin(2)};
      padding-right: ${({ theme }) => theme.margin(2)};
    }
    .rowEight {
      margin-top: 25px;
    }
    .sweep-button {
      width: 100%;
      border-radius: 50px;
      background-color: #3735bb;
      border: none;
      height: 60px;
      font-size: 20px;
      font-weight: 600;
      color: white;
    }
    .sweep-button[disabled],
    .sweep-button:disabled {
      background-color: #808080;
    }
    .price-text {
      margin-right: 5px;
    }
    .verified-tick {
      width: 20px;
      height: 20px;
      margin-left: 10px;
      position: relative;
      top: 2px;
    }
    .sweep-index {
      margin-left: ${({ theme }) => theme.margin(1)};
      margin-right: ${({ theme }) => theme.margin(1)};
      font-size: 25px;
    }
    .incoming-wallet-text {
      font-size: 24px;
      font-weight: 600;
      margin-top: 30px;
    }
    .nft-name {
      font-size: 23px;
      color: ${({ theme }) => theme.text7};
    }
    .confirm-message {
      font-size: 14px;
      font-weight: 500;
    }
    .confirm-checkbox {
      margin-right: ${({ theme }) => theme.margin(2)};
      .ant-checkbox-checked .ant-checkbox-inner {
        background-color: ${({ theme }) => theme.primary3} !important;
        border-color: ${({ theme }) => theme.primary3} !important;
      }
    }
    .sweep-details-total {
      font-size: 12px;
      font-weight: 500;
      color: ${({ theme }) => theme.text5};

      .sweep-details-price {
        margin-top: 0;
      }
    }
    .imageRow {
      height: 280px;
      margin-top: 16px;
    }
    .imageRow2 {
      height: 400px;
      margin-top: 25px;
      background-color: ${({ theme }) => theme.sweepModalCard};
      border-radius: 30px;
      align-items: start;
      .you-paid-text,
      .sol-balance {
        width: 100%;
        text-align: center;
      }
      .you-paid-text {
        font-size: 20px;
      }
      .sol-balance {
        font-size: 30px;
      }
      .sol-logo {
        height: 32px;
        width: 32px;
        position: relative;
        bottom: 2px;
        left: 10px;
      }
    }
    .small-image {
      height: 45px;
      width: 45px;
      border-radius: 50%;
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
const settings = {
  infinite: false,
  speed: 500,
  swipeToSlide: true,
  slidesToScroll: 1,
  snapCenter: true,
  initialSlide: 0,
  arrows: true,
  variableWidth: true,
  nextArrow: <img src={`${process.env.PUBLIC_URL}/img/assets/home-slider-next.svg`} alt="banner-next" />,
  prevArrow: <img src={`${process.env.PUBLIC_URL}/img/assets/home-slider-next.svg`} alt="banner-previous" />
}

const settings_sweep = {
  infinite: false,
  speed: 500,
  swipeToSlide: true,
  slidesToScroll: 1,
  snapCenter: true,
  initialSlide: 0,
  slidesToShow: 3,
  arrows: false,
  variableWidth: true
}

const CAROUSEL_WRAPPER = styled.div`
  position: relative;
  //padding-left: ${({ theme }) => theme.margin(4)};
  width: 100% !important;
  height: 100%;
  .fade {
    position: absolute;
    top: 0;
    right: 0;
    height: 99%;
    width: 180px;
    background: ${({ theme }) => theme.fade};
  }
  .slick-prev,
  .slick-next {
    width: 45px;
    height: 45px;
    z-index: 2;

    &.slick-disabled {
      opacity: 0;
    }
  }

  .slick-prev {
    top: calc(50% - 38px);
    left: 25px;
    transform: rotate(180deg);
  }
  .slick-next {
    right: 0px;
  }
  .slick-list {
    background-color: ${({ theme }) => theme.sweepModalCard};
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    justify-content: center;
    padding-left: ${({ theme }) => theme.margin(2)};
    padding-right: ${({ theme }) => theme.margin(2)};
  }
  .slick-slider {
    height: 100%;
  }

  .slick-slide {
    margin-right: ${({ theme }) => theme.margin(2)};
    width: 150px !important;
  }
`

const CAROUSEL_WRAPPER2 = styled.div`
  position: relative;
  //padding-left: ${({ theme }) => theme.margin(4)};
  width: 100% !important;
  height: 80%;

  border-radius: 20px;
  .fade {
    position: absolute;
    top: 0;
    right: 0;
    height: 99%;
    width: 180px;
    background: ${({ theme }) => theme.fade};
  }
  .slick-prev,
  .slick-next {
    width: 45px;
    height: 45px;
    z-index: 2;

    &.slick-disabled {
      opacity: 0;
    }
  }

  .slick-prev {
    top: calc(50% - 20px);
    left: 20px;
    transform: rotate(180deg);
  }
  .slick-next {
    right: 0px;
    top: calc(50% + 20px);
  }
  .slick-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    justify-content: start;
    padding-top: 30px;
    padding-left: ${({ theme }) => theme.margin(2)};
    padding-right: ${({ theme }) => theme.margin(2)};
  }
  .slick-slider {
    height: 100%;
  }

  .slick-slide {
    margin-right: ${({ theme }) => theme.margin(2)};
    width: 150px !important;
  }
`

const SLIDER_ITEM = styled.div`
  position: relative;
  height: 150px;
  width: 150px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  .sweep-card.failed {
    opacity: 0.5;
  }
  .sweep-card {
    border-radius: 20px;
    border: none;
    background-color: ${({ theme }) => theme.sweepPriceCard};
    .nft-img {
      border-radius: 20px;
      padding: 5px;
      padding-bottom: 0px;
    }
    .ant-card-body {
      text-align: center;
      height: 50px;
      padding-top: 15px;
      .sweep-price {
        margin-right: 15px;
      }
      .sweeper-solana-logo {
        height: 23px;
        width: 23px;
        display: inline-block;
        position: absolute;
        right: 15px;
      }
    }
  }
  .sweep-nft-name {
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    margin-top: 15px;
    color: ${({ theme }) => theme.text7};
    ${({ theme }) => theme.ellipse};
  }
  .nft-sweep-success {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    .successIcon {
      width: 35px;
      height: 35px;
    }
  }
  .nft-sweep-fail {
    color: red;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }
`

const SWEEP_CARD = styled.div`
  position: relative;
  //height: 200px;
  width: 102%;

  border-radius: 20px;
  margin-left: -${({ theme }) => theme.margin(2)};
  margin-right: -${({ theme }) => theme.margin(2)};
  .sweeping-card {
    border-radius: 20px;
    border: none;
    background-color: ${({ theme }) => theme.sweepPriceCard};
    .nft-img {
      border-radius: 20px;
      padding: 5px;
      padding-bottom: 0px;
    }
  }

  .slick-prev,
  .slick-next {
    width: 45px;
    height: 45px;
    z-index: 2;

    &.slick-disabled {
      opacity: 0;
    }
  }

  .slick-prev {
    top: calc(50% - 38px);
    left: 25px;
    transform: rotate(180deg);
  }
  .slick-next {
    right: 0px;
  }
  .slick-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    justify-content: center;
    padding-left: ${({ theme }) => theme.margin(2)};
    padding-right: ${({ theme }) => theme.margin(2)};
  }
  .slick-slider {
    height: 100%;
  }

  .slick-slide {
    margin-right: 52px;
    width: 115px;
    opacity: 0.5;
    position: relative;
    top: 40px;
    .ant-card-body {
      text-align: center;
      height: 30px;
      padding-top: 0px;
      .sweep-price {
        margin-right: 20px;
        font-size: 22px;
        display: none;
      }
      .sweeper-solana-logo {
        height: 32px;
        width: 32px;
        display: none;
        position: absolute;
        right: 15px;
      }
    }
  }
  .slick-current + .slick-active {
    width: 200px !important;
    position: relative;
    opacity: 1;
    top: 0px !important;
    .sweep-nft-name {
      font-size: 23px !important;
      margin-top: 10px !important;
    }
    .ant-card-body {
      height: 75px;
      padding-top: 30px;
      .sweep-price {
        margin-right: 20px;
        font-size: 22px;
        display: inline-block;
      }
      .sweeper-solana-logo {
        height: 32px;
        width: 32px;
        display: inline-block;
        position: absolute;
        right: 15px;
      }
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
      top: 1px;
      height: 100%;
      border-radius: 20px;
      animation-duration: 3s;
      animation-name: loadingAnimation;
      animation-iteration-count: infinite;
      animation-direction: normal;
    }
  }
  .slick-active {
    width: 110px !important;

    .sweep-nft-name {
      text-align: center;
      font-size: 15px;
      font-weight: 600;
      margin-top: 5px;
    }
  }
`

const tokenSize: BN = new BN(1)

interface ISweepModal {
  setVisible: (x: boolean) => void
  visible: boolean
  purchasePrice?: string
}

export const SweepModal: FC<ISweepModal> = ({ setVisible, visible }: ISweepModal) => {
  const { mode } = useDarkMode()
  const { fixedPriceWithinCollection, singleCollection } = useNFTCollections()
  const { prices } = usePriceFeed()
  const [dropdownSelection, setDropdownSelection] = useState(null)
  const [nftBatch, setNftBatch] = useState([])
  const [sweeping, setIsSweeping] = useState<boolean>(false)
  const [sweepComplete, setSweepComplete] = useState<boolean>(false)
  const { connected, publicKey, sendTransaction } = useWallet()
  const { connection } = useConnectionConfig()
  const { sessionUser, userCurrency } = useNFTProfile()
  const { bidOnSingleNFT } = useNFTDetails()
  const [nftState, setNftState] = useState([])
  //0 signifies loading, -1 signifies error and 1 signfies success
  const [activeSweepIndex, setActiveSweepIndex] = useState(-1)
  const [agreeConditions, setAgreeConditions] = useState<boolean>(false)
  const [sweepSuccessFlag, setSweepSuccess] = useState<boolean>(false)
  const [settleProgress, setSettleProgress] = useState(null) //1 in progress, 2 success, -1 error
  const [escrowBalance, setEscrowBalance] = useState(0)
  const [escrowAccounts, setEscrowAccounts] = useState(null)
  const [emptyFixedPrice, setEmptyFixedPrice] = useState(false)
  const sliderRef = useRef<any>()
  const { getUIAmount } = useAccounts()
  const { getTokenInfoFromSymbol } = useTokenRegistry()

  const userSOLBalance = useMemo(
    () => (publicKey ? getUIAmount(getTokenInfoFromSymbol('SOL')?.address) : 0),
    [getUIAmount, publicKey]
  )

  const callAuctionHouseWithdraw = async (escrowPaymentAccount, amount: BN) => {
    const { withdrawInstructionAccounts, withdrawInstructionArgs } = await callWithdrawInstruction(
      publicKey,
      escrowPaymentAccount,
      amount
    )

    const withdrawIX: TransactionInstruction = await createWithdrawInstruction(
      withdrawInstructionAccounts,
      withdrawInstructionArgs
    )

    const transaction = new Transaction().add(withdrawIX)
    try {
      const signature = await sendTransaction(transaction, connection)
      console.log(signature)

      const confirm = await connection.confirmTransaction(signature, 'confirmed')

      if (confirm.value.err === null) {
        console.log('successfuly settled')
        setSettleProgress(2)
        return 'Success'
      }
    } catch (error) {
      notify({
        type: 'error',
        message: error.message
      })
      setSettleProgress(-1)
      return 'Error'
    }
  }

  const postBidToAPI = async (txSig: any, buyerPrice: BN, nft_data) => {
    const bidObject = {
      clock: Date.now().toString(),
      tx_sig: txSig,
      wallet_key: publicKey.toBase58(),
      auction_house_key: AUCTION_HOUSE,
      token_account_key: nft_data.token_account,
      auction_house_treasury_mint_key: TREASURY_MINT,
      token_account_mint_key: nft_data.mint_address,
      buyer_price: buyerPrice.toString(),
      token_size: tokenSize.toString(),
      non_fungible_id: nft_data.non_fungible_id,
      collection_id: nft_data.collection_id,
      user_id: sessionUser.user_id
    }

    try {
      const res = await bidOnSingleNFT(bidObject)
      // useful for testing without transaction hence not removing

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
        return res
      }
    } catch (error) {
      console.dir(error)
      setIsSweeping(false)
      return 'Error'
    }
  }

  const tradeStatePDA2 = async (token_account, mint_address, price) => {
    try {
      const pda = await PublicKey.findProgramAddress(
        [
          Buffer.from(AUCTION_HOUSE_PREFIX),
          publicKey.toBuffer(),
          toPublicKey(AUCTION_HOUSE).toBuffer(),
          toPublicKey(token_account).toBuffer(),
          toPublicKey(TREASURY_MINT).toBuffer(),
          toPublicKey(mint_address).toBuffer(),
          price,
          bnTo8(tokenSize)
        ],
        toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
      )
      return pda
    } catch (e) {
      console.log(e)
      return undefined
    }
  }

  const derivePDAsForInstruction = async (nft_data) => {
    const buyerPriceInLamports = nft_data.price
    const buyerPrice: BN = new BN(buyerPriceInLamports)
    const metaDataAccount: StringPublicKey = await getMetadata(nft_data.mint_address)

    const escrowPaymentAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION_HOUSE_PREFIX), toPublicKey(AUCTION_HOUSE).toBuffer(), publicKey.toBuffer()],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const buyerTradeState: [PublicKey, number] = await tradeStatePDA2(
      nft_data.token_account,
      nft_data.mint_address,
      bnTo8(buyerPrice)
    )

    if (!metaDataAccount || !escrowPaymentAccount || !buyerTradeState) {
      setIsSweeping(false)
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

  const timeout = async (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const dynamicPriceValue = (currency: string, priceFeed: any, value: number) => {
    const val = currency === 'USD' ? value * priceFeed['SOL/USDC']?.current : value
    return `${val.toFixed(1)} ${currency}`
  }

  const callBuyInstruction = async (e: any) => {
    e.preventDefault()

    const transaction = new Transaction()
    const tempTokenAccount = [],
      tempNftState = [],
      tempNftBatch = nftBatch.slice(0, dropdownSelection)
    tempNftState.length = nftBatch.length
    tempNftState.fill(0)
    setNftState(tempNftState)
    let sum = 0
    let escrowAccountUser = null
    let sweepSuccess = true

    for (let i = 0; i < tempNftBatch.length; i++) sum += tempNftBatch[i].price

    for (let i = 0; i < tempNftBatch.length; i++) {
      const token_account = await getParsedAccountByMint({ mintAddress: tempNftBatch[i].mint_address, connection })
      if (token_account === undefined) throw new Error('Token account could not be parsed')

      tempTokenAccount.push(token_account.pubkey)
      const { metaDataAccount, escrowPaymentAccount, buyerTradeState, buyerPrice } =
        await derivePDAsForInstruction({
          ...tempNftBatch[i],
          token_account: token_account.pubkey
        })

      if (i === 0) {
        let res = 0
        try {
          res = await connection.getBalance(escrowPaymentAccount[0])
        } catch (e) {
          res = 0
        }
        if (sum - res > 0) {
          const initialix = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: escrowPaymentAccount[0],
            lamports: sum - res
          })
          transaction.add(initialix)
        }
        escrowAccountUser = escrowPaymentAccount
        setEscrowAccounts(escrowPaymentAccount)
      }

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

        setTimeout(() => setVisible(false), 10000)
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
        { ...tempNftBatch[i], token_account: token_account.pubkey },
        metaDataAccount,
        escrowPaymentAccount[0],
        buyerTradeState[0]
      )

      const buyIX: TransactionInstruction = await createBuyInstruction(buyInstructionAccounts, buyInstructionArgs)
      transaction.add(buyIX)
    }

    try {
      //    useful for testing

      setActiveSweepIndex(0)
      setIsSweeping(true)
      const signature = await sendTransaction(transaction, connection)
      const confirm = await connection.confirmTransaction(signature, 'processed')

      if (confirm.value.err === null) {
        for (let index = 0; index < tempNftBatch.length; index++) {
          const item = tempNftBatch[index]
          const state_array = nftState
          state_array[index] = 0
          setNftState(state_array)
          setActiveSweepIndex(index)
          const res = await postBidToAPI(signature, item.price, {
            ...item,
            token_account: tempTokenAccount[index]
          })
          if (res.data && res.data.bid_matched && res.data.tx_sig) {
            state_array[index] = 1
            setNftState(state_array)
          } else {
            state_array[index] = -1
            sweepSuccess = false
            setNftState(state_array)
          }

          await timeout(1000)
          if (index < tempNftBatch.length - 1) sliderRef && sliderRef.current && sliderRef.current.slickNext()
        }
        setSweepSuccess(sweepSuccess)
        if (!sweepSuccess) {
          let escrowSolBalance = 0
          try {
            escrowSolBalance = await connection.getBalance(escrowAccountUser[0])
          } catch (e) {
            escrowSolBalance = 0
          }
          setEscrowBalance(escrowSolBalance)
          if (escrowSolBalance > 0) {
            setSettleProgress(1)
            callAuctionHouseWithdraw(escrowAccountUser, new BN(escrowSolBalance))
          }
        } else {
          setSettleProgress(2)
        }
        setIsSweeping(false)
        setSweepComplete(true)
      }
    } catch (error) {
      setIsSweeping(false)
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

  const sortNft = () => {
    const nft_prices = fixedPriceWithinCollection.nft_prices,
      size = fixedPriceWithinCollection.nft_data.length < 10 ? fixedPriceWithinCollection.nft_data.length : 10
    let nft_data = fixedPriceWithinCollection.nft_data

    for (let i = 0; i < nft_prices.length; i++) {
      for (let j = 0; j < nft_prices.length - i - 1; j++) {
        if (+nft_prices[j] > +nft_prices[j + 1]) {
          const temp = nft_prices[j + 1]
          nft_prices[j + 1] = nft_prices[j]
          nft_prices[j] = temp
          const temp1 = { ...nft_data[j] },
            temp2 = { ...nft_data[j + 1] }
          nft_data[j] = temp2
          nft_data[j + 1] = temp1
        }
      }
    }
    nft_data = nft_data.map((item, index) => ({ ...item, price: +nft_prices[index] }))
    setNftBatch(nft_data.slice(0, size))
  }

  const handleClick = (e) => {
    const index = +e.key
    setDropdownSelection(index)
  }

  const enableButton = (e) => {
    setAgreeConditions(e.target.checked)
  }

  const getTotalPrice = () => {
    let sum = 0
    if (dropdownSelection) {
      for (let i = 0; i < dropdownSelection; i++) sum += nftBatch[i].price
    }
    return sum
  }

  const getSuccessfulSweeps = () => {
    let count = 0
    for (let i = 0; i < nftState.length; i++) {
      if (nftState[i] === 1) count++
    }
    return count
  }

  const getTotalPaid = () => {
    let sum = 0
    for (let i = 0; i < nftState.length; i++) {
      if (nftState[i] === 1) sum += nftBatch[i].price
    }
    return (sum / LAMPORTS_PER_SOL).toFixed(2)
  }

  const onShare = async (social) => {
    if (social === 'copy link') {
      copyToClipboard()
      return
    }

    const collectionName = singleCollection.collection[0].collection_name

    const res = await generateTinyURL(
      `https://${process.env.NODE_ENV !== 'production' ? 'app.staging.goosefx.io' : window.location.host}${
        window.location.pathname
      }`,
      ['gfx', 'nest-exchange', 'sweeper', social]
    )

    if (res.status !== 200) {
      notify({ type: 'error', message: 'Error creating sharing url' })
      return
    }

    const tinyURL = res.data.data.tiny_url

    switch (social) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=Just%20Sweeping%20Up%20%F0%9F%A7%B9%F0%9F%A7%
          B9${collectionName}%20%F0%9F%A7%B9%F0%9F%A7%B9%0AProbably%20Nothing.%20%F0%9F%A4%AB%0ADeFi%
          20Simplified%20-%20%20%40GooseFX1%0A%F0%9F%9A%80%F0%9F%9A%80%F0%9F%9A%80&via=gooseFX1&
          original_referer=${window.location.host}${window.location.pathname}`
        )
        break
      case 'telegram':
        window.open(
          `https://t.me/share/url?url=${tinyURL}&text=Just%20Sweeping%20Up%20%F0%9F%A7%B9%F0%9F%A7
          %B9${collectionName}%20%F0%9F%A7%B9%F0%9F%A7%B9%0AProbably%20Nothing.%20%F0%9F%A4%AB%
          0ADeFi%20Simplified%20-%20%20%40GooseFX1%0A%F0%9F%9A%80%F0%9F%9A%80%F0%9F%9A%80`
        )
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${tinyURL}`)
        break
      default:
        break
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href)
  }

  useEffect(() => {
    if (fixedPriceWithinCollection.nft_prices.length) sortNft()
    else setEmptyFixedPrice(true)
  }, [fixedPriceWithinCollection])

  const nfts = (
    <Menu>
      {fixedPriceWithinCollection.nft_data.map((item, index) => {
        if (index < 11)
          return (
            <Menu.Item key={index + 1} onClick={handleClick}>
              {index + 1}
            </Menu.Item>
          )
        else return null
      })}
    </Menu>
  )
  return (
    <SWEEP_MODAL visible={visible} setVisible={setVisible}>
      <div className="sweep-details">
        {emptyFixedPrice ? (
          <>
            <div className="topbar">
              <SVGDynamicReverseMode
                className={'topbar-image'}
                src={`/img/assets/collectionSweeper.svg`}
                alt="collection-sweeper"
              />
            </div>
            <div className="topbar-no-nft">Oh snap! There is no floor to sweep.</div>
            <img src={`/img/assets/no-nft-sweep-${mode}.svg`} alt="collection-sweeper" />
            <div className="no-nft-text">There are no listed NFT’s from this collection available to sweep!</div>
          </>
        ) : (
          <>
            {!sweepComplete ? (
              <>
                <div className="topbar">
                  <SVGDynamicReverseMode
                    className={'topbar-image'}
                    src={`/img/assets/collectionSweeper.svg`}
                    alt="collection-sweeper"
                  />
                </div>
                <Row justify="center" align="middle" className="rowTwo">
                  <img
                    className="small-image"
                    src={singleCollection.collection[0].profile_pic_link}
                    alt="the-nft"
                  />
                  <span className="collection-name-sweeper">{singleCollection.collection[0].collection_name}</span>
                  {singleCollection.collection[0].is_verified && (
                    <img className="verified-tick" src={`/img/assets/check-icon.svg`} alt="" />
                  )}
                </Row>
              </>
            ) : (
              <>
                {getSuccessfulSweeps() > 0 && (
                  <Lottie animationData={confettiAnimation} className="confettiAnimation" />
                )}
                <div className="topbar">
                  {sweepSuccessFlag
                    ? 'Mission accomplished!'
                    : getSuccessfulSweeps() > 0
                    ? 'Almost all!'
                    : 'Try Again'}
                </div>
                <div className="successful-sweeps">
                  You are now the owner of<span className="count primary3color">{getSuccessfulSweeps()}</span>NFT's
                  from:
                </div>
                <Row justify="center" align="middle" className="rowTwo">
                  <img
                    className="small-image"
                    src={singleCollection.collection[0].profile_pic_link}
                    alt="the-nft"
                  />
                  <span className="collection-name-sweeper">{singleCollection.collection[0].collection_name}</span>
                  {singleCollection.collection[0].is_verified && (
                    <img className="verified-tick" src={`/img/assets/check-icon.svg`} alt="" />
                  )}
                </Row>
                <Row justify="center" align="middle" className="imageRow2">
                  <CAROUSEL_WRAPPER2>
                    <Slider {...settings}>
                      {nftBatch.map((item, index) =>
                        index < dropdownSelection ? (
                          <SLIDER_ITEM key={index}>
                            <Card
                              cover={<img className="nft-img" src={item.image_url} alt="NFT" />}
                              className={'sweep-card ' + (nftState[index] === -1 ? 'failed' : '')}
                            >
                              <Meta
                                title={
                                  <span>
                                    <span className="sweep-price">{item.price / LAMPORTS_PER_SOL} SOL</span>
                                    <img
                                      className="sweeper-solana-logo"
                                      src={`/img/assets/solana-logo.png`}
                                      alt=""
                                    />
                                  </span>
                                }
                              />
                            </Card>
                            <div className="sweep-nft-name">{item.nft_name}</div>
                            <div className={'nft-sweep-' + (nftState[index] === -1 ? 'fail' : 'success')}>
                              {nftState[index] === -1 ? (
                                'Transaction Failed'
                              ) : (
                                <img
                                  src={`/img/assets/sweepCompleted.svg`}
                                  alt="sweep-completed"
                                  className="successIcon"
                                />
                              )}
                            </div>
                          </SLIDER_ITEM>
                        ) : null
                      )}
                    </Slider>
                  </CAROUSEL_WRAPPER2>
                  <div className="you-paid-text">You Paid:</div>
                  <div className="sol-balance">
                    {getTotalPaid()} SOL
                    <img className="sol-logo" src={`/img/assets/solana-logo.png`} alt="" />
                  </div>
                </Row>
                {
                  <Row justify="center" align="middle" className="rowShare">
                    {settleProgress === -1
                      ? 'Please settle your balance and try again'
                      : settleProgress === 2
                      ? 'Share it with your friends!'
                      : null}
                  </Row>
                }
                <Row justify="center" align="middle" className="socials">
                  {settleProgress === 1 ? (
                    <div className="settling-container">
                      <div className="line1">
                        <img className="info-icon" src={`/img/assets/info.svg`} alt="" />
                        We are settling your balances
                      </div>
                      <div className="line2">Please be patient and confirm the transaction.</div>
                    </div>
                  ) : settleProgress === 2 ? (
                    <>
                      <img
                        className="social-icon"
                        src={`/img/assets/twitter-violet.svg`}
                        alt=""
                        onClick={() => onShare('twitter')}
                      />

                      <img
                        className="social-icon"
                        src={`/img/assets/telegram-violet.svg`}
                        alt=""
                        onClick={() => onShare('telegram')}
                      />

                      <img
                        className="social-icon"
                        src={`/img/assets/facebook-violet.svg`}
                        alt=""
                        onClick={() => onShare('facebook')}
                      />

                      <img
                        className="social-icon"
                        src={`/img/assets/copy-violet.svg`}
                        alt=""
                        onClick={() => onShare('copy')}
                      />
                    </>
                  ) : settleProgress === -1 ? (
                    <Button
                      className="sweep-button"
                      onClick={() => callAuctionHouseWithdraw(escrowAccounts, new BN(escrowBalance))}
                      disabled={!connected || escrowBalance < 1}
                    >
                      Settle {(escrowBalance / LAMPORTS_PER_SOL).toFixed(2)} SOL
                    </Button>
                  ) : null}
                </Row>
                <Row justify="center" align="middle" className="socials"></Row>
              </>
            )}

            {!sweeping && !sweepComplete ? (
              <>
                <Row justify="center" align="middle" className="rowThree">
                  <span className="sweepNumber primary3color">
                    {fixedPriceWithinCollection.nft_data.length > 10
                      ? 10
                      : fixedPriceWithinCollection.nft_data.length}
                  </span>
                  Cheapest NFT's of the collection:
                </Row>
                <Row justify="center" align="middle" className="imageRow">
                  <CAROUSEL_WRAPPER>
                    <Slider {...settings}>
                      {nftBatch.map((item, index) => (
                        <SLIDER_ITEM key={index}>
                          <Card
                            cover={<img className="nft-img" src={item.image_url} alt="NFT" />}
                            className="sweep-card"
                          >
                            <Meta
                              title={
                                <span>
                                  <span className="sweep-price">
                                    {dynamicPriceValue(userCurrency, prices, item.price / LAMPORTS_PER_SOL)}
                                  </span>
                                  <img
                                    className="sweeper-solana-logo"
                                    src={`/img/crypto/${userCurrency}.svg`}
                                    alt=""
                                  />
                                </span>
                              }
                            />
                          </Card>
                          <div className="sweep-nft-name">{item.nft_name}</div>
                        </SLIDER_ITEM>
                      ))}
                    </Slider>
                  </CAROUSEL_WRAPPER>
                </Row>
                <Row justify="space-between" align="middle" className="rowFour">
                  <Col>Amount of NFT's to Sweep?</Col>
                  <Col>
                    <Dropdown
                      overlay={nfts}
                      trigger={['click']}
                      className="dropdown-choose"
                      arrow={{ pointAtCenter: true }}
                    >
                      <button>
                        {!dropdownSelection ? 'Choose' : dropdownSelection}
                        <ARROW_CLICKER>
                          <SVGToWhite src={`/img/assets/arrow.svg`} alt="arrow" className={'arrow-icon'} />
                        </ARROW_CLICKER>
                      </button>
                    </Dropdown>
                  </Col>
                </Row>
                <Row justify="space-between" align="middle" className="rowFive">
                  <Col># NFT purchased</Col>
                  <Col>{!dropdownSelection ? 0 : dropdownSelection}</Col>
                </Row>
                <Row justify="space-between" align="middle" className="rowSix">
                  <Col>Estimate average price</Col>
                  <Col>
                    <span className="price-text">
                      {dropdownSelection ? (getTotalPrice() / dropdownSelection / LAMPORTS_PER_SOL).toFixed(2) : 0}
                    </span>
                    SOL
                  </Col>
                </Row>
                <Row justify="space-between" align="middle" className="rowSeven">
                  <Col>Estimate total cost</Col>
                  <Col>
                    <span className="price-text">{(getTotalPrice() / LAMPORTS_PER_SOL).toFixed(2)}</span>SOL
                  </Col>
                </Row>
                <Row justify="start" align="middle" className="rowEight">
                  <Checkbox className="confirm-checkbox" onChange={enableButton}></Checkbox>
                  <span className="confirm-message">
                    By, confirming sweep, you agree to confirm multiple wallet transactions.
                    <br /> Please do not leave this page until final confirmation display.
                  </span>
                </Row>
                <Row className="rowEight">
                  <Button
                    className="sweep-button"
                    onClick={connected && callBuyInstruction}
                    disabled={
                      !agreeConditions ||
                      !connected ||
                      !dropdownSelection ||
                      userSOLBalance < getTotalPrice() / LAMPORTS_PER_SOL
                    }
                  >
                    {getTotalPrice() && connected && userSOLBalance < getTotalPrice() / LAMPORTS_PER_SOL
                      ? 'Insufficient SOL'
                      : 'Confirm Sweep'}
                  </Button>
                </Row>
              </>
            ) : !sweepComplete ? (
              <>
                <Row justify="center" align="middle" className="rowThree">
                  Sweeping NFT's for you:
                </Row>
                <Row justify="center" align="middle" className="sweepIndexRow">
                  NFT <span className="sweep-index">{activeSweepIndex + 1}</span> of{' '}
                  <span className="sweep-index primary3color">{dropdownSelection}</span>
                </Row>
                <Row justify="space-between" className="rowFive">
                  <SWEEP_CARD>
                    <Slider {...settings_sweep} ref={sliderRef}>
                      <div></div>
                      {nftBatch.slice(0, dropdownSelection).map((item, index) => (
                        <div
                          className={index === activeSweepIndex ? 'activeNftZoom' : 'nonactiveNftZoom'}
                          key={index}
                        >
                          <Card
                            key={index}
                            cover={
                              <>
                                <img
                                  className="nft-img"
                                  src={nftBatch[index] && nftBatch[index].image_url}
                                  alt="NFT"
                                />
                                <div className="pink-loading-overlay"></div>
                              </>
                            }
                            className={'sweeping-card '}
                          >
                            <Meta
                              title={
                                <span>
                                  <span className="sweep-price">
                                    {nftBatch[index] && (nftBatch[index].price / LAMPORTS_PER_SOL).toFixed(2)} SOL
                                  </span>
                                  <img
                                    className="sweeper-solana-logo"
                                    src={`/img/assets/solana-logo.png`}
                                    alt=""
                                  />
                                </span>
                              }
                            />
                          </Card>
                          <div className="sweep-nft-name">
                            {nftBatch && nftBatch[index] && nftBatch[index].nft_name}
                          </div>
                        </div>
                      ))}
                      <div></div>
                    </Slider>
                  </SWEEP_CARD>
                </Row>
                <Row justify="center" align="middle" className="rowSix">
                  {nftState[activeSweepIndex] === 1 ? (
                    <div className="sweepStatus">
                      <div>
                        <img
                          src={`/img/assets/sweepCompleted.svg`}
                          alt="sweep-completed"
                          className="sweepCompleted"
                        />
                      </div>
                      <div>Sweep Completed</div>
                    </div>
                  ) : (
                    <div className="sweepStatus">
                      <div className="sweepProgress">
                        <Loader color={'#5855FF'} />
                      </div>
                      <div>Sweep Progress</div>
                    </div>
                  )}
                </Row>
                <Row justify="center" className="incoming-wallet-text rowSeven">
                  Incoming wallet confirmations!
                </Row>
              </>
            ) : null}
          </>
        )}
      </div>
    </SWEEP_MODAL>
  )
}
