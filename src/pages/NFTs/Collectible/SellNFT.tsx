import React, { useMemo, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Form, Row, Col } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import { IAppParams } from '../../../types/app_params.d'
import { INFTAsk } from '../../../types/nft_details.d'
import { CenteredDiv, MainText, TXT_PRIMARY_GRADIENT, GFX_LINK, FLOATING_ACTION_ICON } from '../../../styles'
import { useNFTDetails, useNFTProfile, useConnectionConfig } from '../../../context'
import { SellCategory } from '../SellCategory/SellCategory'
import { FormDoubleItem } from '../Form/FormDoubleItem'
import {
  SuccessfulListingMsg,
  TransactionErrorMsg,
  MainButton,
  Modal,
  FloatingActionButton
} from '../../../components'
import { NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { notify, truncateAddress } from '../../../utils'
import { registerSingleNFT } from '../../../api/NFTs'
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
  AH_FEE_ACCT,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE,
  AUCTION_HOUSE_PROGRAM_ID,
  AUCTION_HOUSE_AUTHORITY,
  TREASURY_MINT,
  toPublicKey,
  createSellInstruction,
  SellInstructionArgs,
  SellInstructionAccounts,
  createCancelInstruction,
  CancelInstructionArgs,
  CancelInstructionAccounts,
  getMetadata,
  StringPublicKey,
  bnTo8
} from '../../../web3'

//#region styles
const UPLOAD_CONTENT = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.margin(6)} 0;
  width: 90%;
  margin: 0 auto;
`

const REVIEW_SELL_MODAL = styled(Modal)`
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

const UPLOAD_INFO_CONTAINER = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
`

const PREVIEW_UPLOAD_CONTAINER = styled.div`
  .image-preview {
    height: auto;
    width: 100%;
    border-radius: 20px;
  }
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
  margin-top: ${({ theme }) => theme.margin(3)};
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

const IMAGE_LABEL = styled(CenteredDiv)`
  margin-bottom: 12px;
`

const PRICE = styled.span`
  font-weight: 700;
  background: linear-gradient(92.45deg, #f7931a 6.46%, #ac1cc7 107.94%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`
//#endregion

