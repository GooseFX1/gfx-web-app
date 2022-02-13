import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Form, Row, Col } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import { IAppParams } from '../../../types/app_params.d'
import PreviewImage from './PreviewImage'
import { MainText } from '../../../styles'
import { useNFTDetails, useNFTProfile, useConnectionConfig } from '../../../context'
import { SellCategory } from '../SellCategory/SellCategory'
import { FormDoubleItem } from '../Form/FormDoubleItem'
import { notify } from '../../../utils'
import { dataFormRow2, dataFormFixedRow2, startingDays, expirationDays } from './mockData'
import { Donate } from '../Form/Donate'
import isEmpty from 'lodash/isEmpty'
import BN from 'bn.js'

import { PublicKey, TransactionInstruction, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import {
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE,
  AUCTION_HOUSE_AUTHORITY,
  AUCTION_HOUSE_PROGRAM_ID,
  TREASURY_MINT,
  AH_FEE_ACCT,
  toPublicKey,
  createSellInstruction,
  createCancelInstruction,
  SellInstructionArgs,
  SellInstructionAccounts,
  CancelInstructionArgs,
  CancelInstructionAccounts,
  getMetadata,
  StringPublicKey,
  bnTo8
} from '../../../web3'

import { tradeStatePDA, freeSellerTradeStatePDA, getSellInstructionAccounts, tokenSize } from '../actions'

//#region styles
const UPLOAD_CONTENT = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.margin(6)} 0;
  width: 90%;
  margin: 0 auto;

  .live-auction-back-icon {
    transform: rotate(90deg);
    width: 30px;
    height: 30px;
    filter: ${({ theme }) => theme.filterBackIcon};
    cursor: pointer;
    margin-right: ${({ theme }) => theme.margin(5)};
    margin-left: 0;
    margin-top: ${({ theme }) => theme.margin(1)};
  }
`

const UPLOAD_FIELD_CONTAINER = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`

const UPLOAD_INFO_CONTAINER = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
`

const PREVIEW_UPLOAD_CONTAINER = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-left: ${({ theme }) => theme.margin(6)};
  margin-right: ${({ theme }) => theme.margin(3)};
`

const SECTION_TITLE = MainText(styled.span`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text7} !important;
  text-align: left;
  margin-bottom: ${({ theme }) => theme.margin(3)};
`)

const STYLED_FORM = styled(Form)`
  .mb-3x {
    margin-bottom: ${({ theme }) => theme.margin(3)} !important;
  }

  .ant-form-item-control-input-content {
    display: flex;
    flex-direction: column;
  }

  .description {
    text-align: left;
    max-width: 174px;
  }
`
const STYLED_DESCRIPTION = styled.div`
  font-family: Montserrat;
  font-size: 20px;
  font-weight: 600;
  text-align: left;
  color: #fff;
  padding-bottom: ${({ theme }) => theme.margin(5)} !important;
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

const BUTTON = styled.button`
  display: block;
  min-width: 245px;
  height: 60px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  border-radius: 60px;
  background: #7d7d7d;
  border: none;
  cursor: pointer;
  width: 50%;
  margin-top: ${({ theme }) => theme.margin(5)};
  margin-right: 0;
  margin-left: auto;

  &:hover {
    opacity: 0.8;
  }
  background-color: ${({ theme }) => theme.secondary2};
  &:disabled {
    background-color: #7d7d7d;
  }
