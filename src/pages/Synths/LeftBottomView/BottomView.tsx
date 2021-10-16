import { Button, Menu } from 'antd'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import styled, { css } from 'styled-components'
import { ArrowDropdown } from '../../../components'
import { Row, Col, Select, Tabs } from 'antd'
import { GtokensView } from './GtokensView'
import { CollateralView } from './CollateralView'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
  ${({ theme }) => theme.mediaWidth.fromLarge`
  height: 45vh;
  width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
  height: auto;
  width: 100%;
`}
`

const { TabPane } = Tabs

const { Option } = Select

const Nav = ['gtokens', 'Collateral']

export const BottomView: FC = () => {
  return (
    <WRAPPER>
      <div
        style={{
          backgroundColor: '#121212',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }}
      >
        <Button shape={'round'} style={{ outline: 'none', border: 'none' }}>
          <img src={`${process.env.PUBLIC_URL}/img/synths/dash.svg`} style={{ height: 5, width: 25 }} />
        </Button>
      </div>
      <Tabs
        type={'line'}
        centered={true}
        tabBarGutter={40}
        tabBarStyle={{
          height: 20,
          marginBottom: 0,
          backgroundColor: '#121212'
        }}
      >
        {Nav.map((value, index) => (
          <TabPane key={index} tab={value}>
            {index === 0 ? <GtokensView /> : <CollateralView />}
          </TabPane>
        ))}
      </Tabs>
    </WRAPPER>
  )
}
