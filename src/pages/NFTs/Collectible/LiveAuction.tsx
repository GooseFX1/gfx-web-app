import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Form, Col, Row } from 'antd'
import { MainText } from '../../../styles'
import { useWallet } from '@solana/wallet-adapter-react'
import PreviewImage from './PreviewImage'
import { useHistory } from 'react-router-dom'
import { useNFTDetails, useNFTProfile, useConnectionConfig } from '../../../context'
import { SellCategory } from '../SellCategory/SellCategory'
import { FormDoubleItem } from '../Form/FormDoubleItem'
import { notify } from '../../../utils'
import { dataFormRow2, dataFormFixedRow2, dataDonate, startingDays, expirationDays } from './mockData'
import { Donate } from '../Form/Donate'
import { GroupButton } from '../GroupButton/GroupButton'
import isEmpty from 'lodash/isEmpty'

const UPLOAD_CONTENT = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.margin(5)};
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
  margin-right: ${({ theme }) => theme.margin(6)};
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

export const LiveAuction = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const initSettingData = {
    info: {
      title: '',
      desc: ''
    },
    previewImage: '',
    status: ''
  }
  const initLiveData = {
    minimumBid: '',
    royalties: ''
  }
  const [settingData, setSettingData] = useState<any>({ ...initSettingData })
  const [liveData, setLiveData] = useState<any>({ ...initLiveData })
  const [disabled, setDisabled] = useState(true)
  const [category, setCategory] = useState(1)
  const { general, nftMetadata, updateUserInput, sellNFT, fetchExternalNFTs } = useNFTDetails()
  const { sessionUser } = useNFTProfile()
  const { publicKey, connected } = useWallet()
  const { connection } = useConnectionConfig()

  useEffect(() => {
    const { state = {} } = history.location
    if (!isEmpty(state)) {
      setSettingData(state)
    }
  }, [history.location, history.location.state])

  useEffect(() => {
    if (connected) {
      fetchExternalNFTs(publicKey, connection, nftMetadata)
    }
  }, [])

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

  useEffect(() => {
    if (category == 2) {
      if (liveData?.minimumBid && liveData?.royalties) {
        setDisabled(false)
      } else setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [liveData, category])

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

  return (
    <>
      <UPLOAD_CONTENT>
        <img
          className="live-auction-back-icon"
          src={`/img/assets/arrow.svg`}
          alt="back"
          onClick={() => history.push('/NFTs/create-single')}
        />
        <UPLOAD_FIELD_CONTAINER>
          <UPLOAD_INFO_CONTAINER>
            <SECTION_TITLE>3. Sale type</SECTION_TITLE>
            <SellCategory setCategory={setCategory} category={category} />

            <SECTION_TITLE>
              {category === 1 && '4. Open Bid settings'}
              {category === 2 && '4. Fixed price settings'}
            </SECTION_TITLE>
            <STYLED_FORM form={form} layout="vertical" initialValues={{}}>
              {category === 0 && (
                <>
                  <FormDoubleItem startingDays={startingDays} expirationDays={expirationDays} className="mb-3x" />
                  <FormDoubleItem data={dataFormRow2} className="mb-3x" onChange={onChange} />
                </>
              )}
              {category === 1 && (
                <STYLED_DESCRIPTION>
                  Open bids are open to any amount and they will be closed after a scuccessful bid agreement or if the
                  creator decides to remove it.
                </STYLED_DESCRIPTION>
              )}
              {category === 2 && <FormDoubleItem data={dataFormFixedRow2} className="mb-3x" onChange={onChange} />}
              <Donate {...dataDonate} label={`${category === 1 ? '4.' : '5.'} Donate for charity`} />
            </STYLED_FORM>
          </UPLOAD_INFO_CONTAINER>
          <PREVIEW_UPLOAD_CONTAINER>
            <PreviewImage
              file={settingData?.previewImage}
              image_url={nftMetadata?.image}
              status={settingData?.status}
            />
            <GroupButton
              text1="Save as a draft"
              text2="Sell item"
              disabled={disabled}
              onClick1={() => history.push('/NFTs/create-single')}
              onClick2={() => confirmBid()}
            />
          </PREVIEW_UPLOAD_CONTAINER>
        </UPLOAD_FIELD_CONTAINER>
      </UPLOAD_CONTENT>
    </>
  )
}
