import { FC } from 'react'
import styled, { css } from 'styled-components'
import { Frame } from '../../../components/Frame'
import { Col, Row } from 'antd'
import { MainButton } from '../../../components'
import { SwapBut } from '../../../components/SwapBut'

import { SwapSwitch } from '../../../components/SwapSwitch'
import { SwapFrame } from '../../../components/SwapFrame'

const TITLEBOX = styled.div`
  color: white;
  height: 100px;
  width: auto;
`
const BODY = styled.div`
  position: relative;
  ${({ theme }) => theme.flexColumnNoWrap}
  justify-content: space-between;
  ${({ theme }) => theme.measurements('100%')}
  margin: ${({ theme }) => theme.margins['4x']} 0;
`

const LEFTCOLTEXT = styled.span`
  color: white;
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 15px;
`

const RIGHTCOLTEXT = styled.span`
  color: white;
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 15px;
`
const SPACE = styled.div`
  height: 50px;
`
const SPAN = styled.div`
  width: '100%';
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
`

export const SwapView: FC = () => {
  const localCSS = css`
    .ant-input {
      height: '65px';
      border-radius: 45px;
      border: none;
      padding-right: 20px;
      font-size: 16px;
    }
  `
  return <div>A</div>
  /* return (
    <SwapFrame
      rowGutterValue={25}
      firstColFlexValue={2}
      secondColFlexValue={2}
      midColFlexValue={4}
      leftJustifyValue={'space-between'}
      rightJustifyValue={'start'}
      buttonJustifyValue={'end'}
      firstTitle={
        <Row justify={'space-between'} style={{ width: '90%', marginLeft: 15 }}>
          <LEFTCOLTEXT>From:</LEFTCOLTEXT>
          <LEFTCOLTEXT>UseMax</LEFTCOLTEXT>
        </Row>
      }
      firstChild={
        <Col>
          <SwapBut />
          <SPAN>
            <span style={{ marginTop: 10, fontSize: 10, color: 'white', textAlign: 'right' }}>gUSD Value</span>
          </SPAN>
        </Col>
      }
      secondTitle={
        <Row style={{ width: '90%', marginLeft: 20 }}>
          <RIGHTCOLTEXT>To</RIGHTCOLTEXT>
        </Row>
      }
      midChild={<SwapSwitch></SwapSwitch>}
      secondChild={
        <Col>
          <SwapBut />
          <SPAN>
            <span style={{ marginTop: 10, fontSize: 10, color: 'white', textAlign: 'right' }}>gUSD Value</span>
          </SPAN>
        </Col>
      }
      button={
        <div style={{ marginTop: 35 }}>
          <MainButton height="50px" onClick={() => null} status="action" width="175px">
            <span>Swap</span>
          </MainButton>
        </div>
      }
    ></SwapFrame>
  ) */
}