export const SellNFT = () => {
  const history = useHistory()
  const params = useParams<IAppParams>()
  const { general, setGeneral, ask, fetchGeneral, nftMetadata, updateUserInput, sellNFT, patchNFTAsk } =
    useNFTDetails()
  const { sessionUser } = useNFTProfile()
  const wallet = useWallet()
  const { connected, publicKey, sendTransaction } = wallet
  const { connection, network } = useConnectionConfig()
  const [reviewSellModal, setReviewSellModal] = useState<boolean>(false)
  const [pendingTxSig, setPendingTxSig] = useState<string>()

  const [form] = Form.useForm()
  const [userInput, setUserInput] = useState<any>({
    minimumBid: '',
    royalties: ''
  })
  const [disabled, setDisabled] = useState<boolean>(true)
  const [category, setCategory] = useState<string>('fixed-price')
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
      return truncateAddress(addr)
    } else if (nftMetadata.collection) {
      return Array.isArray(nftMetadata.collection) ? nftMetadata.collection[0].name : nftMetadata.collection.name
    } else {
      return null
    }
  }, [nftMetadata])

  useEffect(() => {
    if (params.nftMintAddress && (!general || !nftMetadata)) {
      fetchGeneral(params.nftMintAddress, connection).then((res) => {
        console.log(res)
      })
    }
  }, [])

  useEffect(() => {
    if (!sessionUser || !connected || !publicKey) {
      history.push(`/NFTs/details/${params.nftMintAddress}`)
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

  const onChange = (e) => {
    const { value } = e.target
    const temp = { ...userInput }
    const fmtNum = parseFloat(value).toFixed(3)

    temp[e.target.id] = fmtNum.toString()
    if (e.target.id === 'minimumBid') {
      updateUserInput({ price: fmtNum.toString() })
    } else {
      updateUserInput({ royalty: value })
    }
    setUserInput(temp)
  }

  const derivePDAsForInstruction = async () => {
    const buyerPriceInLamports = parseFloat(userInput['minimumBid']) * LAMPORTS_PER_SOL
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

    // asserts current NFT does not belong to collection, is one-off
    if (general.uuid === null) {
      try {
        const registeredNFT = await registerSingleNFT({
          nft_name: general.nft_name,
          nft_description: general.nft_description,
          mint_address: general.mint_address,
          metadata_url: general.metadata_url,
          image_url: general.image_url,
          animation_url: general.animation_url
        })

        setGeneral({
          uuid: registeredNFT.data.uuid,
          non_fungible_id: registeredNFT.data.non_fungible_id,
          ...general
        })
      } catch (error) {
        notify({
          type: 'error',
          message: (
            <TransactionErrorMsg
              title={`Error Registering NFT!`}
              itemName={nftMetadata.name}
              supportText={`Please try again, if the error persists please contact support.`}
            />
          )
        })

        return
      }
    }

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

    const sellInstructionAccounts: SellInstructionAccounts = getSellInstructionAccounts(
      publicKey,
      general,
      metaDataAccount,
      tradeState[0],
      freeTradeState[0],
      programAsSignerPDA[0]
    )

    const sellIX: TransactionInstruction = createSellInstruction(sellInstructionAccounts, sellInstructionArgs)

    const transaction = new Transaction()

    let removeAskIX: TransactionInstruction | undefined = undefined
    // if ask exists
    if (ask !== undefined) {
      // make web3 cancel
      removeAskIX = await createRemoveAskIX()
    }

    // adds ixs to tx
    console.log(`Updating ask: ${removeAskIX !== undefined}`)
    if (ask && removeAskIX) transaction.add(removeAskIX)
    transaction.add(sellIX)

    try {
      const signature = await sendTransaction(transaction, connection)
      console.log(signature)
      setPendingTxSig(signature)
      attemptConfirmTransaction(buyerPrice, tradeState, signature)
    } catch (error) {
      setIsLoading(false)
      console.log('User exited signing transaction to list fixed price')
    }
  }

  const attemptConfirmTransaction = async (buyerPrice: BN, tradeState: [PublicKey, number], signature: any) => {
    try {
      const confirm = await connection.confirmTransaction(signature, 'finalized')
      console.log(confirm)
      // successfully list nft
      if (confirm.value.err === null) {
        // create asking price
        postAskToAPI(signature, buyerPrice, tokenSize, ask).then((res) => {
          console.log('Ask data synced: ', res)
          if (!res) {
            handleTxError(nftMetadata.name, 'Listing has been canceled. Please try againg')
            callCancelInstruction(wallet, connection, general, tradeState, buyerPrice)
          } else {
            setTimeout(() => {
              notify(successfulListingMsg(signature, nftMetadata, userInput['minimumBid']))
              history.push(`/NFTs/profile/${publicKey.toBase58()}`)
            }, 2000)
          }
        })

        // unsuccessfully list nft
      } else {
        handleTxError(nftMetadata.name, '')
      }
    } catch (error) {
      handleTxError(nftMetadata.name, error.message)
    }
  }

  const postAskToAPI = async (txSig: any, buyerPrice: BN, tokenSize: BN, ask: INFTAsk | undefined) => {
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
      const res =
        ask === undefined
          ? await sellNFT(sellObject)
          : await patchNFTAsk({ ...sellObject, ask_id: ask.ask_id, uuid: ask.uuid })

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

  const createRemoveAskIX = async () => {
    const curAskingPrice: BN = new BN(parseFloat(ask.buyer_price))
    const tradeState: [PublicKey, number] = await tradeStatePDA(publicKey, general, bnTo8(curAskingPrice))
    const cancelInstructionArgs: CancelInstructionArgs = {
      buyerPrice: curAskingPrice,
      tokenSize: tokenSize
    }

    const cancelInstructionAccounts: CancelInstructionAccounts = {
      wallet: wallet.publicKey,
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
    return cancelIX
  }

  const successfulListingMsg = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Successfully listed ${nftMetadata.name}!`}
        itemName={nftMetadata.name}
        supportText={`My price: ${price}`}
        tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
      />
    )
  })

  const handleTxError = (itemName: string, error: string) => {
    setPendingTxSig(undefined)
    setIsLoading(false)
    notify({
      type: 'error',
      message: <TransactionErrorMsg title={`NFT Listing error!`} itemName={itemName} supportText={error} />
    })
  }

  const modal = () => {
    if (reviewSellModal) {
      return (
        <REVIEW_SELL_MODAL
          title={null}
          onOk={() => setReviewSellModal(false)}
          onCancel={(bool: boolean) => {
            setIsLoading(bool)
            setPendingTxSig(undefined)
          }}
          setVisible={setReviewSellModal}
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

          <div style={{ marginBottom: '32px' }}>
            <div className="bm-title">Fixed Price</div>
            <div className="bm-support">
              Users can still bid below the asking price. If a bid is placed that is equal to your asking price,
              your item will be sold and transferred from your wallet.
            </div>
          </div>

          {pendingTxSig && (
            <div style={{ marginBottom: '56px' }} className="bm-support">
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
            <Row
              className="bm-details-price"
              justify="space-between"
              align="middle"
              style={{ marginBottom: '70px' }}
            >
              <Col>You will receive</Col>
              <Col>
                <Row gutter={8} justify="space-between" align="middle" style={{ fontWeight: 700 }}>
                  <Col>{parseFloat(userInput['minimumBid'] || 0) - servicePriceCalc}</Col>
                  <Col>SOL</Col>
                </Row>
              </Col>
            </Row>

            <MainButton
              height={'60px'}
              width="100%"
              status="action"
              onClick={callSellInstruction}
              loading={isLoading}
            >
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
          <div style={{ position: 'absolute', top: '32px', left: '-48px' }}>
            <FloatingActionButton height={40} onClick={() => history.goBack()}>
              <FLOATING_ACTION_ICON src={`/img/assets/arrow.svg`} alt="back" />
            </FloatingActionButton>
          </div>

          <Row className="" justify="space-around">
            <Col sm={12} xl={12} xxl={10} className="nd-details">
              <UPLOAD_INFO_CONTAINER>
                <SECTION_TITLE>Sale Type</SECTION_TITLE>
                <SellCategory setCategory={setCategory} category={category} />

                <SECTION_TITLE>
                  {ask === undefined ? 'Set' : 'Edit'} Asking Price:{' '}
                  {ask !== undefined && <PRICE> {parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL} SOL</PRICE>}
                </SECTION_TITLE>
                <STYLED_FORM form={form} layout="vertical" initialValues={{}}>
                  {category === 'open-bid' && (
                    <div>
                      <FormDoubleItem
                        data={[
                          {
                            id: 'minimumBid',
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
                        Open bids are open to any amount and they will be closed after a bid matches the asking
                        price or if the creator decides to remove it.
                      </STYLED_DESCRIPTION>
                    </div>
                  )}
                  {category === 'fixed-price' && (
                    <div>
                      <FormDoubleItem
                        data={[
                          {
                            id: 'minimumBid',
                            defaultValue:
                              ask === undefined ? '' : `${parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL}`,
                            placeholder: 'Enter asking price',
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
                        Open bids are open to any amount and they will be closed after a bid matches the asking
                        price or if the creator decides to remove it.
                      </STYLED_DESCRIPTION>
                    </div>
                  )}
                </STYLED_FORM>
              </UPLOAD_INFO_CONTAINER>
            </Col>
            <Col sm={10} xl={10} xxl={10}>
              <PREVIEW_UPLOAD_CONTAINER>
                <IMAGE_LABEL>
                  <STYLED_DESCRIPTION>{nftMetadata.name}</STYLED_DESCRIPTION>
                </IMAGE_LABEL>
                <img className={`image-preview`} src={nftMetadata.image} alt="nft-preview" />

                <div>
                  <BUTTON onClick={() => setReviewSellModal(true)} disabled={disabled}>
                    Review
                  </BUTTON>
                </div>
              </PREVIEW_UPLOAD_CONTAINER>
            </Col>
          </Row>
        </UPLOAD_CONTENT>
      )}
    </div>
  )
}
