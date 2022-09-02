import { Row, Col, Tag } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ImageContainer, InputSection, NextStepsButton } from '../components/SharedComponents'
import tw from 'twin.macro'
import { useNFTCreator } from '../../../../context/nft_creator'
import { ICreatorData } from '../../../../types/nft_launchpad'

const WRAPPER = styled.div`
  ${tw`mb-12`}
  .legal-question {
    font-size: 25px;
    font-weight: 600;
  }
  .ant-col-12:first-child {
    padding-left: 55px;
    padding-right: 50px;
  }
  .ant-col-12:nth-child(2) {
    padding-right: 60px;
    display: flex;
    justify-content: start;
    flex-direction: column;
    align-items: end;
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
  .next-steps {
    ${tw`mt-20 flex items-end justify-end`}
    .ant-btn {
      ${tw`rounded-3xl`}
      background-color: ${({ theme }) => theme.primary3};
    }
  }
`

export const Step1: FC = () => {
  const { creatorData } = useNFTCreator()
  const [projectName, setProjectName] = useState<string>('')
  const [collectionName, setCollectionName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [tagIndex, setTagIndex] = useState<number>(-1)
  const [nextButtonActive, setNextButtonActive] = useState<boolean>(false)

  useEffect(() => {
    if (creatorData && creatorData[1]) {
      setProjectName(creatorData[1].projectName)
      setCollectionName(creatorData[1].collectionName)
      setDescription(creatorData[1].collectionDescription)
      if (creatorData[1].legality === 'author') setTagIndex(0)
      else if (creatorData[1].legality === 'permission') setTagIndex(1)
    }
  }, [creatorData])

  useEffect(() => {
    if (projectName.length > 0 && collectionName.length > 0 && description.length > 0 && tagIndex > -1 && tagIndex < 2)
      setNextButtonActive(true)
    else setNextButtonActive(false)
  }, [projectName, collectionName, description, tagIndex])

  const creatorStepData: ICreatorData[1] = {
    legality: tagIndex === 0 ? 'author' : tagIndex === 1 ? 'permission' : 'no',
    projectName: projectName,
    collectionName: collectionName,
    collectionDescription: description
  }

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
          <Row>
            <ImageContainer
              imageName="launchpad-logo"
              projectName={tagIndex === 2 ? 'Upps, you don’t have the proper permissions!' : projectName}
              collectionName={
                tagIndex === 2
                  ? 'In order to proceed, make sure you have all the legal permisions to use, distribut and sell.'
                  : collectionName
              }
            />
          </Row>

          <NextStepsButton data={creatorStepData} active={nextButtonActive} />
        </Col>
      </Row>
    </WRAPPER>
  )
}
