import { FC } from 'react'
import styled from 'styled-components'
import { Frame } from '../../../components/Frame'
import { Col, Input, Row } from 'antd'
import { InfoBlock } from '../../../components/InfoBlock'
import { MainButton } from '../../../components'
import { InputBlock } from '../../../components/InputBlock'
import { BlockTail } from '../../../components/BlockTail'

const TITLEBOX = styled.div`
  color: white;
  height: 100px;
  width: auto;
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
const INPUT = styled.div`
  margin-top: 22px;
`

export const RewardsView: FC = () => {
  return (
    <Frame
      rowGutterValue={25}
      firstColFlexValue={2.5}
      secondColFlexValue={2.5}
      leftJustifyValue={'space-between'}
      rightJustifyValue={'start'}
      buttonJustifyValue={'end'}
      firstTitle={
        <Row justify={'space-between'} style={{ width: '100%' }}>
          <LEFTCOLTEXT>Historical</LEFTCOLTEXT>
          <LEFTCOLTEXT></LEFTCOLTEXT>
        </Row>
      }
      firstChild={
        <InfoBlock
          height={'50px'}
          width={'100%'}
          color={'#fff'}
          backgroundColor={'#121212'}
          fontSize={'14px'}
          bottomMargin={'40px'}
          borderRadius={'10px'}
          text={'150.345678'}
          tail={
            <BlockTail
              image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`}
              text={<span style={{ paddingLeft: 20, paddingRight: 10 }}>GFX</span>}
              imageHeight={'30px'}
              imageWidth={'30px'}
              backgroundColor={'#121212'}
              width={'auto'}
              justifyItems={''}
            ></BlockTail>
          }
        ></InfoBlock>
      }
      secondTitle={
        <Row>
          <RIGHTCOLTEXT>Current</RIGHTCOLTEXT>
        </Row>
      }
      secondChild={
        <InfoBlock
          height={'50px'}
          width={'100%'}
          color={'#fff'}
          backgroundColor={'#121212'}
          fontSize={'14px'}
          bottomMargin={'40px'}
          borderRadius={'10px'}
          text={'87.345678'}
          tail={<span style={{ paddingRight: 20 }}>GFX</span>}
        ></InfoBlock>
      }
      button={
        <MainButton height="50px" onClick={() => null} status="action" width="175px">
          <span>Claim</span>
        </MainButton>
      }
    ></Frame>
  )
}
