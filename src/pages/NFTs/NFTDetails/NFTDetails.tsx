import React, { FC, useCallback, useMemo } from 'react'
import { Row, Col } from 'antd'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useNFTDetails } from '../../../context'
import { RightSection } from './RightSection'
import { LeftSection } from './LeftSection'
import { NFTDetailsProviderMode, MintItemViewStatus, INFTMetadata } from '../../../types/nft_details'

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
      top: 40px;
      left: 30px;
      transform: rotate(90deg);
      width: 25px;
      filter: ${theme.filterBackIcon};
      cursor: pointer;
    }
    .nd-details {
      height: 100%;
    }
  `};
`

export const NFTDetails: FC<{
  mode?: NFTDetailsProviderMode
  handleClickPrimaryButton?: () => void
  status?: MintItemViewStatus
  backUrl?: string
  arbData?: INFTMetadata
}> = ({ mode, status = '', backUrl, handleClickPrimaryButton, ...rest }) => {
  const history = useHistory()
  const { general } = useNFTDetails()

  const currentMode = useMemo(() => {
    // asserts component renders as a result
    // of clicking nft in profile wallet
    if (!mode && !general.non_fungible_id) {
      return 'my-external-NFT'
    } else {
      return mode
    }
  }, [])

  // TODO: if param "nftMintAddress" is present, make a web3 call to get data and metadata
  // getParsedAccountByMint(nftMintAddress) then setGeneral() and setNftMetadata()

  const setPrimaryButtonClick = useCallback(() => {
    return currentMode === 'my-external-NFT' && !handleClickPrimaryButton
      ? history.push(`/NFTs/sell/${general.mint_address}`)
      : handleClickPrimaryButton()
  }, [general])

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

      <Row gutter={[12, 16]} className="nd-content" justify="space-around">
        <Col sm={9} xl={9} xxl={6} className="nd-preview">
          <LeftSection mode={mode} />
        </Col>
        <Col sm={12} xl={9} xxl={7} className="nd-details">
          <RightSection mode={currentMode} status={status} handleClickPrimaryButton={setPrimaryButtonClick} />
        </Col>
      </Row>
    </NFT_DETAILS>
  )
}
