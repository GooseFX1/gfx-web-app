import { FC } from 'react'
import styled from 'styled-components'
import { Row, Col, Progress } from 'antd'
import { Tooltip } from '../../../components/Tooltip'
import { useDarkMode } from '../../../context'

const WRAPPER = styled.div`
  height: 150px;
  padding: 25px 0px 0px 0px;
  color: ${({ theme }) => theme.text1};
`

const TITLE = styled.span`
  font-size: 15px;
  font-weight: 500;
  padding-bottom: 30px;
  color: ${({ theme }) => theme.text1};
`
const DATA = styled.span`
  display: flex;
  justify-content: left;
  width: 50px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text1};
`
const NUMBER = styled.span`
  font-size: 11px;
  display: flex;
  justify-content: right;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};
  ${({ theme }) => theme.mediaWidth.fromLarge`
  
  width: 125px;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
 
  width: 110px;
`};
`
const POSITION = styled.div`
  display: flex;
  justify-content: left;
`
const WIDGETWRAP = styled.div`
  padding-bottom: 25px;
`

const PROGRESS = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 2px;
  margin-right: 2px;
  ${({ theme }) => theme.mediaWidth.fromLarge`
  
  width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
 
  width: 100%;
`};
`

export const MyStats: FC = () => {
  const { mode } = useDarkMode()
  const value = mode === 'dark' ? '#1e1e1e' : '#e2e2e2'
  return (
    <WRAPPER>
      <Col span={24}>
        <Row>
          <TITLE>My Stats</TITLE>
        </Row>
        <WIDGETWRAP>
          <Row align={'middle'}>
            <Col flex={1}>
              <DATA>Debt</DATA>
            </Col>
            <Col flex={1}>
              <POSITION>
                <Tooltip>
                  The minimum amount on how many tokens you will accept, in the event that the price increases or
                  decreases.
                </Tooltip>
              </POSITION>
            </Col>
            <Col flex={5}>
              <PROGRESS>
                <Progress percent={50} showInfo={false} strokeWidth={16} strokeColor={'#5654f2'} trailColor={value} />
              </PROGRESS>
            </Col>
            <Col flex={1}>
              <NUMBER>000,000.00 USD</NUMBER>
            </Col>
          </Row>
        </WIDGETWRAP>
        <WIDGETWRAP>
          <Row align={'middle'}>
            <Col flex={1}>
              <DATA>Collateral</DATA>
            </Col>
            <Col flex={1}>
              <POSITION>
                <Tooltip>
                  The minimum amount on how many tokens you will accept, in the event that the price increases or
                  decreases.
                </Tooltip>
              </POSITION>
            </Col>
            <Col flex={5}>
              <PROGRESS>
                <Progress percent={30} showInfo={false} strokeWidth={16} strokeColor={'#cf5ae8'} trailColor={value} />
              </PROGRESS>
            </Col>
            <Col flex={1}>
              <NUMBER>000,000.00 USD</NUMBER>
            </Col>
          </Row>
        </WIDGETWRAP>
        <WIDGETWRAP>
          <Row align={'middle'}>
            <Col flex={1}>
              <DATA>C-Ratio</DATA>
            </Col>
            <Col flex={1}>
              <POSITION>
                <Tooltip>
                  The minimum amount on how many tokens you will accept, in the event that the price increases or
                  decreases.
                </Tooltip>
              </POSITION>
            </Col>
            <Col flex={5}>
              <PROGRESS>
                <Progress percent={60} showInfo={false} strokeWidth={16} strokeColor={'#bb7535'} trailColor={value} />
              </PROGRESS>
            </Col>
            <Col flex={1}>
              <NUMBER>125% / No Minting</NUMBER>
            </Col>
          </Row>
        </WIDGETWRAP>
      </Col>
    </WRAPPER>
  )
}
