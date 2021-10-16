import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { Row, Col, Select, Tabs } from 'antd'
import { SVGToWhite } from '../../../styles'
import { DepositView } from './DepositView'
import { MintView } from './MintView'
import { WithdrawView } from './WithdrawView'
import { RewardsView } from './RewardsView'
import { BurnView } from './BurnView'
import { SwapView } from './SwapView'

const { TabPane } = Tabs

const { Option } = Select

const Nav = ['Deposit', 'Mint', 'Swap', 'Burn', 'Withdraw', 'Rewards']

const OperationsSlot = {
  left: (
    <Select
      bordered={false}
      style={{ backgroundColor: '#3735bb', color: 'white', fontSize: 15, height: 80, paddingTop: 25 }}
      defaultValue="Sp 500 pool"
      dropdownStyle={{
        height: '30vh',
        width: '150px',
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
      <Option value="Russel" style={{ height: 50, alignItems: 'center', marginBottom: 10, color: 'white' }}>
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
              <DepositView />
            ) : index === 1 ? (
              <MintView />
            ) : index === 2 ? (
              <SwapView />
            ) : index === 3 ? (
              <BurnView />
            ) : index === 4 ? (
              <WithdrawView />
            ) : index === 5 ? (
              <RewardsView />
            ) : null}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}
