import { FC } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { RightContainer } from './RightView/Container'
import { TopContainer } from './LeftTopView/Container'
import { BottomContainer } from './LeftBottomView/Container'
import { SynthsProvider, useSynths } from '../../context/synths'

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
height: auto;
width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
height: auto;
width: 100%;

`};
  margin-top: ${({ theme }) => theme.margins['8x']};
`
const RIGHTGRID = styled.div`
  ${({ theme }) => theme.mediaWidth.fromLarge`
  height: 80vh;
  width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
height: 80vh;
width: 100%;
`};
  margin-top: ${({ theme }) => theme.margins['8x']};
`

const A: FC = () => {
  const { burn, claim, deposit, mint, withdraw } = useSynths()

  return (
    <div>
      <button onClick={() => burn()}>BURN</button>
      <button onClick={() => claim()}>CLAIM</button>
      <button onClick={() => deposit()}>DEPOSIT</button>
      <button onClick={() => mint()}>MINT</button>
      <button onClick={() => withdraw()}>WITHDRAW</button>
    </div>
  )
}

export const Synths: FC = () => {
  return (
    <WRAPPER>
      <Row gutter={40} justify={'space-around'}>
        <Col flex={3}>
          <LEFTGRID>
            <TopContainer></TopContainer>
            <BottomContainer></BottomContainer>
          </LEFTGRID>
        </Col>

        <SynthsProvider>
          <A />
        </SynthsProvider>
        <Col>
          <RIGHTGRID>
            <RightContainer></RightContainer>
          </RIGHTGRID>
        </Col>
      </Row>
    </WRAPPER>
  )
}
