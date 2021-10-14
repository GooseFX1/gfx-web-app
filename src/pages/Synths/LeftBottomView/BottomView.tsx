import { Button, Menu } from 'antd'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import styled, { css } from 'styled-components'
import { ArrowDropdown } from '../../../components'
import { Row, Col, Select, Tabs } from 'antd'
import { HeaderBar } from '../../../components/HeaderBar'
import React from 'react'
import { useDarkMode } from '../../../context'
import { SVGToWhite } from '../../../styles'

const { TabPane } = Tabs

const { Option } = Select

const BUTTON = styled.button`
  display: flex;
  justify-content: right;
  align-items: center;
  height: 80px;
  width: 175px;
  border: none;
  border-radius: 20px;
`
const TEXT = styled.span`
  display: flex;
  justify-content: left;
  align-items: flex-start;
  font-size: 14px;
  margin-right: 20px;
  color: white;
  font-weight: 500;
`
const ARROW = styled.div`
  display: flex;
  justify-content: left;
  align-items: flex-start;
  margin-right: 10px;
  margin-top: 2px;
`

const MENU = styled.div`
  width: 175px;
  margin-top: 12%;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-right: 10px;
  border-radius: 20px;
  background-color: #131212;
`

const MENUITEM = styled.div`
  margin-top: 0px;
  margin-bottom: 0px;
  height: '100%';
  padding-bottom: 8px;
  padding-top: 8px;
  width: 175px;
  border-radius: 5px;
  background-color: #3f3f3f;
`

const Nav = ['gtokens', 'Collateral']

export const BottomView: FC = () => {
  return (
    <div>
      <Tabs
        type={'line'}
        centered={true}
        tabBarGutter={40}
        tabBarStyle={{ height: 80, backgroundColor: '#121212', borderRadius: 20 }}
      >
        {Nav.map((value, index) => (
          <TabPane key={index} tab={value}>
            {index === 0 ? 'View one' : 'View two'}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}
