import { Menu } from 'antd'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import { ArrowDropdown } from '../../../components'
import { Row, Col } from 'antd'
import { HeaderBar } from '../../../components/HeaderBar'

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

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setVisible: Dispatch<SetStateAction<boolean>>
}> = ({ setArrowRotation, setVisible }) => {
  return (
    <MENU>
      <Menu>
        <MENUITEM>
          <Menu.Item>1st menu item</Menu.Item>
        </MENUITEM>
        <MENUITEM>
          <Menu.Item>1st menu item</Menu.Item>
        </MENUITEM>
        <MENUITEM>
          <Menu.Item>1st menu item</Menu.Item>
        </MENUITEM>
        <MENUITEM>
          <Menu.Item>1st menu item</Menu.Item>
        </MENUITEM>
      </Menu>
    </MENU>
  )
}

export const TopView: FC = () => {
  const [arrowRotation, setArrowRotation] = useState(false)
  const [visible, setVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setVisible(!visible)
  }
  return (
    <HeaderBar height={'80px'} width={'100%'}>
      <BUTTON style={{ backgroundColor: '#3735bb' }}>
        <Row>
          <TEXT>Sp 500 pool </TEXT>
          <ARROW>
            <ArrowDropdown
              arrowRotation={arrowRotation}
              measurements="16px"
              offset={[26, 26]}
              overlay={<Overlay setArrowRotation={setArrowRotation} setVisible={setVisible} />}
              onVisibleChange={handleClick}
              onClick={handleClick}
              visible={visible}
            />
          </ARROW>
        </Row>
      </BUTTON>
    </HeaderBar>
  )
}
