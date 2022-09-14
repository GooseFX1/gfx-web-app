import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { Row, Col, Slider, InputNumber, Typography, Button } from 'antd'
import InfoInput from './InfoInput'
import { PopupCustom } from '../Popup/PopupCustom'
import { Creator, StringPublicKey } from '../../../web3'
import { truncateAddress } from '../../../utils'
const { Text } = Typography

//#region styles
const STYLED_POPUP = styled(PopupCustom)`
  * {
    font-family: 'Montserrat';
    color: ${({ theme }) => theme.text2};
  }

  .ant-input-number {
    width: 100%;
  }
  ${({ theme }) => `
    .ant-modal-body {
      padding: ${theme.margin(3.5)} ${theme.margin(6)} ${theme.margin(2)};
    }
    .ant-modal-close {
      right: 35px;
      top: 35px;
      left: auto;
      svg {
        color: ${theme.text7};
      }
    }
    .title {
      font-family: Montserrat;
      font-size: 25px;
      font-weight: 600;
      color: ${theme.text7};
      margin-bottom: ${theme.margin(4)};
    }
  `}
`

const STYLED_CREATE_BTN = styled(Button)`
  ${({ theme }) => `
    margin-top: ${theme.margin(2)};
    width: 100%;
    font-size: 17px;
    font-weight: 600;
    line-height: 45px;
    height: 53px;
    ${theme.roundedBorders}
    border: none;
    background-color: #9625ae;
    span {
      color: #fff !important;
    }
    &:hover {
      background-color: #9625ae;
    }
  `}
`

const BUTTON_PLUS_WRAPPER = styled(Button)<{ disabled: boolean }>`
  margin-top: 8px;
  ${({ disabled }) => `
    width: 143px;
    height: 45px;
    border-radius: 29px;
    background-color: #3735bb;
    background: ${disabled ? '#7d7d7d' : ' #3735bb'} !important;
    color: #fff;
    border: none;
    margin-left: auto;
    margin-right: 0;
    display: block;
    span {
      color: #fff !important;
    }
    &:hover, &:focus {
      background-color: #3735bb;
      color: #fff;
      opacity: 0.8;
    }
  `}
`

const CREATOR_CONTAINER = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.margin(1)} 0px;

  .close-btn {
    width: 35px;
    height: 35px;
    background: ${({ theme }) => theme.iconRemoveBg};
    border-radius: 50%;
    margin-right: ${({ theme }) => theme.margin(2)};
    line-height: 31px;
    text-align: center;
    cursor: pointer;
    .close-white-icon {
      width: 17px;
      height: auto;
    }
  }
  .label {
    margin-right: ${({ theme }) => theme.margin(2)};
    font-weight: 700;
    font-size: 22px;
  }
  .input {
    width: 72px;

    .ant-input-number-focused {
      border-color: white;
    }
  }
  .slider {
    margin-left: auto;
    width: 150px;
    margin-right: ${({ theme }) => theme.margin(1)};

    .ant-slider {
      :hover {
        .ant-slider-handle {
          border-color: #9625ae;
        }
      }
    }
    .ant-slider-track {
      background-color: #9625ae;
    }
    .ant-slider-handle {
      border-color: #9625ae;
    }
  }
