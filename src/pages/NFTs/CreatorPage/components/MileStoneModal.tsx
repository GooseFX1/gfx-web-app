import { Button, Col, Input, Row } from 'antd'
import React, { useState, Dispatch, FC, SetStateAction, useEffect } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { Modal } from '../../../../components'
import 'styled-components/macro'

const MODAL_WRAPPER = styled(Modal)`
  width: 500px !important;
  ${tw`relative`}
  .ant-modal-body {
    padding-bottom: 70px !important;
  }
  .save-button {
    ${tw`absolute bottom-0 flex justify-center items-center w-11/12 mb-5`}
    .button-save {
      ${tw`h-full rounded-[29px] w-10/12 h-12 text-[15px] font-medium flex justify-center items-center cursor-pointer`}
      background-color: ${({ theme }) => theme.text1h};
      color: ${({ theme }) => theme.text11};
      &.active {
        background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
        color: #eeeeee;
      }
    }
  }
  .header-row {
    div:first-child {
      ${tw`text-[25px] font-semibold`}
      color: ${({ theme }) => theme.text7}
    }
    div:nth-child(2) {
      ${tw`text-base font-medium`}
      color: ${({ theme }) => theme.text12}
    }
  }
  .content-row-scrollable {
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
    ${tw`h-96 overflow-y-auto`}
  }
  .content-row-scrollable::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
  .add-more-button {
    ${tw`w-full flex justify-end items-end mt-5 h-12`}
    .ant-btn {
      ${tw`h-full rounded-[29px] w-36 text-[15px] font-medium`}
      background-color: ${({ theme }) => theme.inputFence};
      color: ${({ theme }) => theme.text11};
      &.active {
        background-color: ${({ theme }) => theme.primary3};
        color: #eeeeee;
      }
    }
  }
`

interface IMileStoneModal {
  setVisible: (x: boolean) => void
  visible: boolean
  mileStones: any
  setMileStones: Dispatch<SetStateAction<any>>
}

export const MileStoneModal: FC<IMileStoneModal> = ({ visible, setVisible, mileStones, setMileStones }) => {
  const [addButtonActive, setAddButtonActive] = useState<boolean>(false)

  const [tempMS, setTempMS] = useState([
    {
      input1: '',
      input2: '',
      input3: ''
    }
  ])

  useEffect(() => {
    if (mileStones.length !== 0) setTempMS(mileStones)
  }, [])

  const addMileStone = (input, data, index) => {
    let existingMilestoneData = [...tempMS]
    existingMilestoneData[index][input] = data
    setTempMS(existingMilestoneData)
  }

  const addEmpty = () => {
    let existingMilestoneData = [...tempMS]
    existingMilestoneData.push({
      input1: '',
      input2: '',
      input3: ''
    })
    setTempMS(existingMilestoneData)
  }

  const removeIndex = (index) => {
    if (tempMS.length > 1) {
      let existingMilestoneData = [...tempMS]
      existingMilestoneData.splice(index, 1)
      setTempMS(existingMilestoneData)
    }
  }

  const saveInfo = () => {
    let mileStonesSet = tempMS
    setMileStones(mileStonesSet)
    setVisible(false)
  }

  useEffect(() => {
    let lastIndex = tempMS.length - 1
    if (tempMS[lastIndex].input1 && tempMS[lastIndex].input2 && tempMS[lastIndex].input3) setAddButtonActive(true)
    else setAddButtonActive(false)
  }, [tempMS])

  return (
    <MODAL_WRAPPER visible={visible} setVisible={setVisible}>
      <Row className="header-row">
        <div>Add Milestones</div>
        <div>Enter milestones by title, year and description.</div>
      </Row>
      <Row className="content-row-scrollable">
        {tempMS !== null &&
          tempMS.map((item, index2) => (
            <MileStoneComponent
              index={index2}
              mileStones={tempMS}
              add={addEmpty}
              remove={removeIndex}
              setMileStones={addMileStone}
              data={item}
            />
          ))}
        <div className="add-more-button">
          <Button onClick={addEmpty} className={addButtonActive ? 'active' : ''} disabled={!addButtonActive}>
            Add more
          </Button>
        </div>
      </Row>
      <Row className="save-button">
        <div className={addButtonActive ? 'active button-save' : 'button-save'} onClick={saveInfo}>
          Save
        </div>
      </Row>
    </MODAL_WRAPPER>
  )
}

const WRAPPER_COMPONENT = styled.div`
  ${tw`w-full mt-5`}
  .right-character-limit {
    ${tw`flex items-end justify-end mt-2 text-base`}
    color: ${({ theme }) => theme.text20}
  }
  .first-input-row {
    ${tw`flex justify-center items-center`}
    .ant-input:first-child {
      ${tw`text-left pl-4 w-8/12 h-[53px] rounded-bl-[40px] border-0 rounded-tl-[40px] border-none border-r border-gray-1 border-solid text-[17px]`}
      background-color: ${({ theme }) => theme.sweepModalCard};
      color: ${({ theme }) => theme.text25};
    }
    .ant-input:nth-child(2) {
      ${tw`text-center w-4/12 h-[53px] rounded-br-[40px] rounded-tr-[40px] border-none text-[17px]`}
      background-color: ${({ theme }) => theme.sweepModalCard};
      color: ${({ theme }) => theme.text25};
    }
  }
  .second-input-row {
    ${tw`flex justify-center items-center w-full mt-4`}
    textarea {
      ${tw`w-full rounded-[15px] border-none pl-4 pt-2 h-20 outline-none text-base`}
      background-color: ${({ theme }) => theme.sweepModalCard};
      color: ${({ theme }) => theme.text25};
    }
  }
`

const MileStoneComponent: FC<{
  mileStones: any
  setMileStones: Function
  index: number
  add: Function
  remove: Function
  data: any
}> = ({ mileStones, setMileStones, index, data, remove }) => {
  const [valueChanged, setValueChanged] = useState<number>(0)

  const callSetMileStones = (input, data) => {
    setValueChanged(valueChanged + 1)
    setMileStones(input, data, index)
  }

  return (
    <WRAPPER_COMPONENT>
      <Row>
        <Col span={4}>
          <Row>
            <img tw="cursor-pointer" alt="close" src="/img/assets/primary-close.svg" onClick={() => remove(index)} />
          </Row>
        </Col>
        <Col span={20}>
          <Row className="first-input-row">
            <Input
              value={data.input1}
              onChange={(e) => e.target.value.length < 21 && callSetMileStones('input1', e.target.value)}
              placeholder="Enter Title"
            />
            <Input
              value={data.input2}
              onChange={(e) => {
                const reg = new RegExp('^\\d+$')
                let isNumber = reg.test(e.target.value)
                if (isNumber && e.target.value.length < 5) callSetMileStones('input2', e.target.value)
                else if (e.target.value === '') callSetMileStones('input2', '')
              }}
              placeholder="Year"
            />
          </Row>
          <Row className="right-character-limit">{data.input1.length} of 20 characters limit</Row>
          <Row className="second-input-row">
            <textarea
              value={data.input3}
              onChange={(e) => e.target.value.length < 61 && callSetMileStones('input3', e.target.value)}
              placeholder="Enter Description"
            />
          </Row>
          <Row className="right-character-limit">{data.input3.length} of 60 characters limit</Row>
        </Col>
      </Row>
    </WRAPPER_COMPONENT>
  )
}
