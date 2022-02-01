import React from 'react'
import { Row } from 'antd'
import { FC } from 'react'
import { useHistory } from 'react-router'
import styled, { css } from 'styled-components'
import { RightSection } from './RightSection'
import { LeftSection } from './LeftSection'
import { NFTDetailsProviderMode, MintItemViewStatus } from '../../../types/nft_details'

const NFT_DETAILS = styled.div`
  ${({ theme }) => css`
    position: relative;
    height: 71vh;
    padding: ${theme.margins['9x']} ${theme.margins['11x']} ${theme.margins['3x']} ${theme.margins['11x']};
    margin: 0 auto;
    background-color: ${theme.nftDetailBackground};
    overflow-y: auto;
    ${theme.flexCenter}

    .nd-content-wrapper {
      width: 100%;
      max-width: 1052px;
      margin: 0 auto;
    }

    .nd-back-icon {
      position: absolute;
      top: 40px;
      left: 30px;
      transform: rotate(90deg);
      width: 25px;
      filter: ${theme.filterBackIcon};
      cursor: pointer;
    }

    .nd-content {
      height: 100%;
      margin-top: 150px;
    }

    .nd-preview {
      width: 100%;
      max-width: 456px;
    }

    .nd-details {
      width: 100%;
      max-width: 430px;
    }
  `}
`

export const NFTDetails: FC<{
  mode: NFTDetailsProviderMode
  handleClickPrimaryButton: () => void
  status?: MintItemViewStatus
  backUrl?: string
}> = ({ mode, status = '', backUrl, handleClickPrimaryButton, ...rest }) => {
  const history = useHistory()

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
      <div className="nd-content-wrapper">
        <Row className="nd-content" justify="space-between">
          <div className="nd-preview">
            <LeftSection mode={mode} />
          </div>
          <div className="nd-details">
            <RightSection mode={mode} status={status} handleClickPrimaryButton={handleClickPrimaryButton} />
          </div>
        </Row>
      </div>
    </NFT_DETAILS>
  )
}
