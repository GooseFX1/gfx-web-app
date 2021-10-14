import { FC } from 'react'
import styled from 'styled-components'
import { Row, Col, Progress } from 'antd'
import { useDarkMode } from '../../../context'
import { ProgressRow } from './ProgressRow'

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

export const MyStats: FC<{}> = () => {
  const { mode } = useDarkMode()
  const value = mode === 'dark' ? '#1e1e1e' : '#e2e2e2'
  return (
    <WRAPPER>
      <Col>
        <Row>
          <TITLE>My Stats</TITLE>
        </Row>

        <ProgressRow
          title={'Debt'}
          tooltip={'The current USD denominated value of your debt that must be repaid.'}
          number={'000,000.00 USD'}
          percent={60}
          showInfo={false}
          strokeWidth={16}
          strokeColor={'#5654f2'}
          trailColor={value}
        ></ProgressRow>
        <ProgressRow
          title={'Collateral'}
          tooltip={
            'The current USD denominated value of your deposited collateral. Prices of collaterals are provided by decentralized Pyth oracles.'
          }
          number={'000,000.00 USD'}
          percent={30}
          showInfo={false}
          strokeWidth={16}
          strokeColor={'#cf5ae8'}
          trailColor={value}
        ></ProgressRow>
        <ProgressRow
          title={'C-Ratio'}
          tooltip={
            'Current value of your debt based on the debt of the platform. Max borrow represents the maximal debt that you can mint - if your debt increases beyond this value, your position can be liquidated. You can mint if your collateral ratio is greater than 200% and you may be liquidated if your collateral ratio falls below 120%.'
          }
          number={'125%/No Minting'}
          percent={50}
          showInfo={false}
          strokeWidth={16}
          strokeColor={'#bb7535'}
          trailColor={value}
        ></ProgressRow>
      </Col>
    </WRAPPER>
  )
}
