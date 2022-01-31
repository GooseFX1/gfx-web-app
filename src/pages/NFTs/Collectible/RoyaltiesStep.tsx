import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { Row, Col, Slider, InputNumber, Typography } from 'antd'
import { PopupCustom } from '../Popup/PopupCustom'
import { Creator, StringPublicKey } from '../../../web3'
import { MainText } from '../../../styles'
const { Text } = Typography

//#region styles
const STYLED_POPUP = styled(PopupCustom)`
  * {
    font-family: 'Montserrat';
  }
  .ant-input-number {
    width: 100%;
  }
  ${({ theme }) => `
    .ant-modal-body {
      padding: ${theme.margins['3.5x']} ${theme.margins['6x']} ${theme.margins['4x']};
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
      margin-bottom: ${theme.margins['4x']};
    }
  `}
`
const TITLE = MainText(styled.p`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.text8} !important;
  text-align: left;
  margin-bottom: ${({ theme }) => theme.margins['2x']};
`)

const STYLED_CREATE_BTN = styled.button<{ disabled: boolean }>`
  ${({ theme, disabled }) => `
    margin-top: ${theme.margins['3.5x']};
    width: 100%;
    font-size: 17px;
    font-weight: 600;
    line-height: 45px;
    height: 53px;
    ${theme.roundedBorders}
    border: none;
    background: ${disabled ? '#7d7d7d !important' : theme.btnNextStepBg};
    color: #fff !important;
    &:hover {
      background: ${disabled ? '#7d7d7d !important' : theme.btnNextStepBg};
      opacity: 0.8;
    }
  `}
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
  // const file = nftMintingData.image;
  const { publicKey, connected } = useWallet()
  const [creators, setCreators] = useState<Array<UserValue>>([])
  const [fixedCreators, setFixedCreators] = useState<Array<UserValue>>([])
  const [royalties, setRoyalties] = useState<Array<Royalty>>([])
  const [totalRoyaltyShares, setTotalRoyaltiesShare] = useState<number>(0)
  const [isShowErrors, setIsShowErrors] = useState<boolean>(false)

  useEffect(() => {
    if (publicKey) {
      const key = publicKey.toBase58()
      setFixedCreators([
        {
          key,
          label: key,
          value: key
        }
      ])
    }
  }, [])

  useEffect(() => {
    setRoyalties(
      [...fixedCreators, ...creators].map((creator) => ({
        creatorKey: creator.key,
        amount: Math.trunc(100 / [...fixedCreators, ...creators].length)
      }))
    )
  }, [creators, fixedCreators])

  useEffect(() => {
    // When royalties changes, sum up all the amounts.
    const total = royalties.reduce((totalShares, royalty) => {
      return totalShares + royalty.amount
    }, 0)

    setTotalRoyaltiesShare(total)
  }, [royalties])

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

  return (
    <>
      <STYLED_POPUP width="500px" height="596px" title={null} visible={visible} onCancel={handleCancel} footer={null}>
        <h3 className="title">Set royalties and splits</h3>
        <div>
          <Row className="" style={{ marginBottom: 20 }}>
            <p>Royalties ensure that you continue to get compensated for your work after its initial sale.</p>
          </Row>
          <Row className="" style={{ marginBottom: 20 }}>
            <label className="">
              <span className="">Royalty Percentage</span>
              <p>This is how much of each secondary sale will be paid out to the creators.</p>
              <InputNumber
                autoFocus
                min={0}
                max={100}
                placeholder="Between 0 and 100"
                onChange={(val: number) => {
                  setNftMintingData({
                    ...nftMintingData,
                    sellerFeeBasisPoints: val * 100
                  })
                }}
                className="royalties-input"
              />
            </label>
          </Row>
          {[...fixedCreators, ...creators].length > 0 && (
            <Row>
              <label className="action-field" style={{ width: '100%' }}>
                <span className="field-title">Creators Split</span>
                <p>
                  This is how much of the proceeds from the initial sale and any royalties will be split out amongst the
                  creators.
                </p>
                <RoyaltiesSplitter
                  creators={[...fixedCreators, ...creators]}
                  royalties={royalties}
                  setRoyalties={setRoyalties}
                  isShowErrors={isShowErrors}
                />
              </label>
            </Row>
          )}
          <Row>
            <span onClick={() => console.log(true)} style={{ padding: 10, marginBottom: 10 }}>
              <span
                style={{
                  color: 'white',
                  fontSize: 25,
                  padding: '0px 8px 3px 8px',
                  background: 'rgb(57, 57, 57)',
                  borderRadius: '50%',
                  marginRight: 5,
                  verticalAlign: 'middle'
                }}
              >
                +
              </span>
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  verticalAlign: 'middle',
                  lineHeight: 1
                }}
              >
                Add another creator
              </span>
            </span>
            {/* <MetaplexModal visible={showCreatorsModal} onCancel={() => setShowCreatorsModal(false)}>
              <label className="action-field" style={{ width: '100%' }}>
                <span className="field-title">Creators</span>
                <UserSearch setCreators={setCreators} />
              </label>
            </MetaplexModal> */}
          </Row>
          {isShowErrors && totalRoyaltyShares !== 100 && (
            <Row>
              <Text type="danger" style={{ paddingBottom: 14 }}>
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
  setRoyalties: Function
  isShowErrors?: boolean
}

const RoyaltiesSplitter = ({ creators, royalties, setRoyalties, isShowErrors }: IRoylatySplit) => {
  return (
    <Col>
      <Row gutter={[0, 24]}>
        {creators.map((creator, idx) => {
          const royalty = royalties.find((royalty) => royalty.creatorKey === creator.key)
          if (!royalty) return null

          const amt = royalty.amount

          const handleChangeShare = (newAmt: number) => {
            setRoyalties(
              royalties.map((_royalty) => {
                return {
                  ..._royalty,
                  amount: _royalty.creatorKey === royalty.creatorKey ? newAmt : _royalty.amount
                }
              })
            )
          }

          return (
            <Col span={24} key={idx}>
              <Row align="middle" gutter={[0, 4]} style={{ margin: '5px auto' }}>
                <Col span={10} style={{ padding: 10 }}>
                  {`${creator.label.substr(0, 4)}...${creator.label.substr(-4, 4)}`}
                </Col>
                <Col span={4}>
                  <InputNumber<number>
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                    value={amt}
                    parser={(value) => parseInt(value?.replace('%', '') ?? '0')}
                    onChange={handleChangeShare}
                    className="royalties-input"
                  />
                </Col>
                <Col span={10} style={{ paddingLeft: 12 }}>
                  <Slider value={amt} onChange={handleChangeShare} />
                </Col>
                {isShowErrors && amt === 0 && (
                  <Col style={{ paddingLeft: 12 }}>
                    <Text type="danger">The split percentage for this creator cannot be 0%.</Text>
                  </Col>
                )}
              </Row>
            </Col>
          )
        })}
      </Row>
    </Col>
  )
}
