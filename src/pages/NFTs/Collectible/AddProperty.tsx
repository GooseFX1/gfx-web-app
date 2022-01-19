import React, { useState, useEffect } from 'react'
import { Button, Input } from 'antd'
import styled from 'styled-components'
import { PopupCustom } from '../Popup/PopupCustom'
import isEmpty from 'lodash/isEmpty'

interface Item {
  id: number
  type: string
  name: string
}

interface Props {
  visible: boolean
  handleCancel: () => void
  handleOk: () => void
  propertyList: Item[]
  setPropertyList: (items: Array<Item>) => void
}

const STYLED_ADD_PROPERTY = styled(PopupCustom)`
  ${({ theme }) => `
    background: transparent;
    .ant-modal-body {
      ${theme.largeBorderRadius}
      padding: 0;
      background-color: ${theme.bg3};
    }
    .body-wrap {
      padding: ${theme.margins['4x']};
    }
    .btn-wrap {
      margin-top: ${theme.margins['3.5x']};
      padding: ${theme.margins['2.5x']} ${theme.margins['4x']};
      background: rgba(64, 64, 64, 0.22);
      border-radius: 0 0 20px 20px;
    }
    .ant-modal-close {
      right: 30px;
      top: 35px;
      left: auto;
    }
    .title {
      font-family: Montserrat;
      font-size: 25px;
      font-weight: 600;
      color: ${theme.text7};
      margin-bottom: ${theme.margins['3x']};
    }
    .desc {
      color: ${theme.text12};
      font-family: Montserrat;
      font-size: 16px;
      font-weight: 500;
    }
  `}
`

const STYLED_CREATE_BTN = styled(Button)<{ disabled: boolean }>`
  ${({ theme, disabled }) => `
    width: 100%;
    font-size: 17px;
    font-weight: 600;
    line-height: 46px;
    height: 53px;
    ${theme.roundedBorders}
    border: none;
    color: #fff !important;
    background: ${disabled ? '#7d7d7d' : '#9625ae'} !important;
    &:hover {
      background: ${disabled ? '#7d7d7d' : '#9625ae'} !important;
      opacity: 0.8;
    }
  `}
`

const STYLED_ADD_GROUP = styled.div`
  ${({ theme }) => `
    padding: 0 ${theme.margins['4x']};
    .add-header {
      display: flex;
      align-items: center;
      margin-bottom: ${theme.margins['2x']};
      .empty {
        width: 55px;
        height: 20px;
        margin-right: ${theme.margins['2x']};
      }
      .text {
        width: 180px;
        font-family: Montserrat;
        font-size: 18px;
        font-weight: 600;
        text-align: left;
        color: ${theme.text7};
        padding-left: ${theme.margins['2.5x']};
      }
    }
  `}
`
const STYLED_ADD_BODY = styled.div`
  ${({ theme }) => `
    .add-item {
      display: flex;
      align-items: center;
      margin-bottom: ${theme.margins['3x']}
    }
    .close-btn {
      width: 55px;
      height: 55px;
      background: ${theme.iconRemoveBg};
      border-radius: 50%;
      margin-right: ${theme.margins['2x']};
      line-height: 51px;
      text-align: center;
      cursor: pointer;
    }
    input {
      width: 180px;
      height: 55px;
      background-color: ${theme.inputPropertyBg};
      border: none;
      text-align: left;
      font-family: Montserrat;
      font-size: 18px;
      font-weight: 500;
      color: #fff;
      padding-left: ${theme.margins['2.5x']};
      &:focus {
        box-shadow: none;
      }
      &:placeholder {
        font-family: Montserrat;
        font-size: 18px;
        font-weight: 500;
        text-align: left;
        color: #979797;
      }
    }
    .input-type {
      position: relative;
      border-radius: 42px 0 0 42px;
    }
    .input-wrap {
      position: relative;
      &:before {
        content: '';
        width: 3px;
        background: ${theme.inputFence};
        height: 42px;
        position: absolute;
        top: 6px;
        right: 0;
        display: inline-block;
        z-index: 2;
      }
    }
    .input-name {
      border-radius: 0 42px 43px 0;
    }
  `}
`

