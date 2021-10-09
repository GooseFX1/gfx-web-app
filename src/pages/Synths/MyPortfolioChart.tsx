import { FC } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'

const WRAPPER = styled.div`
  height: fit-content;
  padding: 25px 0px 0px 0px;
  color: ${({ theme }) => theme.text1};
`

const TITLE = styled.span`
  font-size: 15px;
  font-weight: 500;
  padding-bottom: 5px;
  color: ${({ theme }) => theme.text1};
`

const AMOUNT = styled.span`
  font-size: 15px;
  font-weight: bold;
  padding-bottom: 5px;
  color: ${({ theme }) => theme.text1};
`

const DATE = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text1};
`
const POSITION = styled.div`
  margin-left: 15px;
  padding-bottom: 5px;
`

export const MyPortfolioChart: FC = () => {
  return (
    <WRAPPER>
      <Col span={24}>
        <Row align={'middle'}></Row>
      </Col>
    </WRAPPER>
  )
}
