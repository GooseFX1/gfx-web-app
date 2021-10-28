import React from 'react'
import styled from 'styled-components'
import { Modal, Form, Input } from 'antd'

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
      margin-top: 10px;
    }
    .note {
      padding-left: 20px;
      font-size: 14px;
      color: #fff;
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

const PopupProfile = ({ visible, handleOk, handleCancel }: Props) => {
  const [form] = Form.useForm()

  return (
    <POPUP_PROFILE title="Edit profile" visible={visible} onOk={handleOk} onCancel={handleCancel} footer={null}>
      <div className="avatar-wrapper">
        <div className="image-group">
          <img className="avatar-image" src={`${process.env.PUBLIC_URL}/img/assets/avatar-profile.png`} alt="" />
          <div className="note">
            <div>Minimun size 400x400</div>
            <div>Gift's work too</div>
          </div>
        </div>
        <div className="text">Preview</div>
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

export default PopupProfile
