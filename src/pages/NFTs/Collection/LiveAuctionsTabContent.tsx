import { Col, Row } from 'antd'
import { FC } from 'react'
import styled from 'styled-components'
import { Card } from './Card'
import { liveAuctionsNFTs } from './mockData'

const LIVE_AUCTIONS_TAB = styled(Row)`
  overflow-x: auto;
  padding-top: ${({ theme }) => theme.margins['5.5x']};
  padding-left: ${({ theme }) => theme.margins['4x']};

  &::-webkit-scrollbar {
    display: none;
  }
`

export const LiveAuctionsTabContent: FC = ({ ...rest }) => {
  return (
    <LIVE_AUCTIONS_TAB {...rest}>
      <Row wrap={false} gutter={43}>
        {liveAuctionsNFTs.map((item) => (
          <Col>
            <Card type="carousel" key={item.id} data={item} />
          </Col>
        ))}
      </Row>
    </LIVE_AUCTIONS_TAB>
  )
}
