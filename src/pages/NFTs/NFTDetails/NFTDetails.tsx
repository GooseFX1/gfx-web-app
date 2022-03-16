import React, { FC, useCallback, useMemo, useEffect } from 'react'
import { Row, Col } from 'antd'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useNFTDetails, useConnectionConfig } from '../../../context'
import { RightSection } from './RightSection'
import { LeftSection } from './LeftSection'
import { NFTDetailsProviderMode, MintItemViewStatus, INFTMetadata } from '../../../types/nft_details'
import { getParsedAccountByMint } from '../../../web3'
import { useParams } from 'react-router-dom'
import { IAppParams } from '../../../types/app_params.d'

const NFT_DETAILS = styled.div`
  height: 100%;
  margin: 0 auto;
  padding-top: ${({ theme }) => theme.margin(6)};

  .nd-content {
    height: 100%;
  }

  ${({ theme }) => css`
    .nd-back-icon {
      position: absolute;
      top: 132px;
      left: 30px;
      transform: rotate(90deg);
      width: 25px;
      filter: ${theme.filterBackIcon};
      cursor: pointer;
    }
    .nd-details {
    }
  `};
`

export const NFTDetails: FC<{
  mode?: NFTDetailsProviderMode
  handleClickPrimaryButton?: (type: string) => void
  status?: MintItemViewStatus
  backUrl?: string
  arbData?: INFTMetadata
}> = ({ mode, status = '', backUrl, handleClickPrimaryButton, ...rest }) => {
  const history = useHistory()
  const { general, setGeneral, nftMetadata, setNftMetadata } = useNFTDetails()
  const { connection } = useConnectionConfig()
  const params = useParams<IAppParams>()

  const currentMode = useMemo(() => {
    // asserts component renders as a result
    // of clicking nft in profile wallet
    if (!mode && !general?.non_fungible_id) {
      return 'my-external-NFT'
    } else {
      return mode
    }
  }, [])

  useEffect(() => {
    // async function getData() {
    //   if (params.nftMintAddress && (!general || !nftMetadata)) {
    //     let data = await getParsedAccountByMint({ mintAddress: params.nftMintAddress, connection })
    //     await fetchExternalNFTs(data.account.data.parsed.info.owner, connection, null, params.nftMintAddress)
    //   }
    // }

    // getData()

    return () => {}
  }, [])

  // TODO: if param "nftMintAddress" is present, make a web3 call to get data and metadata
  // getParsedAccountByMint(nftMintAddress) then setGeneral() and setNftMetadata()

  return (
    <NFT_DETAILS {...rest}>
      <img
        className="nd-back-icon"
        src={`/img/assets/arrow.svg`}
        alt="back"
        onClick={() => {
          backUrl ? history.push(backUrl) : history.goBack()
        }}
      />

      <Row gutter={[12, 16]} className="nd-content" justify="space-around" align="middle">
        <Col sm={9} xl={9} xxl={8} className="nd-preview">
          <LeftSection mode={mode} />
        </Col>
        <Col sm={12} xl={9} xxl={7} className="nd-details">
          <RightSection mode={currentMode} status={status} />
        </Col>
      </Row>
    </NFT_DETAILS>
  )
}
