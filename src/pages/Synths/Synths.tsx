import React, { FC } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { RightContainer } from './RightContainer'
import { LeftTopContainer } from './LeftTopContainer'
import { LeftBottomContainer } from './LeftBottomContainer'

const WRAPPER = styled.div`
  height: 100%;
  width: 100%;
  margin-left: ${({ theme }) => theme.margins['8x']};
  margin-right: ${({ theme }) => theme.margins['8x']};
  padding-bottom: 0px;
  overflow: hidden;
`

const LEFTGRID = styled.div`
  ${({ theme }) => theme.mediaWidth.fromLarge`
height: 85vh;
width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
height: 85vh;
width: 100%;

`};
  margin-top: ${({ theme }) => theme.margins['8x']};
`
const RIGHTGRID = styled.div`
  ${({ theme }) => theme.mediaWidth.fromLarge`
  height: 85vh;
  width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
height: 85vh;
width: 100%;
`};
  margin-top: ${({ theme }) => theme.margins['8x']};
`

export const Synths: FC = () => {
  return (
    <WRAPPER>
      <Row gutter={60}>
        <Col flex={3.75}>
          <LEFTGRID>
            <LeftTopContainer></LeftTopContainer>
            <LeftBottomContainer></LeftBottomContainer>
          </LEFTGRID>
        </Col>

        <Col flex={1.25}>
          <RIGHTGRID>
            <RightContainer></RightContainer>
          </RIGHTGRID>
        </Col>
      </Row>
    </WRAPPER>
  )
}
