import React, { FC, useEffect } from 'react'
import { Row, Col } from 'antd'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useNFTDetails, useConnectionConfig } from '../../../context'
import { FloatingActionButton } from '../../../components'
import { RightSection } from './RightSection'
import { ImageShowcase } from './ImageShowcase'
import { MintItemViewStatus, INFTMetadata } from '../../../types/nft_details'
import { IAppParams } from '../../../types/app_params.d'
import { FLOATING_ACTION_ICON } from '../../../styles'
import { checkMobile } from '../../../utils'

const NFT_DETAILS = styled.div`
  position: relative;
  height: 100%;
  margin: 0 auto;

  .nd-content {
    height: 100%;
  }
`

export const NFTDetails: FC<{
  handleClickPrimaryButton?: (type: string) => void
  status?: MintItemViewStatus
  backUrl?: string
  arbData?: INFTMetadata
}> = ({ status = '', ...rest }) => {
  const history = useHistory()
  const { general, nftMetadata, fetchGeneral } = useNFTDetails()
  const { connection } = useConnectionConfig()
  const params = useParams<IAppParams>()

  useEffect(() => {
    if (general === undefined && nftMetadata === undefined) {
      fetchGeneral(params.nftMintAddress, connection)
    }

    return null
  }, [])

  return (
    <NFT_DETAILS {...rest}>
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
        <FloatingActionButton height={40} onClick={() => history.goBack()}>
          <FLOATING_ACTION_ICON src={`/img/assets/arrow.svg`} alt="back" />
        </FloatingActionButton>
      </div>
      {!checkMobile() ? (
        <Row gutter={[12, 16]} className="nd-content" justify="space-around" align="middle">
          <Col sm={10} xl={9} xxl={8}>
            <ImageShowcase />
          </Col>
          <Col sm={10} xl={9} xxl={7} className="nd-details">
            <RightSection status={status} />
          </Col>
        </Row>
      ) : (
        <>
          <ImageShowcase />
          <RightSection status={status} />
        </>
      )}
    </NFT_DETAILS>
  )
}
