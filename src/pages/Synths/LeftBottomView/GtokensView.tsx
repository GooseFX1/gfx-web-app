import { Col, Row } from 'antd'
import { FC } from 'react'
import styled from 'styled-components'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
  ${({ theme }) => theme.mediaWidth.fromLarge`
  height: auto;
  width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
height: auto;
width: 100%;
`};
`
const BOTTOMTAB = styled.div``

export const GtokensView: FC = () => {
  return (
    <WRAPPER>
      <Row
        justify={'space-between'}
        align={'bottom'}
        style={{
          height: 50,
          backgroundColor: '#121212',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignSelf: 'flex-end',
          paddingBottom: 10
        }}
      >
        <Col flex={1}>Market</Col>
        <Col flex={1}>Current Price</Col>
        <Col flex={1}>Average Price</Col>
        <Col flex={1}>Amount</Col>
        <Col flex={1}>Profit/Loss</Col>
        <Col flex={1}>Debt</Col>
      </Row>
    </WRAPPER>
  )
}
