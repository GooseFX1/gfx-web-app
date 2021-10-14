import { FC, ReactElement } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'

const WRAPPER = styled.div`
  height: '100%';
  width: '100%';
  padding-left: 30px;
  padding-right: 50px;
  margin: 20px;
`

const LEFTGRID = styled.div`
  margin: 20;
  padding: 20;
`
const RIGHTGRID = styled.div`
  margin: 20;
  padding: 20;
`

export const Frame: FC<{
  rowGutterValue: number
  firstColFlexValue: number
  secondColFlexValue: number
  leftJustifyValue: any
  rightJustifyValue: any
  buttonJustifyValue: any
  firstChild: ReactElement
  secondChild: ReactElement
  firstTitle: ReactElement
  secondTitle: ReactElement
  button: ReactElement
}> = ({
  rowGutterValue,
  firstColFlexValue,
  secondColFlexValue,
  leftJustifyValue,
  rightJustifyValue,
  buttonJustifyValue,
  firstChild,
  secondChild,
  firstTitle,
  secondTitle,
  button
}) => {
  return (
    <div>
      <WRAPPER>
        <Row gutter={rowGutterValue}>
          <Col flex={firstColFlexValue}>
            <LEFTGRID>
              <Row justify={leftJustifyValue}>{firstTitle}</Row>
              {firstChild}
            </LEFTGRID>
          </Col>

          <Col flex={secondColFlexValue}>
            <RIGHTGRID>
              <Row justify={rightJustifyValue}>{secondTitle}</Row>
              {secondChild}
              <Row justify={buttonJustifyValue}>{button}</Row>
            </RIGHTGRID>
          </Col>
        </Row>
      </WRAPPER>
    </div>
  )
}
