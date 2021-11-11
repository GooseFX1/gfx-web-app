import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal, Form, Input, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'

const POPUP_PROFILE = styled(Modal)`
  background: #2a2a2a;
  border-radius: 20px;
  width: 500px !important;
  height: 757px;
  .ant-modal-header {
    border-radius: 20px;
    background: #2a2a2a;
    padding: 30px 45px 0 45px;
    border: none;
    .ant-modal-title {
      font-size: 25px;
      color: #fff;
      font-weight: 600;
    }
  }
  .ant-modal-content {
    border-radius: 0;
    box-shadow: none;
  }
  .ant-modal-body {
    padding: 30px 45px;
  }
  .ant-modal-close {
    top: 23px;
    right: 35px;
  }
  .ant-modal-close-x {
    width: auto;
    height: auto;
    font-size: 26px;
    line-height: 1;
    svg {
      color: #fff;
    }
  }
  .avatar-wrapper {
    background-color: #000;
    border-style: dashed;
    border-color: #848484;
    border-width: 2px;
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 30px;
    .image-group {
      display: flex;
      align-items: center;
    }
    .avatar-image {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }
    .text {
      font-size: 10px;
      color: #fff;
      text-align: center;
      max-width: 70px;
      margin-top: ${({ theme }) => theme.margins['0.5x']};
    }
    .note {
      padding-left: 20px;
      font-size: 14px;
      color: #fff;
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
  }
`
const FORM_PROFILE = styled(Form)`
  .half-width {
    flex: 1;
    width: 50%;
    margin: 0 0.5rem;
  }
  .full-width {
    display: flex;
    margin: 0 -0.5rem 1rem;
  }
  .ant-form-item {
    margin-bottom: 9px;
  }
  .hint {
    font-size: 9px;
  }
  .ant-form-item-label {
    padding-bottom: 0;
    label {
      font-size: 17px;
      font-weight: 600;
      color: #fff;
      line-height: 1;
    }
    .ant-form-item-optional {
      color: #8a8a8a;
      font-size: 12px;
    }
  }
  .ant-form-item-control-input {
    input {
      border: none;
      border-radius: 0;
      border-bottom: 2px solid #a8a8a8;
      padding-left: 0;
      text-align: left;
      &:focus {
        box-shadow: none;
      }
    }
  }
  .section-label {
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    line-height: 1;
    margin: 25px 0 15px;
  }
  .btn-save {
    margin-top: 27px;
    width: 100%;
    font-size: 17px;
    font-weight: 600;
    line-height: 50px;
    height: 53px;
    border-radius: 53px;
    border: none;
    background: #9625ae;
  }
`

interface Props {
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
}

export const PopupProfile = ({ visible, handleOk, handleCancel }: Props) => {
  const [form] = Form.useForm()

  const [avatar, setAvatar] = useState<any>()

  const handleAvatar = (file: UploadChangeParam<UploadFile<any>>) => {
    setAvatar(file.fileList[0])
  }

  return (
    <POPUP_PROFILE title="Edit profile" visible={visible} onOk={handleOk} onCancel={handleCancel} footer={null}>
      <div className="avatar-wrapper">
        <div className="image-group">
          <Upload className="avatar-image" listType="picture-card" maxCount={1} onChange={handleAvatar}>
            <div className="image-wrap">
              {!avatar && (
                <img
                  className="img-current avatar-image"
                  src={`${process.env.PUBLIC_URL}/img/assets/avatar-profile.png`}
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
        </div>
      </div>
      <FORM_PROFILE form={form} layout="vertical" requiredMark="optional">
        <div className="full-width">
          <div className="half-width">
            <Form.Item label="Creator name" required>
              <Input />
            </Form.Item>
          </div>
          <div className="half-width">
            <Form.Item label="Email" required>
              <Input />
            </Form.Item>
            <div className="hint">Will be used as public URL</div>
          </div>
        </div>
        <Form.Item label="Biography">
          <Input />
        </Form.Item>
        <div className="section-label">Social media links</div>
        <div className="full-width">
          <div className="half-width">
            <Form.Item label="Instagram">
              <Input />
            </Form.Item>
            <div className="hint">Will be used as public URL</div>
          </div>
          <div className="half-width">
            <Form.Item label="Twitter">
              <Input />
            </Form.Item>
            <div className="hint">Will be used as public URL</div>
          </div>
        </div>
        <div className="full-width">
          <div className="half-width">
            <Form.Item label="Facebook">
              <Input />
            </Form.Item>
            <div className="hint">Will be used as public URL</div>
          </div>
          <div className="half-width">
            <Form.Item label="Youtube">
              <Input />
            </Form.Item>
            <div className="hint">Will be used as public URL</div>
          </div>
        </div>
        <button className="btn-save">Save changes</button>
      </FORM_PROFILE>
    </POPUP_PROFILE>
  )
}
