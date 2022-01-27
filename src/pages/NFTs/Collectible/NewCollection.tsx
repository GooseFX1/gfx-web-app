import React, { useState } from 'react'
import { PopupCustom } from '../Popup/PopupCustom'
import { Button, Form, Input, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
import styled from 'styled-components'
import isEmpty from 'lodash/isEmpty'

const STYLED_POPUP = styled(PopupCustom)`
  ${({ theme }) => `
    .ant-modal-body {
      padding: ${theme.margins['3.5x']} ${theme.margins['6x']} ${theme.margins['4x']};
    }
    .ant-modal-close {
      right: 35px;
      top: 35px;
      left: auto;
      svg {
        color: ${theme.text7};
      }
    }
    .title {
      font-family: Montserrat;
      font-size: 25px;
      font-weight: 600;
      color: ${theme.text7};
      margin-bottom: ${theme.margins['4x']};
    }
  `}
`

const STYLED_AVATAR = styled.div`
  ${({ theme }) => `
    background-color: ${theme.avatarBackground};
    border-style: dashed;
    border-color: #848484;
    border-width: 2px;
    ${theme.largeBorderRadius}
    padding: ${theme.margins['3x']};
    margin-bottom: ${theme.margins['4x']};

    .image-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .avatar-image {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }
    .text {
      font-size: 10px;
      color: ${theme.text8};
      text-align: center;
      max-width: 70px;
      margin-top: ${theme.margins['0.5x']};
    }
    .note {
      padding-left: ${theme.margins['2.5x']};
      padding-right: ${theme.margins['1x']};
      font-size: 14px;
      color: ${theme.text8};
      font-family: Montserrat;
    }
    .choose-file-btn-wrap {
      width: 85px;
    }
    .choose-file-btn {
      background-color: #3735bb;
      border: none;
      border-radius: 30px;
      height: 30px;
      width: 85px;
      color: #fff;
      font-size: 10px;
      font-weight: 500;
    }
    .image-wrap {
      position: relative;
      .icon-upload {
        position: absolute;
        width: 100%;
        height: 30px;
        top: 20px;
        right: 0;
        display: flex;
        justify-content: center;
        text-align: center;
        font-size: 30px;
        opacity: 0;
      }
      &:hover {
        .icon-upload {
          opacity: 1;
        }
      }
    }
    .ant-upload {
      flex-direction: column;
    }
    .ant-upload-list-picture-card-container {
      width: 70px;
      height: 70px;
    }
    .ant-upload-list {
      border: none;
      border-radius: 10px;
      position: relative;
      width: 70px;
      height: 70px;
    }
    .ant-upload-select {
      position: absolute;
      border: none;
      width: 100%;
      height: 100%;
      bottom: 0;
      right: 0;
      margin: 0;
      background-color: transparent;
    }
    .ant-upload-list-item {
      padding: 0 !important;
      border: none;
    }
  `}
`
const STYLED_FORM = styled(Form)`
  ${({ theme }) => `
    .half-width {
      flex: 1;
      width: 50%;
      margin: 0 ${theme.margins['1x']};
    }
    .full-width {
      display: flex;
      margin: 0 -${theme.margins['0.5x']} ${theme.margins['3x']};
    }
    .ant-form-item {
      margin-bottom: ${theme.margins['1x']};
    }
    .hint {
      font-size: 9px;
      color: ${theme.text8};
    }
    .ant-form-item-label {
      padding-bottom: 0;
      label {
        font-size: 17px;
        font-weight: 600;
        color: ${theme.text7};
        line-height: 1;
      }
      .ant-form-item-optional {
        color: #8a8a8a;
        font-size: 12px;
      }

      .ant-form-item-required {
        &::after {
          content: '(required)';
          font-size: 12px;
          color: #8a8a8a;
          display: inline-block;
          padding-left: ${theme.margins['0.5x']}
        }
      }
    }
    .ant-form-item-control-input {
      input {
        border: none;
        border-radius: 0;
        border-bottom: 2px solid #a8a8a8;
        text-align: left;
        padding-left: 0;
        color: ${theme.text8};
        &:placeholder {
          color: ${theme.text8};
        }
        &:focus {
          box-shadow: none;
        }
      }
    }
  `}
`

const STYLED_CREATE_BTN = styled(Button)<{ disabled: boolean }>`
  ${({ theme, disabled }) => `
    margin-top: ${theme.margins['3.5x']};
    width: 100%;
    font-size: 17px;
    font-weight: 600;
    line-height: 45px;
    height: 53px;
    ${theme.roundedBorders}
    border: none;
    background: ${disabled ? '#7d7d7d !important' : theme.btnNextStepBg};
    color: #fff !important;
    &:hover {
      background: ${disabled ? '#7d7d7d !important' : theme.btnNextStepBg};
      opacity: 0.8;
    }
  `}
`

interface Props {
  visible: boolean
  handleSubmit: (collection: any) => void
  handleCancel: () => void
}

const NewCollection = ({ visible, handleSubmit, handleCancel }: Props) => {
  const initialValues = {
    collection_name: '',
    symbol: '',
    description: '',
    short_url: ''
  }
  const requiredObj = {
    collection_name: '',
    symbol: '',
    short_url: ''
  }

  const [disabled, setDisabled] = useState(true)
  const onChange = (e) => {
    const { id, value } = e.target
    requiredObj[id] = value
    Object.values(requiredObj).forEach((item) => {
      if (isEmpty(item)) {
        setDisabled(true)
        return
      }
      setDisabled(false)
    })
  }

  const [form] = Form.useForm()
  const [avatar, setAvatar] = useState<any>()

  const handleAvatar = (file: UploadChangeParam<UploadFile<any>>) => {
    setAvatar(file.fileList[0])
  }

  return (
    <STYLED_POPUP width="500px" height="596px" title={null} visible={visible} onCancel={handleCancel} footer={null}>
      <h3 className="title">New collection</h3>
      <STYLED_AVATAR>
        <div className="image-group">
          <Upload className="avatar-image" listType="picture-card" maxCount={1} onChange={handleAvatar}>
            <div className="image-wrap">
              {!avatar && (
                <img
                  className="img-current avatar-image"
                  src={`${process.env.PUBLIC_URL}/img/assets/default-avatar.png`}
                  alt=""
                />
              )}
              <div className="icon-upload">
                <PlusOutlined />
              </div>
            </div>
            <div className="text">Preview</div>
          </Upload>
          <div className="note">
            <div>Minimum size 400x 400</div>
            <div>(Gif's work too).</div>
          </div>
          <div className="choose-file-btn-wrap">
            {!avatar && (
              <Button className="choose-file-btn" type="primary" htmlType="submit">
                Choose file
              </Button>
            )}
          </div>
        </div>
      </STYLED_AVATAR>
      <STYLED_FORM
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <div className="full-width">
          <div className="half-width">
            <Form.Item
              name="collection_name"
              label="Display name"
              rules={[{ required: true, message: 'Please input display name!' }]}
            >
              <Input placeholder="Enter token name" onChange={onChange} />
            </Form.Item>
            <div className="hint">Token name cannot change in the future.</div>
          </div>
          <div className="half-width">
            <Form.Item label="Symbol" name="symbol" rules={[{ required: true, message: 'Please input symbol!' }]}>
              <Input placeholder="Enter token symbol" onChange={onChange} />
            </Form.Item>
          </div>
        </div>
        <div className="full-width">
          <div className="half-width">
            <Form.Item name="description" label="Description">
              <Input placeholder="Describe your collection" />
            </Form.Item>
            <div className="hint">0 of 70 character limit.</div>
          </div>
          <div className="half-width">
            <Form.Item
              label="Short URL"
              name="short_url"
              rules={[{ required: true, message: 'Please input short URL!' }]}
            >
              <Input placeholder="goosefx.io/ Enter short url" onChange={onChange} />
            </Form.Item>
            <div className="hint">Will be used as public URL</div>
          </div>
        </div>
        <STYLED_CREATE_BTN className="create-collection-btn" type="primary" htmlType="submit" disabled={disabled}>
          Create collection
        </STYLED_CREATE_BTN>
      </STYLED_FORM>
    </STYLED_POPUP>
  )
}

export default React.memo(NewCollection)
