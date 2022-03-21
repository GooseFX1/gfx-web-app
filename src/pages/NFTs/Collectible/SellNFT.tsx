import React, { useMemo, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Form, Row, Col } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import { IAppParams } from '../../../types/app_params.d'
import PreviewImage from './PreviewImage'
import { PopupCustom } from '../Popup/PopupCustom'
import { MainText, TXT_PRIMARY_GRADIENT } from '../../../styles'
import { useNFTDetails, useNFTProfile, useConnectionConfig } from '../../../context'
import { SellCategory } from '../SellCategory/SellCategory'
import { FormDoubleItem } from '../Form/FormDoubleItem'
import { SuccessfulListingMsg, TransactionErrorMsg, MainButton } from '../../../components'
import { NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { notify } from '../../../utils'
import {
  tradeStatePDA,
  freeSellerTradeStatePDA,
  getSellInstructionAccounts,
  callCancelInstruction,
  tokenSize
} from '../actions'
import { PublicKey, TransactionInstruction, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import BN from 'bn.js'
import {
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE,
  AUCTION_HOUSE_PROGRAM_ID,
  TREASURY_MINT,
  toPublicKey,
  createSellInstruction,
  SellInstructionArgs,
  SellInstructionAccounts,
  getMetadata,
  StringPublicKey,
  bnTo8
} from '../../../web3'
import { dataFormRow2, dataFormFixedRow2 } from './mockData'
// import { Donate } from '../Form/Donate'
// const dataDonate = {
//   desc: 'We will donate a percentage of the total price for people in need.',
//   percents: [0, 10, 20, 50, 100]
// }

//#region styles
const UPLOAD_CONTENT = styled.div`
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

const REVIEW_SELL_MODAL = styled(PopupCustom)`
  * {
    text-align: center;
  }
  .bm-title {
    color: ${({ theme }) => theme.text1};
    font-size: 58px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  .bm-text {
    color: ${({ theme }) => theme.text1};
    font-size: 22px;
    line-height: 26px;
  }
  .bm-support {
    color: ${({ theme }) => theme.text1};
    font-size: 18px;
    line-height: 26px;
  }
  .bm-text-bold {
    color: ${({ theme }) => theme.text1};
    font-weight: 700;
  }
  .bm-details-price {
    margin-bottom: 12px;
    * {
      color: ${({ theme }) => theme.text1};
      font-size: 17px;
      font-weight: 600;
    }
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
  color: ${({ theme }) => theme.text1};
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

const LOADING = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-top: 2rem;
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
const BUTTON_TEXT = styled.div`
  font-weight: 700;
  font-size: 21px;
`

//#endregion

export const SellNFT = () => {
  const history = useHistory()
  const params = useParams<IAppParams>()
  const { general, fetchGeneral, nftMetadata, updateUserInput, sellNFT } = useNFTDetails()
  const { sessionUser } = useNFTProfile()
  const wallet = useWallet()
  const { connected, publicKey, sendTransaction } = wallet
  const { connection, network } = useConnectionConfig()
  const [reviewSellModal, setReviewSellModal] = useState<boolean>(false)

  const [form] = Form.useForm()
  const [userInput, setUserInput] = useState<any>({
    minimumBid: '',
    royalties: ''
  })
  const [disabled, setDisabled] = useState<boolean>(true)
  const [category, setCategory] = useState<string>('open-bid')
  const [isLoading, setIsLoading] = useState(false)

  const servicePriceCalc: number = useMemo(
    () =>
      userInput['minimumBid']
        ? parseFloat(((NFT_MARKET_TRANSACTION_FEE / 100) * Number(userInput['minimumBid'])).toFixed(3))
        : 0,
    [userInput['minimumBid']]
  )

  const creator = useMemo(() => {
    if (nftMetadata === undefined) return null
    if (nftMetadata.properties.creators.length > 0) {
      const addr = nftMetadata.properties.creators[0].address
      return `${addr.substr(0, 4)}...${addr.substr(-4, 4)}`
    } else if (nftMetadata.collection) {
      return Array.isArray(nftMetadata.collection) ? nftMetadata.collection[0].name : nftMetadata.collection.name
    } else {
      return null
    }
  }, [nftMetadata])

  useEffect(() => {
    const { state = {} } = history.location
  }, [history.location, history.location.state])

  useEffect(() => {
    if (params.nftId && (!general || !nftMetadata)) {
      fetchGeneral(params.nftId, connection).then((res) => {
        console.log(res)
      })
    }
  }, [])

  useEffect(() => {
    if (!sessionUser || !connected || !publicKey) {
      history.push(`/NFTs/open-bid/${params.nftId}`)
    }
  }, [connected, publicKey])

  useEffect(() => {
    if (userInput.minimumBid.length > 0) {
      if (category === 'fixed-price' && userInput.royalties.length > 0) {
        setDisabled(false)
      } else {
        setDisabled(false)
      }
    } else {
      setDisabled(true)
    }
  }, [userInput, category])

  const onChange = ({ e, id }) => {
    const { value } = e.target
    const temp = { ...userInput }
    const fmtNum = parseFloat(value).toFixed(3)

    temp[id] = fmtNum.toString()
    if (id === 'minimumBid') {
      updateUserInput({ price: fmtNum.toString() })
    } else {
      updateUserInput({ royalty: value })
    }
    setUserInput(temp)
  }

  const derivePDAsForInstruction = async () => {
    const buyerPriceInLamports = parseFloat(userInput['minimumBid'] || 0) * LAMPORTS_PER_SOL
    const buyerPrice: BN = new BN(buyerPriceInLamports)

    const metaDataAccount: StringPublicKey = await getMetadata(general.mint_address)
    const tradeState: [PublicKey, number] = await tradeStatePDA(publicKey, general, bnTo8(buyerPrice))
    const freeTradeState: [PublicKey, number] = await freeSellerTradeStatePDA(publicKey, general)
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
    setIsLoading(true)

    const { metaDataAccount, tradeState, freeTradeState, programAsSignerPDA, buyerPrice } =
      await derivePDAsForInstruction()

    console.log(metaDataAccount, tradeState, freeTradeState, programAsSignerPDA, buyerPrice.toString())

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

    if (confirm.value.err === null) {
      postTransationToAPI(signature, buyerPrice, tokenSize).then((res) => {
        console.log(res)
        if (!res) {
          callCancelInstruction(wallet, connection, general, tradeState, buyerPrice)
        }

        setTimeout(() => {
          notify(successfulListingMsg(signature, nftMetadata, userInput['minimumBid']))
          history.push('/NFTs/profile')
        }, 2000)
      })
    }
  }

  const postTransationToAPI = async (txSig: any, buyerPrice: BN, tokenSize: BN) => {
    const sellObject = {
      ask_id: null,
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
      const res = await sellNFT(sellObject)
      console.dir(res)
      if (res.isAxiosError) {
        notify({
          type: 'error',
          message: (
            <TransactionErrorMsg
              title={`NFT Listing error!`}
              itemName={nftMetadata.name}
              supportText={`Please try again, if the error persists please contact support.`}
            />
          )
        })
        return false
      } else {
        return true
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const successfulListingMsg = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Successfully listed ${nftMetadata.name}!`}
        itemName={nftMetadata.name}
        supportText={`My price: ${price}`}
        tx_url={`https://explorer.solana.com/tx/${signature}?cluster=${network}`}
      />
    )
  })

  const modal = () => {
    if (reviewSellModal) {
      return (
        <REVIEW_SELL_MODAL
          title={null}
          onOk={(e) => setReviewSellModal(false)}
          onCancel={(e) => setReviewSellModal(false)}
          footer={null}
          visible={reviewSellModal}
          width="570px"
        >
          <div className="bm-text" style={{ marginTop: '40px' }}>
            You are about to list
          </div>
          <Row className="bm-text" align="middle" justify="center" gutter={4} style={{ marginBottom: '70px' }}>
            <Col className="bm-text-bold">
              <TXT_PRIMARY_GRADIENT>{general.nft_name}</TXT_PRIMARY_GRADIENT>
            </Col>
            <Col>by</Col>
            <Col className="bm-text-bold">{creator}</Col>
          </Row>

          <div style={{ marginBottom: '70px' }}>
            <div className="bm-title">Open Bid</div>
            <div className="bm-support">Accept any amount that you feel comfortable selling your NFT</div>
          </div>

          <div>
            <Row className="bm-details-price" justify="space-between" align="middle">
              <Col>Service fee ({`${NFT_MARKET_TRANSACTION_FEE}%`})</Col>
              <Col>
                <Row gutter={8} justify="space-between" align="middle">
                  <Col>{servicePriceCalc}</Col>
                  <Col>SOL</Col>
                </Row>
              </Col>
            </Row>
            <Row className="bm-details-price" justify="space-between" align="middle" style={{ marginBottom: '70px' }}>
              <Col>You will recieve</Col>
              <Col>
                <Row gutter={8} justify="space-between" align="middle" style={{ fontWeight: 700 }}>
                  <Col>{parseFloat(userInput['minimumBid'] || 0) - servicePriceCalc}</Col>
                  <Col>SOL</Col>
                </Row>
              </Col>
            </Row>

            <MainButton height={'60px'} width="100%" status="action" onClick={callSellInstruction} loading={isLoading}>
              <BUTTON_TEXT>List Now</BUTTON_TEXT>
            </MainButton>
          </div>
        </REVIEW_SELL_MODAL>
      )
    }
  }

  return (
    <div>
      {!general || !nftMetadata ? (
        <LOADING>Loading...</LOADING>
      ) : (
        <UPLOAD_CONTENT>
          {modal()}
          <img
            className="live-auction-back-icon"
            src={`/img/assets/arrow.svg`}
            alt="back"
            onClick={() => history.goBack()}
          />
          <UPLOAD_FIELD_CONTAINER>
            <UPLOAD_INFO_CONTAINER>
              <SECTION_TITLE>Sale Type</SECTION_TITLE>
              <SellCategory setCategory={setCategory} category={category} />

              <SECTION_TITLE>Set Asking Price</SECTION_TITLE>
              <STYLED_FORM form={form} layout="vertical" initialValues={{}}>
                {/* {category === '0' && (
                  <>
                    <FormDoubleItem startingDays={startingDays} expirationDays={expirationDays} className="mb-3x" />
                    <FormDoubleItem data={dataFormRow2} className="mb-3x" onChange={onChange} />
                  </>
                )} */}
                {category === 'open-bid' && (
                  <div>
                    <FormDoubleItem
                      data={[
                        {
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
                      Open bids are open to any amount and they will be closed after a bid matches the asking price or
                      if the creator decides to remove it.
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
              <PreviewImage image_url={nftMetadata.image} />
              <div>
                <BUTTON onClick={() => setReviewSellModal(true)} disabled={disabled}>
                  Review
                </BUTTON>
              </div>
            </PREVIEW_UPLOAD_CONTAINER>
          </UPLOAD_FIELD_CONTAINER>
        </UPLOAD_CONTENT>
      )}
    </div>
  )
}
