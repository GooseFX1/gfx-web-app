import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ArrowClicker } from '../../../components'
import { MainText } from '../../../styles'
import { ButtonWrapper } from '../NFTButton'
import BottomButtonUpload, { BottomButtonUploadType } from './BottomButtonUpload'
import InfoInput from './InfoInput'
import PreviewImage from './PreviewImage'
import { useHistory } from 'react-router-dom'
import { UploadCustom } from './UploadCustom'
import { NewCollection } from './NewCollection'
import { AddProperty } from './AddProperty'
import isEmpty from 'lodash/isEmpty'

const UPLOAD_CONTENT = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.margins['5x']};
  width: 90%;
  margin: 0 auto;
`

const LEFT_ARROW = styled(ArrowClicker)`
  width: 30px;
  transform: rotateZ(90deg);
  margin-right: ${({ theme }) => theme.margins['5x']};
  margin-left: 0;
  margin-top: ${({ theme }) => theme.margins['1x']};
`

const UPLOAD_FIELD_CONTAINER = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`

const UPLOAD_INFO_CONTAINER = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  margin-right: ${({ theme }) => theme.margins['6x']};
`

const PREVIEW_UPLOAD_CONTAINER = styled.div`
  flex: 1;
  display: flex;
  /* justify-content: space-between; */
  flex-direction: column;
  margin-left: ${({ theme }) => theme.margins['6x']};
  margin-right: ${({ theme }) => theme.margins['3x']};
`

const SECTION_TITLE = MainText(styled.span`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text1};
  text-align: left;
`)

const INPUT_SECTION = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const SPACE = styled.div`
  width: ${({ theme }) => theme.margins['6x']};
`

const NEXT_BUTTON = styled(ButtonWrapper)`
  height: 60;
  padding: ${({ theme }) => `${theme.margins['2x']} ${theme.margins['6x']}`};
  align-self: flex-end;
  background-color: ${({ theme }) => theme.secondary2};
  margin-top: ${({ theme }) => theme.margins['5x']};
  &:disabled {
    background-color: #7d7d7d;
  }
`

const BOTTOM_BUTTON_SECTION = styled.div`
  display: flex;
  flex-direction: row;
`

const STYLED_PROPERTY_BLOCK = styled.div`
  display: flex;
  align-items: flex-end;
  > div {
    &:first-child {
      width: 128px;
    }
  }
  .property-result {
    width: calc(100% - 145px);
    height: 60px;
    display: flex;
    align-items: center;
    padding: ${({ theme }) => `${theme.margins['1x']}`};
    border-radius: 10px;
    background-color: #131313;
  }
  .property-item {
    width: 100px;
    height: 40px;
    padding: 2px ${({ theme }) => `${theme.margins['1x']}`};
    border-radius: 10px;
    background-color: #000;
    position: relative;
    margin-right: 10px;
    .type {
      font-family: Montserrat;
      font-size: 11px;
      font-weight: 500;
      color: #565656;
      text-align: left;
    }
    .name {
      font-family: Montserrat;
      font-size: 12px;
      font-weight: 600;
      color: #fff;
      text-align: left;
    }
    .close-btn {
      width: 18px;
      height: 18px;
      position: absolute;
      top: -6px;
      right: -6px;
      cursor: pointer;
      img {
        display: block;
        width: 100%;
        height: auto;
      }
    }
  }
