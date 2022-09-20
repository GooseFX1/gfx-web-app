import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Row } from 'antd'
import { MintLayout } from '@solana/spl-token-v2'
import { Connection } from '@solana/web3.js'
import { LAMPORT_MULTIPLIER, MAX_METADATA_LEN, getAssetCostToStore } from '../../../web3'
import { IMetadataContext } from '../../../types/nft_details.d'
import { Loader } from '../../../components'
import { PopupCustom } from '../Popup/PopupCustom'

const CUSTOM_CONTAINER = styled(PopupCustom)`
  ${({ theme }) => `
    * {
      font-family: 'Montserrat';
    }
    background: transparent;
    .ant-modal-body {
      ${theme.largeBorderRadius}
      padding: 0;
      background-color: ${theme.bg3};
    }
    .body-wrap {
      padding: ${theme.margin(4)};
    }
    .btn-wrap {
      margin-top: ${theme.margin(3.5)};
      padding: ${theme.margin(2.5)} ${theme.margin(4)};
      background: rgba(64, 64, 64, 0.22);
      border-radius: 0 0 20px 20px;
    }
    .ant-modal-close {
      right: 30px;
      top: 35px;
      left: auto;
    }
    .desc {
      color: ${theme.text12};
      font-family: Montserrat;
      font-size: 16px;
      font-weight: 500;
    }
  `}
`

const LOADER = styled.div`
  position: relative;
  height: 54px;
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
`
const MINT_BUTTON = styled.button`
  width: 508px;
  height: 60px;
  padding: ${({ theme }) => `${theme.margin(2)} ${theme.margin(6)}`};
  text-align: center;
  background-color: ${({ theme }) => theme.secondary5};
  border: none;
  ${({ theme }) => theme.roundedBorders};
  cursor: pointer;

  span {
    font-weight: 700;
  }

  &:disabled {
    background-color: #7d7d7d;
  }
`
const DISPLAY_NUMBER = styled.span`
  font-size: 58.7px;
  font-weight: 600;
  line-height: 54px;
  margin: 0px ${({ theme }) => theme.margin(1)};
  color: ${({ theme }) => theme.text7};
`
const HEADER = styled.span`
  margin-bottom: ${({ theme }) => theme.margin(2)};
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.text7};
`
const TITLE = styled.p`
  color: ${({ theme }) => theme.text7};
  font-size: 30px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.margin(5)};
`
const TICKER = styled.span`
  font-size: 25.8px;
  font-weight: 600;
  color: ${({ theme }) => theme.text7};
`
const SOL_ICON = styled.span`
  img {
    width: 50px;
    height: 50px;
  }
`

const MintPaymentConfirmation = (props: {
  confirm: () => void
  attributes: IMetadataContext
  files: File[]
  connection: Connection
  visible: boolean
  returnToDetails: (bool: boolean) => void
}): JSX.Element => {
  const [cost, setCost] = useState(0)
  const files = props.files
  const metadata = props.attributes

  useEffect(() => {
    const rentCall = Promise.all([
      props.connection.getMinimumBalanceForRentExemption(MintLayout.span),
      props.connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN)
    ])
    if (files.length)
      getAssetCostToStore([...files, new File([JSON.stringify(metadata)], 'metadata.json')]).then(
        async (lamports) => {
          const sol = lamports / LAMPORT_MULTIPLIER

          // TODO: cache this and batch in one call
          const [mintRent, metadataRent] = await rentCall

          const additionalSol = (metadataRent + mintRent) / LAMPORT_MULTIPLIER

          // TODO: add fees based on number of transactions and signers
          setCost(sol + additionalSol)
        }
      )
  }, [files, metadata, setCost])

  useEffect(() => () => setCost(0), [props.visible])

  return (
    <CUSTOM_CONTAINER
      width="500px"
      height="800px"
      title={null}
      visible={props.visible}
      onCancel={() => props.returnToDetails(false)}
      footer={null}
      closeIcon={
        <div>
          <img className="close-white-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
        </div>
      }
      centered
    >
      <div className="body-wrap">
        <Row className="content-action" justify="center">
          <TITLE className="title">Review Details</TITLE>
        </Row>
        <Row className="content-action" justify="center">
          <HEADER>Royalty Percentage</HEADER>
        </Row>
        <Row className="content-action" justify="center">
          <DISPLAY_NUMBER>{props.attributes.sellerFeeBasisPoints / 100}%</DISPLAY_NUMBER>
        </Row>
        <br />
        <br />
        <br />

        <Row className="content-action" justify="center">
          <HEADER>Cost to Mint</HEADER>
        </Row>
        {cost !== 0 ? (
          <Row className="content-action" justify="center" align="bottom">
            <SOL_ICON style={{ marginRight: '8px' }}>
              <img src={`/img/assets/SOL-icon.svg`} alt={'sol-symbol'} />
            </SOL_ICON>
            <DISPLAY_NUMBER>{cost.toFixed(5)}</DISPLAY_NUMBER>
            <TICKER>SOL</TICKER>
          </Row>
        ) : (
          <Row className="content-action" justify="center" align="middle">
            <LOADER>
              <Loader />
            </LOADER>
          </Row>
        )}
        <br />
        <br />
        <Row justify="center">
          <MINT_BUTTON onClick={props.confirm}>
            <span>Mint NFT</span>
          </MINT_BUTTON>
        </Row>
      </div>
    </CUSTOM_CONTAINER>
  )
}

export default MintPaymentConfirmation
