import { FC } from 'react'
import styled from 'styled-components'
import { Frame } from '../../../components/Frame'
import { Col, Input, Row, Select } from 'antd'
import { InfoBlock } from '../../../components/InfoBlock'
import { MainButton } from '../../../components'
import { InputBlock } from '../../../components/InputBlock'
import { BlockTail } from '../../../components/BlockTail'
import { Selector } from '../../Swap/Selector'
import { MiniDropdown } from '../../../components/MiniDropdown'
import { OptionDetail } from '../../../components/OptionDetail'

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

export const BurnView: FC = () => {
  const { Option } = Select

  return <div>A</div>
  /* return (
    <Frame
      rowGutterValue={45}
      firstColFlexValue={4}
      secondColFlexValue={1.5}
      leftJustifyValue={'space-between'}
      rightJustifyValue={'start'}
      buttonJustifyValue={'end'}
      firstTitle={
        <Row justify={'space-between'} style={{ width: '100%' }}>
          <LEFTCOLTEXT>Burn</LEFTCOLTEXT>
          <LEFTCOLTEXT>Use Max</LEFTCOLTEXT>
        </Row>
      }
      firstChild={
        <InputBlock
          height={'45px'}
          width={'100%'}
          color={'#fff'}
          backgroundColor={'#4a4949'}
          fontSize={'14px'}
          bottomMargin={'40px'}
          borderRadius={'10px'}
          defaultValue={''}
          addOn={
            <MiniDropdown
              backgroundColor={'#4a4949'}
              color={'#fff'}
              fontsize={'14px'}
              height={'45px'}
              width={'150px'}
              defaultValue={
                <BlockTail
                  image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`}
                  text={<span style={{ marginLeft: 15, fontSize: 13 }}>gUSD</span>}
                  imageHeight={'20px'}
                  imageWidth={'20px'}
                  backgroundColor={'transparent'}
                  width={'100px'}
                  justifyItems={'flex-start'}
                ></BlockTail>
              }
              dropdownHeight={'225px'}
              dropdownWidth={'150px'}
              dropdownRadius={10}
              dropdownBackground={'#4a4949'}
              iconHeight={15}
              iconWidth={15}
              iconRightMargin={10}
              options={
                <>
                  <Option value="1" style={{ height: 40, alignItems: 'center', marginTop: 10, color: 'white' }}>
                    <OptionDetail image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`} title={'gUSD'} />
                  </Option>
                  <Option value="2" style={{ height: 40, alignItems: 'center', color: 'white' }}>
                    <OptionDetail image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`} title={'gAAPL'} />
                  </Option>
                  <Option value="3" style={{ height: 40, alignItems: 'center', color: 'white' }}>
                    <OptionDetail image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`} title={'gGOOG'} />
                  </Option>
                  <Option value="4" style={{ height: 40, alignItems: 'center', color: 'white' }}>
                    <OptionDetail image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`} title={'gFB'} />
                  </Option>
                  <Option value="5" style={{ height: 40, alignItems: 'center', color: 'white' }}>
                    <OptionDetail image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`} title={'gUSD'} />
                  </Option>
                  <Option value="6" style={{ height: 40, alignItems: 'center', color: 'white' }}>
                    <OptionDetail image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`} title={'gUSD'} />
                  </Option>
                  <Option value="7" style={{ height: 40, alignItems: 'center', color: 'white' }}>
                    <OptionDetail image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`} title={'gUSD'} />
                  </Option>
                  <Option value="8" style={{ height: 40, alignItems: 'center', color: 'white' }}>
                    <OptionDetail image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`} title={'gUSD'} />
                  </Option>
                </>
              }
            />
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
          text={'150.345678'}
          tail={<span style={{ paddingRight: 20 }}>GFX</span>}
        ></InfoBlock>
      }
      button={
        <MainButton height="50px" onClick={() => null} status="action" width="175px">
          <span>Burn</span>
        </MainButton>
      }
    ></Frame>
  ) */
}
