import React, { FC, useEffect } from 'react'
import { Row, Col } from 'antd'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useNFTDetails, useConnectionConfig } from '../../../context'
import { MintItemViewStatus, INFTMetadata } from '../../../types/nft_details'
import { useParams } from 'react-router-dom'
import { IAppParams } from '../../../types/app_params'
import { NestQuestLeftSection } from './NestQuestLeftSection'
import { NestQuestRightSection } from './NestQuestRightSection'

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

export const NestQuestSingleListing: FC<{
  handleClickPrimaryButton?: (type: string) => void
  status?: MintItemViewStatus
  backUrl?: string
  arbData?: INFTMetadata
}> = ({ status = '', backUrl, handleClickPrimaryButton, ...rest }) => {
  const history = useHistory()
  const { general, nftMetadata, fetchGeneral } = useNFTDetails()
  const { connection } = useConnectionConfig()
  const params = useParams<IAppParams>()

  useEffect(() => {
    if (general === undefined && nftMetadata === undefined) {
      fetchGeneral('54692', connection)
    }

    return () => {}
  }, [])

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
        <Col sm={9} xl={9} xxl={8}>
          <NestQuestLeftSection />
        </Col>
        <Col sm={12} xl={9} xxl={7} className="nd-details">
          <NestQuestRightSection status={status} />
        </Col>
      </Row>
    </NFT_DETAILS>
  )
}
