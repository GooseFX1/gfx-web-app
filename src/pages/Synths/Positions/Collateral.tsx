import { FC } from 'react'
import styled from 'styled-components'
import DoughnutChart from './DoughnutChart'
import { Row, Col, Select, Tabs } from 'antd'
import { DoughnutLegend } from '../../../components/DougnutLegend'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
  ${({ theme }) => theme.mediaWidth.fromLarge`
  height: auto;
  width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
height: 100%;
width: 100%;
`};
`
const CONT = styled.div`
  height: 'auto';
  padding-bottom: 30px;
`

const BOTTOMTAB = styled.div`
  height: 40px;
  background-color: #121212;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

const TITLE = styled.span`
  background-color: #2a2a2a;
  font-size: 15px;
  font-family: 'Montserrat';
  font-weight: 500;
  display: flex;
  justify-content: left;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 60px;
`

const LEFT = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  padding-top: 25px;
  padding-left: 15px;
`

const CENTER = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0px;
`

const RIGHT = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 25px;
`

export const Collateral: FC = () => {
  return (
    <WRAPPER>
      <CONT>
        <Row align={'top'} justify={'space-around'}>
          <LEFT>
            <Col flex={2}>
              <DoughnutLegend backgroundColor={'#7d338c'} value={'gUSD'} percentage={'50%'} />
              <DoughnutLegend backgroundColor={'#bc4747'} value={'gTSLA'} percentage={'25%'} />
              <DoughnutLegend backgroundColor={'#5a58e9'} value={'gFB'} percentage={'15%'} />
            </Col>
          </LEFT>
          <CENTER>
            <DoughnutChart />
          </CENTER>
          <RIGHT>
            <Col flex={2}>
              <DoughnutLegend backgroundColor={'#379620'} value={'gGOOG'} percentage={'10%'} />
            </Col>
          </RIGHT>
        </Row>
      </CONT>
    </WRAPPER>
  )
}