`

//#endregion

const dataDonate = {
  desc: 'We will donate a percentage of the total price for people in need.',
  percents: [0, 10, 20, 50, 100]
}

export const SellNFT = () => {
  const history = useHistory()
  const params = useParams<IAppParams>()
  const { general, nftMetadata, updateUserInput, sellNFT } = useNFTDetails()
  const { sessionUser } = useNFTProfile()
  const wallet = useWallet()
  const { publicKey, sendTransaction } = wallet
  const { connection, network } = useConnectionConfig()

  const [form] = Form.useForm()
  const initSettingData = {
    info: {
      title: '',
      desc: ''
    },
    previewImage: ''
  }
  const initLiveData = {
    minimumBid: '',
    royalties: ''
  }
  const [settingData, setSettingData] = useState<any>({ ...initSettingData })
  const [liveData, setLiveData] = useState<any>({ ...initLiveData })
  const [disabled, setDisabled] = useState<boolean>(true)
  const [category, setCategory] = useState<string>('open-bid')

  // TODO: if param "nftMintAddress" is present, make a web3 call to get data and metadata
  // getParsedAccountByMint(nftMintAddress) then setGeneral() and setNftMetadata()

  useEffect(() => {
    const { state = {} } = history.location
    if (!isEmpty(state)) {
      setSettingData(state)
    }
  }, [history.location, history.location.state])

  useEffect(() => {
    if (category === 'fixed-price') {
      if (liveData?.minimumBid && liveData?.royalties) {
        setDisabled(false)
      } else setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [liveData, category])

  const onChange = ({ e, id }) => {
    const { value } = e.target
    const temp = { ...liveData }
    temp[id] = value
    if (id === 'minimumBid') {
      updateUserInput({ price: value })
    } else {
      updateUserInput({ royalty: value })
    }
    setLiveData(temp)
  }

  const derivePDAsForInstruction = async () => {
    const buyerPriceInLamports = parseFloat(liveData['minimumBid'] || 0) * LAMPORTS_PER_SOL
    const buyerPrice: BN = new BN(buyerPriceInLamports)

    const metaDataAccount: StringPublicKey = await getMetadata(general.mint_address)

    const tradeState: [PublicKey, number] = await tradeStatePDA(publicKey, general, bnTo8(buyerPrice))
    console.log(tradeState)

    const freeTradeState: [PublicKey, number] = await freeSellerTradeStatePDA(publicKey, general)
    console.log(freeTradeState)

    const programAsSignerPDA: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION_HOUSE_PREFIX), Buffer.from('signer')],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    if (!tradeState || !freeTradeState || !programAsSignerPDA || !metaDataAccount) {
      throw Error(`Could not derive values for sell instructions`)
    }

    return {
      metaDataAccount,
      tradeState,
      freeTradeState,
      programAsSignerPDA,
      buyerPrice
    }
  }

  const callSellInstruction = async (e: any) => {
    e.preventDefault()
    const { metaDataAccount, tradeState, freeTradeState, programAsSignerPDA, buyerPrice } =
      await derivePDAsForInstruction()

    const sellInstructionArgs: SellInstructionArgs = {
      tradeStateBump: tradeState[1],
      freeTradeStateBump: freeTradeState[1],
      programAsSignerBump: programAsSignerPDA[1],
      buyerPrice: buyerPrice,
      tokenSize: tokenSize
    }

    const sellInstructionAccounts: SellInstructionAccounts = await getSellInstructionAccounts(
      publicKey,
      general,
      metaDataAccount,
      tradeState[0],
      freeTradeState[0],
      programAsSignerPDA[0]
    )

    const sellIX: TransactionInstruction = await createSellInstruction(sellInstructionAccounts, sellInstructionArgs)
    console.log(sellIX)

    const transaction = new Transaction().add(sellIX)
    const signature = await sendTransaction(transaction, connection)
    console.log(signature)
    const confirm = await connection.confirmTransaction(signature, 'processed')
    console.log(confirm)

    notify(successfulListingMessage(signature, nftMetadata, liveData['minimumBid']))

    if (confirm.value.err === null) {
      postTransationToAPI(signature, buyerPrice, tokenSize).then((res) => {
        console.log(res)
      })
    }
  }

  const postTransationToAPI = async (txSig: any, buyerPrice: BN, tokenSize: BN) => {
    const sellObject = {
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
      collection_id: nftMetadata.collection,
      user_id: sessionUser.user_id
    }

    try {
      const res = await sellNFT(sellObject)
      return res
    } catch (error) {
      console.dir(error)
      notify({
        type: 'error',
        message: (
          <MESSAGE>
            <Row className="m-title" justify="space-between" align="middle">
              <Col>NFT Listing error!</Col>
              <Col>
                <img className="m-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
              </Col>
            </Row>
            <div>Please try again, if the error persists please contact support.</div>
          </MESSAGE>
        )
      })
    } finally {
      // setIsLoading(false)
    }
  }

  const callCancelInstruction = async (e: any) => {
    e.preventDefault()

    const { tradeState, buyerPrice } = await derivePDAsForInstruction()

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
      tradeState: tradeState[0]
    }

    const cancelIX: TransactionInstruction = await createCancelInstruction(
      cancelInstructionAccounts,
      cancelInstructionArgs
    )

    const transaction = new Transaction().add(cancelIX)
    const signature = await sendTransaction(transaction, connection)
    console.log(signature)
    const confirm = await connection.confirmTransaction(signature, 'processed')
    console.log(confirm)
  }

  const successfulListingMessage = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <MESSAGE>
        <Row className="m-title" justify="space-between" align="middle">
          <Col>Successfully listed {nftMetadata?.name}!</Col>
          <Col>
            <img className="m-icon" src={`/img/assets/bid-success-icon.svg`} alt="" />
          </Col>
        </Row>
        <div>{nftMetadata?.name}</div>
        <div>My price: {`${price}`}</div>
        <div>
          <a
            href={`https://explorer.solana.com/tx/${signature}?cluster=${network}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Transaction ID
          </a>
        </div>
      </MESSAGE>
    )
  })

  // const handleSelectPercentage = (number: number) => {}

  return (
    <>
      <UPLOAD_CONTENT>
        <img
          className="live-auction-back-icon"
          src={`/img/assets/arrow.svg`}
          alt="back"
          onClick={() => history.goBack()}
        />
        <UPLOAD_FIELD_CONTAINER>
          <UPLOAD_INFO_CONTAINER>
            <SECTION_TITLE>1. Sale type</SECTION_TITLE>
            <SellCategory setCategory={setCategory} category={category} />

            <SECTION_TITLE>
              {category === 'open-bid' && '2. Open Bid settings'}
              {category === 'fixed-price' && '2. Fixed price settings'}
            </SECTION_TITLE>
            <STYLED_FORM form={form} layout="vertical" initialValues={{}}>
              {category === '0' && (
                <>
                  <FormDoubleItem startingDays={startingDays} expirationDays={expirationDays} className="mb-3x" />
                  <FormDoubleItem data={dataFormRow2} className="mb-3x" onChange={onChange} />
                </>
              )}
              {category === 'open-bid' && (
                <div>
                  <FormDoubleItem
                    data={[
                      {
                        label: 'Minimum bid',
                        name: 'minimumBid',
                        defaultValue: '',
                        placeholder: 'Enter minimum bid',
                        hint: (
                          <div>
                            Bids below the minimum wont <div>be accepted</div>
                          </div>
                        ),
                        unit: 'SOL',
                        type: 'input'
                      }
                    ]}
                    className="mb-3x"
                    onChange={onChange}
                  />

                  <STYLED_DESCRIPTION>
                    Open bids are open to any amount and they will be closed after a scuccessful bid agreement or if the
                    creator decides to remove it.
                  </STYLED_DESCRIPTION>
                </div>
              )}
              {category === 'fixed-price' && (
                <FormDoubleItem data={dataFormFixedRow2} className="mb-3x" onChange={onChange} />
              )}
              {/* <Donate
                {...dataDonate}

                const 
                label={`${category === 'open-bid' ? '3.' : '4.'} Donate for charity`}
                // selectPercentage={handleSelectPercentage}
              /> */}
            </STYLED_FORM>
          </UPLOAD_INFO_CONTAINER>
          <PREVIEW_UPLOAD_CONTAINER>
            <PreviewImage image_url={nftMetadata.properties.files[0].uri} />
            <div>
              <BUTTON onClick={callSellInstruction}>Sell item</BUTTON>
            </div>
          </PREVIEW_UPLOAD_CONTAINER>
        </UPLOAD_FIELD_CONTAINER>
      </UPLOAD_CONTENT>
    </>
  )
}
