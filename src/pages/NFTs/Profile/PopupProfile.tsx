import React, { useState } from 'react'
import { Form, Input, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
import { StyledPopupProfile, StyledFormProfile } from './PopupProfile.styled'

interface Props {
  visible: boolean
  setVisible: (value: boolean) => void
  handleOk: () => void
  handleCancel: () => void
}

export const PopupProfile = ({ visible, setVisible, handleOk, handleCancel }: Props) => {
  const [form] = Form.useForm()
  const onSaveChanges = () => {
    setVisible(false)
  }

  const [avatar, setAvatar] = useState<any>()

  const handleAvatar = (file: UploadChangeParam<UploadFile<any>>) => {
    setAvatar(file.fileList[0])
  }

  return (
    <>
      <StyledPopupProfile title="Edit profile" visible={visible} onOk={handleOk} onCancel={handleCancel} footer={null}>
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
            <div className="text">Preview</div>
          </div>
        </div>
        <StyledFormProfile form={form} layout="vertical" requiredMark="optional">
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
          <button className="btn-save" onClick={onSaveChanges}>
            Save changes
          </button>
        </StyledFormProfile>
      </StyledPopupProfile>
    </>
  )
}
