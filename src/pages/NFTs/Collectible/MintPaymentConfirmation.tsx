import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { MintLayout } from '@solana/spl-token'
import { Connection } from '@solana/web3.js'
import { LAMPORT_MULTIPLIER, MAX_METADATA_LEN, getAssetCostToStore } from '../../../web3'
import { IMetadataContext } from '../../../types/nft_details.d'
import { Loader } from '../../../components'

const CONTAINER = styled.div`
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1e1e1e;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1000;

  .upload-NFT-back-icon {
    position: absolute;
    top: 32px;
    left: 32px;
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
const LOADER = styled.div`
  position: relative;
  height: 60px;
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
`
const NEXT_BUTTON = styled.button`
  height: 60px;
  width: 245px;
  padding: ${({ theme }) => `${theme.margin(2)} ${theme.margin(6)}`};
  text-align: center;
  background-color: ${({ theme }) => theme.secondary5};
  border: none;
  ${({ theme }) => theme.roundedBorders};
  cursor: pointer;

  &:disabled {
    background-color: #7d7d7d;
  }
`

const MintPaymentConfirmation = (props: {
  confirm: () => void
  attributes: IMetadataContext
  files: File[]
  connection: Connection
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
      getAssetCostToStore([...files, new File([JSON.stringify(metadata)], 'metadata.json')]).then(async (lamports) => {
        const sol = lamports / LAMPORT_MULTIPLIER

        // TODO: cache this and batch in one call
        const [mintRent, metadataRent] = await rentCall

        // const uriStr = 'x';
        // let uriBuilder = '';
        // for (let i = 0; i < MAX_URI_LENGTH; i++) {
        //   uriBuilder += uriStr;
        // }

        const additionalSol = (metadataRent + mintRent) / LAMPORT_MULTIPLIER

        // TODO: add fees based on number of transactions and signers
        setCost(sol + additionalSol)
      })
  }, [files, metadata, setCost])

  return (
    <CONTAINER>
      <img
        className="upload-NFT-back-icon"
        src={`/img/assets/arrow.svg`}
        alt="back"
        onClick={() => props.returnToDetails(false)}
      />
      <div>
        <h2>2. Calculate Mint Cost</h2>
      </div>
      <Row className="content-action" justify="space-around">
        <Col className="section" style={{ minWidth: 300 }}>
          <div>
            <h3>Royalty Percentage</h3>
            <p>{props.attributes.sellerFeeBasisPoints / 100}%</p>
          </div>
          <h3>Cost to Mint</h3>
          {cost ? (
            <p>
              <span style={{ marginRight: '8px' }}>
                <img src={`/img/assets/SOL-icon.svg`} alt={'sol-symbol'} />
              </span>
              {cost.toFixed(5)}
            </p>
          ) : (
            <LOADER>
              <Loader />
            </LOADER>
          )}
        </Col>
      </Row>
      <Row justify="center">
        <NEXT_BUTTON onClick={props.confirm}>
          <span>Mint NFT</span>
        </NEXT_BUTTON>
      </Row>
    </CONTAINER>
  )
}

export default MintPaymentConfirmation
