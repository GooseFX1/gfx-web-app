import { Row, Col, Tag } from 'antd'
import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { ImageContainer, InputSection } from '../components/SharedComponents'

const WRAPPER = styled.div`
  .legal-question {
    font-size: 25px;
    font-weight: 600;
  }
  .ant-col-12:first-child {
    padding-left: 55px;
  }
  .ant-col-12:nth-child(2) {
    padding-right: 60px;
    display: flex;
    justify-content: end;
  }
  .padding-15 {
    padding-bottom: 15px;
  }
  .heading {
    font-size: 25px;
    font-weight: 600;
    margin-bottom: 5px;
    margin-top: 40px;
  }
  .ant-tag {
    height: 50px;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    padding: 15px 20px;
    background-color: ${({ theme }) => theme.inputFence};
    color: ${({ theme }) => theme.text11};
  }
  .ant-tag-checkable-checked {
    background-color: ${({ theme }) => theme.primary3};
    color: #eeeeee;
  }
  .ant-tag-checkable:not(.ant-tag-checkable-checked):hover {
    color: ${({ theme }) => theme.primary3};
  }
  .margin-40 {
    margin-top: 40px;
  }
`

export const Step1: FC = () => {
  const [projectName, setProjectName] = useState<string>('')
  const [collectionName, setCollectionName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [tagIndex, setTagIndex] = useState<number>(-1)

  //  return <ImageContainer imageName="launchpad-logo" projectName="Nestquest the egg" collectionName="Tier 3 the egg" />
  return (
    <WRAPPER>
      <Row>
        {/*left side*/}
        <Col span={12}>
          <Row>
            <div className="legal-question">
              1. Is the artwork in your collection and banner either original work or do you have legal permission to
              use, distribute, and sell?
            </div>
          </Row>
          <Row className="margin-40">
            <Tag.CheckableTag checked={tagIndex === 0} onChange={(e) => e && setTagIndex(0)}>
              Yes, I'm author
            </Tag.CheckableTag>
            <Tag.CheckableTag checked={tagIndex === 1} onChange={(e) => e && setTagIndex(1)}>
              Yes, I’ve permission
            </Tag.CheckableTag>
            <Tag.CheckableTag checked={tagIndex === 2} onChange={(e) => e && setTagIndex(2)}>
              No
            </Tag.CheckableTag>
          </Row>
          <Row className="padding-15">
            <div className="heading">Project, colletion name and description</div>
          </Row>
          <Row className="padding-15">
            <InputSection
              label="Project name"
              placeholder="Name your project"
              value={projectName}
              setValue={setProjectName}
              characterLimit={80}
            />
          </Row>
          <Row className="padding-15">
            <InputSection
              label="Collection name"
              placeholder="Name your collection"
              value={collectionName}
              setValue={setCollectionName}
              characterLimit={80}
            />
          </Row>
          <Row className="padding-15">
            <InputSection
              label="Collection description"
              placeholder="Enter collection description"
              value={description}
              setValue={setDescription}
              characterLimit={300}
              needBorders={true}
            />
          </Row>
        </Col>
        {/*right side*/}
        <Col span={12}>
          <ImageContainer imageName="launchpad-logo" projectName={projectName} collectionName={collectionName} />
        </Col>
      </Row>

      {/*<InputSection label="Project name" placeholder='Name your project' value={textValue} setValue={setTextValue} characterLimit={500} needBorders={true} />*/}
    </WRAPPER>
  )
}
