import React from 'react'
import { Col, Row, Image } from 'antd'
import styled from 'styled-components'
import { Card } from './Card'
import { NFTsData } from './mockData'
import { useHistory } from 'react-router-dom'

interface TabProps {
  type: string
}

const TABS = styled.div<TabProps>`
  ${({ type }) => (type === 'live-auctions' ? 'overflow-x: auto;' : 'overflow-y: auto;')}

  padding: ${({ theme }) => `${theme.margins['5.5x']} ${theme.margins['4x']}`};

  ${({ type, theme }) => {
    return type !== 'owners' && type !== 'live-auctions'
      ? `
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: ${theme.margins['6x']};`
      : `
      display: flex;
      flex-flow: row wrap;
      `
  }}

  .owners-tab-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .owners-tab-name {
    color: ${({ theme }) => theme.text1};
    margin-top: ${({ theme }) => theme.margins['1.5x']};
  }

  &::-webkit-scrollbar {
    display: none;
  }
`

interface Props {
  type: string
  data?: Array<number>
}

export const TabContent = ({ data, type, ...rest }: Props) => {
  const history = useHistory()
  const goToLiveAuctionDetails = (id: string): void => history.push(`/NFTs/live-auction/${id}`)

  return (
    <TABS {...rest} type={type}>
      {type === 'live-auctions' && (
        <Row wrap={false} gutter={43}>
          {NFTsData.map((item) => (
            <Col onClick={() => goToLiveAuctionDetails(item.id)}>
              <Card type="carousel" key={item.id} data={item} />
            </Col>
          ))}
        </Row>
      )}
      {type === 'fixed-price' && (
        <>
          {NFTsData.map((item) => (
            <Card type="grid" key={item.id} data={item} />
          ))}
        </>
      )}
      {type === 'open-bids' && (
        <>
          {NFTsData.map((item) => (
            <Card type="grid" key={item.id} data={item} />
          ))}
        </>
      )}
      {type === 'owners' && (
        <>
          {[...Array(100).keys()].map((item) => (
            <Col span={3} key={item}>
              <Image
                className="owners-tab-avatar"
                preview={false}
                src={`${process.env.PUBLIC_URL}/img/assets/avatar@3x.png`}
                fallback={`${process.env.PUBLIC_URL}/img/assets/avatar@3x.png`}
                alt=""
              />
              <div className="owners-tab-name">Owner Name</div>
            </Col>
          ))}
        </>
      )}
    </TABS>
  )
}
