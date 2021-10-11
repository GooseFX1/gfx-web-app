import { FC } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { Tooltip } from '../../../components/Tooltip'

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

export const Header: FC = () => {
  return (
    <WRAPPER>
      <Col span={24}>
        <Row align={'middle'}>
          <TITLE>My Portfolio</TITLE>
          <POSITION>
            <Tooltip>
              The minimum amount on how many tokens you will accept, in the event that the price increases or decreases.
            </Tooltip>
          </POSITION>
        </Row>
        <Row>
          <AMOUNT>1,000,000 gUSD</AMOUNT>
        </Row>
        <Row>
          <DATE>30/12/16</DATE>
        </Row>
      </Col>
    </WRAPPER>
  )
}