`
//#endregion

interface UserValue {
  key: StringPublicKey
  label: StringPublicKey
  value: StringPublicKey
}

interface Royalty {
  creatorKey: StringPublicKey
  amount: number
}

interface Props {
  visible: boolean
  setNftMintingData: (data: any) => void
  nftMintingData: any
  handleSubmit: () => void
  handleCancel: () => void
}

const RoyaltiesStep = ({ visible, nftMintingData, setNftMintingData, handleSubmit, handleCancel }: Props) => {
  const { publicKey } = useWallet()
  const [inputVal, setInputVal] = useState<any>()
  const [creators, setCreators] = useState<Array<UserValue>>([])
  const [fixedCreators, setFixedCreators] = useState<Array<UserValue>>([])
  const [royalties, setRoyalties] = useState<Array<Royalty>>([])
  const [totalRoyaltyShares, setTotalRoyaltiesShare] = useState<number>(0)
  const [isShowErrors, setIsShowErrors] = useState<boolean>(false)

  useEffect(() => {
    if (publicKey) {
      initializeComponent()
    }
  }, [])

  useEffect(() => {
    if (nftMintingData.creators.length > 0) {
      const initCreator = nftMintingData.creators.map((creator: any) => {
        const key = creator.address
        return {
          key,
          label: key,
          value: key,
          share: creator.share
        }
      })

      setFixedCreators(initCreator)
      setRoyalties(
        initCreator.map((creator: any) => ({
          creatorKey: creator.key,
          amount: creator.share
        }))
      )
    }
  }, [nftMintingData.creators])

  useEffect(() => {
    if (visible) {
      setRoyalties(
        [...fixedCreators, ...creators].map((creator) => ({
          creatorKey: creator.key,
          amount: Math.trunc(100 / [...fixedCreators, ...creators].length)
        }))
      )
    }
  }, [creators, fixedCreators])

  useEffect(() => {
    // When royalties changes, sum up all the amounts.
    const total = royalties.reduce((totalShares, royalty) => totalShares + royalty.amount, 0)

    setTotalRoyaltiesShare(total)
  }, [royalties])

  const initializeComponent = () => {
    const key = publicKey.toBase58()
    if (nftMintingData.creators.length === 0 && fixedCreators.length === 0 && creators.length === 0) {
      initializeCreator(key)
    } else {
      handleSetCurrentCreators(key, nftMintingData.creators)
    }
  }

  const initializeCreator = (key: string) => {
    const initCreator = [
      {
        key,
        label: key,
        value: key
      }
    ]
    setFixedCreators(initCreator)
    setRoyalties(
      //eslint-disable-next-line
      initCreator.map((creator) => ({
        creatorKey: key,
        amount: 100
      }))
    )
  }

  const handleSetCurrentCreators = (key: StringPublicKey, creatorsFromMetadata: Creator[]) => {
    const creators: UserValue[] = creatorsFromMetadata.map((c) => ({
      key: c.address,
      label: c.address,
      value: c.address
    }))

    setCreators(creators.filter((c) => c.key !== key))
    setFixedCreators(creators.filter((c) => c.key === key))
    setRoyalties(
      creatorsFromMetadata.map((creator) => ({
        creatorKey: creator.address,
        amount: creator.share
      }))
    )
  }

  const handleSaveCreatorInfo = () => {
    // Find all royalties that are invalid (0)
    const zeroedRoyalties = royalties.filter((royalty) => royalty.amount === 0)

    if (zeroedRoyalties.length !== 0 || totalRoyaltyShares !== 100) {
      // Contains a share that is 0 or total shares does not equal 100, show errors.
      setIsShowErrors(true)
      return
    }

    const creatorStructs: Creator[] = [...fixedCreators, ...creators].map(
      (c) =>
        new Creator({
          address: c.value as StringPublicKey,
          verified: c.value === publicKey?.toBase58(),
          share: royalties.find((r) => r.creatorKey === c.value)?.amount || Math.round(100 / royalties.length)
        })
    )

    //eslint-disable-next-line
    const share = creatorStructs.reduce((acc, el) => (acc += el.share), 0)

    if (share > 100 && creatorStructs.length) {
      creatorStructs[0].share -= share - 100
    }

    setNftMintingData({
      ...nftMintingData,
      creators: creatorStructs
    })

    handleSubmit()
  }

  const handleRemoveCreator = (key: any) => {
    setCreators((prev) => prev.filter((cr) => cr.key !== key))
    setFixedCreators((prev) => prev.filter((cr) => cr.key !== key))
  }

  const handleAddCreator = () => {
    const existingKeys = [...creators.map((c) => c.key), ...fixedCreators.map((c) => c.key)]
    if (inputVal.length > 0 && !existingKeys.includes(inputVal)) {
      setCreators((prev) => [
        ...prev,
        {
          key: inputVal,
          label: inputVal,
          value: inputVal
        }
      ])

      setInputVal(undefined)
    }
  }

  return (
    <>
      <STYLED_POPUP
        width="532px"
        height={'auto'}
        title={null}
        visible={visible}
        onCancel={() => {
          if (publicKey) {
            initializeComponent()
          }
          handleCancel()
        }}
        closeIcon={
          <div>
            <img className="close-white-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
          </div>
        }
        footer={null}
      >
        <h3 className="title">Set royalties and splits</h3>
        <div>
          <Row className="">
            <p>Royalties ensure that you continue to get compensated for your work after its initial sale.</p>
          </Row>
          <Row className="">
            <Col span={18}>
              <span className="">Royalty Percentage</span>
              <p>This is how much of each secondary sale will be paid out to the creators.</p>
            </Col>
            <Col span={6}>
              <InputNumber
                autoFocus
                min={0}
                max={100}
                placeholder=" 0 - 100"
                onChange={(val: number) => {
                  setNftMintingData({
                    ...nftMintingData,
                    sellerFeeBasisPoints: val * 100
                  })
                }}
                className="royalties-input"
                value={nftMintingData.sellerFeeBasisPoints / 100 || ''}
              />
            </Col>
          </Row>
          {[...fixedCreators, ...creators].length > 0 && (
            <Row>
              <label className="action-field" style={{ width: '100%' }}>
                <span className="field-title">Creators Split</span>
                <p>
                  This is how much of the proceeds from the initial sale and any royalties will be split out
                  amongst the creators.
                </p>
                <RoyaltiesSplitter
                  creators={[...fixedCreators, ...creators]}
                  royalties={royalties}
                  setRoyalties={setRoyalties}
                  removeCreator={handleRemoveCreator}
                  isShowErrors={isShowErrors}
                />
              </label>
            </Row>
          )}
          <Row>
            <InfoInput
              type="input"
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={'Paste Creator Public Key Here'}
              value={inputVal}
            />
          </Row>
          <Row justify="end">
            <BUTTON_PLUS_WRAPPER
              onClick={handleAddCreator}
              disabled={!inputVal || inputVal.length === 0}
              className="add-more"
            >
              <span>Add Creator</span>
            </BUTTON_PLUS_WRAPPER>
          </Row>
          {isShowErrors && totalRoyaltyShares !== 100 && (
            <Row>
              <Text type="danger">
                The split percentages for each creator must add up to 100%. Current total split percentage is{' '}
                {totalRoyaltyShares}%.
              </Text>
            </Row>
          )}
          <STYLED_CREATE_BTN className="create-collection-btn" onClick={handleSaveCreatorInfo} disabled={false}>
            Save Creator Info
          </STYLED_CREATE_BTN>
        </div>
      </STYLED_POPUP>
    </>
  )
}

export default React.memo(RoyaltiesStep)

interface IRoylatySplit {
  creators: Array<UserValue>
  royalties: Array<Royalty>
  setRoyalties: (arr: any[]) => void
  removeCreator: (key: string) => void
  isShowErrors?: boolean
}

const RoyaltiesSplitter = ({ creators, royalties, setRoyalties, isShowErrors, removeCreator }: IRoylatySplit) => (
  <Col>
    <Row gutter={[0, 24]}>
      {creators.map((creator, idx) => {
        const royalty = royalties.find((royalty) => royalty.creatorKey === creator.key)
        if (!royalty) return null

        const amt = royalty.amount

        const handleChangeShare = (newAmt: number) =>
          setRoyalties(
            royalties.map((_royalty) => ({
              ..._royalty,
              amount: _royalty.creatorKey === royalty.creatorKey ? newAmt : _royalty.amount
            }))
          )

        return (
          <CREATOR_CONTAINER key={idx}>
            <div className="close-btn" onClick={() => removeCreator(creator.key)}>
              <img className="close-white-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
            </div>

            <div className={'label'}>{truncateAddress(creator.label)}</div>

            <div className={'slider'}>
              <Slider value={amt} onChange={handleChangeShare} />
            </div>

            <div className={'input'}>
              <InputNumber<number>
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                value={amt}
                parser={(value) => parseInt(value?.replace('%', '') ?? '0')}
                onChange={handleChangeShare}
                className="royalties-input"
              />
            </div>

            {isShowErrors && amt === 0 && (
              <div>
                <Text type="danger">The split percentage for this creator cannot be 0%.</Text>
              </div>
            )}
          </CREATOR_CONTAINER>
        )
      })}
    </Row>
  </Col>
)
