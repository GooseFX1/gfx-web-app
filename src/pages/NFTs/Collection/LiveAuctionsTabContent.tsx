import { Col, Row } from 'antd'
import { FC } from 'react'
import styled, { css } from 'styled-components'
import { Card } from './Card'
import { NFTsData } from './mockData'
import { useHistory } from 'react-router-dom'

const LIVE_AUCTIONS_TAB = styled(Row)`
  ${({ theme }) => css`
    overflow-x: auto;
    padding-top: ${theme.margins['5.5x']};
    padding-bottom: ${theme.margins['5.5x']};
    padding-left: ${theme.margins['4x']};

    &::-webkit-scrollbar {
      display: none;
    }
  `}
`

export const LiveAuctionsTabContent: FC = ({ ...rest }) => {
  const history = useHistory()
  const goToLiveAuctionDetails = (id: string): void => history.push(`/NFTs/live-auction/${id}`)

  return (
    <LIVE_AUCTIONS_TAB {...rest}>
      <Row wrap={false} gutter={43}>
        {NFTsData.map((item) => (
          <Col onClick={() => goToLiveAuctionDetails(item.id)}>
            <Card type="carousel" key={item.id} data={item} />
          </Col>
        ))}
      </Row>
    </LIVE_AUCTIONS_TAB>
  )
}
