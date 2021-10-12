import { Menu } from 'antd'
import { FC } from 'react'
import styled from 'styled-components'
import { ArrowDropdown } from '../../../components'
import { Row, Col } from 'antd'
import { HeaderBar } from '../../../components/HeaderBar'

const BUTTON = styled.button`
  display: flex;
  justify-content: right;
  align-items: center;
  height: 80px;
  width: 150px;
  border: none;
  border-radius: 20px;
`
const TEXT = styled.span`
  display: flex;
  justify-content: left;
  align-items: flex-start;
  font-size: 14px;
  margin-right: 10px;
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

const Overlay: FC = () => {
  return (
    <Menu>
      <Menu.Item>1st menu item</Menu.Item>
      <Menu.Item>2nd menu item</Menu.Item>
      <Menu.Item>3rd menu item</Menu.Item>
    </Menu>
  )
}

export const TopView: FC = () => {
  return (
    <HeaderBar height={'80px'} width={'100%'}>
      <BUTTON style={{ backgroundColor: '#3735bb' }}>
        <Row>
          <TEXT>Sp 500 pool </TEXT>
          <ARROW>
            <ArrowDropdown onVisibleChange={function (x: boolean): void {}} overlay={<Overlay />} />
          </ARROW>
        </Row>
      </BUTTON>
    </HeaderBar>
  )
}
