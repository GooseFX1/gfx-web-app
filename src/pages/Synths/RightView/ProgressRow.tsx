import { FC } from 'react'
import styled from 'styled-components'
import { Row, Col, Progress } from 'antd'
import { Tooltip } from '../../../components/Tooltip'
import { useDarkMode } from '../../../context'
import { ProgressBar } from '../../../components/Progress'
import { title } from 'process'

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

export const ProgressRow: FC<{
  title: string
  tooltip: string
  number: string
  percent: number
  showInfo: boolean
  strokeWidth: number
  strokeColor: string
  trailColor: string
}> = ({ title, tooltip, number, percent, showInfo, strokeWidth, strokeColor, trailColor }) => {
  return (
    <WIDGETWRAP>
      <Row align={'middle'}>
        <Col flex={1}>
          <DATA>{title}</DATA>
        </Col>
        <Col flex={1}>
          <POSITION>
            <Tooltip>{tooltip}</Tooltip>
          </POSITION>
        </Col>
        <Col flex={5}>
          <PROGRESS>
            <Progress
              percent={percent}
              showInfo={showInfo}
              strokeWidth={strokeWidth}
              strokeColor={strokeColor}
              trailColor={trailColor}
            />
          </PROGRESS>
        </Col>
        <Col flex={1}>
          <NUMBER>{number}</NUMBER>
        </Col>
      </Row>
    </WIDGETWRAP>
  )
}
