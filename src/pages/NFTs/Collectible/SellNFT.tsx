import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Form, Col, Row } from 'antd'
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
  const { general, nftMetadata, updateUserInput, sellNFT, fetchExternalNFTs } = useNFTDetails()
  const { sessionUser } = useNFTProfile()
  const { publicKey, connected } = useWallet()
  const { connection } = useConnectionConfig()

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
    if (id == 'minimumBid') {
      updateUserInput({ price: value })
    } else {
      updateUserInput({ royalty: value })
    }
    setLiveData(temp)
  }

  const confirmBid = async () => {
    const sellObject = {
      clock: Date.now() + '', // string, not a number
      tx_sig: 'RANDOM_TX_SIG_HERE',
      wallet_key: `${publicKey}`,
      auction_house_key: 'AUCTION_HOUSE_KEY_HERE',
      token_account_key: 'RANDOM_TOKEN_ACCOUNT_KEY_HERE',
      auction_house_treasury_mint_key: 'AUCTION_HOUSE_TREASURY_KEY_HERE',
      token_account_mint_key: general?.mint_address,
      buyer_price: liveData['minimumBid'] || '0',
      token_size: 'TOKEN_SIZE_HERE',
      non_fungible_id: 11, //chnage this when you get the nft id
      collection_id: nftMetadata?.collection || 11, // and this too
      user_id: sessionUser?.user_id
    }

    try {
      const res = await sellNFT(sellObject)

      if (res) {
        notify({
          message: (
            <MESSAGE>
              <Row className="m-title" justify="space-between" align="middle">
                <Col>NFT listing sucessfull!</Col>
                <Col>
                  <img className="m-icon" src={`/img/assets/bid-success-icon.svg`} alt="" />
                </Col>
              </Row>
              <div>{nftMetadata?.name}</div>
              <div>My price: {`${liveData['minimumBid']}`}</div>
            </MESSAGE>
          )
        })
      } else {
        throw new Error()
      }
      // setBidPrice('')
      // setMode('bid')
      // setVisible(false)
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
      //setIsLoading(false)
    }
  }

  const handleSelectPercentage = (number: number) => {}

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
                label={`${category === 'open-bid' ? '3.' : '4.'} Donate for charity`}
                selectPercentage={handleSelectPercentage}
              /> */}
            </STYLED_FORM>
          </UPLOAD_INFO_CONTAINER>
          <PREVIEW_UPLOAD_CONTAINER>
            <PreviewImage image_url={nftMetadata.properties.files[0].uri} />
            <div>
              <BUTTON onClick={(e) => confirmBid()}>Sell item</BUTTON>
            </div>
          </PREVIEW_UPLOAD_CONTAINER>
        </UPLOAD_FIELD_CONTAINER>
      </UPLOAD_CONTENT>
    </>
  )
}
