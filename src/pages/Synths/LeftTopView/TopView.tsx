import { Button, Menu } from 'antd'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import styled, { css } from 'styled-components'
import { ArrowDropdown } from '../../../components'
import { Row, Col, Select, Tabs } from 'antd'
import { HeaderBar } from '../../../components/HeaderBar'
import React from 'react'
import { useDarkMode } from '../../../context'
import { SVGToWhite } from '../../../styles'
import { DepositView } from './DepositView'
import { MintView } from './MintView'
import { WithdrawView } from './WithdrawView'

const { TabPane } = Tabs

const { Option } = Select

const Nav = ['Deposit', 'Mint', 'Swap', 'Burn', 'Withdraw', 'Rewards']

const OperationsSlot = {
  left: (
    <Select
      bordered={false}
      style={{ backgroundColor: '#3735bb', color: 'white', fontSize: 15, height: 80 }}
      defaultValue="Sp 500 pool"
      dropdownStyle={{
        height: '27.5vh',
        borderRadius: 20,
        backgroundColor: '#525252',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      suffixIcon={
        <SVGToWhite
          src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`}
          alt="arrow"
          style={{ height: 15, width: 15, marginRight: 15 }}
        />
      }
    >
      <Option value="Sp 500" style={{ height: 50, alignItems: 'center', marginTop: 10, color: 'white' }}>
        Sp 500 pool
      </Option>
      <Option value="Dow Jones" style={{ height: 50, alignItems: 'center', color: 'white' }}>
        Dow Jones pool
      </Option>
      <Option value="Nasdaq" style={{ height: 50, alignItems: 'center', color: 'white' }}>
        Nasdaq pool
      </Option>
      <Option value="Russel" style={{ height: 50, alignItems: 'center', color: 'white' }}>
        Russel 2000 pool
      </Option>
    </Select>
  )
}

export const TopView: FC = () => {
  return (
    <div>
      <Tabs
        tabBarExtraContent={OperationsSlot}
        centered={true}
        tabBarGutter={40}
        tabBarStyle={{ height: 80, backgroundColor: '#121212', borderRadius: 20 }}
      >
        {Nav.map((value, index) => (
          <TabPane key={index} tab={value}>
            {index === 0 ? (
              <DepositView></DepositView>
            ) : index === 1 ? (
              'View two'
            ) : index === 2 ? (
              'View three'
            ) : index === 3 ? (
              'View four'
            ) : index === 4 ? (
              <WithdrawView></WithdrawView>
            ) : index === 5 ? (
              'View six'
            ) : null}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}
