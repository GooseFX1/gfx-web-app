import { FC, ReactElement } from 'react'
import { Row } from 'antd'
import styled from 'styled-components'

const CONT = styled.div`
  height: 20px;
  width: '100%';
  margin-bottom: 25px;
`

const DOT = styled.div<{ $backgroundColor: string }>`
  height: 18px;
  width: 18px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 20px;
`
const VALUE = styled.span`
  color: white;
  font-size: 12px;
  font-family: 'Montserrat';
  font-weight: 500;
  width: 60px;
  margin-left: 10px;
  text-align: left;
`
const DASH = styled.div`
  height: 2px;
  width: 50px;
  background-color: #fff;
  border-radius: 2px;
  margin-right: 12px;
  align-self: center;
`
const PERCENTAGE = styled.span`
  color: white;
  font-size: 12px;
  font-family: 'Montserrat';
  font-weight: 500;
`

export const DoughnutLegend: FC<{
  backgroundColor: string
  value: string
  percentage: string
}> = ({ value, percentage, backgroundColor }) => {
  return (
    <>
      <CONT>
        <Row justify={'space-around'}>
          <DOT $backgroundColor={backgroundColor} />
          <VALUE>{value}</VALUE>
          <DASH />
          <PERCENTAGE>{percentage}</PERCENTAGE>
        </Row>
      </CONT>
    </>
  )
}