`

export const UpLoadNFT = () => {
  const history = useHistory()
  const [previewImage, setPreviewImage] = useState<any>()
  const [status, setStatus] = useState('') // TODO case ('failed') when API is available
  const initInfo = {
    title: '',
    desc: ''
  }
  const [info, setInfo] = useState({ ...initInfo })
  const [disabled, setDisabled] = useState(true)

  const [visible, setVisible] = useState(false)
  const [visibleProperty, setVisibleProperty] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)

  // Property block
  const [propertyList, setPropertyList] = useState([])

  const onRemove = (id) => {
    const temp = JSON.parse(JSON.stringify(propertyList))
    const index = temp.findIndex((item) => item?.id === id)
    if (index !== -1) {
      temp.splice(index, 1)
      setPropertyList(temp)
    }
  }
  // title, desc
  const onChange = ({ e, id }) => {
    const { value } = e.target
    const temp = { ...info }
    temp[id] = value
    setInfo(temp)
  }

  const onLiveAuction = () => {
    history.push({
      pathname: '/NFTs/live-auction',
      state: {
        info,
        previewImage: previewImage,
        status
      }
    })
  }

  useEffect(() => {
    if (info?.title && info?.desc && !isEmpty(previewImage)) {
      setDisabled(false)
    } else setDisabled(true)
  }, [info, previewImage])

  return (
    <>
      <UPLOAD_CONTENT>
        <LEFT_ARROW onClick={() => history.push('/NFTs/create-a-collectible')} />
        <UPLOAD_FIELD_CONTAINER>
          <UPLOAD_INFO_CONTAINER>
            <SECTION_TITLE>1. Upload your file</SECTION_TITLE>
            <UploadCustom setPreviewImage={setPreviewImage} setStatus={setStatus} status={status} />
            <SECTION_TITLE>2. Item settings</SECTION_TITLE>
            <INPUT_SECTION>
              <InfoInput title="Title" placeholder="Name your item" onChange={(e) => onChange({ e, id: 'title' })} />
              <SPACE />
              <InfoInput
                title="Description"
                placeholder="Describe your item"
                onChange={(e) => onChange({ e, id: 'desc' })}
              />
            </INPUT_SECTION>
            <BOTTOM_BUTTON_SECTION>
              <BottomButtonUpload flex={2.5} type={BottomButtonUploadType.text} title="Number of copies" />
              <BottomButtonUpload flex={2} type={BottomButtonUploadType.category} title="Category" />
              <BottomButtonUpload
                flex={2}
                buttonTitle="Create"
                type={BottomButtonUploadType.plus}
                title="Collection"
                onClick={() => setVisible(true)}
              />
            </BOTTOM_BUTTON_SECTION>
            <STYLED_PROPERTY_BLOCK>
              <BottomButtonUpload
                flex={2}
                buttonTitle={propertyList && propertyList.length > 0 ? 'Add more' : 'Add'}
                type={
                  propertyList && propertyList.length > 0
                    ? BottomButtonUploadType.add_more
                    : BottomButtonUploadType.plus
                }
                title="Properties"
                onClick={() => setVisibleProperty(true)}
              />
              {propertyList && propertyList.length > 0 && (
                <div className="property-result">
                  {propertyList.map((item) => (
                    <div className="property-item" key={item?.id}>
                      <div className="type">{item?.type}</div>
                      <div className="name">{item?.name}</div>
                      <div className="close-btn" onClick={() => onRemove(item?.id)}>
                        <img
                          className="close-white-icon"
                          src={`${process.env.PUBLIC_URL}/img/assets/close-gray.svg`}
                          alt=""
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </STYLED_PROPERTY_BLOCK>
          </UPLOAD_INFO_CONTAINER>
          <PREVIEW_UPLOAD_CONTAINER>
            <PreviewImage file={previewImage} status={status} info={info} />
            <NEXT_BUTTON onClick={onLiveAuction} disabled={false}>
              <span>Next steps</span>
            </NEXT_BUTTON>
          </PREVIEW_UPLOAD_CONTAINER>
        </UPLOAD_FIELD_CONTAINER>
      </UPLOAD_CONTENT>
      <NewCollection visible={visible} handleOk={handleOk} handleCancel={handleCancel} />
      {visibleProperty && (
        <AddProperty
          visible={visibleProperty}
          handleCancel={() => setVisibleProperty(false)}
          handleOk={() => setVisibleProperty(false)}
          propertyList={propertyList}
          setPropertyList={setPropertyList}
        />
      )}
    </>
  )
}
