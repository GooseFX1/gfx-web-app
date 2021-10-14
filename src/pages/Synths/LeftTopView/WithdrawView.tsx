import { FC } from 'react'
import styled from 'styled-components'
import { Frame } from '../../../components/Frame'
import { Col, Input, Row } from 'antd'
import { InfoBlock } from '../../../components/InfoBlock'
import { MainButton } from '../../../components'
import { InputBlock } from '../../../components/InputBlock'
import { InfoBlockTail } from '../../../components/InfoBlockTail'

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

export const WithdrawView: FC = () => {
  return (
    <Frame
      rowGutterValue={45}
      firstColFlexValue={4}
      secondColFlexValue={1}
      leftJustifyValue={'space-between'}
      rightJustifyValue={'start'}
      buttonJustifyValue={'end'}
      firstTitle={
        <Row justify={'space-between'} style={{ width: '100%' }}>
          <LEFTCOLTEXT>Withdraw</LEFTCOLTEXT>
          <LEFTCOLTEXT>Use Max</LEFTCOLTEXT>
        </Row>
      }
      firstChild={
        <InputBlock
          height={'45px'}
          width={'100%'}
          color={'#fff'}
          backgroundColor={'#4a4949'}
          fontSize={'12'}
          bottomMargin={'40px'}
          borderRadius={'10px'}
          defaultValue={''}
          addOn={
            <InfoBlockTail
              image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`}
              text={'GFX'}
              imageHeight={'30px'}
              imageWidth={'30px'}
            ></InfoBlockTail>
          }
        ></InputBlock>
      }
      secondTitle={
        <Row>
          <RIGHTCOLTEXT>Available GFX</RIGHTCOLTEXT>
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
          textOne={'150.345678'}
          textTwo={'GFX'}
        ></InfoBlock>
      }
      button={
        <MainButton height="50px" onClick={() => null} status="action" width="175px">
          <span>Withdraw</span>
        </MainButton>
      }
    ></Frame>
  )
}