const STYLED_ADD_MORE_BTN = styled(Button)`
  ${({ theme }) => `
    width: 143px;
    height: 45px;
    border-radius: 29px;
    background-color: #3735bb;
    color: #fff;
    border: none;
    margin-left: auto;
    margin-right: 0;
    display: block;
    &:hover, &:focus {
      background-color: #3735bb;
      color: #fff;
      opacity: 0.8;
    }
  `}
`

export const AddProperty = ({ visible, handleCancel, handleOk, propertyList, setPropertyList }: Props) => {
  const [disabled, setDisabled] = useState(true)
  const [counter, setCounter] = useState(1)
  const initData = [
    {
      id: 1,
      type: '',
      name: ''
    }
  ]
  const tempProperties = JSON.parse(JSON.stringify(propertyList))
  const [realData, setRealData] = useState(isEmpty(tempProperties) ? initData : tempProperties)
  const onAdd = (number) => {
    const temp = JSON.parse(JSON.stringify(realData))
    temp.push({
      id: number + 1,
      type: '',
      name: ''
    })
    setRealData(temp)
    setCounter(number + 1)
  }
  const onRemove = (id) => {
    if (realData.length === 1) return
    const temp = JSON.parse(JSON.stringify(realData))
    const index = temp.findIndex((item) => item.id === id)
    if (index !== -1) {
      temp.splice(index, 1)
      setRealData(temp)
    }
  }
  const onChange = ({ e, id }) => {
    const { name, value } = e.target
    const temp = JSON.parse(JSON.stringify(realData))
    const index = temp.findIndex((item) => item.id === id)
    if (index !== -1) {
      temp[index][name] = value
      setRealData(temp)
      checkDisabled(realData)
    }
  }
  const checkDisabled = (list) => {
    const temp = JSON.parse(JSON.stringify(list))

    for (const item of temp) {
      const empty = Object.values(item).some((val) => !val)
      if (empty) {
        setDisabled(true)
        break
      }
      setDisabled(false)
    }
  }

  const onSave = () => {
    setPropertyList(realData)
    handleOk()
  }

  useEffect(() => {
    checkDisabled(realData)
  }, [realData])
  return (
    <STYLED_ADD_PROPERTY
      width="500px"
      height="600px"
      title={null}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <div className="body-wrap">
        <h1 className="title">Add Properties</h1>
        <div className="desc">
          Properties show up in the atributtes section inside each item view and can be filtered using sort by.
        </div>
      </div>
      <STYLED_ADD_GROUP>
        <div className="add-header">
          <div className="empty" />
          <div className="text">Type</div>
          <div className="text">Name</div>
        </div>
        <STYLED_ADD_BODY>
          {realData.map((item) => (
            <div className="add-item" key={item?.id}>
              <div className="close-btn" onClick={() => onRemove(item?.id)}>
                <img
                  className="close-white-icon"
                  src={`${process.env.PUBLIC_URL}/img/assets/close-white-icon.svg`}
                  alt=""
                />
              </div>
              <div className="input-wrap">
                <Input
                  name="type"
                  className="input-type"
                  placeholder="Character"
                  defaultValue={item?.type}
                  onChange={(e) => onChange({ e: e, id: item?.id })}
                />
              </div>
              <Input
                name="name"
                className="input-name"
                placeholder="Male"
                defaultValue={item?.name}
                onChange={(e) => onChange({ e: e, id: item?.id })}
              />
            </div>
          ))}
        </STYLED_ADD_BODY>
        <STYLED_ADD_MORE_BTN onClick={() => onAdd(counter)}>Add more</STYLED_ADD_MORE_BTN>
      </STYLED_ADD_GROUP>

      <div className="btn-wrap">
        <STYLED_CREATE_BTN
          className="create-collection-btn"
          type="primary"
          htmlType="submit"
          disabled={disabled}
          onClick={onSave}
        >
          Save
        </STYLED_CREATE_BTN>
      </div>
    </STYLED_ADD_PROPERTY>
  )
}
